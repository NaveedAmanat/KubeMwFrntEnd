import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css']
})
export class LeftSideBarComponent implements OnInit {
  subMods = [];
  auth;

  constructor() { }

  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    console.log(this.auth.modules);
    this.auth.modules.forEach(screen => {
      if (screen.modUrl.indexOf("/compliance/compliance-setup") >= 0) {
        this.subMods = screen.subMods;
      }
    });
    console.log(this.subMods)
  }


  hasSubMod(url) {
    let v = false;
    this.subMods.forEach(sub => {
      if (sub.subModUrl.indexOf(url) >= 0) {
        v = true;
      }
    });
    return v;
  }

  getName(url) {
    let v = "";
    this.subMods.forEach(sub => {
      if (sub.subModUrl.indexOf(url) >= 0) {
        v = sub.subModNm;
      }
    });
    return v;
  }

}
