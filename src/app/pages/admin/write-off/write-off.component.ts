import { forEach } from '@angular/router/src/utils/collection';
import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, timestamp } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import swal from 'sweetalert2';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class WriteOffComponent implements OnInit {
  expandContent = true;
  panelOpenState = false;
  auth = JSON.parse(sessionStorage.getItem('auth'));
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  columnsToDisplay: any;
  expandedElement: TotalTransactionModel | null;
  dataSource: any;
  dataSource2: any;
  isCash: boolean = false;
  showFields = false;
  transactionData: any; 
  recoveryModesTyps: any


  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      // this.dataSource.sort = this.sort;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      // this.lastPageIndex = 0;
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


  constructor(private toaster: ToastrService, private recoveryService: RecoveryService,
    private fb: FormBuilder, private transfersService: TransfersService,
    private spinner: NgxSpinnerService, private commonService: CommonService) { }
  allLoans = [];
  branchs: Branch[];
  branchForm: FormGroup;
  applyPayment: FormGroup;
  onBranchSelection: boolean = false;
  maxDate: Date;
  // dueAmount: any;
  // recoveredAmount: any;


  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;


  ngOnInit() {
    this.transactionData = [];
    this.allLoans = [];
    this.applyPayment = this.fb.group({
      branchNm: [{ value: '', disabled: true }, Validators.required],
      prd: [{ value: '', disabled: true }, Validators.required],
      clientNm: [{ value: '', disabled: true }, Validators.required],
      clntId: [{ value: '', disabled: true }, Validators.required],
      installmentAmountDue: [{ value: '', disabled: true }, Validators.required],
      rcvryTypsSeq: ['', Validators.required],
      instr: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      pymtDt: [new Date(), Validators.required],
      pymtAmt: ['', Validators.required, this.validate.bind(this)],
      clientId: [''],
      totalDue: [{ value: '', disabled: true }],
      post: [''],
    });
    this.displayedColumns = ['clntSeq', 'frstNm', 'prd', 'totalDue', 'totalRecv', 'remaingAmt', 'status', 'action'];
    // this.columnsToDisplay = ['Client Sequence', 'Transaction Number', 'Payment Amount', 'Instrument Number'];
    this.columnsToDisplay = ['clntSeq', 'wrtOfRcvryTrxSeq', 'instrNum', 'pymtAmt'];
    // this.displayedColumnsForTransaction = ['clntSeq', 'frstNm', 'prd', 'totalDue', 'totalRecv', 'status', 'action'];
    // this.spinner.show();
    // this.recoveryService.getWrtOffClients(this.auth.emp_branch).subscribe(res => {
    //   console.log(res);
    //   this.spinner.hide();
    //   this.allLoans = res;
    //   this.dataSource = new MatTableDataSource(res);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // }, error => {
    //   this.spinner.hide();
    // })

    this.maxDate = new Date();

    // if (this.auth.role == 'bm') {
    //   this.isCount =true;
    //   this.spinner.show();
    //   this.recoveryService.getWrtOffClients(this.auth.emp_branch, this.paginator.pageIndex, 10, "", this.isCount).subscribe(res => {
    //     console.log(res);
    //     this.spinner.hide();
    //     this.allLoans = res.clnts;
    //     // for (let i = 0; i < this.allLoans.length; i++) {
    //     //   this.dueAmount = this.allLoans[i].totalDue;
    //     //   this.recoveredAmount = this.allLoans[i].totalRecv;
    //     // }
    //     this.dataSource = new MatTableDataSource(this.allLoans);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.datalength = res.count;

    //     this.dataBeforeFilter = this.dataSource.data;
    //     this.countBeforeFilter = res.count;
    //     this.lastPageIndexBeforeFilter = this.lastPageIndex;

    //   }, (error) => {
    //     this.spinner.hide();
    //     if (error.status == 500) {
    //       this.toaster.error("Something Went Wrong", "Error");
    //     } else if (error) {
    //       this.toaster.error("Something Went Wrong", "Error")
    //     }
    //   });
    //  } else {
    this.allLoans = [];

    //   }
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

  // statusOfWriteOf(status) {
  //   let a = '';
  //   if(status == 1){

  //   }
  // }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSelectBranch())
      )
      .subscribe();
  }

  /**
   * MOdified by Naveed - Date - 10-05-2022
   * SCR - Account - WriteOff 
   */
  openKcrForWriteOff(trnsSeq) {
    this.recoveryService.getPostedReport(trnsSeq, 2).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }

  

  postedReport(trx: string) {
  }

  onSelectBranch() {
    this.isCount = true;
    this.allLoans = [];
    this.dataSource = new MatTableDataSource(this.allLoans);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;
    this.searchVal = '';
    this.filterValue = '';

    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.dataSource = null;
      this.datalength = 0;

      return;
    }
    this.onBranchSelection = true;

    this.recoveryService.getTypesByBrnch(this.branchForm.controls['branch'].value).subscribe(res =>{
      this.recoveryModesTyps = res
    },
    error =>{
      console.log(error);
    })

    setTimeout(() => { this.spinner.show() }, 10)

    this.recoveryService.getWrtOffClientsBranchWise(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.allLoans = data.clnts;

      setTimeout(() => { this.spinner.hide() }, 5)

      if (this.allLoans.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allLoans);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  loadSelectBranch() {

    this.isCount = false;
    setTimeout(() => { this.spinner.show() }, 10);

    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {

      this.recoveryService.getWrtOffClientsBranchWise(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(data => {
        this.spinner.hide();

        this.allLoans = data.clnts;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.allLoans);

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err Write Off Clnts Service');
        console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    setTimeout(() => { this.spinner.show() }, 10)
    this.recoveryService.getWrtOffClientsBranchWise(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
      this.allLoans = data.clnts;

      this.spinner.hide();

      if (this.allLoans.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allLoans);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;
    }, error => {
      this.spinner.hide();
      console.log('err Write Off Clnts Service');
      console.log('err', error);
    });
  }

  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }
  tempInstituteArray = [];
  clnt: any = {};
  disable = false;
  openPayModal(clnt) {
    this.spinner.show();

    console.log(clnt);
    this.clnt = clnt;
    this.recoveryService.getWrtOfClntRecoveryTypes(clnt.clntSeq).subscribe(data => {
      this.tempInstituteArray = data;

      this.disable = false;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      this.disable = false;
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });

    // this.recovery = null;
    // this.recovery = recovery;
    this.applyPayment.reset();
    this.applyPayment.controls['clntId'].setValue(clnt.clntSeq);
    this.applyPayment.controls['clientId'].setValue(clnt.clntSeq);
    this.applyPayment.controls['clientNm'].setValue(clnt.frstNm);
    this.applyPayment.controls['prd'].setValue(clnt.prd);
    this.applyPayment.controls['totalDue'].setValue(clnt.totalDue - clnt.totalRecv);
    (<any>$('#ApplyPayment')).modal('show');
  }
  showTrxModal(clnt) {
    console.log(clnt);
    if (clnt.totalRecv == 0) {
      this.toaster.warning('No Data Found', 'Warning')
      return;
    }
    let data;
    setTimeout(() => {
      this.spinner.show();
    }, 2);
    this.recoveryService.getWrtOffTrxForClient(clnt.clntSeq).subscribe(res => {
      this.transactionData = res;
      (<any>$('#AdjustLoan')).modal('show');
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
  findDetails(item) {
    return item.dtl;
  }

  checkingTypeSeq(typ_seq) {
    let a;
    if (typ_seq == -1) {
      a = 'Principal';
    } else if (typ_seq == -2) {
      a = 'Insurance';
    } else {
      a = typ_seq;
    }
    return a;
  }
  onSubmitRevertData(item) {
    let branchSeq;
    if (this.auth.role == 'bm') {
      branchSeq = this.auth.emp_branch;
    } else {
      branchSeq = this.branchForm.controls['branch'].value;
    }
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Revert?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.recoveryService.revertWrtOffClient(item.trx.wrtOfRcvryTrxSeq, item.dtl[0].loan_app_seq).subscribe((res) => {
          this.recoveryService.getWrtOffTrxForClient(item.trx.clntSeq).subscribe(res => {

            this.isCount = true;
            this.allLoans = [];
            this.dataSource = new MatTableDataSource(this.allLoans);
            this.paginator.pageIndex = 0;
            this.dataSource.paginator = this.paginator;
            this.lastPageIndex = 0;
            this.searchVal = '';
            this.filterValue = '';

            this.onSelectBranch();

            this.transactionData = res;
          });
          this.spinner.hide();
          this.toaster.success('Reverted Sucessfully', 'Success')
        }, (error) => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
      }
    });

  }

  get fApplyPayment() {
    return this.applyPayment.controls;
  }

  validate(control: AbstractControl) {
    let pymtAmt = control;
    let totalDue = control.parent.get('totalDue') as FormControl;
    return of(pymtAmt.value > totalDue.value).pipe(
      map(result => result ? { paymtamterror: true } : null)
    );

  }

    /**
   * MOdified by Naveed - Date - 10-05-2022
   * SCR - Account - WriteOff 
   */
  onApplyPaymentSubmit() {
    this.disable = true;
    let branchSeq;
    if (this.auth.role == 'bm') {
      branchSeq = this.auth.emp_branch;
    } else {
      branchSeq = this.branchForm.controls['branch'].value;
    }
    this.spinner.show();
    let obj = this.applyPayment.getRawValue();
    obj.rcvryTypsSeq = this.applyPayment.controls['rcvryTypsSeq'].value.typSeq;
    obj.rcvryTypId = this.applyPayment.controls['rcvryTypsSeq'].value.typId;
    obj.brnchSeq = branchSeq  
    this.recoveryService.applyWrtOffClntPayment(obj).subscribe(res => {
      (<any>$('#ApplyPayment')).modal('hide');
      
      if(res.returnTrxSeq != 0){
          this.toaster.success('success', res.success);

          if(this.applyPayment.value.rcvryTypsSeq.typStr == 'CASH' && this.auth.role == 'bm'){
            this.openKcrForWriteOff(res.returnTrxSeq);
          }
      }else{
        this.toaster.warning('warning', res.warning);
      }
      this.disable = false;
      this.isCount = true;
      this.allLoans = [];
      this.dataSource = new MatTableDataSource(this.allLoans);
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
      this.lastPageIndex = 0;
      this.searchVal = '';
      this.filterValue = '';
      this.loadSelectBranch();

    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  onRecoveryChange() {
    const pymtDt = this.applyPayment.get('pymtDt');
    const instr = this.applyPayment.get('instr');
    if (this.applyPayment.get('rcvryTypsSeq').value.typId === '0001') {
      this.isCash = true;
      pymtDt.setValue(null);
      instr.setValue("");
      pymtDt.clearValidators();
      instr.clearValidators();
    } else {
      this.isCash = false;
      instr.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
      pymtDt.setValidators(Validators.required);
    }
    pymtDt.updateValueAndValidity();
    instr.updateValueAndValidity();
  }

  getTypeStr(typSeq){
    let typStr = typSeq;
    this.recoveryModesTyps.forEach(typ =>{
          if(typ.typSeq == typSeq){
            typStr = typ.typStr;
        }
    });
    return typStr;
  }
}

export interface TotalTransactionModel {
  wrtOfRcvryTrxSeq: number;
  clntSeq: number;
  instrNum: number;
  pymtAmt: string;
}