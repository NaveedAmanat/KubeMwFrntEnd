import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import swal from 'sweetalert2';
import { ClientHealthInsuranceClaim } from 'src/app/shared/models/client-health-insurance-claim.model';
import { ClientHealthInsuranceClaimService } from 'src/app/shared/services/client-health-insurance-claim.service';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { AnmlService } from 'src/app/shared/services/anml.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-animal-insurance-claim',
  templateUrl: './animal-insurance-claim.component.html',
  styleUrls: ['./animal-insurance-claim.component.css']
})

export class AnimalInsuranceClaimComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  auth;
  claims;
  insrForm: FormGroup;
  statusArray;
  claim;
  constructor(private formBuilder: FormBuilder, private anmlService: AnmlService,
    private toaster: ToastrService, private spinner: NgxSpinnerService, private commonService: CommonService) {
  }
  ngOnInit() {
    this.displayedColumns = ['clntId', 'cnicNum', 'frstNm', 'amt', 'tagNum', 'clntNomFlg', 'dtOfDth', 'sts', 'action'];
    this.spinner.show()
    this.anmlService.getAnmlInsuranceClaims().subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.claims = res;
      this.dataSource = new MatTableDataSource(this.claims);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinner.hide();
    });
    this.loadLovs();
    this.insrForm = this.formBuilder.group({
      dthRptSeq: ['', Validators.required],
      sts: ['', Validators.required],
      rmrks: ['', Validators.required],
    });

  }
  get form() {
    return this.insrForm.controls;
  };
  onSaveClick() {
    this.spinner.show();
    console.log(this.insrForm.value)
    this.anmlService.updateAnmlInsuranceClaims(this.insrForm.value.dthRptSeq, this.insrForm.value.sts, this.insrForm.value.rmrks).subscribe(res => {
      this.claim.sts = this.insrForm.value.sts;
      this.claim.rmrks = this.insrForm.value.rmrks;
      this.spinner.hide();
      (<any>$('#ApplyPayment')).modal('hide');
      this.toaster.success("Saved")
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  onInstUpdate(claim) {
    this.insrForm.reset();
    (<any>$('#ApplyPayment')).modal('show');
    this.claim = claim;
    this.insrForm = this.formBuilder.group({
      dthRptSeq: [this.claim.dthRptSeq, Validators.required],
      sts: [this.claim.sts, Validators.required],
      rmrks: [this.claim.rmrks],
    });
  };

  findValueByKey(key) {
    let status = '';
    if (this.statusArray) {
      this.statusArray.forEach(s => {
        if (s.codeKey == key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  loadLovs() {
    this.commonService.getValues("0385").subscribe((res) => {
      this.statusArray = res;
    }, (error) => {
      console.log('err', error);
    });
  }
} 