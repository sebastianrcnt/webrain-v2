import {
  ExperimentModel,
  IProject,
  IProjectGroup,
  IUser,
  ParticipationModel,
  ProjectGroupModel,
  ProjectModel,
  UserModel,
} from ".";

function generateSamples() {
  const admin = new UserModel({
    email: "admin@monet.com", // primary key
    name: "admin",
    phone: "010-1234-5678",
    password: "secret",
    level: 200,
  } as IUser);
  const researcher1 = new UserModel({
    email: "researcher1@monet.com",
    name: "researcher 1",
    phone: "010-8765-4321",
    password: "secret",
    level: 100,
  } as IUser);
  const researcher2 = new UserModel({
    email: "researcher2@monet.com",
    name: "researcher 2",
    phone: "010-8765-4321",
    password: "secret",
    level: 100,
  } as IUser);
  const subject1 = new UserModel({
    email: "subject1@monet.com", // primary key
    name: "subject 1",
    phone: "010-1234-5678",
    password: "secret",
    level: 0,
  } as IUser);
  const subject2 = new UserModel({
    email: "subject2@monet.com", // primary key
    name: "subject 2",
    phone: "010-1234-5678",
    password: "secret",
    level: 0,
  } as IUser);
  const subject3 = new UserModel({
    email: "subject3@monet.com", // primary key
    name: "subject 3",
    phone: "010-1234-5678",
    password: "secret",
    level: 0,
  } as IUser);
  const subject4 = new UserModel({
    email: "subject4@monet.com", // primary key
    name: "subject 4",
    phone: "010-1234-5678",
    password: "secret",
    level: 0,
  } as IUser);
  const subject5 = new UserModel({
    email: "subject@monet.com", // primary key
    name: "subject 5",
    phone: "010-1234-5678",
    password: "secret",
    level: 0,
  } as IUser);

  const UserSamples = {
    admin,
    researcher1,
    researcher2,
    subject1,
    subject2,
    subject3,
    subject4,
    subject5,
  };

  const projectGroup1 = new ProjectGroupModel({
    id: "projectgroup1",
    name: "Project Group 1",
    description: "this is project group 2",
    coverFileId: "image-1.jpeg",
  } as IProjectGroup);
  const projectGroup2 = new ProjectGroupModel({
    id: "projectgroup2",
    name: "Project Group 2",
    description: "this is project group 2",
    coverFileId: "image-2.jpeg",
  } as IProjectGroup);

  const ProjectGroupSamples = {
    projectGroup1,
    projectGroup2,
  };

  const project1 = new ProjectModel({
    id: "project1",
    name: "Project 1",
    author: UserSamples.researcher1,
    description: "this is project 1",
    agreement: "do you agree?",
    projectGroup: ProjectGroupSamples.projectGroup1,
    coverFileId: "image-3.jpeg",
    public: true,
  } as IProject);
  const project2 = new ProjectModel({
    id: "project2",
    name: "Project 2",
    author: UserSamples.researcher1,
    description: "this is project 2",
    agreement: "do you agree?",
    projectGroup: ProjectGroupSamples.projectGroup1,
    coverFileId: "image-4.jpeg",
    public: false,
  } as IProject);
  const project3 = new ProjectModel({
    id: "project3",
    name: "Project 3",
    author: UserSamples.researcher2,
    description: "this is project 3",
    agreement: "do you agree?",
    projectGroup: ProjectGroupSamples.projectGroup2,
    coverFileId: "image-5.jpeg",
    public: false,
  } as IProject);

  const ProjectSamples = {
    project1,
    project2,
    project3,
  };

  // const experiment1 = new ExperimentModel({
  //   id: "experiment1",
  //   name: "Experiment 1",
  //   description: "This is Experiment 1",
  //   coverFileId: "image-6.jpeg",
  //   tags: "Tag1,Tag2,Tag3",
  //   instructionsJson: "{}",
  //   project: null,
  // });
  // const experiment2 = new ExperimentModel({
  //   id: "experiment2",
  //   name: "Experiment 2",
  //   description: "This is Experiment 2",
  //   coverFileId: "image-7.jpeg",
  //   tags: "Tag1,Tag2,Tag3",
  //   instructionsJson: "{}",
  //   project: ProjectSamples.project1._id,
  // });
  // const experiment3 = new ExperimentModel({
  //   id: "experiment3",
  //   name: "Experiment 3",
  //   description: "This is Experiment 3",
  //   coverFileId: "image-8.jpeg",
  //   tags: "Tag1,Tag2,Tag3",
  //   instructionsJson: "{}",
  //   project: ProjectSamples.project2._id,
  // });
  // const experiment4 = new ExperimentModel({
  //   id: "experiment4",
  //   name: "Experiment 4",
  //   description: "This is Experiment 4",
  //   coverFileId: "image-9.jpeg",
  //   tags: "Tag1,Tag2,Tag3",
  //   instructionsJson: "{}",
  //   project: ProjectSamples.project2._id,
  // });
  // const experiment5 = new ExperimentModel({
  //   id: "experiment5",
  //   name: "Experiment 5",
  //   description: "This is Experiment 5",
  //   coverFileId: "image-10.jpeg",
  //   tags: "Tag1,Tag2,Tag3",
  //   instructionsJson: "{}",
  //   project: ProjectSamples.project3._id,
  // });

  const ExperimentSamples = {
    // experiment1,
    // experiment2,
    // experiment3,
    // experiment4,
    // experiment5,
  };

  // const participation1 = new ParticipationModel({
  //   id: "participation1",
  //   experiment: ExperimentSamples.experiment2,
  //   participant: UserSamples.subject1,
  //   timestamp: 1601710095359,
  //   resultJson: "{}",
  // });

  const ParticipationSamples = {
    // participation1,
  };

  const Samples = {
    UserSamples,
    ProjectGroupSamples,
    ProjectSamples,
    ExperimentSamples,
    ParticipationSamples,
  };
  return Samples;
}

export default generateSamples;
