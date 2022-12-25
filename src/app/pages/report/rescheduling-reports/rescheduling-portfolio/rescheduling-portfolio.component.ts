import { Component, OnInit } from '@angular/core';
import { ReschedulingReportsService } from 'src/app/shared/services/rescheduling-reports.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from 'src/app/shared/models/Auth.model';

@Component({
  selector: 'app-rescheduling-portfolio',
  templateUrl: './rescheduling-portfolio.component.html',
  styleUrls: ['./rescheduling-portfolio.component.css']
})
export class ReschedulingPortfolioComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  constructor(
    private reschedulingReportService: ReschedulingReportsService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
  }

  onSubmitReschedulingPortfolio() {
    this.spinner.show();
    this.reschedulingReportService.getReschedulingPortfolio().subscribe((response) => {
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
