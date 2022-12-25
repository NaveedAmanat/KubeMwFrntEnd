import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-product-wise-report-edition',
  templateUrl: './product-wise-report-edition.component.html',
  styleUrls: ['./product-wise-report-edition.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class ProductWiseReportEditionComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];

  constructor(private fb: FormBuilder,
    private reportsService: ReportsService,
    private transfersService: TransfersService, private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role == 'admin' || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }
  }
  ngOnInit() {
  }
  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    this.reportsService.printProductWiseAddition(frmDt, toDt, this.ngForm.get("branch").value).subscribe((response) => {
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

