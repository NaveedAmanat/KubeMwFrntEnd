import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { FinanceService } from 'src/app/shared/services/finance.service';


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
  selector: 'app-mcb-disburse-funds-status',
  templateUrl: './mcb-disburse-funds-status.component.html',
  styleUrls: ['./mcb-disburse-funds-status.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  })
export class McbDisburseFundsStatusComponent implements OnInit {
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  minDate: Date;
  branchs: Branch[];

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private spinner: NgxSpinnerService) {
   
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-1);
   
   if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        type: ['1', Validators.required],
        brnchSeq: [this.auth.emp_branch],
        isXls: [0]
      });
    }else{
      this.ngForm = this.fb.group({
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        type: ['1', Validators.required],
        brnchSeq: ['-1'],
        isXls: [0, Validators.required]
      });
    }

  }

  ngOnInit() {
  }

  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    let brnchSeq: boolean = this.ngForm.get('brnchSeq').value;
    let type = this.ngForm.get('type').value;

    this.financeService.printMcbDisburseFunds(frmDt, toDt, brnchSeq, type, isXls).subscribe((response) => {
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
