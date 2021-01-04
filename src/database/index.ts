import mongoose, { Schema, Document } from "mongoose";
import { generate } from "shortid";
const { ObjectId } = Schema.Types;
import generateSamples from "./sample";

// User
export const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: Number, required: true, default: 0 },
});

export interface IUser extends Document {
  email: string;
  name: string;
  phone: string;
  password: string;
  level: number;
}

export interface IUserCreation {
  email: IUser["email"];
  name: IUser["name"];
  phone: IUser["phone"];
  password: IUser["password"];
}

UserSchema.statics.register = async function (userCreation: IUserCreation) {
  await this.create({ ...userCreation });
};

export const UserModel = mongoose.model("User", UserSchema);

// Project Group
export const ProjectGroupSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverFileId: { type: String, required: true },
});

export interface IProjectGroup extends Document {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
}

export const ProjectGroupModel = mongoose.model(
  "ProjectGroup",
  ProjectGroupSchema
);

// Project
export const ProjectSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  agreement: { type: String, required: true },
  coverFileId: { type: String, required: true },
  author: { type: ObjectId, required: true, ref: "User" },
  projectGroup: { type: ObjectId, required: true, ref: "ProjectGroup" },
  public: { type: Boolean },
});

export interface IProject extends Document {
  id: string;
  name: string;
  description: string;
  agreement: string;
  coverFileId: string;
  author: IUser["_id"];
  public?: boolean;
  projectGroup: IProjectGroup["_id"];
}

export const ProjectModel = mongoose.model("Project", ProjectSchema);

// Experiment
export const ExperimentSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverFileId: { type: String, required: true },
  instructionsJson: { type: String, required: true, default: "{}" },
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  tags: { type: String, required: true, default: "" },
  public: { type: Boolean, required: true, default: false },
  project: { type: ObjectId, ref: "Project" },
  author: { type: ObjectId, ref: "User" },
});

export interface IExperiment extends Document {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
  instructionsJson: string;
  fileId: string;
  fileName: string;
  tags: string;
  public: boolean;
  project?: IProject["_id"];
  author?: IUser["_id"];
}

export interface IExperimentCreation {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
  instructionsJson: string;
  fileId: string;
  fileName: string;
  tags: string;
  public: boolean;
  project?: IProject["_id"];
  author?: IUser["_id"];
}

export const ExperimentModel = mongoose.model("Experiment", ExperimentSchema);

// Participation
export const ParticipationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  experiment: { type: ObjectId, required: true, ref: "Experiment" },
  participant: { type: ObjectId, required: true, ref: "User" },
  timestamp: { type: Number, required: false },
  resultJson: { type: String, required: false },
});

export interface IParticipation extends Document {
  id: string;
  experiment: IExperiment["_id"];
  participant: IUser["_id"];
  timestamp: number;
  resultJson: number;
}

export const ParticipationModel = mongoose.model(
  "Participation",
  ParticipationSchema
);

export async function initializeDatabase() {
  mongoose
    .connect("mongodb://localhost:27017/webrain", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log("👌  Successfully Connected To Database");
    });
}

export async function clearDatabase() {
  await UserModel.deleteMany({}).exec();
  await ProjectGroupModel.deleteMany({}).exec();
  await ProjectModel.deleteMany({}).exec();
  await ExperimentModel.deleteMany({}).exec();
  await ParticipationModel.deleteMany({}).exec();
  console.log("👌  Successfully Cleared Database");
}

export async function insertSampleToDatabase() {
  async function saveSamples(samples: any) {
    for (let name in samples) {
      console.log(`✍  inserting ${name} to database`);
      await (samples[name] as Document).save();
    }
  }
  const Samples = generateSamples();
  await saveSamples(Samples.UserSamples);
  await saveSamples(Samples.ProjectGroupSamples);
  await saveSamples(Samples.ProjectSamples);
  await saveSamples(Samples.ExperimentSamples);
  await saveSamples(Samples.ParticipationSamples);
  console.log("👌  Successfully Inserted To Database");
}
