import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }
  auth:any;
  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate([''], {replaceUrl: true}).then(() => {
      window.location.reload();
    });;
  }
}
