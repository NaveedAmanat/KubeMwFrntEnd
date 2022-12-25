import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ubl-omni-maped',
  templateUrl: './ubl-omni-maped.component.html',
  styleUrls: ['./ubl-omni-maped.component.css']
})
export class UblOmniMapedComponent implements OnInit {

  ngForm: FormGroup;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  
  constructor(
    private fb: FormBuilder, 
    private financeService: FinanceService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) {

      this.ngForm = this.fb.group({
        isXls: [0, Validators.required],
      });
  }

  ngOnInit() {
  }

  print() {
    this.spinner.show();
    let isXls: boolean = this.ngForm.get('isXls').value;
    this.financeService.printUblOmniMapped(isXls).subscribe((response) => {
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