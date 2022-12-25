import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-easypaisa-dues',
  templateUrl: './easypaisa-dues.component.html',
  styleUrls: ['./easypaisa-dues.component.css']
})
export class EasypaisaDuesComponent implements OnInit {
  ngForm: FormGroup;

  auth = JSON.parse(sessionStorage.getItem("auth"));
  constructor(private fb: FormBuilder, private toaster: ToastrService, private financeService: FinanceService, private spinner: NgxSpinnerService) {
  
    this.ngForm = this.fb.group({
        isXls: [1, Validators.required],
      });
  }

  ngOnInit() {
  }

  easyPaisaDues() {
    this.spinner.show();
    let isXls: boolean = this.ngForm.get('isXls').value;
    console.log(isXls);
    this.financeService.printEasyPaisaDues(true).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      let fileURL = ""
      // if (isXls == true) {
        console.log("ex");
        fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
      // }
      // else {
      //   console.log("pdf");
      //   fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      // }

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
