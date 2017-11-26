import { Injectable } from '@angular/core';

import { Graph } from '../../../graph-constituents/graph';
import { Node } from '../../../graph-constituents/node';
import { Edge } from '../../../graph-constituents/edge';

@Injectable()
export class EdgesDrawer {
	private _graph: Graph;
	private _context: CanvasRenderingContext2D;
	private _weighed: boolean;
	private _directed: boolean;

	public get graph(): Graph  {
		return this._graph;
	}

	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public get weighed(): boolean {
		return this._weighed;
	}

	public get directed(): boolean {
		return this._directed;
	}

	public set graph(graph: Graph) {
		this._graph = graph;
	}

	public set context(context: CanvasRenderingContext2D) {
		this._context = context;
	}

	public set weighed(weighed: boolean) {
		this._weighed = weighed;
	}

	public set directed(directed: boolean) {
		this._directed = directed;
	}

	public draw(): void {
		this.context.font = "9px Arial";
		for(let edge of this.graph.edges) {
			this.drawEdge(edge);
			if(this.weighed) {
				this.drawWeight(edge);
			}
			if(this.directed) {
				this.drawArrows(edge);
			}
		}
	}

	private drawEdge(edge: Edge): void {
		this.context.beginPath();
		this.context.moveTo(this.graph.nodes[edge.getFrom()].x, 
							this.graph.nodes[edge.getFrom()].y);
		this.context.lineTo(this.graph.nodes[edge.getTo()].x, 
							this.graph.nodes[edge.getTo()].y);
		this.context.stroke();
		this.context.closePath();
		
	}

	private drawWeight(edge: Edge): void {
		const xF = this.graph.nodes[edge.getFrom()].x;
		const yF = this.graph.nodes[edge.getFrom()].y;

		const xT = this.graph.nodes[edge.getTo()].x;
		const yT = this.graph.nodes[edge.getTo()].y;

		const x: number = Math.round((xF + xT) / 2);
		const y: number = Math.round((yF + yT) / 2);

		this.context.beginPath();
		this.context.fillStyle = "#ffffff";
		this.context.arc(x, y, 5, 0, 2 * Math.PI, true);
		this.context.fill();

		this.context.fillStyle = "#000000";
		this.context.fillText("" + edge.getWeight(), x - 3.5, y + 3);
		this.context.closePath();
	}

	private drawArrows(edge: Edge): void {
		const length = 3.5;
		const xF = this._graph.nodes[edge.getFrom()].x;
		const xT = this._graph.nodes[edge.getTo()].x;
		const yF = this._graph.nodes[edge.getFrom()].y;
		const yT = this._graph.nodes[edge.getTo()].y;

		const angle = Math.atan2(yT - yF, xT - xF);
		const topX = xT - 6.5 * Math.cos(angle);
		const topY = yT - 6.5 * Math.sin(angle);
		const baseX = xT - 9 * Math.cos(angle);
		const baseY = yT - 9 * Math.sin(angle);

		this.context.beginPath();
		this.context.moveTo(topX, topY);
		this.context.lineTo(baseX - length * Math.cos(angle - Math.PI / 6),
							baseY - length * Math.sin(angle - Math.PI / 6));
		this.context.moveTo(topX, topY);
		this.context.lineTo(baseX - length * Math.cos(angle + Math.PI / 6),
							baseY - length * Math.sin(angle + Math.PI / 6));
		this.context.stroke();
		this.context.closePath();
	}
}