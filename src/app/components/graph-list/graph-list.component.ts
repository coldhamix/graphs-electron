import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SettingsService } from '../../providers/settings.service';
import { Graph } from '../../graph-renderer/graph-constituents/graph';
import { GraphService } from '../../graph-renderer/graph-service/graph.service';

import 'rxjs/add/operator/takeUntil';
import { TaskRunnerService } from '../../providers/task-runner.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-graph-list',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.scss'],
})
export class GraphListComponent implements OnInit, OnDestroy {

  private canvasWidth = 640;
  private canvasHeight = 480;
  private variantsNumber = 15;
  private nodesCount = 8;
  private directed = false;
  private weighted = true;
  private canvases: HTMLCanvasElement[] = [];
  private inputNodes: number[][] = [];

  graphs: Graph[] = [];

  private destroyed: Subject<void> = new Subject();

  constructor(private graphService: GraphService,
              private settingsService: SettingsService,
              private taskRunnerService: TaskRunnerService,
              private electronService: ElectronService) {
  }

  get nodeSelectorEnabled(): boolean {
    const pluginInput = this.taskRunnerService.currentPlugin.input;
    return pluginInput && pluginInput.nodes && !!pluginInput.nodes.length; 
  }

  get nodeSelectorNodes() {
    const pluginInput = this.taskRunnerService.currentPlugin.input;
    return pluginInput ? pluginInput.nodes : null;
  }

  ngOnInit(): void {
    this.init();
    this.settingsService.settingsChange
      .takeUntil(this.destroyed)
      .subscribe(() => this.init());
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private init() {
    this.variantsNumber = this.settingsService.tasksCount;
    this.nodesCount = this.settingsService.nodesCount;
    this.weighted = this.settingsService.weightedGraph;
    this.directed = this.settingsService.directedGraph;
    this.graphService.init(this.canvasWidth, this.canvasHeight);
    this.generateGraphs();
  }

  private generateGraphs(): void {
    this.graphs = [];
    for (let i = 0; i < this.variantsNumber; i++) {
      this.graphs.push(this.graphService.generateGraph(this.nodesCount));
    }
  }

  regenerate(index: number): void {
    this.graphs[index] = this.graphService.generateGraph(this.nodesCount);
  }

  saveAll(): void {
    const dir = this.electronService.createResultDir(this.taskRunnerService.currentPlugin);
    for (let i = 0; i < this.graphs.length; i++) {
      this.save(i, dir);
    }
  }

  save(index: number, dir: string): void {
    const result = this.taskRunnerService.run(this.graphs[index], this.inputNodes[index]);
    this.electronService.saveTextFile(`${dir}/${index + 1}.txt`, result);
    this.electronService.saveImageFile(`${dir}/${index + 1}.png`, this.canvases[index]);
  }

  saveCanvas(index: number, canvas: HTMLCanvasElement) {
    this.canvases[index] = canvas;
  }

  onNodeInputChanged(index: number, nodes: number[]) {
    this.inputNodes[index] = nodes;
  }

}
