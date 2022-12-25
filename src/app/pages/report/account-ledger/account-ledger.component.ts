import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ProductService } from 'src/app/shared/services/product.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
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
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AccountLedgerComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  maxDate: Date;
  GlAccounts: any[] = [];
  branchs: Branch[];

  constructor(private fb: FormBuilder, private toaster: ToastrService, private reportsService: ReportsService, private productService: ProductService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
      account: ['', Validators.required],
      branch: [''],
    });

    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        account: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        console.log(d)
        this.branchs = d;
      }
      );
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        account: ['', Validators.required],
        branch: [''],
      });
    }


  }

  ngOnInit() {

    this.productService.getGlAccounts().subscribe(res => {
      console.log(res);
      this.GlAccounts = res;
    }, error => {
      console.log(error);
    })
  }
  printReport() {
    this.spinner.show();
    this.reportsService.printAccountLedger(this.ngForm.value).subscribe((response) => {
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
  maxVal = 0;
  getStyleList() {
    this.GlAccounts.forEach(acc => {
      if (acc.accDesc.length > this.maxVal) {
        this.maxVal = acc.accDesc.length;
      }
    })
    // console.log({'display':'block', 'width': this.maxVal*10+'px !important'})
    return { 'display': 'block', 'width': this.maxVal * 0.75 + 'em' };
  }

  onBranchSelectionChange(e) {
    this.spinner.show();
    this.productService.getGlAccountsForAccountLedger(this.ngForm.controls['branch'].value).subscribe(res => {
      this.spinner.hide();
      console.log(res);
      this.GlAccounts = res;
    }, error => {
      console.log(error);
    })
  }

}
