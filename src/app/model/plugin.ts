export interface Plugin {
  caption: string;
  description: string;
  name: string;
}

export function createTask(caption: string, description: string, name: string): Plugin {
  return { caption, description, name };
}
