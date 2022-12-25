import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerYear : any;
  title = 'app';

  ngOnInit() {
    let a = new Date();
    this.footerYear = a.getUTCFullYear();
  }

}
