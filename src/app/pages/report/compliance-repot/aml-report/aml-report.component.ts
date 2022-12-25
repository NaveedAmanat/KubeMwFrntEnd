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
  selector: 'app-aml-report',
  templateUrl: './aml-report.component.html',
  styleUrls: ['./aml-report.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class AmlReportComponent implements OnInit {
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private complianceService: ComplianceService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role == "admin" || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        branch: ['', Validators.required],
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        isXls: [0, Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        isXls: [0, Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }
    // this.ngForm = this.fb.group({
    //   branch: ['', Validators.required],
    //   frmDt: ['', Validators.required],
    //   toDt: ['', Validators.required],
    //   isXls:[0, Validators.required],
    // });
  }

  ngOnInit() {
    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });
  }

  onSubmitAmlReport() {
    this.spinner.show();
    console.log(this.ngForm.controls['branch'].value);
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    console.log(isXls);
    this.complianceService.printAmlCompliaanceReport(frmDt, toDt, this.ngForm.controls['branch'].value, isXls).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      let fileURL = ""
      if (isXls == true) {
        console.log("ex");
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      }
      else {
        console.log("pdf");
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      }

      console.log(fileURL);

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
