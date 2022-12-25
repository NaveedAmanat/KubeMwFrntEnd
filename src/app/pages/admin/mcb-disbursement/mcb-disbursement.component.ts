import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { Toast, ToastrService } from 'ngx-toastr';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { McbDisbursementService } from 'src/app/shared/services/mcb-disbursement.service';
import swal from 'sweetalert2';

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
 * Added By Naveed - Date - 10-05-2022
 * SCR - MCB Disbursement
 */

@Component({
  selector: 'app-mcb-disbursement',
  templateUrl: './mcb-disbursement.component.html',
  styleUrls: ['./mcb-disbursement.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class McbDisbursementComponent implements OnInit {
  pageEvent: PageEvent;
  dataSource: any;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  role: any = this.auth.role;
  filters: any[] = [];
  columnsToDisplay: string[] = ['clientId', 'clientName', 'loanAppId', 'dsbmtAmt',
    'disburseSts', 'disburseDate', 'adcSts','adcDate', 'action'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchVal = "";
  journelVouchersArray: any;
  journelVoucherDetailsArray: any;
  limit: number = 10;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [];
  filterValue: any = "";
  datalength: Number = 0;

  branchs: Branch[];

  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  isCount: boolean = true;

  maxDate: Date;
  minDate: Date;

  reasonForm: FormGroup;

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

  constructor(
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private mcbDisbursementService: McbDisbursementService,
  ) { 
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit() {
    this.branchForm = this.fb.group({
      branch: [this.auth.emp_branch],
    });

    console.log('Branch Form:', this.branchForm);

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')
      
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
      })
    } else {
      this.onSelectBranch();
    }

    // 
    this.reasonForm = this.fb.group({
      clientId: [Validators.required],
      loanAppId: [Validators.required],
      dsbmtDtlKey: [Validators.required],
      dsbmtHdrKey: [Validators.required],
      disburseSts: [Validators.required],
      adcSts: [Validators.required],
      remarks: [''],
    });
    
  }

  onSelectBranch(){
    this.isCount = true;

    this.journelVouchersArray = [];
    this.dataSource = new MatTableDataSource(this.journelVouchersArray);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;
    this.searchVal = '';
    this.filterValue = '';

    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.journelVouchersArray = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      return;
    }
    setTimeout( () => {  this.spinner.show()}, 2)
    this.mcbDisbursementService.getAllClient(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "",this.isCount).subscribe((data => {
      this.journelVouchersArray = data.clients;

      console.log('getAllClient:', data);
     
      setTimeout( () => {  this.spinner.hide()}, 2)

      if (this.journelVouchersArray.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.journelVouchersArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }), error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }

  ngAfterViewInIt() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.changePage())
      )
      .subscribe();
  }
  
  showFields = false;
  showField() {
    this.showFields = true;
  }

  changePage(){
    this.isCount = false;
    setTimeout( () => {  this.spinner.show()}, 2)
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.mcbDisbursementService.getAllClient(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue,this.isCount).subscribe(data => {
        this.journelVouchersArray = data.clients
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.clients);
       
        this.spinner.hide();

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 2);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
        this.spinner.hide();
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue) {
    this.isCount = true;
    setTimeout( () => {  this.spinner.show()}, 2)
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;

    console.log('getFilteredData: ', this.branchForm.controls['branch'].value);
    if ( this.branchForm.controls['branch'].value == null ){
      this.branchForm.controls['branch'].setValue(0);
    }

    this.mcbDisbursementService.getAllClient(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe((data) => {

      this.journelVouchersArray = data.clients;

      this.dataSource = new MatTableDataSource(this.journelVouchersArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalLength = 0;
      this.datalength = data.count;

      if (this.journelVouchersArray.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.spinner.hide();

    }, (error) => {
       this.spinner.hide();
      console.log('err', error);
    });
  }

  // Added by Zohaib Asim - Dated 11-05-2022 - Loan Reversal Reason
  fnReveralRemarks(adcDsbmt) {
    (<any>$('#modalReveralRemarks')).modal('show');
    this.reasonForm = this.fb.group({
      clientId: [adcDsbmt.clientId, Validators.required],
      loanAppId: [adcDsbmt.loanAppId, Validators.required],
      dsbmtDtlKey: [adcDsbmt.dsbmtDtlKey, Validators.required],
      dsbmtHdrKey: [adcDsbmt.dsbmtHdrSeq, Validators.required],
      disburseSts: [adcDsbmt.disburseSts, Validators.required],
      adcSts: [adcDsbmt.adcSts, Validators.required],
      remarks: [adcDsbmt.remarks],
    });
  }

  onSubmitReversalReason() {
    (<any>$('#modalReveralRemarks')).modal('hide');    
    this.mcbDisbursementService.dsbmtReversalReason(this.reasonForm.controls['dsbmtDtlKey'].value, this.reasonForm.controls['remarks'].value ).subscribe((res) => {
      console.log('Reason', res);
      if(res.updated == 1){
        this.toaster.success('Reason successfully updated.');
        this.onSelectBranch();
      }else{
        this.toaster.warning('Reason not updated. Retry!');
      }
      //this.deferedLoan.loanAppStatus = 'Deferred';
    }, error => console.log('There was an error: ', error));

  }

  // Discard Reversal Request/Reason
  discardReversalReason(adcDsbmt) {  
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to discard reserval reason?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, execute!'
    }).then((result) => {
      if (result.value) {
        this.mcbDisbursementService.discardReversalReason(adcDsbmt.dsbmtDtlKey).subscribe((res) => {
          console.log('Reason', res);
          if(res.reversed == 1){
            this.toaster.success('Reason successfully discarded.');
            this.onSelectBranch();
          }else{
            this.toaster.warning('Reason not discarded. Retry!');
          }
          //this.deferedLoan.loanAppStatus = 'Deferred';
        }, error => console.log('There was an error: ', error));
      }
    });
  }
  // End
}

