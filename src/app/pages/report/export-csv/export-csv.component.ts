import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGroup } from 'src/app/shared/models/productGroup.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { MY_FORMATS } from '../overdueloans-report/overdueloans-report.component';
const moment = _moment;
@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ExportCsvComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder, private reportsService: ReportsService, private toaster: ToastrService, private recoveryService: RecoveryService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    this.ngForm = this.fb.group({
      frmDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required]
    });
  }
  ngOnInit() {
  }
  portfolioReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    this.reportsService.printExportBankBookCsv(frmDt, toDt, 1).subscribe((response) => {
      // var binaryData = [];
      // binaryData.push(response);
      // if(binaryData[0].byteLength > 0){
      //   let fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "text/csv" }));
      //   saveAs(fileURL, "Export CVS")
      // }else{
      //   this.toaster.warning("Issue in data extraction", "Warning");
      // }

      this.downloadFile(response);

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

  async downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = 'myFile.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
}

  // downloadFile(data: any) {
  //   const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  //   const header = Object.keys(data[0]);
  //   const csv = data.map((row) =>
  //     header
  //       .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //       .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   const csvArray = csv.join('\r\n');
  
  //   const a = document.createElement('a');
  //   const blob = new Blob([csvArray], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  
  //   a.href = url;
  //   a.download = 'myFile.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();
  // }
}