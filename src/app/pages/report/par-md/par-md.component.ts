import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-par-md',
  templateUrl: './par-md.component.html',
  styleUrls: ['./par-md.component.css']
})
export class ParMdComponent implements OnInit {
  ngForm: FormGroup;
  // frmDt: string;
  toDt: string;
  constructor(private fb: FormBuilder,
    private toaster: ToastrService, private reportsService: ReportsService, private spinner: NgxSpinnerService) {
    this.ngForm = this.fb.group({
      // frmDt: [new Date,Validators.required],
      toDt: [new Date, Validators.required]
    });
  }

  ngOnInit() {
  }
  portfolioReport() {
    this.spinner.show();
    // const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    console.log(toDt)
    this.reportsService.printParMdReport(toDt).subscribe((response) => {
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
