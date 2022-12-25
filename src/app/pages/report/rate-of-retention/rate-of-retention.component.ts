import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rate-of-retention',
  templateUrl: './rate-of-retention.component.html',
  styleUrls: ['./rate-of-retention.component.css']
})
export class RateOfRetentionComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  scheduleForm: FormGroup;
  maxDate: Date;
  constructor( private reportsService:ReportsService, private toaster: ToastrService,private fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.maxDate=new Date();
    this.scheduleForm = this.fb.group({
      clntId: [new Date(), Validators.required],
    }); }

  ngOnInit() {
  }
  

  postedReport(){
    this.spinner.show();
    this.reportsService.printRateOfRetention(this.auth.emp_branch).subscribe((response) => {
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
