import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Branch } from 'src/app/shared/models/branch.model';
import { ProductGroup } from 'src/app/shared/models/productGroup.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-turn-around-time',
  templateUrl: './turn-around-time.component.html',
  styleUrls: ['./turn-around-time.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TurnAroundTimeComponent implements OnInit {


  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rpt_flg: any;
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  allItems: ProductGroup[] = [];
  allRegions: Region[];
  allAreas: Object;
  allBranches: Object;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;
  constructor(private fb: FormBuilder,
    private reportsService: ReportsService,
    private transfersService: TransfersService,
    private productService: ProductService, private toaster: ToastrService, private dataService: DataService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        brnchSeq: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        brnchSeq: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }

    this.productService.getAllProductGroups().subscribe((data) => {
      this.allItems = data;
    });
  }

  ngOnInit() {
    if (this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == "ops") {

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
    if ((this.auth.role == "admin"|| this.auth.role == "ia" || this.auth.role == "ops") && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value !== 0 && this.ngForm.controls['brnchSeq'].value !== 0) {
      this.rpt_flg = 1;
    } else if ((this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == "ops") && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value !== 0 &&
      this.ngForm.controls['brnchSeq'].value == 0) {
      this.rpt_flg = 2;
    } else if ((this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == "ops") && this.ngForm.controls['regSeq'].value !== 0 && this.ngForm.controls['areaSeq'].value == 0 && this.ngForm.controls['brnchSeq'].value == 0) {
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



  printReport() {
    this.spinner.show();
    if (this.auth.role == "bm" || this.auth.role == "bdo" || this.auth.role == "rm" || this.auth.role == "am") {
      this.returnFlag();
    } else {
      this.returnFlagForAdmin();
    }
    this.spinner.show();
    let regSeq = this.ngForm.get('regSeq').value ? this.ngForm.get('regSeq').value : 0;
    let areaSeq = this.ngForm.get('areaSeq').value ? this.ngForm.get('areaSeq').value : 0;
    let brnchSeq = this.ngForm.get('brnchSeq').value ? this.ngForm.get('brnchSeq').value : 0;
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.reportsService.printTurnAroundTime(frmDt, toDt, this.rpt_flg, areaSeq, regSeq, brnchSeq).subscribe((response) => {
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

  get f() { return this.ngForm.controls; }

}
