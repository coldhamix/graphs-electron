import { Node } from '../graph-constituents/node';
import { Edge } from '../graph-constituents/edge';

export class CoordGenerator {
	private lineCoeff: number[][];
	private _nodes: Node[] = [];
	private _edges: Edge[] = [];

	private width: number;
	private height: number;

	public init(width: number, height: number, nodes: Node[], edges: Edge[]): void {
		this.lineCoeff = [];

		this.width = width;
		this.height = height;
		this._nodes = nodes;
		this._edges = edges;
	}

	private calculateCoeff(from: Node, to: Node): void {
		let k = (from.y - to.y) / (from.x - to.x);
		let b = from.y - from.x * k;
		this.lineCoeff.push([k, b]);
	}

	public setCoord(): void {
		let unit = this.width > this.height ? 
					Math.floor((this.height - 30)/ 10) : Math.floor((this.width - 30) / 10);

		this._nodes[this._edges[0].getFrom()].x = this.width / 2 - 15 + Math.round(Math.random() * 30); 
		this._nodes[this._edges[0].getFrom()].y = this.height / 2 - 15 + Math.round(Math.random() * 30);

		for(let i = 0; i < this._edges.length; i++) {
			const from: Node = this._nodes[this._edges[i].getFrom()];
			const to: Node = this._nodes[this._edges[i].getTo()];
			const edge_length: number = unit * this._edges[i].getWeight();
			
			if(from.x == 0) {
				if(this.resolve(i, unit)) {
					i--;
				}
			} else {
				if(to.x == 0) {
					this.generateCoord(from, to, edge_length);
				}
			}

			this.calculateCoeff(from, to);		
		}

		
		this.checkEdgesLength(unit);
	}

	private resolve(index: number, unit: number): boolean {
		const from = this._nodes[this._edges[index].getFrom()];
		const to = this._nodes[this._edges[index].getTo()];
		let edge_length: number;
		
		if(to.x != 0) {
			edge_length = unit * this._edges[index].getWeight();

			this.generateCoord(to, from, edge_length);
			return false;
		}

		for(let i = index + 1; i < this._edges.length; i++) {
			edge_length = unit * this._edges[i].getWeight();
	
			if(this._nodes[this._edges[i].getFrom()] == from && 
				this._nodes[this._edges[i].getTo()].x != 0) {
				this.generateCoord(this._nodes[this._edges[i].getTo()], from, edge_length);
				return true;
			}
			if(this._nodes[this._edges[i].getFrom()] == to && 
				this._nodes[this._edges[i].getTo()].x != 0) {
				this.generateCoord(this._nodes[this._edges[i].getTo()], to, edge_length);
				return true;
			}
			if(this._nodes[this._edges[i].getTo()] == from &&
			 	this._nodes[this._edges[i].getFrom()].x != 0) {
				this.generateCoord(this._nodes[this._edges[i].getFrom()], from, edge_length);
				return true;
			}
			if(this._nodes[this._edges[i].getTo()] == to && 
				this._nodes[this._edges[i].getFrom()].x != 0) {
				this.generateCoord(this._nodes[this._edges[i].getFrom()], from, edge_length);
				return true;
			}
		}

		this.connectNodes(from);
		this.generateCoord(this._nodes[this._edges[0].getFrom()], this._nodes[this._edges[0].getTo()], this._edges[0].getWeight() * unit);
		return true;
	}

	private connectNodes(to: Node): void {
		const edge = new Edge();
		edge.setFrom(this._edges[0].getFrom());
		edge.setTo(to.id);
		edge.setWeight(1 + Math.round(Math.random() * 8.5));

		this._edges.unshift(edge);
	}

	private generateCoord(from: Node, to: Node, edge_length: number): void {
		let x = this.generateX(from.x, edge_length);
		let y = this.generateY(from.x, from.y, edge_length, x);
		
		let counter = 0;
		let breakLoop = false;

		while(this.checkCoord(x, y)) {
			counter++;
			if(counter == 10) {
				if(!breakLoop) {
					breakLoop = true;
				} else {
					break;
				}

				edge_length *= 2;
				counter = 0;
			}

			const coords = this.rotate(x, y, from.x, from.y, edge_length);
			x = coords[0];
			y = coords[1];
		} 

		x = this.checkX(x);
		y = this.checkY(y);

		to.x = x;
		to.y = y;
	}

