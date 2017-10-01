import { Component, OnDestroy, OnInit } from '@angular/core';
import { Graph } from '../../graphs/graph';
import { GraphService } from '../../graphs/graph.service';
import { Subject } from 'rxjs/Subject';
import { SettingsService } from '../../providers/settings.service';

import 'rxjs/add/operator/takeUntil';

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

  private graphs: Graph[] = [];

  private destroyed: Subject<void> = new Subject();

  constructor(private graphService: GraphService,
              private settingsService: SettingsService) {
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

  private regenerate(index: number): void {
    this.graphs[index] = this.graphService.generateGraph(this.nodesCount);
  }

}
