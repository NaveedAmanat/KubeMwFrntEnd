import { PrincipleAmount } from './../../../../shared/models/principleAmount.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FinanceService } from 'src/app/shared/services/finance.service';

@Component({
  selector: 'app-upaisa-dues-sharing',
  templateUrl: './upaisa-dues-sharing.component.html',
  styleUrls: ['./upaisa-dues-sharing.component.css']
})
export class UpaisaDuesSharingComponent implements OnInit {

  ngForm: FormGroup;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  walletMode: any[];
  
  constructor(
    private fb: FormBuilder, 
    private financeService: FinanceService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) {
      this.ngForm = this.fb.group({
        type: ['', Validators.required],
        isXls: [1],
      });
  }
  ngOnInit() {
    
  }

  print() {
    this.spinner.show();
    const walletMode =  this.ngForm.get('type').value;
    let isXls: boolean = this.ngForm.get('isXls').value;
    this.financeService.printUPaisaDuesShring(walletMode, isXls).subscribe((response) => {
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
