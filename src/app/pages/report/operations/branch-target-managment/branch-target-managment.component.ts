import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
const moment = _moment;
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-branch-target-managment',
  templateUrl: './branch-target-managment.component.html',
  styleUrls: ['./branch-target-managment.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BranchTargetManagmentComponent implements OnInit {
  ngForm: FormGroup;
  toDt: string;
  maxDate: Date;

  constructor(private fb: FormBuilder, private toaster: ToastrService, private operationsReportsService: OperationsReportsService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    // this.ngForm = this.fb.group({
    //   frmDt: [new Date(), Validators.required]
    // });
  }
  ngOnInit() {
  }


  branchTargetManagmentReport() {
    this.spinner.show();
    // const frmDt = new DatePipe('en-US').transform(this.frmDt.value, 'dd-MM-yyyy')
    let dt = new Date(new DatePipe('en-US').transform(this.frmDt.value, 'yyyy-MM-dd'));
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    this.operationsReportsService.printBranchTargetManagment(new DatePipe('en-US').transform(dt, 'dd-MM-yyyy')).subscribe((response) => {
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

  frmDt = new FormControl(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 30)));

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.frmDt.value;
    ctrlValue.year(normalizedYear.year());
    this.frmDt.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.frmDt.value;
    ctrlValue.month(normalizedMonth.month());
    this.frmDt.setValue(ctrlValue);
    datepicker.close();
  }
}
