import {Component, DoCheck, OnInit, Input} from '@angular/core';
import {BreadCrumb} from '../../../shared/models/BreadCrumb.model';
import {ActivationEnd, Router} from '@angular/router';
import {BreadcrumbProvider} from '../../../shared/providers/breadcrumb';
import {LoanService} from '../../../shared/services/loan.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit , DoCheck {
  breadcrumbs: BreadCrumb[] = [];
  constructor(private router: Router,
              private breadcrumbProvider: BreadcrumbProvider,
              private loanService: LoanService) {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        if (e.snapshot.data.breadcrumbs) {
          this.breadcrumbs = Object.assign([], e.snapshot.data.breadcrumbs);
        } else {
          if (this.breadcrumbs.length <= 0 && e.snapshot.data.defaultBreadcrumbs) {
            this.breadcrumbs = Object.assign([], e.snapshot.data.defaultBreadcrumbs);
          }
        }
      }
    });

    this.breadcrumbProvider._addItem.subscribe(breadcrumb =>{ 
      let f = -1;
      for(let i =0; i<this.breadcrumbs.length;i++){
        if(this.breadcrumbs[i].label == breadcrumb.label){
          this.breadcrumbs[i]=breadcrumb;
          f=i;
        }
      }
      if(f<0)
        this.breadcrumbs.push(breadcrumb)
  });

  }

  ngOnInit() {
  }

  ngDoCheck() {
  }

  tytPreGetBool(pre) {
    return sessionStorage.getItem(pre) === 'true' ? true : false;
  }
}
