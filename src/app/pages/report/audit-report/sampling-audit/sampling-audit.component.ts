import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
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
  selector: 'app-sampling-audit',
  templateUrl: './sampling-audit.component.html',
  styleUrls: ['./sampling-audit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SamplingAuditComponent implements OnInit {

  ngForm: FormGroup;
  asofDt: string;
  branchs: Branch[];
  maxDate: Date;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    if (this.auth.role == "admin" || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      //this.maxDate = new Date();
      this.maxDate = new Date(new Date().setDate(new Date().getDate() - 1));
      
      this.ngForm = this.fb.group({
        branch: ['', Validators.required],
        asofDt: ['', Validators.required],
        isXls: [1, Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        asofDt: ['', Validators.required],
        isXls: [1, Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }
  }

  ngOnInit() {
    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });
  }

  auditSamplingReport() {
    this.spinner.show();
    console.log(this.ngForm.controls['branch'].value);
    const asofDt = new DatePipe('en-US').transform(this.ngForm.get('asofDt').value, 'dd-MM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    console.log(isXls);
    this.reportsService.printAuditSampling(asofDt, this.ngForm.controls['branch'].value, isXls).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      // if (isXls == true) {
      //   console.log("ex");
      //   fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      // }
      // else {
      //   console.log("pdf");
      //   fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      // }

      console.log(fileURL);

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
