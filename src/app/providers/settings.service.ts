import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SettingsService {

  private settingsChanged$: Subject<void> = new Subject();
  settingsChange: Observable<void> = this.settingsChanged$.asObservable();

  private _printTaskDescription = true;
  private _tasksCount = 25;
  private _nodesCount = 8;
  private _developerMode = false;
  private _weightedGraph = true;
  private _directedGraph = false;


  get printTaskDescription(): boolean {
    return this._printTaskDescription;
  }

  set printTaskDescription(value: boolean) {
    this._printTaskDescription = value;
  }

  get tasksCount(): number {
    return this._tasksCount;
  }

  set tasksCount(value: number) {
    this._tasksCount = value;
  }

  get developerMode(): boolean {
    return this._developerMode;
  }
  get weightedGraph(): boolean {
    
    return this._weightedGraph;
  }

  get directedGraph(): boolean {
    return this._directedGraph;
  }

  set developerMode(value: boolean) {
    this._developerMode = value;
  }

  get nodesCount(): number {
    return this._nodesCount;
  }

  set nodesCount(value: number) {
    this._nodesCount = value;
  }
  
  set weightedGraph(weightedGraph: boolean) {
    this._weightedGraph = weightedGraph;
  }

  set directedGraph(directedGraph: boolean) {
    this._directedGraph = directedGraph;
  }

  notify(): void {
    this.settingsChanged$.next();
  }

}
