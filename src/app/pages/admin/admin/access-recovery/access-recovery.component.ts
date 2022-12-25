import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import swal from 'sweetalert2';
import { AccessRecovery } from '../../../../shared/models/access-recovery.model';
import { CommonService } from '../../../../shared/services/common.service';
import { AccessRecoveryService } from '../../../../shared/services/access-recovery.service';
import { DisbursementService } from '../../../../shared/services/disbursement.service';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/MyErrorStateMatcher.helper';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Expense } from 'src/app/shared/models/expense.model';
import { PaymentType } from 'src/app/shared/models/paymentType.model';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';

@Component({
  selector: 'app-access-recovery',
  templateUrl: './access-recovery.component.html',
  styleUrls: ['./access-recovery.component.css']
})


export class AccessRecoveryComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  tempInstituteArray: any;

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


  showFields = false;
  applyExcessPayment: FormGroup;
  payment: boolean;

  isCash: boolean;
  paymentArray: any[];

  nameArray: string[];
  paymentModeArray: any[] = [];
  matcher = new MyErrorStateMatcher();

  public accessRecoveries: AccessRecovery[];
  public addAccessRecovery: AccessRecovery = new AccessRecovery();
  public isEdit: Boolean = false;

  accessRecoveryForm: FormGroup;
  submitted = false;
  auth;
  branchForm: FormGroup;

  onBranchSelection: boolean = false;

  branchs: Branch[];

  excessRecoveryReversalForm: FormGroup;

  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  isTotalAmt: any = 0;

  constructor(private expenseService: ExpenseService,
    private recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService, private changeDetectorRefs: ChangeDetectorRef, private formBuilder: FormBuilder, private accessRecoveryService: AccessRecoveryService, private commonService: CommonService, private paymentTypesService: PaymentTypesService,) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
  }

  ngOnInit() {
    this.accessRecoveries = [];

    this.accessRecoveries = [];

    this.branchForm = this.formBuilder.group({
      branch: [this.auth.emp_branch],
    })

    this.expenseService.getPaymentModes().subscribe((data => {
      this.paymentArray = data;
    }))
    this.applyExcessPayment = this.fb.group({
      clntSeq: ['', Validators.required],
      pymntMod: ['', Validators.required],
      pymtAmt: ['', Validators.required],
    });

    this.recoveryService.getRecoveryTypes().subscribe((temp => {
      this.tempInstituteArray = temp;
    }));


    // this.refreshExcessRecovery();
    this.displayedColumns = ['txId', 'branchNm', 'clientId', 'clientName', 'accessAmount', 'pymtDt', 'agent', 'action'];
    this.accessRecoveryForm = this.formBuilder.group({
      txId: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      accessAmount: ['', Validators.required],
      paymentMode: ['', Validators.required],
      instrumentNum: [''],
    });

    this.expenseService.getPaymentModes().subscribe(
      d => {
        console.log("here");
        this.paymentModeArray = d;
        console.log(this.paymentModeArray);
        console.log("there");
      });

    // this.accessRecoveryService.getAccessRecoveries().subscribe(data => {
    //   this.accessRecoveries = data;
    //   this.dataSource = new MatTableDataSource(this.accessRecoveries);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    //   console.log(data);
    // });


    this.excessRecoveryReversalForm = this.fb.group({
      loanAppSeq: ['', Validators.required],
      cmnt: ['', Validators.required],
    });

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        this.toaster.info('Please Select Branch', 'Information')
      })
    } else {
      this.onSelectBranch();
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadAccessRcvry())
      )
      .subscribe();
  }




  onSelectBranch() {
    this.accessRecoveries = [];
    this.dataSource = new MatTableDataSource(this.accessRecoveries);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.filterValue = '';
    this.searchVal = '';
    this.lastPageIndex = 0;
    this.isCount = true;
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.accessRecoveries = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      return;
    }
    // this.expenseArray = [];
    // console.log(this.expenseArray)
    // if (!this.branchForm.controls['branch'].value == null || !this.branchForm.controls['branch'].value == undefined) {
    //   this.expenseService.getAllCatgoriesModesByBranches(this.branchForm.controls['branch'].value).subscribe((data) => {
    //     this.expenseArray = data;
    //     console.log(this.expenseArray)
    //   })
    // }
    // if (this.auth.role != 'bm') {
    // this.expenseService.getAllCatgoriesModesByBranches(this.branchForm.controls['branch'].value).subscribe((data) => {
    //   this.expenseArray = data;
    //   console.log(this.expenseArray)
    // })


    //   this.accessRecoveryService.getAccessRecoveriesManually(this.branchForm.controls['branch'].value).subscribe(data => {
    //     this.accessRecoveries = data;
    //     this.dataSource = new MatTableDataSource(this.accessRecoveries);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });

    // }
    if (this.branchForm.controls['branch'].value == null) {
      this.onBranchSelection = false;
    }
    this.onBranchSelection = true;
    this.spinner.show();
    this.accessRecoveryService.getAccessRecoveriesManually(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.accessRecoveries = data.accessrcvry;
      this.isTotalAmt = data.totAmt;

      this.spinner.hide();

      if (this.accessRecoveries.length <= 0  && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.accessRecoveries);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        setTimeout(()=> this.datalength = data.count, 10);
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = data.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Internal Server Error", "Error")
      }
    });
  }

  loadAccessRcvry() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.accessRecoveryService.getAccessRecoveriesManually(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(data => {
        this.spinner.hide();
        this.accessRecoveries = data.accessrcvry;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.accessRecoveries);
      
       data.count = this.datalength;
       this.datalength = 0;
       setTimeout(() => { this.datalength = data.count; }, 10);

        if (this.accessRecoveries.length <= 0  && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        }
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err All Expense Service');
        console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.spinner.show();
    this.accessRecoveryService.getAccessRecoveriesManually(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
      this.accessRecoveries = data.accessrcvry;
      this.spinner.hide();
      if (this.accessRecoveries.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.accessRecoveries);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;
    }, error => {
      this.spinner.hide();
      console.log('err All Expense Service');
      console.log('err', error);
    });
  }


  get form() {
    return this.accessRecoveryForm.controls;
  }
  get fApplyPayment() {
    return this.applyExcessPayment.controls;
  }
  onRecoveryChange() {
    const pymtDt = this.applyExcessPayment.get('pymtDt');
    const instr = this.applyExcessPayment.get('instr');
    if (this.applyExcessPayment.get('rcvryTypsSeq').value.typId === '0001') {
      this.isCash = true;
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
  onPaymentClick(AccessRecovery) {
    this.isEdit = true;
    this.accessRecoveryForm.patchValue(AccessRecovery);
    this.addAccessRecovery = AccessRecovery;
    (<any>$('#ApplyPayment')).modal('show');
  }

  exp: Expense = new Expense();
  temp: PaymentType = new PaymentType();
  onPayClick() {
    this.spinner.show();
    this.addAccessRecovery.insturmentNum = this.form.instrumentNum.value;
    this.addAccessRecovery.paymentMode = this.form.paymentMode.value;

    this.exp = new Expense();
    this.temp.typId = '0005';
    this.temp.typCtgryKey = 2;
    this.temp.brnchSeq = 0;

    this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;
        this.exp.pymtTypSeq = +this.addAccessRecovery.paymentMode['typSeq'];
        this.exp.brnchSeq = +this.addAccessRecovery.branchSeq;
        this.exp.expnsDscr = this.temp.typStr;
        this.exp.instrNum = this.addAccessRecovery.insturmentNum;
        this.exp.expnsAmt = this.addAccessRecovery.accessAmount;
        this.exp.expnsStsKey = 200;
        this.exp.expnsTypSeq = this.temp.typSeq;
        this.exp.expRef = this.addAccessRecovery.txId;
        this.exp.pymtRctFlg = 1;
        this.accessRecoveryService.addNewExpense(this.exp).subscribe(res => {
          this.toaster.success('Excess Recovery Paid', 'Success');
          this.accessRecoveries = [];
          this.dataSource = new MatTableDataSource(this.accessRecoveries);
          this.paginator.pageIndex = 0;
          this.dataSource.paginator = this.paginator;
          this.filterValue = '';
          this.searchVal = '';
          this.lastPageIndex = 0;
          this.isCount = true;
          this.onSelectBranch();
        }, error => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
      }
    );
    (<any>$('#ApplyPayment')).modal('hide');
  }
  showField() {
    this.showFields = true;
  }

  onSelectChange() {
    let instrNum = this.accessRecoveryForm.get('instrumentNum');
    if (this.accessRecoveryForm.get('paymentMode').value.typId === '0001') {
      this.isCash = true;
      instrNum.clearValidators();
    } else {
      instrNum.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
      this.isCash = false;
    }
    instrNum.updateValueAndValidity();

  }



  validateClient() {
    this.payment = false;
    this.accessRecoveryService.validateClients(this.applyExcessPayment.controls['clntSeq'].value).subscribe((temp => {
      console.log(temp);
      if (temp == null) {
        this.toaster.error("Client does not have an active loan.")
        return;
      };
      if (temp != null) {
        this.toaster.success("You can do things with these")
        this.payment = true;
      };
    }));

  }
  onApplyExcessPaymentSubmit() {
    this.accessRecoveryService.addExcessRecoveryManually().subscribe((temp => {
      this.tempInstituteArray = temp;
    }
    ))
  };
  seq = 0;
  onClickExcessRecoveryButton(seq) {
    (<any>$('#excessRecoveryReversal')).modal('show');
    this.seq = seq;
  }

  onSubmitExcessRecoveryReversal() {
    console.log('excess recovery service');
    console.log(this.excessRecoveryReversalForm.controls['cmnt'].value)
    this.spinner.show();
    this.accessRecoveryService.reverseExcessRecovery(this.seq, this.excessRecoveryReversalForm.controls['cmnt'].value).subscribe(temp => {
      this.spinner.hide();
      this.toaster.success('Reverted Sucessfully', 'Success')
      this.accessRecoveries = [];
      this.dataSource = new MatTableDataSource(this.accessRecoveries);
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
      this.filterValue = '';
      this.searchVal = '';
      this.lastPageIndex = 0;
      this.isCount = true;

      this.onSelectBranch();

      (<any>$('#excessRecoveryReversal')).modal('hide');
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.toaster.error("Something Went Wrong");
    })
  }

  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }
}
