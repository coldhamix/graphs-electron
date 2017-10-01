import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { MdDialog } from '@angular/material';
import { SettingsComponent } from './components/settings/settings.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private electronService: ElectronService,
              private dialog: MdDialog,
              private router: Router) {}

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
      disableClose: true
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

}
