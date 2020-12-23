// System Modules
import path from "path";

// Server Modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars";

// My Modules
import { initializeDatabase } from "./database";
import router from "./router";

// App Generation
const app: express.Application = express();

// Database Generation
initializeDatabase();

// Middlewares
app.use(cors());

const handlebars = exphbs.create({
  // layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
  defaultLayout: "layout",
  extname: "hbs",
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static File Serving
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(router);

const PORT = 8080;

app.listen(PORT, () => {
  console.log("🧠  [Monet Webrain] ");
  console.log(`✈️   Server Running on port ${PORT}`);
});
