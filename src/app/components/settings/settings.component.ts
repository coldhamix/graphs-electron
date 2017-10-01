import { Component } from '@angular/core';
import { SettingsService } from '../../providers/settings.service';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  printTaskDescription: boolean;
  tasksCount: number;
  nodesCount: number;
  developerMode: boolean;

  constructor (private settingsService: SettingsService,
               private dialogRef: MdDialogRef<SettingsComponent>) {
    this.reset();
  }

  save(): void {
    this.settingsService.printTaskDescription = this.printTaskDescription;
    this.settingsService.developerMode = this.developerMode;
    this.settingsService.tasksCount = this.tasksCount;
    this.settingsService.nodesCount = this.nodesCount >= 6 && this.nodesCount <= 16 ? this.nodesCount : 6;
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
  }

}
