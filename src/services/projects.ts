import { ExperimentModel, ProjectModel } from "../database";

const ProjectServices = {
  async getAssignedExperiments(projectId) {
    const project = await ProjectModel.findOne({ id: projectId });
    return await ExperimentModel.find({ project: project._id }).lean();
  },
};

export default ProjectServices;
