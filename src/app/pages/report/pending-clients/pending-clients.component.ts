import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Branch } from 'src/app/shared/models/branch.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
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
  selector: 'app-pending-clients',
  templateUrl: './pending-clients.component.html',
  styleUrls: ['./pending-clients.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class PendingClientsComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];
  allItems: any;
  constructor(private productService: ProductService, private toaster: ToastrService, private fb: FormBuilder, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    if (this.auth.role == 'admin' || this.auth.role == 'ia' || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );
      this.ngForm = this.fb.group({
        typ: ['', Validators.required],
        prdId: ['', Validators.required],
        asDt: ['', Validators.required],
        branch: ['', Validators.required],
      });
    } else {
      this.ngForm = this.fb.group({
        typ: ['', Validators.required],
        prdId: ['', Validators.required],
        asDt: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required,],
      });
    }

  }

  ngOnInit() {
    this.maxDate=new Date();
    this.productService.getAllProductGroups().subscribe((data) => {
      this.allItems = data;
      let index = this.allItems.indexOf(this.allItems.find( prd => prd.prdGrpSeq == -1));
      this.allItems.splice(index, 1);
    });
  }

  get f() { return this.ngForm.controls; }
  overdueReport() {
    let portSeq = this.auth.role == 'bdo' ? this.auth.emp_portfolio : -1;
    this.spinner.show();
    let asDt = new DatePipe('en-US').transform(this.ngForm.get('asDt').value, 'dd-MM-yyyy')
    this.reportsService.printPendingClients(this.ngForm.get('prdId').value,this.ngForm.get('branch').value,asDt,this.ngForm.get('typ').value, portSeq).subscribe((response) => {
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
