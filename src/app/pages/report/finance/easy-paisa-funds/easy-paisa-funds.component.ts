import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
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
  selector: 'app-easy-paisa-funds',
  templateUrl: './easy-paisa-funds.component.html',
  styleUrls: ['./easy-paisa-funds.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EasyPaisaFundsComponent implements OnInit {
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
        mode: ['', Validators.required],
        isXls: [0, Validators.required],
      });

      this.dataService.getTypsMobileWalletModes().subscribe(data => {
        this.pymentModes = data;
        this.pymentModes.unshift({'typId': -1, 'typStr': 'ALL'});
      });
  }

  ngOnInit() {
  }

  printReport() {
    setTimeout(()=> this.spinner.show(), 2)
    const mode =  this.ngForm.get('mode').value
    if(mode == "-1"){
     this.pymentModes.forEach(p =>{
       if(p['typId'] != '-1'){
         this.getReport(p['typId']);
       }
     })
    }else{
      this.getReport(mode);
    }
    this.spinner.hide();
  }

  getReport(paymentMode){

    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-y')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-y')
    let isXls: boolean = this.ngForm.get('isXls').value;
    console.log(isXls);
    this.financeService.printMobileWalletFunds(frmDt, toDt, paymentMode, isXls).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      this.spinner.hide();
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
