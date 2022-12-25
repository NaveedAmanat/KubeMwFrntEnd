import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-par-branch-wise',
  templateUrl: './par-branch-wise.component.html',
  styleUrls: ['./par-branch-wise.component.css']
})
export class PARBranchWiseComponent implements OnInit {


  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  ngForm: FormGroup;
  tempInstituteArray: any[] = [];
  maxDate: Date;
  branchs: Branch[];
  constructor(private fb: FormBuilder, private toaster: ToastrService, private reportsService: ReportsService, private transfersService: TransfersService, private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
    if (this.auth.role == "admin" || this.auth.role == 'ops') {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );

      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        type: ['', Validators.required],
        branch: [''],
      });
    } else {
      this.ngForm = this.fb.group({
        frmDt: [new Date(), Validators.required],
        toDt: [new Date(), Validators.required],
        type: ['', Validators.required],
        branch: [{ value: this.auth.emp_branch, disabled: false }, Validators.required],
      });

    }
  }
  ngOnInit() {
  }
  get f() { return this.ngForm.controls; }
  printReport() {
    this.spinner.show();
    const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MMM-yyyy')
    const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MMM-yyyy')
    this.reportsService.parBranchWise(frmDt, toDt, this.ngForm.get("branch").value).subscribe((response) => {
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
