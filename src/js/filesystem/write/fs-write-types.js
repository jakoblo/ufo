//@flow

export type WorkerParams = {
  id: number,
  clobber: boolean,
  type: string,
  sources: Array<string>,
  target: string
};

export type Task = {
  id: number,
  subTasks: SubTasks,
  clobber: boolean,
  type: string,
  sources: Array<string>,
  target: string,
  errors: {},
  finished: boolean
};

export type ProgressReport = {
  destination: string,
  percentage: number
};

export type SubTasks = {
  [destination: string]: SubTask
};

export type SubTask = {
  id: number,
  source: string,
  destination: string,
  type: string,
  percentage: number,
  clobber: boolean
};
