import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-due-recovery',
  templateUrl: './due-recovery.component.html',
  styleUrls: ['./due-recovery.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DueRecoveryComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder,
    private toaster: ToastrService, private reportsService: ReportsService, private recoveryService: RecoveryService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role == "admin" || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }
  }

  ngOnInit() {
  }
  printReport() {
    if (new Date(this.ngForm.controls['toDt'].value) < new Date(this.ngForm.controls['frmDt'].value)) {
      this.toaster.error("From Date Can not be greater than To Date");
      return;
    }
    this.spinner.show();
    this.reportsService.printDueRecovery(this.ngForm.value).subscribe((response) => {
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
