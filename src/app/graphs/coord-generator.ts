import { Node } from './node';
import { Edge } from './edge';

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

  public setCoord(): void {
    const unit = this.width > this.height ?
      Math.floor((this.height - 30) / 10) : Math.floor((this.width - 30) / 10);

    this._nodes[this._edges[0].getFrom()].setX(this.width / 2 - 15 + Math.round(Math.random() * 30));
    this._nodes[this._edges[0].getFrom()].setY(this.height / 2 - 15 + Math.round(Math.random() * 30));

    for (let i = 0; i < this._edges.length; i++) {
      const from: Node = this._nodes[this._edges[i].getFrom()];
      const to: Node = this._nodes[this._edges[i].getTo()];
      const edge_length: number = unit * this._edges[i].getWeight();

      if (from.getX() === 0) {
        if (this.resolve(i, unit)) {
          i--;
        }
      } else {
        if (to.getX() === 0) {
          this.generateCoord(from, to, edge_length);
        } else {
          this.changeCoord(i, unit);
        }
      }

      this.calculateCoeff(from, to);
    }
  }

  private calculateCoeff(from: Node, to: Node): void {
    const k = (from.getY() - to.getY()) / (from.getX() - to.getX());
    const b = from.getY() - from.getX() * k;
    console.log('k: ' + k + ' b: ' + b);
    console.log('another b: ' + (to.getY() - to.getX() * k));
    this.lineCoeff.push([k, b]);
  }

  private resolve(index: number, unit: number): boolean {
    const from = this._nodes[this._edges[index].getFrom()];
    const to = this._nodes[this._edges[index].getTo()];
    let edge_length: number;

    if (to.getX() !== 0) {
      edge_length = unit * this._edges[index].getWeight();

      this.generateCoord(to, from, edge_length);
      return false;
    }

    for (let i = index + 1; i < this._edges.length; i++) {
      edge_length = unit * this._edges[i].getWeight();

      if (this._nodes[this._edges[i].getFrom()] === from &&
        this._nodes[this._edges[i].getTo()].getX() !== 0) {
        this.generateCoord(this._nodes[this._edges[i].getTo()], from, edge_length);
        return true;
      }
      if (this._nodes[this._edges[i].getFrom()] === to &&
        this._nodes[this._edges[i].getTo()].getX() !== 0) {
        this.generateCoord(this._nodes[this._edges[i].getTo()], to, edge_length);
        return true;
      }
      if (this._nodes[this._edges[i].getTo()] === from &&
        this._nodes[this._edges[i].getFrom()].getX() !== 0) {
        this.generateCoord(this._nodes[this._edges[i].getFrom()], from, edge_length);
        return true;
      }
      if (this._nodes[this._edges[i].getTo()] === to &&
        this._nodes[this._edges[i].getFrom()].getX() !== 0) {
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
    edge.setTo(to.getId());
    edge.setWeight(1 + Math.round(Math.random() * 8.5));

    this._edges.unshift(edge);
  }

  private generateCoord(from: Node, to: Node, edge_length: number): void {
    let x: number;
    let y: number;

    let counter = 0;
    do {
      x = from.getX() - edge_length + Math.round(Math.random() * 2 * edge_length);

      if (x <= 15) {
        x += edge_length;
      } else if (x >= this.width - 15) {
        x -= edge_length;
      }

      let distX = from.getX() - x;
      const distY = Math.round(Math.sqrt(edge_length * edge_length - distX * distX));

      if (Math.round(Math.random())) {
        y = from.getY() - distY;
      } else {
        y = from.getY() + distY;
      }

      while (y >= this.height - 15 || y <= 15) {
        if (y >= this.height - 15) {
          y--;
        } else {
          y++;
        }

        distX = Math.round(Math.sqrt(Math.pow(edge_length, 2) - y * y));
        let newX: number;

        if (Math.round(Math.random())) {
          newX = from.getX() - distX;
        } else {
          newX = from.getX() + distX;
        }

        if (newX < this.width - 15 && newX > 15) {
          x = newX;
        }
      }

      counter++;
      if (counter === 75) {
        break;
      }
    } while (this.checkCoord(x, y));

    to.setX(x);
    to.setY(y);
  }

  private changeCoord(index: number, unit: number): void {
    const edge = this._edges[index];
    const from = this._nodes[this._edges[index].getFrom()];
    const to = this._nodes[this._edges[index].getTo()];
    const edge_length = edge.getWeight() * unit;
    const nodeEdges: Edge[] = [];

    for (let i = 0; i < index; i++) {
      if (this._nodes[this._edges[i].getFrom()] === to ||
        this._nodes[this._edges[i].getTo()] === to) {
        nodeEdges.push(this._edges[i]);
      }
    }

    let xF = from.getX();
    let yF = from.getY();

    let xT = to.getX();
    let yT = to.getY();

    let distX = xF - xT;
    let distY = yF - yT;
    let dist = Math.round(Math.sqrt(distX * distX + distY * distY));
    if (xF > xT && yF > yT) {
      while (dist > edge_length) {
        xF--;
        xT++;
        yF--;
        yT++;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF < xT || yF < yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      while (dist < edge_length) {
        xF++;
        xT--;
        yF++;
        yT--;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF < xT || yF < yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      this.updateCoord(from, to, xF, yF, xT, yT);
    }

    if (xF < xT && yF > yT) {
      while (dist > edge_length) {
        xF++;
        xT--;
        yF--;
        yT++;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF > xT || yF < yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      while (dist < edge_length) {
        xF--;
        xT++;
        yF++;
        yT--;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF > xT || yF < yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      this.updateCoord(from, to, xF, yF, xT, yT);
    }

    if (xF > xT && yF < yT) {
      while (dist > edge_length) {
        xF--;
        xT++;
        yF++;
        yT--;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF < xT || yF > yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      while (dist < edge_length) {
        xF++;
        xT--;
        yF--;
        yT++;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF < xT || yF > yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      this.updateCoord(from, to, xF, yF, xT, yT);
    }

    if (xF < xT && yF < yT) {
      while (dist > edge_length) {
        xF++;
        xT--;
        yF++;
        yT--;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF > xT || yF > yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      while (dist < edge_length) {
        xF--;
        xT++;
        yF--;
        yT++;

        distX = xF - xT;
        distY = yF - yT;
        dist = Math.round(Math.sqrt(distX * distX + distY * distY));

        if (this.checkDistance(nodeEdges, unit)) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          return;
        }

        if (xF > xT || yF > yT) {
          this.updateCoord(from, to, xF, yF, xT, yT);
          this.changeCoord(index, unit);
          return;
        }
      }
      this.updateCoord(from, to, xF, yF, xT, yT);
    }
  }

  private updateCoord(from: Node, to: Node, xF: number, yF: number, xT: number, yT: number) {
    if (xF < this.width - 15) {
      if (xF > 15) {
        from.setX(xF);
      } else {
        from.setX(15);
      }
    } else {
      from.setX(this.width - 15);
    }

    if (yF < this.height - 15) {
      if (yF > 15) {
        from.setY(yF);
      } else {
        from.setY(15);
      }
    } else {
      from.setY(this.height - 15);
    }

    if (xT < this.width - 15) {
      if (xT > 15) {
        to.setX(xT);
      } else {
        to.setX(15);
      }
    } else {
      to.setX(this.width - 15);
    }

    if (yT < this.height - 15) {
      if (yT > 15) {
        to.setY(yT);
      } else {
        to.setY(15);
      }
    } else {
      to.setY(this.height - 15);
    }
  }

  private checkDistance(nodeEdges: Edge[], unit: number): boolean {
    for (let i = 0; i < nodeEdges.length; i++) {
      const from = this._nodes[nodeEdges[i].getFrom()];
      const to = this._nodes[nodeEdges[i].getTo()];

      const xF = from.getX();
      const yF = from.getY();

      const xT = to.getX();
      const yT = to.getY();
      const distX = xF - xT;
      const distY = yF - yT;
      const dist = Math.round(Math.sqrt(distX * distX + distY * distY));

      if (dist > (nodeEdges[i].getWeight() + 1) * unit
        || dist < (nodeEdges[i].getWeight() - 1) * unit) {
        return true;
      }
    }

    return false;
  }

  private checkCoord(x: number, y: number): boolean {
    const distance = Math.round(25 - (this._nodes.length - 6) * 1.3);
    for (let i = 0; i < this.lineCoeff.length; i++) {
      const k = this.lineCoeff[i][0];
      const b = this.lineCoeff[i][1];

      if (x > Math.round((y - b) / k) - distance && x < Math.round((y - b) / k) + distance) {
        return true;
      }

      if (y > Math.round(k * x + b) - distance && y < Math.round(k * x + b) + distance) {
        return true;
      }
    }

    for (const node of this._nodes) {
      if (node.getX() === 0) {
        continue;
      }

      if ((x >= node.getX() - 0.75 * distance && x <= node.getX() + 0.75 * distance)
        || (y >= node.getY() - 0.75 * distance && y <= node.getY() + 0.75 * distance)) {
        console.log('TRUE');
        return true;
      }
    }
    return false;
  }
}
