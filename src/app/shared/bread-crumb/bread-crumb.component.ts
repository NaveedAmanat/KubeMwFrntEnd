import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule, ActivationEnd, Router} from '@angular/router';
import {BreadCrumb} from '../models/BreadCrumb.model';
import {BreadcrumbProvider} from '../providers/breadcrumb';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent {
  breadcrumbs: BreadCrumb[] = [];

  constructor(private router: Router
              , private breadcrumbProvider: BreadcrumbProvider) {
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

    this.breadcrumbProvider._addItem.subscribe(breadcrumb => this.breadcrumbs.push(breadcrumb));
  }

}
