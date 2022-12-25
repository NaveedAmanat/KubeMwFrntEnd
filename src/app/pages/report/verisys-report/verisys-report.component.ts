import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Region } from 'src/app/shared/models/region.model';
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
  selector: 'app-verisys-report',
  templateUrl: './verisys-report.component.html',
  styleUrls: ['./verisys-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VerisysReportComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rpt_flg: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
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
    private dataService: DataService,
    private transfersService: TransfersService,
    private reportService: ReportsService ) {
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
    });
  }


  // constructor(private spinner: NgxSpinnerService, private toaster: ToastrService, private fb: FormBuilder, private reportsService: ReportsService, private recoveryService: RecoveryService, private transfersService: TransfersService) {
  //   this.maxDate = new Date();

  //   if (this.auth.role == "bm" || this.auth.role == "bdo") {
  //     this.ngForm = this.fb.group({
  //       frmDt: [new Date(), Validators.required],
  //       toDt: [new Date(), Validators.required],
  //       type: ['', Validators.required],
  //       isXls: [0, Validators.required],
  //       branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
  //     });
  //   } else {
  //     this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
  //     );

  //     this.ngForm = this.fb.group({
  //       frmDt: [new Date(), Validators.required],
  //       toDt: [new Date(), Validators.required],
  //       type: ['', Validators.required],
  //       isXls: [0, Validators.required],
  //       branch: [''],
  //     });

  //   }
  // }
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
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required],
        type: ['', Validators.required],
        isXls: [0, Validators.required]
      });
    } else if (this.auth.role == "rm") {
  
      this.disabledRegion = false;
      this.disabledArea = true;
      this.disabledBranch = true;
  
      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [this.auth.emp_reg],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required],
        type: ['', Validators.required],
        isXls: [0, Validators.required]
      });
      this.getArea();
    } else if (this.auth.role == "am") {
  
      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = true;
  
      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [-1],
        areaSeq: [this.auth.emp_area],
        brnchSeq: ['', Validators.required],
        type: ['', Validators.required],
        isXls: [0, Validators.required]
      });
      this.getBranch();
  
    } else if (this.auth.role == "bm" || this.auth.role == "bdo") {
  
      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = false;
  
      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: [-1],
        areaSeq: [-1],
        brnchSeq: [this.auth.emp_branch],
        type: ['', Validators.required],
        isXls: [0, Validators.required]
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
  
      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: ['', Validators.required],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required],
        type: ['', Validators.required],
        isXls: [0, Validators.required]
      });
    }
  
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
      this.allAreas.unshift({'areaSeq': -1, 'areaNm': 'ALL'});
    });
  }
  
  getBranch() {
    this.allBranches = [];
    this.disabledBranch = false;
    if(this.ngForm.controls["areaSeq"].value != -1 && this.ngForm.controls["areaSeq"].value != null){
      this.dataService.getBranch(this.ngForm.controls["areaSeq"].value).subscribe(d => {
        this.allBranches = d;
        this.disabledBranch = true;
        this.allBranches.unshift({'brnchSeq': -1, 'brnchNm': 'ALL'});
        this.ngForm.controls.brnchSeq.setValidators([Validators.required]);
        this.ngForm.controls.brnchSeq.updateValueAndValidity();
      });
    }else{
      console.log('this.ngForm.controls["areaSeq"].value', this.ngForm.controls["areaSeq"].value)
      this.ngForm.patchValue({'brnchSeq': -1, 'brnchNm': 'ALL'});
      this.ngForm.controls.brnchSeq.clearValidators();
      this.ngForm.controls.brnchSeq.updateValueAndValidity();
    }
  }

  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    let isXls: boolean = this.ngForm.get('isXls').value;
    let type = this.ngForm.get('type').value;
    const regSeq = this.ngForm.get('regSeq').value;
    const areaSeq = this.ngForm.get('areaSeq').value;
    const brnchSeq = this.ngForm.get('brnchSeq').value;

    this.reportService.verisysReport(frmDt, toDt, brnchSeq, areaSeq, regSeq, type, isXls).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      let fileURL = ""
      if (isXls == true) {
        console.log("ex");
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      }
      else {
        console.log("pdf");
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