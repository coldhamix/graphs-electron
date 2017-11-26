import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '../model/plugins';
import { Plugin } from '../model/plugin';
import { Observer } from 'rxjs/Observer';
import { Graph } from '../graph-renderer/graph-constituents/graph';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { AdjacencyMatrix } from 'app/graph-renderer/graph-constituents/adjacency-matrix';
import { SettingsService } from 'app/providers/settings.service';
import { Edge } from 'app/graph-renderer/graph-constituents/edge';
import { ElectronService } from 'app/providers/electron.service';

@Injectable()
export class TaskRunnerService {

  protected _plugins: Plugins;
  protected plugin: Plugin;

  pluginsChange = new EventEmitter<Plugins>();

  constructor (protected httpClient: HttpClient,
               protected settingsService: SettingsService,
               protected electronService: ElectronService) {}

  get currentPlugin(): Plugin {
    return this.plugin;
  }

  get plugins(): Plugins {
    return this._plugins;
  }

  init(): Observable<void> {
    window['plugins'] = {};
    return this.loadPluginsList()
      .do(plugins => this.pluginsChange.emit(this._plugins = plugins))
      .switchMap(plugins => this.loadPlugins(plugins));
  }

  select(plugin: Plugin): void {
    this.plugin = plugin;
  }

  run(graph: Graph, inputNodes: number[]): string {
    const fn = window['plugins'][this.plugin.name];
    graph = this.cleanGraph(graph);
    return fn(graph, inputNodes);
  }

  protected loadPluginsList(): Observable<Plugins> {
    return this.httpClient
      .get<Plugins>('assets/plugins.json')
      .map(plugins => this.handleObservableMode(plugins));
  }

  protected handleObservableMode(plugins: Plugins): Plugins {
    if (this.settingsService.developerMode) {
      plugins.plugins.push(...this.electronService.findCwdPlugins().plugins);
    }

    return plugins;
  }

  protected loadPlugins(plugins: Plugins): Observable<any> {
    const pluginsQuery: Observable<any>[] = [];

    for (const plugin of plugins.plugins) {
      if (!plugin.external) {
        pluginsQuery.push(this.loadScript(`assets/${plugin.name}.js`));
      } else {
        pluginsQuery.push(this.loadExternalScript(plugin.name));
      } 
    }

    return Observable.forkJoin(pluginsQuery);

  }

  protected loadScript(name: string): Observable<any> {

    return Observable.create((observer: Observer<any>) => {

      const script = document.createElement('script');

      script.onload = () => {
        observer.next(null);
        observer.complete();
      };

      script.onerror = () => {
        observer.error(null);
      };

      script.src = name;

      document.body.appendChild(script);
    });

  }

  protected loadExternalScript(name: string): Observable<any> {
    const source = this.electronService.readFile(`${name}.plugin.js`);
    const script = document.createElement('script');
    script.innerHTML = source;
    document.body.appendChild(script);    
    return null;
  }

  protected cleanGraph(graph: Graph): Graph {
    const directed = this.settingsService.directedGraph,
          weighted = this.settingsService.weightedGraph,
          clean = new Graph(graph.nodes.length);

    for (let edge of graph.edges) {
      const newEdge = new Edge();
      newEdge.setFrom(edge.getFrom());
      newEdge.setTo(edge.getTo());
      newEdge.setWeight(weighted ? edge.getWeight() : 1);

      clean.edges.push(newEdge);
    }

    clean.matrix = this.generateMatrix(clean, directed);

    return clean;
  }

  protected generateMatrix(graph: Graph, directed: boolean): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < graph.nodes.length; i++) {
        matrix.push([]);
        for (let j = 0; j < graph.nodes.length; j++) {
          matrix[i].push(0);
        }
    }

    for (const edge of graph.edges) {
      const from = edge.getFrom(),
            to = edge.getTo(),
            weight = edge.getWeight();
      matrix[from][to] = weight;
      if (!directed) {
        matrix[to][from] = weight;
      }
    }

    return matrix;
  }

}
