import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as _moment from 'moment';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
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
  selector: 'app-dues-reports',
  templateUrl: './dues-reports.component.html',
  styleUrls: ['./dues-reports.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DuesReportsComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  minDate: Date;
  branchs: Branch[];
  selected = "1";
  options = [
    {id: "1", value: "All Clients"},
    {id: "2", value: "Rescheduled Clients"},
    {id: "3", value: "Non Rescheduled Clients"}
  ]


  constructor(private fb: FormBuilder, private transfersService: TransfersService, private toaster: ToastrService, private operationsReportsService: OperationsReportsService, private spinner: NgxSpinnerService) {
    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
        typ: ['1', Validators.required],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new FormControl(moment()), Validators.required],
        toDt: [new FormControl(moment()), Validators.required],
        branch: ['', Validators.required],
        typ: ['1', Validators.required],
      });
    }

  }

  // Areeba Naveed - 18-Nov-2022 - 90 Days Criteria
  FrmDtChanged(event){
    const day = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd');
    const month = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'MM');
    const year = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'yyyy');

    this.minDate = new Date(Number(year), Number(month) - 1, Number(day));
    this.minDate.setMonth(this.minDate.getMonth() + 3);
    this.maxDate = this.minDate;
  }

  ngOnInit() {
  }

  dueReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    const type = this.ngForm.get('typ').value
    this.operationsReportsService.printDuesReport(frmDt, toDt, this.ngForm.controls['branch'].value, type).subscribe((response) => {
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
