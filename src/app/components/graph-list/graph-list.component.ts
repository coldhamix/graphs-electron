import { Component, OnDestroy, OnInit } from '@angular/core';
import { Graph } from '../../graphs/graph';
import { GraphService } from '../../graphs/graph.service';
import { Subject } from 'rxjs/Subject';
import { SettingsService } from '../../providers/settings.service';

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
  private nodesCount = 16;
  private canvases: HTMLCanvasElement[] = [];

  graphs: Graph[] = [];

  private destroyed: Subject<void> = new Subject();

  constructor(private graphService: GraphService,
              private settingsService: SettingsService,
              private taskRunnerService: TaskRunnerService,
              private electronService: ElectronService) {
  }

  ngOnInit(): void {
    this.init();
    this.settingsService.settingsChange
      .takeUntil(this.destroyed)
      .subscribe(() => {
        this.init();
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private init() {
    this.variantsNumber = this.settingsService.tasksCount;
    this.nodesCount = this.settingsService.nodesCount;
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
    const result = this.taskRunnerService.run(this.graphs[index]);
    this.electronService.saveTextFile(`${dir}/${index + 1}.txt`, result);
    this.electronService.saveImageFile(`${dir}/${index + 1}.png`, this.canvases[index]);
  }

  saveCanvas(index: number, canvas: HTMLCanvasElement) {
    this.canvases[index] = canvas;
  }

}
