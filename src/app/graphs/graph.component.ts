import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Node } from './node';
import { Edge } from './edge';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph.component.html',
})
export class GraphComponent implements AfterViewChecked {
  @Input() width: number;
  @Input() height: number;
  @Input() nodes: Node[];
  @Input() edges: Edge[];

  @ViewChild('canvas') private canvas: ElementRef;

  ngAfterViewChecked(): void {
    this.drawGraph();
  }

  private drawGraph(): void {
    this.clearCanvas();
    this.drawEdges();
    this.drawNodes();
    this.drawWeigth();
  }

  private clearCanvas(): void {
    const context = this.canvas.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  private drawEdges(): void {
    const context = this.canvas.nativeElement.getContext('2d');

    context.beginPath();
    for (const edge of this.edges) {
      context.moveTo(this.nodes[edge.getFrom()].getX(), this.nodes[edge.getFrom()].getY());
      context.lineTo(this.nodes[edge.getTo()].getX(), this.nodes[edge.getTo()].getY());
    }
    context.stroke();
    context.closePath();
  }

  private drawNodes(): void {
    const context = this.canvas.nativeElement.getContext('2d');

    for (const node of this.nodes) {
      context.beginPath();
      context.arc(node.getX(), node.getY(), 3, 0, 2 * Math.PI, true);
      context.fill();
      context.closePath();
    }
  }

  private drawWeigth() {
    const context = this.canvas.nativeElement.getContext('2d');
    context.font = '9px Arial';

    for (const edge of this.edges) {
      const x_f: number = this.nodes[edge.getFrom()].getX();
      const y_f: number = this.nodes[edge.getFrom()].getY();

      const x_t: number = this.nodes[edge.getTo()].getX();
      const y_t: number = this.nodes[edge.getTo()].getY();

      const x: number = Math.round((x_f + x_t) / 2);
      const y: number = Math.round((y_f + y_t) / 2);
      context.beginPath();
      context.fillStyle = '#ffffff';
      context.arc(x, y, 5, 0, 2 * Math.PI, true);
      context.fill();

      context.fillStyle = '#000000';
      context.fillText('' + edge.getWeight(), x - 3.5, y + 3);
      context.closePath();
    }
  }
}
