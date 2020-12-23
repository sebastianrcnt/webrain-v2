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
  experiments: Experiment[];
}

export interface Experiment {
  id: string;
  description: string;
  coverFileId: string;
  instructionsJson: string;
}

export interface Participation {
  experimentId: string;
  participantEmail: string;
  timestamp: number;
  resultJson: string;
}

export interface Database {
  users: User[];
  projects: Project[];
  participations: Participation[];
}