	private rotate(x: number, y: number, centerX: number, centerY: number, edge_length: number): number[] {
		const step = 0.59;
		const coords: number[] = [];

		let calculated = false;
		let dX = Math.round(3.85 * edge_length / 10);
		let dY = dX;

		if(x > centerX && y <= centerY && !calculated) {
			x -= dX;

			if(y - dY < centerY - edge_length) {
				dY = centerY - edge_length - y + dY;
				y += dY;
			} else {
				y -= dY;
			}

			calculated = true;
		}

		if(x <= centerX && y < centerY && !calculated) {
			if(x - dX < centerX - edge_length) {
				dX = centerX - edge_length - x + dX;
				x += dX;
			} else {
				x -= dX;
			}

			y += dY;

			calculated = true;
		}

		if(x < centerX && y >= centerY && !calculated) {
			x += dX;

			if(y + dY > centerY + edge_length) {
				dY = y + dY - centerY - edge_length;
				y -= dY;
			} else {
				y += dY;
			}

			calculated = true;
		}

		if(x >= centerX && y > centerY && !calculated) {
			if(x + dX > centerX + edge_length) {
				dX = x + dX - centerX - edge_length;
				x -= dX;
			} else {
				x += dX;
			}

			y -= dY;

			calculated = true;
		}

		coords.push(x);
		coords.push(y);
		return coords;
	}

	private generateX(centerX: number, distance: number): number {
		let x = centerX - distance + Math.round(Math.random() * 2 * distance);

		if(x <= 15) {
			x += distance;
		} else if(x >= this.width - 15) {
			x -= distance;
		}

		return x;
	}

	private checkX(x: number): number {
		if(x > this.width - 15) {
			x = this.width - 30 + Math.round(Math.random() * 15);
		}

		if(x < 15) {
			x = 15 + Math.round(Math.random() * 15);
		}

		return x;
	}

	private generateY(centerX: number, centerY: number, distance: number, x: number): number {
			let y: number;
			const distX = centerX - x;
			const distY = Math.round(Math.sqrt(distance * distance - distX * distX));
			
			if(Math.round(Math.random())) {
				y = centerY - distY;
			} else {
				y = centerY + distY;
			}
			y = this.checkY(y);

			return y;
	}

	private checkY(y: number): number {
		if(y > this.height - 15) {
			y = this.height - 30 + Math.round(Math.random() * 15);
		}
		if(y < 15) {
			y = 15 + Math.round(Math.random() * 15);
		}

		return y;
	}

	private checkEdgesLength(unit: number): void {
		for(let edge of this._edges) {
			const from = this._nodes[edge.getFrom()];
			const to = this._nodes[edge.getTo()];
			const edgeLength = unit * edge.getWeight();

			let currentLength = this.getCurrentLength(from, to);

			while(currentLength < edgeLength) {
				if(to.x > 15 && to.x < this.width - 15) {
					if(to.x > from.x) {
						to.x = to.x + 1;
					} else {
						to.x = to.x - 1;
					}
				} else if(to.y > 15 && to.y < this.height - 15) {
					if(to.y > from.y) {
						to.y = to.y + 1;
					} else {
						to.y = to.y - 1;
					}
				} else {
					break;
				}

				currentLength = this.getCurrentLength(from, to);
			} 
		}
	}

	private getCurrentLength(from: Node, to: Node): number {
		const distX = from.x - to.x;
		const distY = from.y - to.y;

		return Math.round(Math.sqrt(distX * distX + distY * distY));
	}

	private checkCoord(x: number, y: number): boolean {
		for(let i = 0; i < this.lineCoeff.length; i++) {
			const k = this.lineCoeff[i][0];
			const b = this.lineCoeff[i][1];

			if(x > Math.round((y - b) / k) - 10 && x < Math.round((y - b) / k) + 10) {
				return true;
			}

			if(y > Math.round(k * x + b) - 10 && y < Math.round(k * x + b) + 10) {
				return true;
			}
		}

		for(let node of this._nodes) {
			if(node.x == 0) {
				continue;
			}

			if((x >= node.x - 10 && x <= node.x + 10)
				|| (y >= node.y - 10 && y <= node.y + 10)) {
				return true;
			}
		}
		return false;
	}
}