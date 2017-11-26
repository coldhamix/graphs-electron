export type PluginType = 'MATRIX' | 'GRAPH';

export interface Plugin {
  caption: string;
  description: string;
  name: string;
  type: PluginType;
  input: PluginInput;
  external?: boolean;
}

export interface NodeInputDescriptor {
  name: string;
}

export interface PluginInput {
  nodes: NodeInputDescriptor[];
}


export function createTask(caption: string, description: string, name: string, type?: PluginType, input?: PluginInput): Plugin {
  return { caption, description, name, type, input };
}
