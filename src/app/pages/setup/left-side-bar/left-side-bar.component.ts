import { Component, Input, OnInit } from '@angular/core';
import { COMMON_CODES } from '../../../shared/mocks/mock_common_codes';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css']
})
export class LeftSideBarComponent implements OnInit {
  @Input() commonCodes: String[];
  constructor() { }

  auth;
  subMods = [];
  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    console.log(this.auth.modules);
    this.auth.modules.forEach(screen => {
      if (screen.modUrl.toLowerCase() == ("setup")) {
        this.subMods = screen.subMods;
      }
    });
    console.log(this.subMods)

  }
  hasSubMod(url) {
    let v = false;
    this.subMods.forEach(sub => {
      if (sub.subModUrl == url) {
        v = true;
      }
    });
    return v;
  }

  getName(url) {
    let v = "";
    this.subMods.forEach(sub => {
      if (sub.subModUrl == url) {
        v = sub.subModNm;
      }
    });
    return v;
  }

}
