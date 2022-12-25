import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { OperationsReportsService } from 'src/app/shared/services/operations-reports.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
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
  selector: 'app-portfolio-status',
  templateUrl: './portfolio-status.component.html',
  styleUrls: ['./portfolio-status.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})

export class PortfolioStatusComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rptFlag: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  rpt_flg: any;
  branchs: Branch[];
  allRegions: Region[];
  allAreas: any;
  allBranches: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;


  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private operationsReportsService: OperationsReportsService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private transfersService: TransfersService,) {

    this.maxDate = new Date();

  }

  ngOnInit() {
    if (this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') {
  
      this.disabledRegion = true;
      this.disabledArea = false;
      this.disabledBranch = false;
  
      this.ngForm = this.fb.group({
        toDt: [new FormControl(moment()), Validators.required],
        frmDt: [new FormControl(moment()), Validators.required],
        regSeq: ['', Validators.required],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required]
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
        brnchSeq: ['', Validators.required]
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
        brnchSeq: ['', Validators.required]
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
        brnchSeq: [this.auth.emp_branch]
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
        brnchSeq: ['', Validators.required]
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
      // this.allAreas.unshift({'areaSeq': -1, 'areaNm': 'ALL'});
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
      this.ngForm.patchValue({'brnchSeq': -1, 'brnchNm': 'ALL'});
      this.ngForm.controls.brnchSeq.clearValidators();
      this.ngForm.controls.brnchSeq.updateValueAndValidity();
    }
  }

  printReport() {
  
    this.spinner.show();
    const regSeq = this.ngForm.get('regSeq').value;
    const areaSeq = this.ngForm.get('areaSeq').value;
    const brnchSeq = this.ngForm.get('brnchSeq').value;
    let role = this.auth.role;
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.operationsReportsService.printPortfolioStatus(toDt, role, regSeq, areaSeq, brnchSeq).subscribe((response) => {
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
