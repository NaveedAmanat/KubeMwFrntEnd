import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Auth } from 'src/app/shared/models/Auth.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
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
  selector: 'app-pending-loan-utilization',
  templateUrl: './pending-loan-utilization.component.html',
  styleUrls: ['./pending-loan-utilization.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class PendingLoanUtilizationComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rptFlag: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  constructor(private fb: FormBuilder,
    private toaster: ToastrService, private operationService: OperationsReportsService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.returnFlag();
  }

  returnFlag() {
    if (this.auth.role == "bm") {
      this.rptFlag = 1;
    } else if (this.auth.role == "am") {
      this.rptFlag = 2;
    } else if (this.auth.role == "rm") {
      this.rptFlag = 3;
    }
    return this.rptFlag;
  }


  printPendingLoanUtilization() {
    console.log(this.auth)
    console.log(this.rptFlag);
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    this.operationService.printPendingLoanUtilizationReport(frmDt, toDt, this.rptFlag).subscribe((response) => {
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
