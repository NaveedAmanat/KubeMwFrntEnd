import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FinanceService } from 'src/app/shared/services/finance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-mobile-wallet-maped',
  templateUrl: './mobile-wallet-maped.component.html',
  styleUrls: ['./mobile-wallet-maped.component.css']
})
export class MobileWalletMapedComponent implements OnInit {

  ngForm: FormGroup;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  walletMode: any[];
  
  constructor(
    private fb: FormBuilder, 
    private financeService: FinanceService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private dataService: DataService) {

      this.ngForm = this.fb.group({
        mode: ['', Validators.required],
        isXls: [0, Validators.required],
      });
  }

  ngOnInit() {
    this.dataService.getTypsMobileWalletModes().subscribe(data => {
      this.walletMode = data;
      this.walletMode.unshift({'typId': -1, 'typStr': 'ALL'});
    });
  }

  print() {
    this.spinner.show();
    const walletMode =  this.ngForm.get('mode').value;
    let isXls: boolean = this.ngForm.get('isXls').value;
    this.financeService.printMobileWalletMapped(walletMode, isXls).subscribe((response) => {
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