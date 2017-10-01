import { Injectable } from '@angular/core';

import { AdjacencyMatrix } from './adjacency-matrix';
import { Graph } from './graph';
import { Node } from './node';
import { Edge } from './edge';
import { CoordGenerator } from './coord-generator';

@Injectable()
export class GraphService {
  private width: number;
  private height: number;

  constructor(private coordGenerator: CoordGenerator) {
  }

  public generateGraph(nodesNumber: number): Graph {
    Node.resetIdCounter();

    const graph = new Graph(nodesNumber);
    const matrix: number[][] = (new AdjacencyMatrix(nodesNumber)).generateMatrix();

    for (let i = 0; i < nodesNumber; i++) {
      for (let j = 1 + i; j < nodesNumber; j++) {
        if (matrix[i][j] !== 0) {
          const edge = new Edge();
          edge.setFrom(i);
          edge.setTo(j);
          edge.setWeight(matrix[i][j]);

          graph.pushEdge(edge);
        }
      }
    }

    this.coordGenerator.init(this.width, this.height, graph.nodes, graph.edges);
    this.coordGenerator.setCoord();
    console.log(graph);
    return graph;
  }

  public init(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
