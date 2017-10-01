import { Node } from './node';
import { Edge } from './edge';

export class Graph {

  private _nodes: Node[] = [];
  private _edges: Edge[] = [];


  constructor(nodesCount: number) {
    for (let i = 0; i < nodesCount; i++) {
      this._nodes.push(new Node());
    }
  }

  public get nodes(): Node[] {
    return this._nodes;
  }

  public get edges(): Edge[] {
    return this._edges;
  }

  public pushEdge(edge: Edge): void {
    this._edges.push(edge);
  }
}
