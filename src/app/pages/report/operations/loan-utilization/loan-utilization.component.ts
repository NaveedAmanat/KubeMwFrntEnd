import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../due-recovery/due-recovery.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { DataService } from 'src/app/shared/services/data.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import * as _moment from 'moment';
import { Branch } from 'src/app/shared/models/branch.model';
import { Region } from 'src/app/shared/models/region.model';
const moment = _moment;

@Component({
  selector: 'app-loan-utilization',
  templateUrl: './loan-utilization.component.html',
  styleUrls: ['./loan-utilization.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LoanUtilizationComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rpt_flg: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];
  allRegions: Region[];
  allAreas: Object;
  allBranches: Object;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private operationsReportsService: OperationsReportsService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private transfersService: TransfersService, ) {
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    console.log(this.auth)

    if (this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') {

      this.disabledRegion = true;
      this.disabledArea = false;
      this.disabledBranch = false;

      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: ['', Validators.required],
        areaSeq: [''],
        brnchSeq: [''],
      });
    } else if (this.auth.role == "rm") {

      this.disabledRegion = false;
      this.disabledArea = true;
      this.disabledBranch = true;

      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [this.auth.emp_reg],
        areaSeq: [''],
        brnchSeq: [''],
      });
      this.getArea();
    } else if (this.auth.role == "am") {

      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = true;

      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [0],
        areaSeq: [this.auth.emp_area],
        brnchSeq: [''],
      });
      this.getBranch();

    } else if (this.auth.role == "bm" || this.auth.role == "bdo") {

      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = false;

      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [0],
        areaSeq: [0],
        brnchSeq: [this.auth.emp_branch],
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });

      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: ['', Validators.required],
        areaSeq: [''],
        brnchSeq: [''],
      });
    }

    this.transfersService.getRegions().subscribe(data => {
      this.allRegions = data;
    });
  }

  returnFlag() {
    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.rpt_flg = 1;
    } else if (this.auth.role == "am") {
      this.rpt_flg = 2;
    } else if (this.auth.role == "rm") {
      this.rpt_flg = 3;
    }
    return this.rpt_flg;
  }

  returnFlagForAdmin() {
    if ((this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value !== 0 && this.ngForm.controls['brnchSeq'].value !== 0) {
      this.rpt_flg = 1;
    } else if ((this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value !== 0 &&
      this.ngForm.controls['brnchSeq'].value == 0) {
      this.rpt_flg = 2;
    } else if ((this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value == 0 && this.ngForm.controls['brnchSeq'].value == 0) {
      this.rpt_flg = 3;
    }
    return this.rpt_flg;
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
  rateOfRenewalReport() {
    if (this.auth.role == "bm" || this.auth.role == "bdo" || this.auth.role == "rm" || this.auth.role == "am") {
      this.returnFlag();
    } else {
      this.returnFlagForAdmin();
    }
    console.log(this.auth)
    console.log(this.rpt_flg);
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    let regSeq = this.ngForm.get('regSeq').value ? this.ngForm.get('regSeq').value : 0;
    let areaSeq = this.ngForm.get('areaSeq').value ? this.ngForm.get('areaSeq').value : 0;
    let brnchSeq = this.ngForm.get('brnchSeq').value ? this.ngForm.get('brnchSeq').value : 0;
    this.operationsReportsService.printLoaprintLoanUtlizationnU(toDt, frmDt, this.rpt_flg, areaSeq, regSeq, brnchSeq).subscribe((response) => {
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