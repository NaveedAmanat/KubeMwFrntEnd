import { Component, OnInit } from '@angular/core';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../account-ledger/account-ledger.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';

@Component({
  selector: 'app-monthly-status',
  templateUrl: './monthly-status.component.html',
  styleUrls: ['./monthly-status.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MonthlyStatusComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rptFlag: any;
  ngForm: FormGroup;
  maxDate: Date;

  constructor(private fb: FormBuilder, private toaster: ToastrService, private operationsReportsService: OperationsReportsService, private spinner: NgxSpinnerService) {
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
    this.rptFlag = 0;
    if (this.auth.role == "bm") {
      this.rptFlag = 1;
    } else if (this.auth.role == "am") {
      this.rptFlag = 2;
    } else if (this.auth.role == "rm") {
      this.rptFlag = 3;
    }
    return this.rptFlag;
  }

  rateOfRenewalReport() {
    console.log(this.auth)
    console.log(this.rptFlag);
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.operationsReportsService.printMonthlyStatus(frmDt, toDt, this.rptFlag).subscribe((response) => {
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
