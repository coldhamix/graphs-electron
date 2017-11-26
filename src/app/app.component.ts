import { AfterViewInit, Component, NgZone } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { MatDialog } from '@angular/material';
import { SettingsComponent } from './components/settings/settings.component';
import { Router } from '@angular/router';
import { TaskRunnerService } from './providers/task-runner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  loaded = false;

  pipe: any;

  constructor(private electronService: ElectronService,
              private dialog: MatDialog,
              private router: Router,
              private taskRunnerService: TaskRunnerService,
              private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.pipe = this.taskRunnerService.init()
      .subscribe(() => this.zone.run(() => this.loaded = true));
  }

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

  isMenuScreen(): boolean {
    return this.router.url === '/';
  }

  openSettings(): void {
    this.dialog.open(SettingsComponent, {
      disableClose: true,
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

}
