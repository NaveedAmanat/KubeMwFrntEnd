import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-leftside-bar',
  templateUrl: './reports-leftside-bar.component.html',
  styleUrls: ['./reports-leftside-bar.component.css']
})
export class ReportsLeftsideBarComponent implements OnInit {

  constructor() {

    $(document).ready(function () {
      $('.acc_trigger').toggleClass('inactive-header');
      $('.acc_trigger').click(function () {
        if ($(this).next().is(':hidden')) {
          $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        } else {
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        }
      });

      return false;
    });
  }
  auth;
  subMods =[];
  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    console.log(this.auth.modules);
    this.auth.modules.forEach(screen => {
      if (screen.modUrl.indexOf("reports") >= 0) {
        this.subMods = screen.subMods;
      }
    });
    console.log(this.subMods)
    
  }
  hasSubMod(url){
    let v = false;
    this.subMods.forEach(sub=>{
      if(sub.subModUrl.indexOf(url) >= 0){
        v = true;
      }
    });
    return v;
  }

  getName(url){
    let v = "";
    this.subMods.forEach(sub=>{
      if(sub.subModUrl.indexOf(url) >= 0){
        v = sub.subModNm;
      }
    });
    return v;
  }

}
