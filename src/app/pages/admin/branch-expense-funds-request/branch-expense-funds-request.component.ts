import { error } from '@angular/compiler/src/util';
import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { Toast, ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BranchExpenseFundsRequestService } from 'src/app/shared/services/branch-expense-funds-request.service';
import { DatePipe } from '@angular/common';
import { TransfersService } from 'src/app/shared/services/transfers.service';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
* @Added, Navee
* @Date, 14-06-2022
* @Description, SCR - systemization Funds Request
*/

@Component({
  selector: 'app-branch-expense-funds-request',
  templateUrl: './branch-expense-funds-request.component.html',
  styleUrls: ['./branch-expense-funds-request.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BranchExpenseFundsRequestComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  
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
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      this.datalength = 0;
      setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }


  auth;
  branchs: Branch[];
  branchForm: FormGroup;

  allRegions: any[];
  allAreas: any;
  allBranches: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;

  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  brnchExpenseFundsLists: any[];
  brnchExpenseFundsDetailLists: any[];
  isEdit: Boolean = false;

  branchExpeneFundsForm: FormGroup;
  submitted = false;
  
  maxDate: Date;
  formControlFilter: FormGroup;
  
  showFields = false;
  showField() {
    this.showFields = true;
  }


  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private fb: FormBuilder, private transfersService: TransfersService,
    private branchExpenseFundsRequest: BranchExpenseFundsRequestService,) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.maxDate = new Date();
  }

  ngOnInit() {

    this.displayedColumns = ['regNm', 'brnchNm', 'acctNm', 'expAmt', 'expDscr', 'action'];
    this.branchExpeneFundsForm = this.formBuilder.group({
      regSeq: ['', Validators.required],
      brnchSeq: ['', Validators.required],
      acctNm: ['', Validators.required],
      expAmt: ['', Validators.required],
      expDscr: ['', Validators.required],
      entyTyp: ['BR'],
      fundSeq: ['']
    });

    this.formControlFilter = this.fb.group({
      toDate:['-1'],
      regNm: [''],
      brnchNm: ['']
    })

    this.branchForm = this.fb.group({
      branch: [''],
    });

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')

      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
      })
    } else {
      this.fetchDetail()
    }

    this.transfersService.getRegions().subscribe(data => {
      this.allRegions = data;
      let index = this.allRegions.indexOf(this.allRegions.find( reg => reg.regSeq == -1));
      this.allRegions.splice(index, 1);
    });
    
    this.commonService.getBrnchsForUsr().subscribe((res) => {
      this.branchs = res;
      this.allBranches = this.branchs;
      let index = this.allBranches.indexOf(this.allBranches.find( br => br.brnchSeq == -1));
      this.allBranches.splice(index, 1);
    });
  }

  onRegionSelection(event) {
    this.spinner.show();
    this.allBranches = [];
    this.disabledBranch = false;
    this.formControlFilter.get('brnchNm').setValue('');

   if(event && event.regSeq){
    this.transfersService.getAllBranchByRegion(event.regSeq).subscribe(d => {
      this.allBranches = d;
      this.disabledBranch = true;

      this.applyFilter(event.regNm);
    });
   }else{
    this.allBranches = this.branchs;
    this.searchValue()
   }
   this.spinner.hide();
  }

  onBranchSelection(event){
    this.spinner.show();
    if(event && event.brnchSeq){
      this.applyFilter(event.brnchNm);
    }else{
      this.applyFilter(this.formControlFilter.get('regNm').value);
    }
    this.spinner.hide();
  }

  get form() {
    return this.branchExpeneFundsForm.controls;
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }


  fetchDetail() {
    // const frmDt = new DatePipe('en-US').transform(this.formControlFilter.get('fromDate').value, 'dd-MM-yyyy');
    let toDate = this.formControlFilter.get('toDate').value;
    if(toDate != '-1'){
      toDate =  new DatePipe('en-US').transform(toDate, 'dd-MM-yyyy')
    }

    // if(frmDt == null || toDt == null){
    //   return;
    // }
    // if(this.formControlFilter.get('fromDate').value >  this.formControlFilter.get('toDate').value){
    //   this.toaster.info('From Date cannot be greater then To Date', 'Information');
    //   return;
    // }

    this.isCount = true;

    this.brnchExpenseFundsLists = [];
    this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;

    // if (frmDt == null ||  toDt == null) {
    //   this.brnchExpenseFundsLists = [];
    //   this.dataSource = null;
    //   this.datalength = 0;
    //   return;
    // }

    this.spinner.show()
      this.branchExpenseFundsRequest.getAllLists(toDate, this.paginator.pageIndex, 10, this.filterValue, this.isCount).subscribe(data => {
      this.brnchExpenseFundsLists = data.lists;
      this.spinner.hide();

      if (this.brnchExpenseFundsLists.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };
      
    
      this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 10);
   
      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log('err', error);
    });
  }

  loadNextPage() {
    this.isCount = false;
    // const frmDt = new DatePipe('en-US').transform(this.formControlFilter.get('fromDate').value, 'dd-MM-yyyy')
    // const toDt = new DatePipe('en-US').transform(this.formControlFilter.get('toDate').value, 'dd-MM-yyyy')

    // if(frmDt == null || toDt == null){
    //   return;
    // }
    // if(this.formControlFilter.get('fromDate').value >  this.formControlFilter.get('toDate').value){
    //   this.toaster.info('From Date cannot be greater then To Date', 'Information');
    //   return;
    // }

    let toDate = this.formControlFilter.get('toDate').value;
    if(toDate != '-1'){
      toDate =  new DatePipe('en-US').transform(toDate, 'dd-MM-yyyy')
    }
    
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.branchExpenseFundsRequest.getAllLists(toDate, this.paginator.pageIndex, 10, this.filterValue, this.isCount).subscribe(data => {
        this.brnchExpenseFundsLists = data.lists;

        this.spinner.hide();
        this.brnchExpenseFundsLists = data.lists;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.brnchExpenseFundsLists);

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 10);

        if (this.brnchExpenseFundsLists.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err', error);
      });

    }
  }

  getFilteredData(filterValue: string) {
    // const frmDt = new DatePipe('en-US').transform(this.formControlFilter.get('fromDate').value, 'dd-MM-yyyy');
    // const toDt = new DatePipe('en-US').transform(this.formControlFilter.get('toDate').value, 'dd-MM-yyyy');
    // if(frmDt == null || toDt == null){
    //   return;
    // }
    // if(this.formControlFilter.get('fromDate').value >  this.formControlFilter.get('toDate').value){
    //   this.toaster.info('From Date cannot be greater then To Date', 'Information');
    //   return;
    // }

    let toDate = this.formControlFilter.get('toDate').value;
    if(toDate != '-1'){
      toDate =  new DatePipe('en-US').transform(toDate, 'dd-MM-yyyy')
    }

    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.spinner.show();
    this.branchExpenseFundsRequest.getAllLists(toDate, this.paginator.pageIndex, 10, filterValue, this.isCount).subscribe(data => {
      this.brnchExpenseFundsLists = data.lists;
      this.spinner.hide();

      if (this.brnchExpenseFundsLists.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;
    }, error => {
      this.spinner.hide();
      console.log('err', error);
    });
  }
  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }

  onPaymentClick(fund, flag) {
    this.isEdit = flag;
    this.branchExpeneFundsForm.reset();
    
    if(this.isEdit){
      (<any>$('#fundDetailModel')).modal('hide');
      this.branchExpeneFundsForm.patchValue(fund)
    }else{
      this.branchExpeneFundsForm.patchValue({
        'acctNm': fund.acctNm,
        'areaNm': fund.areaNm,
        'areaSeq': fund.areaSeq,
        'brnchNm': fund.brnchNm,
        'brnchSeq': fund.brnchSeq,
        'regNm': fund.regNm,
        'regSeq': fund.regSeq,
      });
    }

    (<any>$('#ApplyPayment')).modal('show');
  }

  onBranchExpenseSubmit(){

    console.log(this.branchExpeneFundsForm.value);
    if(this.branchExpeneFundsForm.get('brnchSeq') == null || this.branchExpeneFundsForm.get('brnchSeq').value == '0' ){
      this.branchExpeneFundsForm.get('entyTyp').setValue('REG');
    }else{
      this.branchExpeneFundsForm.get('entyTyp').setValue('BR');
    }
    this.spinner.show();
    if(this.isEdit){
      this.branchExpenseFundsRequest.updateBrnchFund(this.branchExpeneFundsForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#ApplyPayment')).modal('hide');
        if(respose.success){
          this.toaster.success(respose.suceess, 'Success')
        }else if(respose.error){
          this.toaster.warning(respose.warning, 'Warning')
        }else{
          this.toaster.error('Something went wrong', 'Error') 
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }else{
      this.branchExpenseFundsRequest.addBranchFund(this.branchExpeneFundsForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#ApplyPayment')).modal('hide');
        if(respose.success){
          this.toaster.success(respose.suceess, 'Success')
        }else if(respose.error){
          this.toaster.warning(respose.warning, 'Warning')
        }else{
          this.toaster.error('Something went wrong', 'Error') 
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }
    this.fetchDetail();
  }

    onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getFundDetail(element, flag){
    this.isEdit = flag;
    
    let toDate = this.formControlFilter.get('toDate').value;
    if(toDate != '-1'){
      toDate =  new DatePipe('en-US').transform(toDate, 'dd-MM-yyyy')
    }
    this.branchExpenseFundsRequest.getFundDetailByAccoutnNum(element.acctNm, toDate).subscribe(res => {
      this.brnchExpenseFundsDetailLists = res.lists;
      (<any>$('#fundDetailModel')).modal('show');
      this.spinner.hide();
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