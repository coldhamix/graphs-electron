import { Component, Input, Output } from '@angular/core';
import { NodeInputDescriptor } from 'app/model/plugin';
import { totalmem } from 'os';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-graph-node-selector',
  templateUrl: './graph-node-selector.component.html',
  styleUrls: ['./graph-node-selector.component.scss']
})
export class GraphNodeSelectorComponent {

  @Output() nodeInputChange = new EventEmitter<number[]>();

  nodesRange: number[];
  nodes: { name: string, value: any }[];
  
  private _totalNodes: number;
  @Input() set totalNodes(totalNodes: number) {
    this._totalNodes = totalNodes;
    this.nodesRange = new Array(totalNodes);
    this.onNodeInputChanged(this._inputNodes);
  }

  get totalNodes(): number {
    return this._totalNodes;
  }

  private _inputNodes: NodeInputDescriptor[];

  @Input() set inputNodes(inputNodes: NodeInputDescriptor[]) {
    this.onNodeInputChanged(this._inputNodes = inputNodes);
  }

  get inputNodes(): NodeInputDescriptor[] {
    return this._inputNodes;
  }

  private onNodeInputChanged(inputNodes: NodeInputDescriptor[]): void {
    this.nodes = [];
    if (inputNodes) {
      inputNodes.forEach((node, index: number) => {
        if (index < this.totalNodes) {
          this.nodes.push({
            name: node.name,
            value: this.takeRandomNode()
          })
        }
      });
    }
    this.nodeInputChange.emit(this.nodes.map(node => node.value));
  }

  private takeRandomNode(): number {
    const takenNodes = this.nodes.map(node => node.value);
    let currentNode;

    do {
      currentNode = Math.floor(Math.random() * this.totalNodes);
    } while (takenNodes.includes(currentNode));

    return currentNode;
  }

  onChange($event, node: any): void {
    node.value = $event;
    this.nodeInputChange.emit(this.nodes.map(node => node.value));
  }

}
