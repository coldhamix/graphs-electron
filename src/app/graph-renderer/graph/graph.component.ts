import { Component, AfterViewChecked, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { NodesConnectorDirective } from '../directives/nodes-connector.directive';
import { NodeDraggerDirective } from '../directives/node-dragger.directive';
import { GraphDrawerDirective } from '../directives/graph-drawer/graph-drawer.directive';

import { Graph } from '../graph-constituents/graph';
import { Node } from '../graph-constituents/node';
import { Edge } from '../graph-constituents/edge';
import { NodesDrawer } from '../directives/graph-drawer/drawer-constituents/nodes-drawer';
import { EdgesDrawer } from '../directives/graph-drawer/drawer-constituents/edges-drawer';

@Component({
	selector: 'graph-component',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.css'],
	providers: [ NodesDrawer,
				 EdgesDrawer ]
})
export class GraphComponent implements AfterViewChecked, OnInit, OnDestroy {
	@ViewChild('canvas') 
	canvas: ElementRef;

	@ViewChild(NodesConnectorDirective)
	nodesConnector;
	@ViewChild(NodeDraggerDirective)
	nodeDragger;
	@ViewChild(GraphDrawerDirective)
	graphDrawer;

	@Input() width: number;
	@Input() height: number;

	@Input() directed: boolean;
	@Input() weighed: boolean;

	@Input() graph: Graph;

	@Output()
	switchUserSelect = new EventEmitter<boolean>();

	@Output()
	initCanvas = new EventEmitter();
	
	switchOffUserSelect(): void {
		this.switchUserSelect.emit(false);
	}

	switchOnUserSelect(): void {
		this.switchUserSelect.emit(true);
	}

	get edges(): Edge[] {
		return this.graph.edges;
	}

	get nodes(): Node[] {
		return this.graph.nodes;
	}

 	ngAfterViewChecked(): void {
		this.drawGraph();
	}

	ngOnInit(): void {
		this.canvas.nativeElement
			.addEventListener('mousemove', this.changeCursor.bind(this));
		this.initCanvas.emit(this.canvas.nativeElement);
	}

	ngOnDestroy(): void {
		this.canvas.nativeElement
			.removeEventListener('mousemove', this.changeCursor.bind(this));
	}

	changeCursor($event): void {
		if(this.getNodeByCoords($event)) {
			this.canvas.nativeElement.classList.add('over-node');
		} else {
			this.canvas.nativeElement.classList.remove('over-node');
		}
	}

	drawGraph(): void {
		this.clearCanvas();
		this.graphDrawer.draw();
	}

	clearCanvas(): void {
		const context = this.canvas.nativeElement.getContext('2d');
		const fillStyle = context.fillStyle;
		context.fillStyle = 'white';
		context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
		context.fillStyle = fillStyle;
	}

	setNode($event): void {
		const node = this.getNodeByCoords($event);
		if($event.ctrlKey) {
			this.nodeDragger.node = node;
			this.nodesConnector.setNode(node);
			const edge = this.nodesConnector.connectNodes();
			if(edge && this.checkEdge(edge)) {
				this.edges.push(edge);
			}
			this.drawGraph();
		} 

		this.nodeDragger.node = node;
		this.switchOffUserSelect();
	}

	checkEdge(edgeToPush: Edge): boolean {
		for(let edge of this.edges) {
			if(edge.getFrom() == edgeToPush.getFrom() &&
			   edge.getTo() == edgeToPush.getTo()) {
				return false;
			}
		}
		return true;
	}

	resetNode(): void {
		this.nodeDragger.node = null;
		this.switchOnUserSelect();
	}

	getNodeByCoords($event): Node {
		const rect = this.canvas.nativeElement.getBoundingClientRect();
		const x = $event.clientX - rect.left;
		const y = $event.clientY - rect.top;

		for(let node of this.nodes) {
			const inXRange = (node.x - 6.5 <= x) && (node.x + 6.5 >= x); 
			const inYRange = (node.y - 6.5 <= y) && (node.y + 6.5 >= y); 
			
			if(inXRange && inYRange) {
				node.dX = x - node.x;
				node.dY = y - node.y;
				return node;
			}
		}

		return null;
	}
}