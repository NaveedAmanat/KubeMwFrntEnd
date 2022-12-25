import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-adc-failed-transaction',
  templateUrl: './adc-failed-transaction.component.html',
  styleUrls: ['./adc-failed-transaction.component.css']
})
export class AdcFailedTransactionComponent {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  minDate: Date;
  constructor(private fb: FormBuilder, private reportsService: ReportsService,
    private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    this.minDate = new Date();


    this.ngForm = this.fb.group({
      logDt: [new Date(), Validators.required],
      isXls: [1]
      });
  }
  ngOnInit() {

  }

  printReport(){
    const logDt = new DatePipe('en-US').transform(this.ngForm.get('logDt').value, 'dd-MMM-yyyy');
    console.log(logDt);

    this.spinner.show();
    this.reportsService.printAdcFailedTransaction(logDt).subscribe((response) => {
      this.spinner.hide();

      let fileName = 'Adc_Failed_Transaction_' + logDt;

        this.downloadFile(response, fileName);
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
   }

   async downloadFile(data: any, fileName) {
    const replacer = (key, value) => value === null ? 'null' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);
    window.URL.revokeObjectURL(url);

    saveAs(blob, fileName + ".csv");

    swal({
      title: 'File: ' + fileName,
      text: 'Check your download folder',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    })
    .then((result) => {
      if (result.value) {
      }
    });
  }

}
