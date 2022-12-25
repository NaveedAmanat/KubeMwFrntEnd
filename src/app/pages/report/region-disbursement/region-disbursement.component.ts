import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Region } from 'src/app/shared/models/region.model';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-region-disbursement',
  templateUrl: './region-disbursement.component.html',
  styleUrls: ['./region-disbursement.component.css']
})
export class RegionDisbursementComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rpt_flg: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  allRegions: Region[];
  allAreas: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  reportLabel = 'Regional'

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private reportsService: ReportsService,
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
    if (this.auth.role == "admin" || this.auth.role == 'ops') {
      this.disabledRegion = true;
      this.disabledArea = false;

      this.ngForm = this.fb.group({
        toDt: ['' , Validators.required],
        frmDt: ['', Validators.required],
        regSeq: ['', Validators.required],
        areaSeq: ['', Validators.required]
      });
    } else if (this.auth.role == "rm") {
      this.disabledRegion = false;

      this.ngForm = this.fb.group({
        toDt: ['' , Validators.required],
        frmDt: ['', Validators.required],
        regSeq: [this.auth.emp_reg],
        areaSeq: ['', Validators.required],
      });
      this.getArea();
    }else if(this.auth.role == "am"){
      this.ngForm = this.fb.group({
        toDt: ['' , Validators.required],
        frmDt: ['', Validators.required],
        regSeq: [-1],
        areaSeq: [this.auth.emp_area],
      });
      this.reportLabel = 'Area'
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
    this.dataService.getArea(this.ngForm.controls["regSeq"].value).subscribe(d => {
      this.allAreas = d;
      this.disabledArea = true;
      this.allAreas.unshift({'areaSeq': -1, 'areaNm': 'ALL'});
    });
  }

  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.reportsService.printRegionalDisbursement(frmDt, toDt, this.ngForm.get("regSeq").value, this.ngForm.get("areaSeq").value).subscribe((response) => {
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
