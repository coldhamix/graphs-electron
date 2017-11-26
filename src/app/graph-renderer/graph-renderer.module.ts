import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { graphServiceProvider } from 'app/graph-renderer/graph-service/graph.service.provider';
import { GraphComponent } from 'app/graph-renderer/graph/graph.component';
import { GraphDrawerDirective } from 'app/graph-renderer/directives/graph-drawer/graph-drawer.directive';
import { ChartDrawerDirective } from 'app/graph-renderer/directives/chart-drawer/chart-drawer.directive';
import { NodeDraggerDirective } from 'app/graph-renderer/directives/node-dragger.directive';
import { NodesConnectorDirective } from 'app/graph-renderer/directives/nodes-connector.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  declarations: [
    GraphComponent,
    GraphDrawerDirective,
    ChartDrawerDirective,
    NodeDraggerDirective,
    NodesConnectorDirective,
  ],
  exports: [
    GraphComponent,
    GraphDrawerDirective,
    ChartDrawerDirective,
    NodeDraggerDirective,
    NodesConnectorDirective,
  ],
})
export class GraphRendererModule { }
