import { Component } from '@angular/core';
import { SettingsService } from '../../providers/settings.service';
import { MatDialogRef } from '@angular/material';
import { TaskRunnerService } from 'app/providers/task-runner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  printTaskDescription: boolean;
  tasksCount: number;
  nodesCount: number;
  weightedGraph: boolean;
  directedGraph: boolean;
  developerMode: boolean;

  constructor (private settingsService: SettingsService,
               private dialogRef: MatDialogRef<SettingsComponent>,
               private taskRunnerService: TaskRunnerService,
               private router: Router) {
    this.reset();
  }

  save(): void {

    if (this.settingsService.developerMode !== this.developerMode) {
      this.settingsService.developerMode = this.developerMode;
      this.taskRunnerService.init().subscribe();
    }

    this.settingsService.printTaskDescription = this.printTaskDescription;
    this.settingsService.tasksCount = this.tasksCount;
    this.settingsService.nodesCount = this.nodesCount >= 6 && this.nodesCount <= 16 ? this.nodesCount : 6;
    this.settingsService.weightedGraph = this.weightedGraph;
    this.settingsService.directedGraph = this.directedGraph;
    this.settingsService.notify();
    this.dialogRef.close();
  }

  cancel(): void {
    this.reset();
    this.dialogRef.close();
  }

  private reset(): void {
    this.printTaskDescription = this.settingsService.printTaskDescription;
    this.tasksCount = this.settingsService.tasksCount;
    this.nodesCount = this.settingsService.nodesCount;
    this.developerMode = this.settingsService.developerMode;
    this.weightedGraph = this.settingsService.weightedGraph;
    this.directedGraph = this.settingsService.directedGraph;
  }

}
