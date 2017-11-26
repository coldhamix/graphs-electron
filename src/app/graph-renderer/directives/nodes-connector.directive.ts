import { Directive, ElementRef } from '@angular/core';

import { Node } from '../graph-constituents/node';
import { Edge } from '../graph-constituents/edge';

@Directive({
	selector: '[nodesConnector]'
})
export class NodesConnectorDirective {
	private from: Node = null;
	private to: Node = null;

	public setNode(node: Node): void {
		if(this.from === null) {
			this.from = node;
			this.from.isSelected = true;
		} else {
			if(this.from === node) {
				this.from.isSelected = false;
				this.from = null;
				return;
			}
			this.to = node;
		}
	}

	public connectNodes(): Edge {
		if(this.from === null || this.to === null) {
			return null;
		}

		const edge = new Edge();
		edge.setFrom(this.from.id);
		edge.setTo(this.to.id);
		edge.setWeight(1 + Math.round(Math.random() * 8.5));

		this.from.isSelected = false;
		this.from = null;
		this.to = null;

		return edge;
	}

}