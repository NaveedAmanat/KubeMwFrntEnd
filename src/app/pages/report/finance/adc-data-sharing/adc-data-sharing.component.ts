import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { FinanceService } from 'src/app/shared/services/finance.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
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
  selector: 'app-adc-data-sharing',
  templateUrl: './adc-data-sharing.component.html',
  styleUrls: ['./adc-data-sharing.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AdcDataSharingComponent implements OnInit {

  ngForm: FormGroup;
  toDt: string;
  maxDate: Date;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private commonService: CommonService , private spinner: NgxSpinnerService) {
  
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
        rpt: ['', Validators.required],
        toDt: [''],
        isXls: [1, Validators.required],
      });
  }

  reportArr = [];

  ngOnInit() {
    this.commonService.getStpConfigValByGrpCd('0020').subscribe((res) => {
      this.reportArr = res;
    })
  }

  rpt : any = [];
  isdate : boolean = false;

  onReportChange(event){
    console.log(event.value);
    this.rpt = event.value;
    if(this.rpt.refCdValShrtDscr == "hbl_konnect_dues_"){
      this.isdate = true;
    }
    else
      this.isdate = false;
  }

  adcDataSharingReport() {
    let isXls: boolean = this.ngForm.get('isXls').value;
    var toDt =  null;
    if(this.rpt.refCdValShrtDscr == "hbl_konnect_dues_"){
      if(this.ngForm.get('toDt').value == null || this.ngForm.get('toDt').value == ''){
        this.toaster.info("Please select a date");
        return;
      }
        toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-y')
    }
    this.spinner.show();
    console.log(isXls);
    this.financeService.printAdcDataSharingReport(this.rpt.refCdValShrtDscr, toDt, true).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      let fileURL = ""
      // if (isXls == true) {
        console.log("ex");
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      // }
      // else {
      //   console.log("pdf");
      //   fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      // }

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
