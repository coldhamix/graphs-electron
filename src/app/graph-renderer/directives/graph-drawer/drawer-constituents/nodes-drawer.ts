import { Injectable } from '@angular/core';

import { Node } from '../../../graph-constituents/node';

export class NodesDrawer {
	private _nodes: Node[];
	private _context: CanvasRenderingContext2D;

	public get nodes(): Node[] {
		return this._nodes;
	}
	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public set nodes(nodes: Node[]) {
		this._nodes = nodes;
	}

	public set context(context: CanvasRenderingContext2D) {
		this._context = context;
	}
	
	public draw(): void {
		for(let node of this.nodes) {
			this.resetStyles();
			this.drawNode(node);
		}		
	}

	private drawNode(node: Node): void {
		this.context.beginPath();
		this.context.arc(node.x, node.y, 6.5, 0, 2 * Math.PI, true);
		this.context.fill();
		this.context.stroke();

		if(node.isSelected) {
			this.context.arc(node.x, node.y, 9.5, 0, 2 * Math.PI, true);
			this.context.stroke();
		}

		this.drawNodeNumber(node);
		this.context.closePath();
	}

	private drawNodeNumber(node: Node): void {
		this.context.fillStyle = "#000000";
		const nodeNumber = node.id + 1;

		if(nodeNumber < 10) {
			this.context.fillText("" + nodeNumber, node.x - 3, node.y + 3);
		} else {
			this.context.font = "9px Arial";
			this.context.fillText("" + nodeNumber, node.x - 5.5, node.y + 3);
		}
	}

	private resetStyles(): void {
		this.context.font = "10px Arial";
		this.context.fillStyle = "#ffffff";
	}
}