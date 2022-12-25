import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as _moment from 'moment';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-reversed-entries',
  templateUrl: './reversed-entries.component.html',
  styleUrls: ['./reversed-entries.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ReversedEntriesComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  constructor(private fb: FormBuilder, private toaster: ToastrService, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();


    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: ['', Validators.required],
      });
    }
  }
  branchs;
  ngOnInit() {
    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });
  }

  onSubmitReversedEnteries() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.reportsService.printReversedEnteriesReprt(frmDt, toDt, this.ngForm.get('branch').value).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }
}
