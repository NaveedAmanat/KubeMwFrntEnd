import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { Region } from 'src/app/shared/models/region.model';
import { DataService } from 'src/app/shared/services/data.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-export-bank-book-csv',
  templateUrl: './export-bank-book-csv.component.html',
  styleUrls: ['./export-bank-book-csv.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ExportBankBookCsvComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rpt_flg: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  toMaxDate: Date;
  minDate: Date;
  branchs: Branch[];
  allRegions: Region[];
  allAreas: any;
  allBranches: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;
  
  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private transfersService: TransfersService,
    private reportService: ReportsService ) {
    this.maxDate = new Date();
    this.minDate = new Date();
    this.toMaxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
      type: ['', Validators.required],
    });
  }
  ngOnInit() {
    const now = new Date();
    now.setDate(now.getDate() - 90);
    this.minDate = now;
  }

  printReport() {
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    let type = this.ngForm.get('type').value;

  let  frm = new Date(this.ngForm.get('frmDt').value);
  let  to = new Date(this.ngForm.get('toDt').value);

  var time_difference = to.getTime() - frm.getTime()
  var days = Math.trunc(time_difference / (1000 * 60 * 60 * 24))
  console.log(' Date Diff', days)

    if(days > 90 ){
      this.toaster.warning("You may get data for 90 days only !", "Warning");
      return;
    }

    this.spinner.show();
    this.reportService.printExportBankBookCsv(frmDt, toDt, type).subscribe((response) => {
    this.spinner.hide();
    
    let fileName = '';
      if(type == '1'){
        fileName = 'BankBook'
      }else if(type == '2'){
        fileName ='CashBook'
      }else if(type == '3'){
        fileName ='HoCurrentAccount'
      }

      this.downloadFile(response, fileName);
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  async downloadFile(data: any, fileName) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);
    window.URL.revokeObjectURL(url);

    saveAs(blob, fileName + '_' + new DatePipe('en-US').transform(new Date(), 'MMM_ddhhmm') + ".csv");

    swal({
      title: 'File: ' + fileName + '_' + new DatePipe('en-US').transform(new Date(), 'MMM_ddhhmm'),
      text: 'Check your download folder',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    })
    .then((result) => {
      if (result.value) {
      }
    });
  }
} 