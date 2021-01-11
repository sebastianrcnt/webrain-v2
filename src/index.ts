// System Modules
import path from "path";
import process from "process";

// Server Modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import exphbs from "express-handlebars";
import dotenv from "dotenv";

// My Modules
import { initializeDatabase, UserModel } from "./database";
import IndexRouter from "./routes";
import asyncHandler from "./utils/async-handler";

// App Generation
const app: express.Application = express();

// configue dotenv
dotenv.config();

// Database Generation
initializeDatabase();

// Middlewares
app.use(cors());

const handlebars = exphbs.create({
  // layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
  defaultLayout: "layout",
  extname: "hbs",
  helpers: {
    isLargeOrEqualTo(x1, x2) {
      return x1 >= x2;
    },
    ternary(exp, val1, val2): string {
      return exp ? val1 : val2;
    },
    levelToString(level) {
      if (level >= 200) {
        return "관리자";
      } else if (level >= 100) {
        return "연구자";
      } else {
        return "실험대상자";
      }
    },
    getUserName(user) {
      return user.name;
    },
    getUserEmail(user) {
      return user.email;
    },
    isUserAdmin(user) {
      return user ? user.level >= 200: false;
    },
    isUserAdminOrResearcher(user) {
      return user ? user.level >= 100 : false;
    },
    isEmptyJson(json) {
      return json === '{}'
    }
  },
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SECRET"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "SECRET",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(flash());
app.use(function (req, res, next) {
  res.locals["req"] = req;
  next();
});

// Static File Serving
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  asyncHandler(async (req, res, next) => {
    console.log(process.env.AUTH_DISABLED);
    if (process.env.AUTH_DISABLED === "TRUE") {
      const defaultUser = await UserModel.findOne({ email: "admin@monet.com" });
      if (defaultUser) {
        req.session.user = defaultUser;
        next();
      } else {
        console.log("Fatal Error: Not admin@monet.com found");
        process.exit();
      }
    } else {
      next();
    }
  })
);

app.use(IndexRouter);

const PORT = process.env.PORT || 8080;
console.log(process.env.port, PORT)

app.listen(PORT, () => {
  console.log("🧠  [Monet Webrain] ");
  console.log(`✈️   Server Running on port ${PORT}`);
});
