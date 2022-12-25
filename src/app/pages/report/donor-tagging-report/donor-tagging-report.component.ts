import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { DonorTaggingService } from 'src/app/shared/services/donor-tagging.service';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MY_FORMATS } from '../overdueloans-report/overdueloans-report.component';

@Component({
  selector: 'app-donor-tagging-report',
  templateUrl: './donor-tagging-report.component.html',
  styleUrls: ['./donor-tagging-report.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DonorTaggingReportComponent implements OnInit {
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];

  auth = JSON.parse(sessionStorage.getItem("auth"));
  donor: any;
  funderData: any;
  constructor(private fb: FormBuilder, private commonService: CommonService, private toaster: ToastrService, private donorTaggingService: DonorTaggingService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();

    this.ngForm = this.fb.group({
      frmDt: ['', Validators.required],
      toDt: ['', Validators.required],
      donor: ['', Validators.required],
      isXls: [1, Validators.required]
    });

    // if (this.auth.role == "admin") {
    //   this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
    //   );

    //   this.ngForm = this.fb.group({
    //     branch: ['', Validators.required],
    //     frmDt: ['', Validators.required],
    //     toDt: ['', Validators.required],
    //     donor: ['', Validators.required],
    //   });
    // } else {
    //   this.ngForm = this.fb.group({
    //     frmDt: ['', Validators.required],
    //     toDt: ['', Validators.required],
    //     donor: ['', Validators.required],
    //     branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
    //   });
    // }
  }

  ngOnInit() {
    // this.transfersService.getBranches().subscribe(d => {
    //   this.branchs = d;
    // });

    //funder Data
    this.commonService.getValues(REF_CD_GRP_KEYS.FUNDED_BY).subscribe((res) => {
      this.funderData = res;
      this.funderData.unshift({'codeKey': -1, 'codeValue': 'ALL'});
    }, (error) => {
      console.log('err', error);
    })
  }

  printDonorTaggingReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    this.donorTaggingService.printDonorTaggingReport(toDt, frmDt, this.ngForm.controls['donor'].value, isXls).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      let fileURL = ""
      if (isXls == true) {
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      }
      else {
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      }
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
