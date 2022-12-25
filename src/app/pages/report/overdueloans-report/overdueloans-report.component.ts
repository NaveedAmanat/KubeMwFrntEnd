import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';

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
  selector: 'app-overdueloans-report',
  templateUrl: './overdueloans-report.component.html',
  styleUrls: ['./overdueloans-report.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class OverdueloansReportComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  allItems: any;
  overdueForm: FormGroup;
  maxDate: Date;
  branchs: Branch[];
  selected = "1";
  options = [
    {id: "1", value: "All Clients"},
    {id: "2", value: "Rescheduled Clients"},
    {id: "3", value: "Non Rescheduled Clients"}
  ]
  constructor(private productService: ProductService, private transfersService: TransfersService, private toaster: ToastrService, private fb: FormBuilder, private reportsService: ReportsService, private spinner: NgxSpinnerService) {
    this.overdueForm = this.fb.group({
      prdId: ['', Validators.required],
      asDt: ['', Validators.required],
      typ: ['1', Validators.required],
    });


    if (this.auth.role == "bm" || this.auth.role == "bdo") {
      this.overdueForm = this.fb.group({
        prdId: ['', Validators.required],
        asDt: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
        typ: ['1', Validators.required]
      });
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
      this.overdueForm = this.fb.group({
        prdId: ['', Validators.required],
        asDt: ['', Validators.required],
        branch: [''],
        typ: ['1', Validators.required]
      });
    }

  }

  ngOnInit() {
    this.maxDate = new Date();
    this.selected = '1';
    this.productService.getAllProductGroups().subscribe((data) => {
      this.allItems = data;
      let index = this.allItems.indexOf(this.allItems.find( prdGrp => prdGrp.prdGrpSeq == -1));
      this.allItems.splice(index, 1);
      this.allItems.unshift({'prdGrpSeq': -1, 'prdGrpNm': 'ALL'});
    });
  }

  overdueReport() {
    this.spinner.show();
    const type = this.overdueForm.get('typ').value
    let asDt = new DatePipe('en-US').transform(this.overdueForm.get('asDt').value, 'dd-MM-yyyy')
    this.reportsService.printOverDueReport(this.overdueForm.get('prdId').value, asDt, this.overdueForm.controls['branch'].value, type).subscribe((response) => {
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
