import { Component, OnInit } from '@angular/core';
import {TASKS} from '../../../shared/mocks/tasks.mocks';
import {STATUSCOLORS} from '../../../shared/mocks/statusColors.mocks';
import {Task} from '../../../shared/models/task.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = TASKS;
  statusColors = STATUSCOLORS;
  public now: Date = new Date();
  constructor() {
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  ngOnInit() {
  }

}
