import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _moment from 'moment';
const moment = _moment;
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { saveAs } from 'file-saver';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

@Component({
  selector: 'app-acc-recoverydetail',
  templateUrl: './acc-recoverydetail.component.html',
  styleUrls: ['./acc-recoverydetail.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AccRecoverydetailComponent implements OnInit {

  ngForm: FormGroup;
  toDt: string;
  maxDate: Date;

  auth = JSON.parse(sessionStorage.getItem("auth"));

  constructor(private fb: FormBuilder, private toaster: ToastrService, private reportsService: ReportsService, private spinner: NgxSpinnerService) {
    // this.maxDate = new Date();
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    
    this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required]
      });
   }

  ngOnInit() {
  } 

  recoveryDetail() {
    this.spinner.show();
    const toDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    let fileName = 'recovery_data_detail_' + new DatePipe('en-US').transform(this.date.value.endOf('month'), 'MMM-yyyy').toUpperCase();
    this.reportsService.printAccountMonthlyReport(toDt, fileName , 6).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      if(binaryData[0].byteLength > 0){
        let fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "text/csv" }));
        saveAs(fileURL, fileName)
      }else{
        this.toaster.warning("Issue in data extraction", "Warning");
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }


  date: FormControl = new FormControl(moment().subtract(1, 'months').endOf('month'));
  // date: FormControl = new FormControl(moment());
  selectedYear = -1;
  chosenYearHandler(normalizedYear: Moment) {

    if(normalizedYear.year() <= this.maxDate.getFullYear()){
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.selectedYear =  normalizedYear.year();
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    if((normalizedMonth.year() < this.maxDate.getFullYear()) && this.selectedYear != -1){
            const ctrlValue = this.date.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.date.setValue(ctrlValue);
            datepicker.close();
    }else if((normalizedMonth.year() == this.maxDate.getFullYear()) && this.selectedYear != -1){
        if(normalizedMonth.month() <= this.maxDate.getMonth()){
            const ctrlValue = this.date.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.date.setValue(ctrlValue);
            datepicker.close();
        }
    }
  }
}
