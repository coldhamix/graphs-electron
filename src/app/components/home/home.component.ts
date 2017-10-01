import { Component } from '@angular/core';
import { Task, createTask } from '../../model/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  tasks: Task[] = [
    createTask('Поиск кратчайшего пути', 'Алгоритмы Дейсктры, Беллмана-Форда'),
    createTask('Подсчет количества ребер и вершин', 'Демонстрационное задание'),
  ];

  constructor (private router: Router) {}

  selectTask(task: Task): void {
    this.router.navigate(['/graphs']);
  }

}
