import { Component, OnInit } from '@angular/core';
import { Plugin } from '../../model/plugin';
import { Router } from '@angular/router';
import { TaskRunnerService } from '../../providers/task-runner.service';
import { Plugins } from 'app/model/plugins';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  tasks: Plugin[];

  constructor(private router: Router,
              private taskRunnerService: TaskRunnerService) {
  }

  ngOnInit(): void {
    this.tasks = this.taskRunnerService.plugins.plugins;
    this.taskRunnerService.pluginsChange.subscribe((plugins: Plugins) => {
      this.tasks = plugins.plugins;
      console.log('plugins update');
    });
  }

  selectTask(plugin: Plugin): void {
    this.taskRunnerService.select(plugin);
    this.router.navigate(['/graphs']);
  }

}
