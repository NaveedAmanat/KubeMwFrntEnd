import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material';
import { Auth } from 'src/app/shared/models/Auth.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-fund-stmnt',
  templateUrl: './fund-stmnt.component.html',
  styleUrls: ['./fund-stmnt.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FundStmntComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder,
    private toaster: ToastrService, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();

    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: ['', Validators.required],
      });
    }
  }

  ngOnInit() {
  }
  portfolioReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    let branch = this.ngForm.get('branch').value;
    this.reportsService.printFundStmntReport(frmDt, toDt, branch).subscribe((response) => {
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

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment, name: string) {
    const ctrlValue = this.date.value;
    console.log(ctrlValue)
    console.log(normalizedYear)
    ctrlValue.year(normalizedYear.year());
    let d = this.ngForm.controls[name].value;
    d.value.year(normalizedYear.year())
    this.ngForm.controls[name].setValue(d);
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, name: string) {
    //const ctrlValue = this.date.value;
    // let d = this.ngForm.controls[name].value;
    // this.ngForm.controls[name].setValue(this.date.value);
    //let d = this.ngForm.controls[name].value;
    //d.value.month(normlizedMonth.month());
    //d.value.year(normlizedMonth.year());
    this.ngForm.controls[name].setValue(normlizedMonth);
    //ctrlValue.month(normlizedMonth.month());
    //this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
