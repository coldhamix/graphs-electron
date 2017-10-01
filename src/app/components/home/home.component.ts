import { Component, OnInit } from '@angular/core';
import { Plugin } from '../../model/plugin';
import { Router } from '@angular/router';
import { TaskRunnerService } from '../../providers/task-runner.service';

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
  }

  selectTask(plugin: Plugin): void {
    this.taskRunnerService.select(plugin);
    this.router.navigate(['/graphs']);
  }

}
