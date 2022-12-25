import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/shared/models/Auth.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Branch } from 'src/app/shared/models/branch.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/shared/services/data.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-active-clients',
  templateUrl: './active-clients.component.html',
  styleUrls: ['./active-clients.component.css']
})
export class ActiveClientsComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  rptFlag: any;
  ngForm: FormGroup;
  frmDt: string;
  toDt: string;
  maxDate: Date;
  branchs: Branch[];
  allBranches: Object;


  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private transfersService: TransfersService,
    private reportService: ReportsService,) {

    this.maxDate = new Date();

  }

  ngOnInit() {
    console.log(this.auth)

    this.ngForm = this.fb.group({
      // toDt: [new FormControl(moment()), Validators.required],
      // frmDt: [new FormControl(moment()), Validators.required],
      // brnchSeq: [this.auth.emp_branch],
      // isXls: [false],
    });
    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });
  }
  getBranch() {
    this.allBranches = [];
    this.dataService.getBranch(this.ngForm.controls["areaSeq"].value).subscribe(d => {
      this.allBranches = d;
    });
  }

  onSubmitActiveClients() {
    this.spinner.show();
    // const frmDt = new DatePipe('en-US').transform(this.ngForm.get('frmDt').value, 'dd-MM-yyyy')
    // const toDt = new DatePipe('en-US').transform(this.ngForm.get('toDt').value, 'dd-MM-yyyy')
    // let brnchSeq = this.ngForm.get('brnchSeq').value ? this.ngForm.get('brnchSeq').value : 0;
    // let isXls = this.ngForm.get('isXls').value;
    // console.log(isXls)
    this.reportService.printActiveClients().subscribe((response) => {
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
