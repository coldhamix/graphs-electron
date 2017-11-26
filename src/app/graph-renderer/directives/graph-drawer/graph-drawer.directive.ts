import { Directive, Input, ElementRef } from '@angular/core';

import { NodesDrawer } from './drawer-constituents/nodes-drawer';
import { EdgesDrawer } from './drawer-constituents/edges-drawer';

import { Graph } from '../../graph-constituents/graph';

@Directive({
  selector: '[graphDrawer]'
})
export class GraphDrawerDirective {
	@Input('graphDrawer') graph: Graph;
	@Input() weighed: boolean;
	@Input() directed: boolean;
	@Input() isActive: boolean;

	private context: CanvasRenderingContext2D;

	constructor(canvas: ElementRef, private nodesDrawer: NodesDrawer, 
		private edgesDrawer: EdgesDrawer) { 
		this.context = canvas.nativeElement.getContext('2d')
	}

	public draw(): void {
		if(this.isActive) {
			this.initDrawers();
			this.edgesDrawer.draw();
			this.nodesDrawer.draw();
		}
	}

	private initDrawers(): void {
		this.edgesDrawer.context = this.context;
		this.edgesDrawer.graph = this.graph;
		this.edgesDrawer.weighed = this.weighed;
		this.edgesDrawer.directed = this.directed;

		this.nodesDrawer.context = this.context;
		this.nodesDrawer.nodes = this.graph.nodes;
	}
}
