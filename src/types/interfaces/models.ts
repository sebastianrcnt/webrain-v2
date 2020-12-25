export interface User {
  email: string;
  name: string;
  phone: string;
  password: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  coverFileId: string;
  projectGroupId: string;
  description: string;
  agreement: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
  projectId: string;
  instructionsJson: string;
}

export interface Participation {
  experimentId: string;
  participantEmail: string;
  timestamp: number;
  resultJson: string;
}

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
}

export interface Database {
  users: User[];
  projects: Project[];
  experiments: Experiment[];
  projectGroups: ProjectGroup[];
  participations: Participation[];
}
