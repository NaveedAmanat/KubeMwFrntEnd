import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Branch } from 'src/app/shared/models/branch.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ProductGroup } from 'src/app/shared/models/productGroup.model';
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
  selector: 'app-portfolio-concentration',
  templateUrl: './portfolio-concentration.component.html',
  styleUrls: ['./portfolio-concentration.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class PortfolioConcentrationComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];
  brnchPrds: any;
  allItems: ProductGroup[] = [];
  constructor(private productService: ProductService, private toaster: ToastrService, private fb: FormBuilder, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    if (this.auth.role == 'admin' || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );
      this.ngForm = this.fb.group({
        prd: ['', Validators.required],
      asDt: ['', Validators.required],
        branch: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        prd: ['', Validators.required],
      asDt: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }

  }

  ngOnInit() {
    this.maxDate=new Date();
    this.productService.getAllProductGroups().subscribe((data) => {
      this.allItems = data;
    });
  }

  get f() { return this.ngForm.controls; }
  overdueReport() {
    this.spinner.show();
    let asDt = new DatePipe('en-US').transform(this.ngForm.get('asDt').value, 'dd-MM-yyyy')
    this.reportsService.printPortfolioConcentration(this.ngForm.get('prd').value,this.ngForm.get('branch').value,asDt).subscribe((response) => {
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
