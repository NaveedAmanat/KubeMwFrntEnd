import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort, MatPaginator, PageEvent } from '@angular/material';
import { merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { RecoveryService } from '../../../shared/services/recovery.service';
import { JVoucher } from 'src/app/shared/models/recovery.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journel-voucher',
  templateUrl: './journel-voucher.component.html',
  styleUrls: ['./journel-voucher.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class JournelVoucherComponent implements OnInit {
  pageEvent: PageEvent;
  dataSource: any;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  role: any = this.auth.role;
  filters: any[] = [];
  columnsToDisplay: string[] = ['jvId', 'jvDt', 'jvDscr', 'entyTyp', 'entySeq'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchVal = "";
  journelVouchersArray: any;
  expandedElement: any;
  journelVoucherDetailsArray: any;
  limit: number = 15;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [];
  filterValue: any = "";
  datalength: Number = 0;
  jvs: JVoucher[] = [];

  branchs: Branch[];

  
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  isCount: boolean = true;

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
    private recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private transfersService: TransfersService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.branchForm = this.fb.group({
      branch: [this.auth.emp_branch],
    });
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')
      
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        console.log(res)
      })
    } else {
      this.onSelectBranch();
    }
    
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
    setTimeout( () => {  this.spinner.show()}, 10)
    this.recoveryService.getJounrelVoucher(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 15, "",this.isCount).subscribe((data => {
      this.journelVouchersArray = data.jvHdr;
     
      this.spinner.hide();

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

  // ngAfterViewInIt() {
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       tap(() => this.getJounrelVoucher())
  //     )
  //     .subscribe();
  // }

  expandFunction(element: any) {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.recoveryService.getJournelVoucherDetails(element.jvHdrSeq).subscribe(d => {
        element.JVoucherDetials = d;
        this.expandedElement = element
        console.log(d);
        element.creditTotal = 0;
        element.debitTotal = 0;
        d.forEach(dtl => {
          (dtl.crdtDbtFlg=="1")?  element.creditTotal = +element.creditTotal + +dtl.amt:element.debitTotal = +element.debitTotal + +dtl.amt;
        })
      });
    }
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }

  // changePage(event) {
  //   console.log('event', event)
  //   // if (event.pageSize !== this.limit) {
  //   //   this.limit = event.pageSize;
  //   //   this.skip = event.pageSize * event.pageIndex;
  //   //   this.pageIndex = event.pageIndex
  //   //   this.limit = event.pageSize;
  //   //   this.getJounrelVoucher(true);
  //   // } else {
  //   //   if (this.totalLength > this.dataSource.data.length) {
  //   //     //if(this.pageIndex < event.pageIndex){
  //   //     // next page
  //   //     this.skip = event.pageSize * event.pageIndex;

  //   //     this.pageIndex = event.pageIndex
  //   //     this.limit = event.pageSize;
  //   //     this.getJounrelVoucher(true);
  //   //   }
  //   // }

  //   if (event.pageIndex < event.previousPageIndex)
  //     return
  //   if (event.length == this.dataSource.data.length)
  //     return;
  //   if (((event.pageIndex + 1) * event.pageSize) - this.dataSource.data.length > 0) {
  //     this.getJounrelVoucher(event.pageIndex, event.pageSize, event.previousPageIndex);
  //   }
  // }

  // public getJounrelVoucher(pageIndex, pageSize, previousPageIndex) {
  //   this.recoveryService.getJournelVoucherPaged(pageIndex, pageSize, this.filterValue).subscribe((data => {
  //     let jv = this.dataSource.data;
  //     jv.concat(data.content);
  //     this.dataSource = new MatTableDataSource(data.content);

  //     if (this.filterValue.length == 0) {
  //       this.dataBeforeFilter = this.dataSource.data;
  //       this.countBeforeFilter = data.totalElements;
  //       this.lastPageIndexBeforeFilter = previousPageIndex;
  //     }
  //   }));

  // }


  // dataBeforeFilter; countBeforeFilter; lastPageIndexBeforeFilter;
  // getFilteredData(filterValue) {
  //   this.spinner.show();
  //   this.paginator.pageIndex = 0;
  //   this.spinner.show();
  //   this.recoveryService.getJournelVoucherPaged(this.paginator.pageIndex, this.paginator.pageSize, filterValue).subscribe((data) => {
  //     this.spinner.hide();
  //     this.jvs = data.content;
  //     this.dataSource = new MatTableDataSource(data.content);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.totalLength = 0;
  //     setTimeout(() => { this.totalLength = data.totalElements; }, 200);
  //   }, (error) => {
  //     this.spinner.hide();
  //     console.log('err All Loans Service');
  //     console.log('err', error);
  //   });
  // }


  changePage(){
    this.isCount = false;
    setTimeout( () => {  this.spinner.show()}, 10)
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.recoveryService.getJounrelVoucher(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue,this.isCount).subscribe(data => {
        this.journelVouchersArray = data.jvHdr
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.jvHdr);
       
        this.spinner.hide();

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
        this.spinner.hide();
          console.log('err All Jv Vorcher Service');
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue) {
    this.isCount = true;
    setTimeout( () => {  this.spinner.show()}, 10)
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.recoveryService.getJounrelVoucher(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe((data) => {

      this.journelVouchersArray = data.jvHdr;

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
      console.log('err All Loans Service');
      console.log('err', error);
    });
  }
}

