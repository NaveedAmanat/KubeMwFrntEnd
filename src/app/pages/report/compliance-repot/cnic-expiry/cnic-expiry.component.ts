import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/pages/admin/loan-servicing/loan-servicing.component';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Branch } from 'src/app/shared/models/branch.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/shared/services/data.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
const moment = _moment;

@Component({
  selector: 'app-cnic-expiry',
  templateUrl: './cnic-expiry.component.html',
  styleUrls: ['./cnic-expiry.component.css']
})
export class CnicExpiryComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rptFlag: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];
  allBranches: Object;


  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private transfersService: TransfersService,
    private complianceService: ComplianceService,) {

    this.maxDate = new Date();

  }

  ngOnInit() {
    console.log(this.auth)

    this.ngForm = this.fb.group({
      // toDt: [new FormControl(moment()), Validators.required],
      // frmDt: [new FormControl(moment()), Validators.required],
      // brnchSeq: [this.auth.emp_branch],
      // isXls: [false],
    });
    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });
  }
  getBranch() {
    this.allBranches = [];
    this.dataService.getBranch(this.ngForm.controls["areaSeq"].value).subscribe(d => {
      this.allBranches = d;
    });
  }

  onSubmitCnicExpiry() {
    this.spinner.show();
    // const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    // const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    // let brnchSeq = this.ngForm.get('brnchSeq').value ? this.ngForm.get('brnchSeq').value : 0;
    // let isXls = this.ngForm.get('isXls').value;
    // console.log(isXls)
    this.complianceService.printCnicExpiryReport().subscribe((response) => {
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
