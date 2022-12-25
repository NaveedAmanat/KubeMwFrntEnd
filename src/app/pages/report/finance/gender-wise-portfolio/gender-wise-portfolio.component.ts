import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
const moment = _moment;
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-gender-wise-portfolio',
  templateUrl: './gender-wise-portfolio.component.html',
  styleUrls: ['./gender-wise-portfolio.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GenderWisePortfolioComponent implements OnInit {

  ngForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];
  disablePrint: boolean = true;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
   
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    this.ngForm = this.fb.group({
      toDt: [new FormControl(moment()), Validators.required]
      });
  }

  ngOnInit() {
  }

  toDt: FormControl = new FormControl(moment().subtract(1, 'months').endOf('month'));
  selectedYear = -1;

  chosenYearHandler(normalizedYear: Moment) {

    if(normalizedYear.year() <= this.maxDate.getFullYear()){
    const ctrlValue = this.toDt.value;
    ctrlValue.year(normalizedYear.year());
    this.toDt.setValue(ctrlValue);
    this.selectedYear =  normalizedYear.year();
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    if((normalizedMonth.year() < this.maxDate.getFullYear()) && this.selectedYear != -1){
            const ctrlValue = this.toDt.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.toDt.setValue(ctrlValue);
            datepicker.close();
    }else if((normalizedMonth.year() == this.maxDate.getFullYear()) && this.selectedYear != -1){
        if(normalizedMonth.month() <= this.maxDate.getMonth()){
            const ctrlValue = this.toDt.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.toDt.setValue(ctrlValue);
            datepicker.close();
        }
    }
    this.disablePrint = false;
  }

  printReport() {
    this.spinner.show();
    const toDt = new DatePipe('en-US').transform(this.toDt.value.endOf('month'), 'dd-MM-yyyy');
    this.financeService.printGenderWisePortfolio(toDt).subscribe((response) => {
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



