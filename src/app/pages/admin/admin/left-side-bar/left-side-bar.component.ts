import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-left-side-bar-admin',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css']
})
export class LeftSideBarComponent implements OnInit {
  @Input() commonCodes: String[];
  constructor() { }
  auth = JSON.parse(sessionStorage.getItem("auth"))
  subMods = [];
  ngOnInit() {
    console.log(this.auth.modules);
    this.auth.modules.forEach(screen => {
      if (screen.modUrl.indexOf("admin") >= 0) {
        this.subMods = screen.subMods;
      }
    });
    console.log(this.subMods)
  }
  checkIfBM(){
    if(this.auth.role=='bm'){
      return true;
    }
    return false;
  }
  hasSubMod(url){
    let v = false;
    this.subMods.forEach(sub=>{
      if(sub.subModUrl == url){
        v = true;
      }
    });
    return v;
  }

  getName(url){
    let v = "";
    this.subMods.forEach(sub=>{
      if(sub.subModUrl == url){
        v = sub.subModNm;
      }
    });
    return v;
  }
}
