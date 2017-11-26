import { Node } from './node';
import { Edge } from './edge';
import { AdjacencyMatrix } from 'app/graph-renderer/graph-constituents/adjacency-matrix';
import { makeDecorator } from '@angular/core/src/util/decorators';

export class Graph {
	private _nodes: Node[] = [];
	private _edges: Edge[] = [];
	private _matrix: number[][];

	constructor(nodesNummer: number) {
		for(let i = 0; i < nodesNummer; i++) { 
			this._nodes.push(new Node());
		}
	}

	public pushEdge(edge: Edge): void {
		this._edges.push(edge);
	}

	public get nodes(): Node[] {
		return this._nodes;
	}

	public get edges(): Edge[] {
		return this._edges;
	
	}

	public get matrix(): number[][] {
		return this._matrix;
	}

	public set matrix(matrix: number[][]) {
		this._matrix = matrix;
	}
}