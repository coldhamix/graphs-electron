import { Injectable } from '@angular/core';

import { AdjacencyMatrix } from '../graph-constituents/adjacency-matrix';
import { Graph } from '../graph-constituents/graph';
import { Node } from '../graph-constituents/node';
import { Edge } from '../graph-constituents/edge';
import { CoordGenerator } from '../coord-generator/coord-generator';

@Injectable()
export class GraphService {
	private width: number;
	private height: number;

	constructor(private coordGenerator: CoordGenerator) {}

	public generateGraph(nodesNumber: number): Graph {
		Node.resetIdCounter();
		
		let graph = new Graph(nodesNumber);
		let matrix: number[][] = (new AdjacencyMatrix(nodesNumber)).generateMatrix();
		graph.matrix = matrix;
		
		for(let i: number = 0; i < nodesNumber; i++) {
			for(let j: number = 1 + i; j < nodesNumber; j++) {
				if(matrix[i][j] != 0) {
					let edge: Edge = new Edge();
					edge.setFrom(i);
					edge.setTo(j);
					edge.setWeight(matrix[i][j]);

					graph.pushEdge(edge);
				}
			}
		}
		this.mix(graph.edges);

		this.coordGenerator.init(this.width, this.height, graph.nodes, graph.edges);
		this.coordGenerator.setCoord();
		return graph;
	}

	private mix(edges: Edge[]): void {
		for(let i = 0; i < edges.length; i++) {
			let index = i;
			while(index == i) {
				index = Math.round(Math.random() * (edges.length - 1));
			}

			const edge = edges[i];
			edges[i] = edges[index];
			edges[index] = edge;
		}
	}

	public init(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}

}