import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: '<app-header></app-header><router-outlet></router-outlet><app-footer></app-footer>',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
