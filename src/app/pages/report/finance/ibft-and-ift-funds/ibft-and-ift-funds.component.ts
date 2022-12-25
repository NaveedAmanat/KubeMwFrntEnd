import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FinanceService } from 'src/app/shared/services/finance.service';

@Component({
  selector: 'app-ibft-and-ift-funds',
  templateUrl: './ibft-and-ift-funds.component.html',
  styleUrls: ['./ibft-and-ift-funds.component.css']
})
export class IbftAndIftFundsComponent implements OnInit {
  ngForm: FormGroup;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  frmDt: string;
  toDt: string;
  maxDate: Date;

  constructor(
    private fb: FormBuilder, 
    private financeService: FinanceService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) {

      this.ngForm = this.fb.group({
        frmDt: ['', Validators.required],
        toDt: ['', Validators.required],
        isXls: [0, Validators.required],
        type: ['1', Validators.required],
      });
  }

  ngOnInit() {
  }

  print() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-y')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-y')
    let isXls: boolean = this.ngForm.get('isXls').value;
    let type = this.ngForm.get('type').value;
    this.financeService.printIbftAndIftReport(frmDt, toDt, type, isXls).subscribe((response) => {
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

      console.log(fileURL);

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