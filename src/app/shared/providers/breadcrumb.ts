import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { BreadCrumb } from '../models/BreadCrumb.model';

@Injectable()
export class BreadcrumbProvider {

  _addItem = new Subject<BreadCrumb>();

  constructor(private router: Router) { }

  addItem(label: string, href: string = this.router.url): void {
    this._addItem.next(new BreadCrumb(label, href));
  }
  addCheckedItem(label: string, href: string = this.router.url, isSaved: boolean): void {
    this._addItem.next({ label: label, href: href, isSaved: isSaved, isDisable: false });
  }

  addCheckedItemDis(label: string, href: string = this.router.url, isSaved: boolean, idDisable: boolean): void {
    this._addItem.next({ label: label, href: href, isSaved: isSaved, isDisable: idDisable });
  }

  addDisabledItem(label: string, href: string = this.router.url, isSaved: boolean): void {
    this._addItem.next({ label: label, href: href, isSaved: isSaved, isDisable: true });
  }
  updateSavedStatusViaLabel(label: string, href: string, isSaved: boolean): void {
    console.log(this._addItem);
    this._addItem.forEach(element => {
      if (element.label == label) {
        element.isSaved = isSaved;
      }
    });
  }
  updateSavedStatusViaLabel2(b: BreadCrumb): void {
    console.log(this._addItem);
    this._addItem.forEach(element => {
      if (element.label === b.label) {
        element.isSaved = b.isSaved;
        element.isDisable = b.isDisable;
      }
    });
  }
}
