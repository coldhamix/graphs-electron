import { Directive, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Node } from '../graph-constituents/node';

@Directive({
  selector: '[nodeDragger]'
})
export class NodeDraggerDirective {
	private canvas: ElementRef;
	private _node: Node = null;

	constructor(canvas: ElementRef) {
		this.canvas = canvas;
	}
	
	public set node(node: Node) {
		this._node = node;
	}

	@HostListener('mousemove', ['$event']) dragNode($event) {
		if(this._node === null) {
			return;
		}

		const rect = this.canvas.nativeElement.getBoundingClientRect();
		const x = $event.clientX - rect.left - this._node.dX;
		const y = $event.clientY - rect.top - this._node.dY;

		if(this.checkX(x)) {
			this._node.x = x;
		}

		if(this.checkY(y)) {
			this._node.y = y;
		}
	}

	private checkX(x: number): boolean {
		const width = this.canvas.nativeElement.getAttribute('width');
		if(x > width - 15 || x < 15) {
			return false;
		}

		return true;
	}

	private checkY(y: number): boolean {
		const height = this.canvas.nativeElement.getAttribute('height');
		if(y > height - 15 || y < 15) {
			return false;
		}

		return true;
	}
}
