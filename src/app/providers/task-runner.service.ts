import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '../model/plugins';
import { Plugin } from '../model/plugin';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/forkJoin';
import { Graph } from '../graphs/graph';

@Injectable()
export class TaskRunnerService {

  protected _plugins: Plugins;
  protected plugin: Plugin;

  constructor (protected httpClient: HttpClient) {}

  get currentPlugin(): Plugin {
    return this.plugin;
  }

  get plugins(): Plugins {
    return this._plugins;
  }

  init(): Observable<void> {
    window['plugins'] = {};
    return this.loadPluginsList()
      .do(plugins => this._plugins = plugins)
      .switchMap(plugins => this.loadPlugins(plugins));
  }

  select(plugin: Plugin): void {
    this.plugin = plugin;
  }

  run(graph: Graph): string {
    const fn = window['plugins'][this.plugin.name];
    return fn(graph);
  }

  protected loadPluginsList(): Observable<Plugins> {
    return this.httpClient.get<Plugins>('assets/plugins.json');
  }

  protected loadPlugins(plugins: Plugins): Observable<any> {
    const pluginsQuery: Observable<any>[] = [];

    for (const plugin of plugins.plugins) {
      pluginsQuery.push(
        this.loadScript(`assets/${plugin.name}.js`)
      );
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

}
