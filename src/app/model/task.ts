export interface Task {
  caption: string;
  description: string;
}

export function createTask(caption: string, description: string): Task {
  return { caption, description };
}
