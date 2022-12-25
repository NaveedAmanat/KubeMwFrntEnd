import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ExpenseService } from '../../../shared/services/expense.service';
import { Expense } from '../../../shared/models/expense.model';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import swal from 'sweetalert2';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],

})


export class ExpenseComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
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

  dataSource: any;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  role: any = this.auth.role;
  statusArray: any[];
  paymentArray: any[];
  expenseArray: any[];

  isCash: boolean;

  public expenses: Expense[];
  public addExpense: Expense = new Expense();
  public isEdit: Boolean = false;

  expenseForm: FormGroup;
  submitted = false;
  reverseForm: FormGroup;
  branchs: Branch[];
  disgardForm: FormGroup;
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  events: Event[] = [];

  
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  constructor(private toaster: ToastrService, private transfersService: TransfersService, private spinner: NgxSpinnerService, private changeDetectorRefs: ChangeDetectorRef, private paymentTypesService: PaymentTypesService, private recoveryService: RecoveryService, private formBuilder: FormBuilder, private expenseService: ExpenseService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.expenses = [];
    this.displayedColumns = ['expnsId', 'expnsDscr', 'expnsTypSeq', 'expnsAmt', 'instrNum', 'pymtTypSeq', 'crtdDt', 'pymtRctFlg', 'action'];
    this.expenseForm = this.formBuilder.group({
      pymtTypSeq: ['', Validators.required],
      expnsStsKey: [''],
      //expnsId: [''],
      expnsDscr: ['', [Validators.required, Validators.maxLength(100)]],
      instrNum: ['', Validators.required],
      expnsAmt: ['', Validators.required],
      expnsTypSeq: ['', Validators.required],
      pymtRctFlg: [1, Validators.required]
    });
    this.reverseForm = this.formBuilder.group({
      pymtTypSeq: [{ value: '', disabled: true }, Validators.required],
      expnsStsKey: [{ value: '', disabled: true }, Validators.required],
      //expnsId: [''],
      expnsDscr: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      instrNum: [{ value: '', disabled: true }, Validators.required],
      expnsAmt: ['', Validators.required],
      expnsTypSeq: [{ value: '', disabled: true }, Validators.required],
      pymtRctFlg: [{ value: '', disabled: true }, Validators.required]
    });
    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );
    // this.expenseService.getPaymentModes().subscribe((data) => {
    //   this.paymentArray = data;
    //   this.paymentArrayOrig = JSON.parse(JSON.stringify(data));
    //   console.log(this.paymentArrayOrig)
    //   console.log(this.paymentArray)
    // });


    // this.paymentTypesService.getAllTypes(5).subscribe((data) => {
    //   this.paymentArray  = data;
    // });

    if (this.auth.role == 'bm') {
      this.spinner.show();

      this.expenseService.getAllCatgoriesModes().subscribe((data) => {
        this.spinner.hide();
        this.expenseArray = data;
        console.log(this.expenseArray);

        this.expenseService.getPaymentModes().subscribe((data) => {
          this.paymentArray = data;
          this.paymentArrayOrig = JSON.parse(JSON.stringify(data));
          console.log(this.paymentArrayOrig)
          console.log(this.paymentArray)
        });
      });
    } else {
      this.toaster.info('Please Select Branch', 'Information')
      this.expenseArray = [];
      this.paymentArray = [];
      // this.expenseService.getAllCatgoriesModesByBranches(this.branchForm.controls['branch'].value).subscribe((data) => {
      //   this.expenseArray = data;
      //   console.log(this.expenseArray)
      // })
    }

    // if (this.auth.role == 'bm') {
    //   this.onBranchSelection = true;
    //   this.expenseService.getExpensesByBranchSeq(this.auth.emp_branch).subscribe(data => {
    //     this.expenses = data;
    //     this.dataSource = new MatTableDataSource(this.expenses);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });
    // }

    this.branchForm = this.formBuilder.group({
      branch: [this.auth.emp_branch],
    })
   
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        console.log(res)
      })
    } else {
      this.onSelectBranch();
    }

    this.disgardForm = this.formBuilder.group({
      expSeq: ['', Validators.required],
      rmrks: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z ]+$")]],
    });
  }

  get form() {
    return this.expenseForm.controls;
  }
  get df() {
    return this.disgardForm.controls;
  }

  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }
  onSelectCategory(e) {
    console.log(e.value)
    let cat = this.expenseForm.controls['expnsTypSeq'].value;
    console.log(cat)
    this.expenseArray.forEach(exp => {
      if (exp.typSeq == cat) {
        if (exp.typId == "0008") {
          this.isCash = false;
        }
      }
    });

  }

ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSelectBranch())
      )
      .subscribe();
  }

  onSelectBranch() {
    this.isCount = true;
    this.expenses = [];
    this.expenseArray = [];
    this.paymentArray = [];
    this.dataSource = new MatTableDataSource(this.expenses);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';
   
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.expenses = [];
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
      this.expenseService.getAllCatgoriesModesByBranches(this.branchForm.controls['branch'].value).subscribe((data) => {
        this.expenseService.getPaymentModesByBranches(this.branchForm.controls['branch'].value).subscribe((data2) => {
          this.expenseArray = data;
          this.paymentArray = data2;
          this.paymentArrayOrig = JSON.parse(JSON.stringify(data2));
        });
      })
    // } 
    if (this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = true;
      this.expenseArray = [];
    } else {
      this.onBranchSelection = false;
      this.expenseService.getExpensesByBranchSeq(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "",this.isCount).subscribe(data => {
        this.expenses = data.exp;
        this.spinner.hide();

        if (this.expenses.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };

        
        this.dataSource = new MatTableDataSource(this.expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; console.log('date', data.count) }, 200);
  
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = data.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;

      }, error =>{
        this.spinner.hide();
        console.log('err All Expense Service');
        console.log('err', error);
        });
    }
  }

  loadSelectBranch(){
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.expenseService.getExpensesByBranchSeq(this.branchForm.controls['branch'].value, 
      this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount). subscribe(data => {
        this.spinner.hide();
        this.expenses = data.exp;

        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.expenses);

        data.count = this.datalength; 
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);

        if (this.expenses.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        }
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
          this.spinner.hide();
          console.log('err All Expense Service');
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue:string){
    this.isCount = true;
    this.paginator.pageIndex = 0;

      this.spinner.show();
      this.expenseService.getExpensesByBranchSeq(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
        this.expenses = data.exp;
        this.spinner.hide();
        if (this.expenses.length <= 0  && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
  
        this.dataSource = new MatTableDataSource(this.expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
      }, error =>{
        this.spinner.hide();
        console.log('err All Expense Service');
        console.log('err', error);
        });
  }

  onAddNewClick() {
    this.expenseForm.reset();
    this.isEdit = false;
    this.addExpense = new Expense();
    this.expenseForm = this.formBuilder.group({
      pymtTypSeq: ['', Validators.required],
      expnsStsKey: [''],
      //expnsId: [''],
      expnsDscr: ['', [Validators.required, Validators.maxLength(100)]],
      instrNum: ['', Validators.required],
      expnsAmt: ['', Validators.required],
      expnsTypSeq: ['', Validators.required],
      pymtRctFlg: [1, Validators.required]
    });
    (<any>$('#businessector')).modal('show');
  }

  addExpensesSubmit() {
    if (this.expenseForm.invalid) {
      console.log(this.expenseForm.value)
      return;
    }

    console.log(this.auth.role == 'bm')
    let a;
    // if (this.auth.role == 'bm') {
    //   a = this.auth.emp_branch;
    //   console.log(a)
    // } else {
    a = this.branchForm.controls['branch'].value;
    // }

    console.log(a)
    if (a.length == 0) {
      this.toaster.error('Please Enter Branch')
    }
    
    this.addExpense.pymtTypSeq = this.expenseForm.value.pymtTypSeq;
    this.addExpense.brnchSeq = a;
    this.addExpense.expnsStsKey = this.expenseForm.value.expnsStsKey;
    //this.addExpense.expnsId= this.expenseForm.value.expnsId;
    this.addExpense.expnsDscr = this.expenseForm.value.expnsDscr;
    this.addExpense.instrNum = this.expenseForm.value.instrNum;
    this.addExpense.expnsAmt = this.expenseForm.value.expnsAmt;
    this.addExpense.expnsTypSeq = this.expenseForm.value.expnsTypSeq;
    this.addExpense.pymtRctFlg = this.expenseForm.value.pymtRctFlg;
    this.addExpense.expnsStsKey = 200;
    (<any>$('#businessector')).modal('hide');
    console.log(this.addExpense);
    if (this.isEdit) {
      this.expenseService.updateExpense(this.addExpense).subscribe(data => {
        this.addExpense = data;
        // this.expenseService.getExpenses(this.auth.role).subscribe(data => {
        //   this.expenses = data;
        //   this.dataSource = new MatTableDataSource(this.expenses);
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // });

        this.onSelectBranch();
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
    else {
      this.spinner.show();
      this.expenseService.addExpense(this.addExpense).subscribe(data => {
        this.addExpense = data;
        this.spinner.hide();
        // this.expenseService.getExpenses(this.auth.role).subscribe(data => {
        //   this.expenses = data;
        //   this.dataSource = new MatTableDataSource(this.expenses);
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // });

        this.onSelectBranch();
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

  onEdit(exp) {
    this.isEdit = true;
    this.expenseForm.patchValue(exp);
    this.addExpense = exp;
    (<any>$('#businessector')).modal('show');
  }

  onReverse(exp: Expense) {
    this.addExpense = null;
    this.addExpense = exp;
    (<any>$('#reverse')).modal('show');
    this.disgardForm.patchValue(this.addExpense);
  }

  onReverseSubmit() {
    this.addExpense.rmrks = this.disgardForm.get("rmrks").value;
    this.expenseService.reverseExpense(this.addExpense).subscribe(data => {
      // this.expenses.splice(this.expenses.indexOf(this.addExpense), 1);
      this.expenses = [];
      this.dataSource = new MatTableDataSource(this.expenses);
      this.paginator.pageIndex = 0;
      this.lastPageIndex = 0;
      this.dataSource.paginator = this.paginator;
      this.searchVal = '';
      this.filterValue = '';
      this.onSelectBranch();
      this.toaster.success("Expense Reversed", "Success")
      // this.dataSource = new MatTableDataSource(this.expenses);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
    this.addExpense = null;
    (<any>$('#reverse')).modal('hide');
    this.disgardForm.reset();
  }


  // onReverseSubmit() {
  //   this.submitted = true;
  //   (<any>$('#reverse')).modal('hide');
  //   if (this.reverseForm.invalid) {
  //     return;
  //   }
  //   this.addExpense.expnsAmt = this.reverseForm.value.expnsAmt;
  //   this.expenseService.reverseExpense(this.addExpense).subscribe(data => {
  //     this.addExpense = data;
  //   });
  // }
  onDelete(Expenses) {

    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Expense?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.expenseService.deleteExpense(Expenses).subscribe(data => {
          this.expenses.splice(this.expenses.indexOf(Expenses), 1);
          this.expenses = [];
          this.dataSource = new MatTableDataSource(this.expenses);
          this.paginator.pageIndex = 0;
          this.lastPageIndex = 0;
          this.dataSource.paginator = this.paginator;
          this.searchVal = '';
          this.filterValue = '';
          this.onSelectBranch();
          swal(
            'Deleted!',
            'Expense Deleted Successfully.',
            'success'
          );
        });
      }
    });

    console.log(Expenses);
  }
  findValueByKey(key) {
    let status = '';
    if (this.statusArray) {
      this.statusArray.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  findPaymentTypeKey(key) {
    let payment = '';
    if (this.paymentArray) {
      this.paymentArray.forEach(p => {
        if (p.typSeq === key) {
          payment = p.typStr;
        }
      });
    }
    return payment;
  }

  findExpenseTypeKey(key) {
    let expense = '';
    if (this.expenseArray) {
      this.expenseArray.forEach(e => {
        if (e.typSeq === key) {
          expense = e.typStr;
        }
      });
    }
    return expense;
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  onSelectChange() {
    let instrNum = this.expenseForm.get('instrNum');
    if (this.expenseForm.get('pymtTypSeq').value == 556) {
      this.isCash = true;
      let cat = this.expenseForm.controls['expnsTypSeq'].value;
      this.expenseArray.forEach(exp => {
        if (exp.typSeq == cat) {
          if (exp.typId == "0008") {
            this.isCash = false;
          }
        }
      });
      if (this.isCash)
        instrNum.clearValidators();
    } else {
      instrNum.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
      this.isCash = false;
    }
    instrNum.updateValueAndValidity();

  }

  getTypeIdOfExpenseType(seq) {
    let cd = '';
    this.expenseArray.forEach(obj => {
      if (obj.typSeq == seq) {
        cd = obj.typId
      }
    })
    return cd;
  }

  paymentArrayOrig;

  onSelectChange1(e) {
    console.log(e)
    console.log(this.getTypeIdOfExpenseType(this.expenseForm.controls['expnsTypSeq'].value))
    console.log(this.expenseArray)
    console.log(this.paymentArrayOrig)
    if (this.getTypeIdOfExpenseType(this.expenseForm.controls['expnsTypSeq'].value) == '0001' || this.getTypeIdOfExpenseType(this.expenseForm.controls['expnsTypSeq'].value) == '0008') {
      let i = -1;
      this.paymentArray.forEach((pym, index) => {
        if (pym.typId == this.getTypeIdOfExpenseType(this.expenseForm.controls['expnsTypSeq'].value)) {
          i = index;
        }
      })
      if (i > -1) {
        this.paymentArray.splice(i, 1)
      }
    } else {
      this.paymentArray = JSON.parse(JSON.stringify(this.paymentArrayOrig));
    }
  }

  printCash(trx: string) {
    this.recoveryService.getPostedReport(trx, 1).subscribe((response) => {
      let binaryData: any[] = [];
      console.log("response")
      console.log(response.byteLength)
      binaryData.push(response);
      if (response.byteLength > 0) {
        var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        window.open(fileURL, '_blank');
      }
    });
  }

  refreshExpense() {
    this.isCount = true;
    this.spinner.show();
    this.expenseService.getExpensesByBranchSeq(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.spinner.hide();
      this.expenses = data.exp;
      this.dataSource = new MatTableDataSource(this.expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
  
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = data.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
    });
  }
}
