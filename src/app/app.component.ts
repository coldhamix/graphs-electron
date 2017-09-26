import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { MdDialog } from '@angular/material';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private electronService: ElectronService,
              private dialog: MdDialog) {}

  maximize(): void {
    const win = this.electronService.remote.getCurrentWindow();

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }

  quit(): void {
    window.close();
  }

  openSettings(): void {
    this.dialog.open(SettingsComponent);
  }

}
