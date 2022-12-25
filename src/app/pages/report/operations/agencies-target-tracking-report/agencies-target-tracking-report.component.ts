import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Branch } from 'src/app/shared/models/branch.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { DatePipe } from '@angular/common';
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
  selector: 'app-agencies-target-tracking-report',
  templateUrl: './agencies-target-tracking-report.component.html',
  styleUrls: ['./agencies-target-tracking-report.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AgenciesTargetTrackingReportComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder, private toaster: ToastrService, private operationsReportsService: OperationsReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role != "bm") {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
      this.ngForm = this.fb.group({
        branch: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }
  }

  ngOnInit() {
    console.log(this.ngForm.getRawValue())
  }

  onSubmitAgenciesTargetReport() {
    this.spinner.show();
    // const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    // const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.operationsReportsService.printAgenciesTargetTracking(this.ngForm.get("branch").value).subscribe((response) => {
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

  get f() { return this.ngForm.controls; }


}
