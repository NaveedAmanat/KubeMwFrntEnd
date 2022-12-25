import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { saveAs } from "file-saver";
 const moment = _moment;
// import { Moment } from 'moment';
import * as _moment from 'moment';
//import moment = require('moment');

@Component({
  selector: 'app-analysis-audit',
  templateUrl: './analysis-audit.component.html',
  styleUrls: ['./analysis-audit.component.css']
})
export class AnalysisAuditComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  minDate: Date;

  constructor(private fb: FormBuilder,
    private reportsService: ReportsService,
    private toaster: ToastrService, 
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef) { 
      this.minDate = new Date();
      this.maxDate = new Date();


    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        flg: ['', Validators.required],
        toDt: [new Date(), Validators.required]
      });
    } else {

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        flg: ['', Validators.required],
        toDt: [new Date(), Validators.required],
      });
    }
  }

  OnDateChange(val){
    this.minDate.setDate(val.getDate());
    this.minDate.setMonth(val.getMonth());
    this.minDate.setFullYear(val.getFullYear());
    this.maxDate.setMonth(val.getMonth());
    this.maxDate.setFullYear(val.getFullYear());
    this.maxDate.setDate(this.minDate.getDate() + 30);
    this.ngForm.get('toDt').setValue(this.minDate);
    console.log(this.ngForm.get("toDt"));
    //this.ngForm.value.toDt.

    // console.log("---");
    // console.log(this.minDate);
    // console.log(this.maxDate);

  }
  ngOnInit(){

  }
  ngAfterViewInit(){

  }
  date: FormControl = new FormControl(moment().subtract(1, 'months').endOf('month'));
  printReport() {
    this.spinner.show();
    let fileName = '';
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy');
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy');
    //const toDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    console.log(this.ngForm.get('flg').value);
    if (this.ngForm.get('flg').value == 0){
      fileName = 'analysis_of_coborrowers_data_punching';
      //+ new DatePipe('en-US').transform(this.date.value.endOf('month'), 'MMM-yyyy').toUpperCase();
    }
    else{
      fileName = 'analysis_of_od_reasons_of_above_30_days_od_clients';
      // + new DatePipe('en-US').transform(this.date.value.endOf('month'), 'MMM-yyyy').toUpperCase();
    }
    this.reportsService.printAuditReport(frmDt, toDt, fileName , this.ngForm.get('flg').value).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      if(binaryData[0].byteLength > 0){
        let fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "text/csv" }));
        saveAs(fileURL, fileName)
      }else{
        this.toaster.warning("Issue in data extraction", "Warning");
      }
      this.spinner.hide();
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

