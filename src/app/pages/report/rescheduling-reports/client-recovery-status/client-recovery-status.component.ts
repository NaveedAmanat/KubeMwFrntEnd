import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ReschedulingReportsService } from 'src/app/shared/services/rescheduling-reports.service';
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
  selector: 'app-client-recovery-status',
  templateUrl: './client-recovery-status.component.html',
  styleUrls: ['./client-recovery-status.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class ClientRecoveryStatusComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];
  constructor(private reschedulingReportService: ReschedulingReportsService, private toaster: ToastrService, private transfersService: TransfersService, private fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();

    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frstInstDt: [new Date(), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
      this.ngForm = this.fb.group({
        frstInstDt: [new Date(), Validators.required],
        branch: [''],
      });
    }

  }

  ngOnInit() {
  }


  onSubmitClientRecoveryReport() {
    this.spinner.show();
    const d = new DatePipe('en-US').transform(this.ngForm.get('frstInstDt').value, 'dd-MMM-yyyy')
    console.log(d)
    let a = this.ngForm.controls['branch'].value;
    this.reschedulingReportService.getClientRecoveryStatus(d, a).subscribe((response) => {
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
