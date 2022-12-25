import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BookDetailsComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  constructor(private spinner: NgxSpinnerService, private toaster: ToastrService, private fb: FormBuilder, private reportsService: ReportsService, private recoveryService: RecoveryService, private transfersService: TransfersService) {
    this.maxDate = new Date();


    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        type: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        type: ['', Validators.required],
        branch: [''],
      });

    }
  }
  ngOnInit() {
  }
  printReport() {
    this.spinner.show();
    this.reportsService.printBookDetails(this.ngForm.value).subscribe((response) => {
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
  getPaymentType() {
    this.recoveryService.getRecoveryTypes().subscribe((data => {
      this.tempInstituteArray = data;
    }));
  }
  get f() { return this.ngForm.controls; }

}
