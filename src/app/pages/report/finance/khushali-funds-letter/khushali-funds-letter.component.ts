import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
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
  selector: 'app-khushali-funds-letter',
  templateUrl: './khushali-funds-letter.component.html',
  styleUrls: ['./khushali-funds-letter.component.css']
})
export class KhushaliFundsLetterComponent implements OnInit {
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];
  pymentModes: any[];

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private dataService: DataService, private spinner: NgxSpinnerService) {
   
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        isXls: [0, Validators.required],
      });
  }

  ngOnInit() {
  }

  printReport() {

    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy');
    let isXls: boolean = this.ngForm.get('isXls').value;
    this.financeService.printKhushaliFundsLetter(frmDt, toDt,  isXls).subscribe((response) => {
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