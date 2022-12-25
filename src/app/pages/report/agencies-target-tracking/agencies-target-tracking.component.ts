import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agencies-target-tracking',
  templateUrl: './agencies-target-tracking.component.html',
  styleUrls: ['./agencies-target-tracking.component.css']
})
export class AgenciesTargetTrackingComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  scheduleForm: FormGroup;
  maxDate: Date;
  constructor( private reportsService:ReportsService,private fb: FormBuilder, private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.maxDate=new Date();
    this.scheduleForm = this.fb.group({
      clntId: [new Date(), Validators.required],
    }); }

  ngOnInit() {
  }
  

  postedReport(){
    this.spinner.show();
    this.reportsService.printAgenciesTargetTracking(this.auth.emp_branch).subscribe((response) => {
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
