import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { FinanceService } from 'src/app/shared/services/finance.service';
import * as _moment from 'moment';
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

/**
 * Added By Naveed - Date - 10-05-2022
 * SCR - MCB Disbursement
 */

@Component({
  selector: 'app-disburse-reversal-request',
  templateUrl: './disburse-reversal-request.component.html',
  styleUrls: ['./disburse-reversal-request.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  })
export class DisburseReversalRequestComponent implements OnInit {
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  minDate: Date;
  branchs: Branch[];
  isFormDateEnable: boolean = true;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private spinner: NgxSpinnerService) {
   
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-1);
   
   if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        brnchSeq: [this.auth.emp_branch],
        type: ['1', Validators.required],
        isXls: [0]
      });
    }else{
      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        brnchSeq: ['-1'],
        isXls: [0, Validators.required],
        type: ['1', Validators.required],
      });
    }

  }

  ngOnInit() {
  }
  onChangeFilter(event){
    if(event.value == '1'){
      this.form.frmDt.clearValidators(); 
      this.isFormDateEnable = false;
    }else{
      this.form.frmDt.setValidators([Validators.required]);
      this.isFormDateEnable = true;
    }
    this.form.frmDt.updateValueAndValidity();
    this.form.toDt.updateValueAndValidity();
  }

  get form() {
    return this.ngForm.controls;
  }

  printReport() {
    this.spinner.show();
    console.log(this.ngForm.value)
    const frmDt = this.isFormDateEnable ?  new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy') : '01-JAN-1901';
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    let brnchSeq: boolean = this.ngForm.get('brnchSeq').value;
    let type = this.ngForm.get('type').value;
    this.financeService.printMcbDisburseReversal(frmDt, toDt, brnchSeq, type, isXls).subscribe((response) => {
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
