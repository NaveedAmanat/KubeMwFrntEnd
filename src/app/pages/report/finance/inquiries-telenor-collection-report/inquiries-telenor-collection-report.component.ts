import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Region } from 'src/app/shared/models/region.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
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
  selector: 'app-inquiries-telenor-collection-report',
  templateUrl: './inquiries-telenor-collection-report.component.html',
  styleUrls: ['./inquiries-telenor-collection-report.component.css'],
 providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]})

  /*
    Modified By Naveed Date 23-01-2022
    SCR - Munsalik Integration 
    added Dropdown menu for online collection channel like, easypaisa and muslink
  */

export class InquiriesTelenorCollectionReportComponent implements OnInit {

  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  minDate: Date;
  branchs: any;
  allRegions: Region[];
  allAreas: any;
  allBranches: any;
  allChannel: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private transfersService: TransfersService, private spinner: NgxSpinnerService, private reportService: ReportsService, private dataService: DataService) {
   
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-1);
    this.ngForm = this.fb.group({
      channelSeq: ['', Validators.required],
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        isXls: [0, Validators.required]
      });
  }

  ngOnInit() {
    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        channelSeq: ['', Validators.required],
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
        isXls: [0, Validators.required]
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
        this.branchs.unshift({'brnchSeq': -1, 'brnchNm': 'ALL'});
      });
      this.ngForm = this.fb.group({
        channelSeq: ['', Validators.required],
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: ['', Validators.required],
        isXls: [0, Validators.required]
      });
    }

    this.dataService.getChannelList().subscribe(data => {
      this.allChannel = data;
    });

    this.transfersService.getRegions().subscribe(data => {
      this.allRegions = data;
      let index = this.allRegions.indexOf(this.allRegions.find( reg => reg.regSeq == -1));
      this.allRegions.splice(index, 1);
    });
  }
  getArea() {
    this.allAreas = [];
    this.disabledArea = false;
    this.disabledBranch = false;
    this.dataService.getArea(this.ngForm.controls["regSeq"].value).subscribe(d => {
      this.allAreas = d;
      this.disabledArea = true;
    });
  }

  getBranch() {
    this.allBranches = [];
    this.disabledBranch = false;
    this.dataService.getBranch(this.ngForm.controls["areaSeq"].value).subscribe(d => {
      this.allBranches = d;
      this.disabledBranch = true;
    });
  }

  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-y')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-y')
    let isXls: boolean = this.ngForm.get('isXls').value;
    const brnchSeq = this.ngForm.get('branch').value;
    const channelSeq =  this.ngForm.get('channelSeq').value;
    this.financeService.printInquiriesTelenorReport(frmDt, toDt, brnchSeq, channelSeq, isXls).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
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

  // ended by Naveed - Date 23-01-2022
}


