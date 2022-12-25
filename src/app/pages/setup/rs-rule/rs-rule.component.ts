import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth.model';
import { RsRule } from 'src/app/shared/models/rs-rule.model';
import { RsRuleService } from 'src/app/shared/services/rs-rule.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/services/common.service';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { lov } from 'src/app/shared/models/lov.model';

@Component({
  selector: 'app-rs-rule',
  templateUrl: './rs-rule.component.html',
  styleUrls: ['./rs-rule.component.css']
})
export class RsRuleComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem("auth"))
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  datalength: number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  ischecked: boolean;

  rsRuleForm: FormGroup;
  type: number;
  selectedYear = -1;

  rsRule: RsRule[] = [];

  enableArr = [];

  loanReschdCategory: lov[] = [];
  loanRechdType: lov[] = [];

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private rsRuleService: RsRuleService,
    private commonService: CommonService) { }

  ngOnInit() {

    this.rsRuleForm = this.fb.group({
      ruleSeq: [''],
      ruleDesc: [''],
      principalAmount: [0],
      serviceCharges: [0],
      scChargeMore: [0],
      scPerInst: [0],
      scNewIrrRate: [0],
      insuranceCharges: [0],
      insChargeMore: [0],
      insPerInst: [0],
      insNewAmount: [0],
      jumpMonths: [''],
      loanReschdCategory: [''],
      loanRechdType: ['']
    });

    this.enableArr = [{ title: "Enable", code: 1 }, { title: "Disable", code: 0 }];

    this.displayedColumns = ["ruleSeq", "ruleDesc", "principalAmount", "serviceCharges",
        "scChargeMore", "insuranceCharges", 
        "insChargeMore", "jumpMonths", "loanReschdCategory", "loanRechdType", "crntRecFlg", "action"];
      this.rsRuleList();

    this.loadLovs();

  }

  loadLovs() {
    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.LOAN_RESCHED_CATEGORY).subscribe((res) => {
      this.loanReschdCategory = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.LOAN_RESCHED_TYPE).subscribe((res) => {
      this.loanRechdType = res;
    }, (error) => {
      console.log('err', error);
    });
  }

  findCategoryValueByKey(key) {
    let category = '';
    if (this.loanReschdCategory) {
      this.loanReschdCategory.forEach(s => {
        if (s.codeKey === key) {
          category = s.codeValue;
        }
      });
    }
    return category;
  }

  findTypeValueByKey(key) {
    let type = '';
    if (this.loanRechdType) {
      this.loanRechdType.forEach(s => {
        if (s.codeKey === key) {
          type = s.codeValue;
        }
      });
    }
    return type;
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }

  rsRuleList() {
    this.isCount = true;
    this.spinner.show();
    this.dataSource = new MatTableDataSource(this.rsRule);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    this.rsRuleService.getRsRule(this.paginator.pageIndex, 10,
      this.filterValue, this.isCount
    ).subscribe(response => {
      this.spinner.hide();
      this.rsRule = response.LoanRule;
      console.log(this.rsRule);
      if (response.LoanRule.length <= 0) {
        this.toaster.info("No Data Found", "Information");
      }

      this.datalength = 0;
      setTimeout(() => {
        this.datalength = response.count;
        this.dataSource = new MatTableDataSource(this.rsRule);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 200);

      this.dataBeforeFilter = response.LoanRule;
      this.countBeforeFilter = response.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      return;
    }
    this.getFilteredData(filterValue.trim().toLowerCase())
  }

  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.rsRuleList();
      return;
    }
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  loadNextPage() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();

      this.rsRuleService.getRsRule(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount
      ).subscribe(response => {
        this.spinner.hide();
        this.rsRule = response.LoanRule;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(response.LoanRule);
        response.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = response.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }

      }, error => {
        this.spinner.hide();
      });

    }
  }

  getFilteredData(filterValue: string) {
      this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      this.rsRuleService.getRsRule(this.paginator.pageIndex, this.paginator.pageSize,
        filterValue, this.isCount).subscribe(response => {
          this.rsRule = response.LoanRule;
          this.spinner.hide();
          if (this.rsRule.length <= 0) {
            this.toaster.info('No Data Found', 'Information')
          };

          this.datalength = 0;
          setTimeout(() => {
            this.datalength = response.count;
            this.dataSource = new MatTableDataSource(this.rsRule);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);
        }, error => {
          this.spinner.hide();
        });
  }

  onRsRuleEdit: Boolean;

  addRsRule() {

    this.onRsRuleEdit = false;
    this.rsRuleForm.reset();

    Object.keys(this.rsRuleForm.controls).forEach((key) => {
      const control = this.rsRuleForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    (<any>$('#addRsRule')).modal('show');
  }

  editRsRule(rule) {
    this.onRsRuleEdit = true;

    this.rsRuleForm.reset();

    Object.keys(this.rsRuleForm.controls).forEach((key) => {
      const control = this.rsRuleForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    this.rsRuleForm = this.fb.group({
      ruleSeq: [rule.ruleSeq],
      ruleDesc: [rule.ruleDesc],
      principalAmount: [rule.principalAmount],
      serviceCharges: [rule.serviceCharges],
      scChargeMore: [rule.scChargeMore],
      scPerInst: [rule.scPerInst],
      scNewIrrRate: [rule.scNewIrrRate],
      insuranceCharges: [rule.insuranceCharges],
      insChargeMore: [rule.insChargeMore],
      insPerInst: [rule.insPerInst],
      insNewAmount: [rule.insNewAmount],
      jumpMonths: [rule.jumpMonths],
      loanReschdCategory: [rule.loanReschdCategory],
      loanRechdType: [rule.loanRechdType]
    });

    (<any>$('#addRsRule')).modal('show');
  }

  invalid: Boolean = false;

  onRsRuleFormSubmit(rule) {
    console.log(rule);

    if(rule.jumpMonths < 1 || rule.jumpMonths > 12){
      this.toaster.warning('Jump should be between 1 to 12 Months.');
      return;
    }

    if((rule.principalAmount == false || rule.principalAmount == null) && 
    (rule.serviceCharges == false || rule.serviceCharges == null) && 
    (rule.insuranceCharges == false || rule.insuranceCharges == null)){
      this.toaster.info('Please select atleast one Relief.');
      return;
    }

    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.rsRuleForm.reset();

    if (this.onRsRuleEdit == true) {
      this.rsRuleForm = this.fb.group({
        ruleSeq: [rule.ruleSeq],
        ruleDesc: [rule.ruleDesc],
        principalAmount: [(rule.principalAmount == null || rule.principalAmount == 0) ? 0 : 1],
        serviceCharges: [(rule.serviceCharges == null || rule.serviceCharges == 0) ? 0 : 1],
        scChargeMore: [(rule.scChargeMore == null || rule.scChargeMore == 0) ? 0 : 1],
        scPerInst: [(rule.scPerInst == null || rule.scPerInst == 0) ? 0 : 0],
        scNewIrrRate: [(rule.scNewIrrRate == null || rule.scNewIrrRate == 0) ? 0 : 0],
        insuranceCharges: [(rule.insuranceCharges == null || rule.insuranceCharges == 0) ? 0 : 1],
        insChargeMore: [(rule.insChargeMore == null || rule.insChargeMore == 0) ? 0 : 1],
        insPerInst: [(rule.insPerInst == null || rule.insPerInst == 0) ? 0 : 0],
        insNewAmount: [(rule.insNewAmount == null || rule.insNewAmount == 0) ? 0 : 0],
        jumpMonths: [rule.jumpMonths],
        loanReschdCategory: [rule.loanReschdCategory],
        loanRechdType: [rule.loanRechdType]
      });
      this.rsRuleService.updateRsRule(this.rsRuleForm.value).subscribe((data) => {

        this.toaster.success('Rescheduling Loan Rule updated');
        this.rsRuleList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.rsRuleForm = this.fb.group({
        ruleSeq: [''],
        ruleDesc: [rule.ruleDesc],
        principalAmount: [(rule.principalAmount == null || rule.principalAmount == 0) ? 0 : 1],
        serviceCharges: [(rule.serviceCharges == null || rule.serviceCharges == 0) ? 0 : 1],
        scChargeMore: [(rule.scChargeMore == null || rule.scChargeMore == 0) ? 0 : 1],
        scPerInst: [(rule.scPerInst == null || rule.scPerInst == 0) ? 0 : 0],
        scNewIrrRate: [(rule.scNewIrrRate == null || rule.scNewIrrRate == 0) ? 0 : 0],
        insuranceCharges: [(rule.insuranceCharges == null || rule.insuranceCharges == 0) ? 0 : 1],
        insChargeMore: [(rule.insChargeMore == null || rule.insChargeMore == 0) ? 0 : 1],
        insPerInst: [(rule.insPerInst == null || rule.insPerInst == 0) ? 0 : 0],
        insNewAmount: [(rule.insNewAmount == null || rule.insNewAmount == 0) ? 0 : 0],
        jumpMonths: [rule.jumpMonths],
        loanReschdCategory: [rule.loanReschdCategory],
        loanRechdType: [rule.loanRechdType]
      });
      this.rsRuleService.addRsRule(this.rsRuleForm.value).subscribe((data) => {
        this.toaster.success('New Rescheduling Loan Rule added');
        this.rsRuleList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    (<any>$('#addRsRule')).modal('hide');
    this.rsRuleForm.reset();
  }

  deleteRsRule(rule) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Rescheduling Rule?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.rsRuleService.deleteRsRule(rule.ruleSeq).subscribe((res) => {

          this.spinner.hide();
          swal(
            'Deleted!',
            'Rescheduling Rule has been deleted.',
            'success'
          );
          this.rsRuleList();
        }, error => {
          this.spinner.hide();
          swal(
            'Deleted!',
            error.error['error'],
            'error'
          );
          console.log('There was an error: ', error.error['error']);
        });
      }
    });
  }
  disableRsRule(rule) {
    if(rule.crntRecFlg == 1){
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to disable this Rescheduling Rule?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, disable it!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.rsRuleService.disableRsRule(rule.ruleSeq).subscribe((res) => {
            this.spinner.hide();
            swal(
              'Status Changed!',
              res['rule'],
              'success'
            );
            this.rsRuleList();
          }, error => {
            this.spinner.hide();
            swal(
              'Status Not Changed!',
              error.error['error'],
              'error'
            );
            console.log('There was an error: ', error.error['error']);
          });
        }
      });
    }
    else if(rule.crntRecFlg == 0){
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to enable this Rescheduling Rule?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, enable it!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.rsRuleService.disableRsRule(rule.ruleSeq).subscribe((res) => {
            this.spinner.hide();
            swal(
              'Status Changed!',
              res['rule'],
              'success'
            );
            this.rsRuleList();
          }, error => {
            this.spinner.hide();
            swal(
              'Status Not Changed!',
              error.error['error'],
              'error'
            );
            console.log('There was an error: ', error.error['error']);
          });
        }
      });
    }




        
      
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
