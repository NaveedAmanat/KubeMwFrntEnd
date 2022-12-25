import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
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
  selector: 'app-bm-mobile-wallet-disbursment-due',
  templateUrl: './bm-mobile-wallet-disbursment-due.component.html',
  styleUrls: ['./bm-mobile-wallet-disbursment-due.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class BmMobileWalletDisbursmentDueComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  minDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder, private reportsService: ReportsService, private toaster: ToastrService, private recoveryService: RecoveryService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    this.minDate = new Date();

    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: [''],
      });
    }
  }
  ngOnInit() {
  }
  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.reportsService.printBmMobileWalletDisbursmentDue(frmDt, toDt, this.ngForm.controls['branch'].value).subscribe((response) => {
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
