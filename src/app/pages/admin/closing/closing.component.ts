//import { DatePipe } from '@angular/common'
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RecoveryClosingDto } from '../../../shared/models/recovery-closing-dto.model';
import { RecoveryClosingService } from '../../../shared/services/recovery-closing.service';
import { DisbursementClosingDto } from '../../../shared/models/disbursement-closing-dto.model';
import { ToastrService } from 'ngx-toastr';
import { DisbursementService } from '../../../shared/services/disbursement.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AdjustPayment, Recovery } from '../../../shared/models/recovery.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RecoveryService } from '../../../shared/services/recovery.service';
import { ExpenseClosingDto } from '../../../shared/models/expense-closing-dto.model';
import { InsuranceClaimClosingDto } from '../../../shared/models/insurance-claim-closing-dto.model';
import { DatePipe } from '@angular/common'
import swal from 'sweetalert2';
import { Expense } from 'src/app/shared/models/expense.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
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
@Component({
  selector: 'app-closing',
  templateUrl: './closing.component.html',
  styleUrls: ['./closing.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ClosingComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  disbTxCounter: number = 0;
  recoveryTxCounter: number = 0;
  expenseTxCounter: number = 0;
  insuranceClaimTxCounter: number = 0;

  disbAmountCalculator: number = 0;
  recoveryAmountCalculator: number = 0;
  expenseAmountCalculator: number = 0;
  insuranceClaimAmountCalculator: number = 0;

  recoveryCheck: boolean = false;
  disbursementCheck: boolean = false;
  expenseCheck: boolean = false;
  insuranceClaimCheck: boolean = false;

  allRecoveries: RecoveryClosingDto[] = [];
  allDisbursements: DisbursementClosingDto[] = [];
  allExpenses: ExpenseClosingDto[] = [];
  allInsuranceClaims: InsuranceClaimClosingDto[] = [];

  allRecoveriesToPost: RecoveryClosingDto[] = [];
  allDisbursementsToPost: DisbursementClosingDto[] = [];
  allExpensesToPost: ExpenseClosingDto[] = [];
  allInsuranceClaimsToPost: InsuranceClaimClosingDto[] = [];

  disbursementClosingDto: DisbursementClosingDto;
  recoveryClosingDto: RecoveryClosingDto;
  expenseClosingDto: ExpenseClosingDto;
  insuranceClaimClosingDto: InsuranceClaimClosingDto;

  adjustPayment: FormGroup;
  expenseForm: FormGroup;
  private disbursment: FormGroup;
  tempInstituteArray: any[] = [];
  minDate: Date;
  maxDate: Date;
  paymentArray: any[];
  expenseArray: any[];

  public expenses: Expense[];
  public closing = (sessionStorage.getItem("closing")=="true")? true: false;

  constructor(
    private recoveryService: RecoveryService,private changeDetectorRefs: ChangeDetectorRef,
    private recoveryClosingService: RecoveryClosingService,
    private toaster: ToastrService,
    private disbursementService: DisbursementService,
    private expenseService: ExpenseService,
    private paymentTypesService: PaymentTypesService,
    private router: Router,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {
    this.disbursment = this.fb.group({
      disbursed: []
    });
    this.expenseForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      expnsStsKey: [''],
      //expnsId: [''],
      expnsDscr: ['', Validators.required],
      instrNum: ['', Validators.required],
      expnsAmt: ['', Validators.required],
      expnsTypSeq: ['', Validators.required],
      pymtRctFlg: [1, Validators.required]
    });

  }
  ngOnInit() {
    this.spinner.show();
    this.refreshExpense();
    this.refreshRecovery();
    this.refreshDisbursment();
    // this.spinner.hide();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.maxDate.getDate() - 30);
    this.recoveryService.getRecoveryTypes().subscribe((data => {
      this.tempInstituteArray = data;
    }));
    this.adjustPayment = this.fb.group({
      loanId: [{ value: '', disabled: true }, Validators.required],
      clientNm: [{ value: '', disabled: true }, Validators.required],
      clntId: [{ value: '', disabled: true }, Validators.required],
      rcvryTypsSeq: ['', Validators.required],
      instr: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      adjPymtDt: [{ value: '', disabled: true }, Validators.required],
      pymtAmt: ['', Validators.required],
      trxId: [''],
      post: [''],
    });


     this.expenseService.getPaymentModes().subscribe((data) => {
      this.paymentArray = data;
    });

    this.expenseService.getAllCatgoriesModes().subscribe((data) => {
      this.expenseArray = data;
    });

    let load = 0;

    this.recoveryClosingService.getRecoveryClosing().subscribe(data => {
      this.allRecoveries = data;
      this.dataSourceRecovery = new MatTableDataSource(this.allRecoveries);
      this.dataSourceRecovery.paginator = this.paginator;
      this.dataSourceRecovery.sort = this.sort;
      this.recoveryTxCounter = this.allRecoveries.length;
      this.allRecoveries.forEach(element => {
        this.recoveryAmountCalculator += parseInt(element.amount);
      });
      load = load+1;
      if(load==3){
        this.spinner.hide();
      }
    });
    this.recoveryClosingService.getDisbursementClosing().subscribe(data => {
      this.allDisbursements = data;
      this.dataSourceDisbursment = new MatTableDataSource(this.allDisbursements);
      this.dataSourceDisbursment.paginator = this.paginator;
      this.dataSourceDisbursment.sort = this.sort;

      this.disbTxCounter = this.allDisbursements.length;
      this.allDisbursements.forEach(element => {
        this.disbAmountCalculator = this.disbAmountCalculator + parseInt(element.amount);
      });
      load = load+1;
      if(load==3){
        this.spinner.hide();
      }
    });

    this.recoveryClosingService.getExpenseClosing().subscribe(data => {
      this.allExpenses = data;
      this.dataSource = new MatTableDataSource(this.allExpenses);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.expenseTxCounter = this.allExpenses.length;
      this.allExpenses.forEach(element => {
        this.expenseAmountCalculator += parseInt(element.amount);
      });
      load = load+1;
      if(load==3){
        this.spinner.hide();
      }
    });

    // this.recoveryClosingService.getInsuranceClaimClosing().subscribe(data => {
    //   this.allInsuranceClaims = data;
    //   this.insuranceClaimTxCounter = this.allInsuranceClaims.length;
    //   this.allInsuranceClaims.forEach(element => {
    //     this.insuranceClaimAmountCalculator += parseInt(element.claimAmount);
    //   });
    // });


  }

  getCodeForPaymentType(seq){
    let p = "";
    this.paymentArray.forEach(type=>{
      if(type.typSeq == seq){
        p= type.typId;
      }
    })
    return p;
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate([''], {replaceUrl: true}).then(() => {
      window.location.reload();
    });;
  }

  get form() {
    return this.expenseForm.controls;
  }
  submitDisbursment() {

    //console.log(this.disbursment.value);
  }


  // get fadjustPayment() {
  //   return this.adjustPayment.controls;
  // }

  addDisbursements(event) {
    if (this.disbursementCheck == true) {

      this.allDisbursements.forEach(element => {
        if (element.status != "Active") {
          this.allDisbursementsToPost.push(element);
        }
      });
    }
    else if (this.disbursementCheck == false) {
      this.allDisbursementsToPost = [];
    }

    console.log(this.allDisbursementsToPost);
  }

  addRecoveries(event) {
    if (this.recoveryCheck == true) {

      this.allRecoveries.forEach(element => {
        if (element.status != "Posted") {
          this.allRecoveriesToPost.push(element);
        }
      });
    }
    else if (this.recoveryCheck == false) {
      this.allRecoveriesToPost = [];
    }

    console.log(this.allRecoveriesToPost);
  }


  addExpenses(event) {
    if (this.expenseCheck == true) {

      this.allExpenses.forEach(element => {
        if (element.status != "Posted") {
          this.allExpensesToPost.push(element);
        }
      });
    }
    else if (this.expenseCheck == false) {
      this.allExpensesToPost = [];
    }

    console.log(this.allExpensesToPost);
  }

  addInsuranceClaims(event) {
    if (this.insuranceClaimCheck == true) {

      this.allInsuranceClaims.forEach(element => {
        if (element.status != "Posted") {
          this.allInsuranceClaimsToPost.push(element);
        }
      });
    }
    else if (this.insuranceClaimCheck == false) {
      this.allInsuranceClaimsToPost = [];
    }

    console.log(this.allInsuranceClaimsToPost);
  }
  // refresh()
  // {
  //   this.recoveryClosingService.getRecoveryClosing().subscribe(data => {this.allRecoveries = data});
  //   this.recoveryClosingService.getDisbursementClosing().subscribe(data => {this.allDisbursements = data;});
  //   this.recoveryClosingService.getExpenseClosing().subscribe(data => {this.allExpenses = data;});  
  //   this.recoveryClosingService.getInsuranceClaimClosing().subscribe(data => {this.allInsuranceClaims = data;});  
  // }
  postSingleRecovery(temp: RecoveryClosingDto) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post this Recovery?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.recoveryClosingService.postSingleRecovery(temp).subscribe(data => {
          this.postedReport(temp.txId,0);
          if (this.allRecoveries.indexOf(temp) !== -1) {
            this.allRecoveries.splice(this.allRecoveries.indexOf(temp), 1);
          }
          this.refreshRecovery();
          this.toaster.success("Recovery Posted Successfully");
          swal(
            'Posted!',
            'Recovery has been posted.',
            'success'
          );
        }, error => {
          this.toaster.error( error.error.error,"Error")
          console.log('There was an error: ', error)
        });
      }
    });
  }

  F(temp: DisbursementClosingDto) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post this Disbursement?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.recoveryClosingService.postSingleDisbursement(temp).subscribe(data => {
          if (this.allDisbursements.indexOf(temp) !== -1) {
            this.allDisbursements.splice(this.allDisbursements.indexOf(temp), 1);
          }
          this.refreshDisbursment();
          this.toaster.success("Disbursement Posted Successfully");
          swal(
            'Posted!',
            'Disbursement has been posted.',
            'success'
          );
        }, error => {
          this.toaster.error(error.error.error,"Error")
          console.log('There was an error: ', error)
        });
      }
    });

  }
  getCodeFromExpenseType(seq){
    let p = "";
    this.expenseArray.forEach(type=>{
      if(type.typSeq == seq){
        p= type.typId;
      }
    })
    return p;
  }
  postSingleExpense(temp: ExpenseClosingDto) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post this Expense?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.recoveryClosingService.postSingleExpense(temp).subscribe(data => {
          console.log(data);
          console.log(this.allExpenses.splice(this.allExpenses.indexOf(temp), 1));
          // Zohaib Asim - Dated 3-11-2021 - Sanction List Phase 2
          // Conditions Modified
          if (data.expSeq == -1 ){
            this.toaster.warning("NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.");
          }else if(data.expSeq == 0){
            this.toaster.warning("Expense Not Posted");
          } else{
            if(temp.flg=='2' && this.getCodeForPaymentType(temp['mode']) == "0001"){
              this.postedReport(data.expSeq,1);
            }
            if(temp.flg=='1' && this.getCodeFromExpenseType(temp['catogory']) == "0424"){
              this.postedReport(data.expSeq,1);
            }
            //Added by Areeba - Disability 
            if(temp.flg=='1' && this.getCodeFromExpenseType(temp['catogory']) == "0423"){
              this.spinner.show();
              this.recoveryService.getSingleRecoveryForDisability(temp.txId).subscribe((data) => {
              this.spinner.hide();
              this.recoveryService.getPostedReport(data.rcvryTrxSeq, 4).subscribe((response) => {
                var binaryData = [];
                binaryData.push(response);
                var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
                window.open(fileURL, '_blank');
              });
              })
            }
            //Ended by Areeba
            if (this.allExpenses.indexOf(temp) != -1) {
              this.allExpenses.splice(this.allExpenses.indexOf(temp), 2);
            }  
            this.toaster.success("Expense Posted Successfully");
            swal(
              'Posted!',
              'Expense has been posted.',
              'success'
            );       
          }
          this.refreshExpense();
        }, error => {
          this.toaster.error(error.error.error,"Error")
          console.log('There was an error: ', error)
        });
      }
    });

  }

  postedReport(trx: string,type:number) {
    this.recoveryService.getPostedReport(trx, type).subscribe((response) => {
      let binaryData : any[]=[];
      console.log("response")
      console.log(response.byteLength)
      binaryData.push(response);
      if(response.byteLength>0){
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
     }
    });
  }


  postSingleInsuranceClaim(temp: InsuranceClaimClosingDto) {
    this.recoveryClosingService.postSingleInsuranceClaim(temp).subscribe(data => {
      //this.refresh();
      this.toaster.success("Insurance Claim Posted Successfully");
    });
  }


  postMultiple() {
    this.spinner.show();
    if (this.disbursementCheck == true) {
      this.postMultipleDisbursements();
    }
    if (this.recoveryCheck == true) {
      this.postMultipleRecoveries();
    }
    if (this.expenseCheck == true) {
      this.postMultipleExpenses();
    }
    this.recoveryClosingService.closeBranch(JSON.parse(sessionStorage.getItem("auth")).emp_branch).subscribe(d => {
      let auth = JSON.parse(sessionStorage.getItem("auth"));
      auth.modules = d.body;
      auth.brnchOpnDt = new Date();
      sessionStorage.setItem("auth", JSON.stringify(auth));
      this.router.navigate(['dashboard/bm']);
      this.spinner.hide();
      this.closing = false;
      sessionStorage.setItem("closing","true"); 
    }, error => {
      this.toaster.error("Branch Already Closed");
      this.spinner.hide();
    });
  }
  postMultipleDisbursements() {
    this.allDisbursementsToPost.forEach(element => {
      this.recoveryClosingService.postSingleDisbursement(element).subscribe(data => {
      });
    });
  }
  postSingleDisbursement(element){
    console.log( 'postSingleDisbursement:', element);

    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post this Disbursement?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.recoveryClosingService.postSingleDisbursement(element).subscribe(data => {
          console.log(data);
          console.log(this.allDisbursements.splice(this.allExpenses.indexOf(element), 1))
          if (this.allDisbursements.indexOf(element) != -1) {
            this.allDisbursements.splice(this.allDisbursements.indexOf(element), 1);
          }
          this.refreshDisbursment();
          
          // Added by Zohaib Asim - Dated 05-10-2021 - CR: KFK Product
          // Health Insurance not included in KFK
          let prdSeqFlg = false;
          if (data['prdSeq'] == 41 || data['prdSeq'] == 42 || data['prdSeq'] == 43) {
            prdSeqFlg = true;
          }          
          if (prdSeqFlg == false){
            // Added by Zohaib Asim - Dated 24-12-2020
            // CR: KSZB Claims
            this.recoveryClosingService.getHealthCardPdf(element).subscribe((response) => {
              var binaryData = [];
              binaryData.push(response);
              var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
              window.open(fileURL, '_blank');
            });
          }            
          // End by Zohaib Asim
          this.toaster.success("Expense Posted Successfully");
          swal(
            'Posted!',
            'Expense has been posted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });
    
  }
  postMultipleRecoveries() {
    this.allRecoveriesToPost.forEach(element => {
      this.recoveryClosingService.postSingleRecovery(element).subscribe(data => {
      });
    });
  }
  postMultipleExpenses() {
    this.allExpensesToPost.forEach(element => {
      this.recoveryClosingService.postSingleExpense(element).subscribe(data => {
      });
    });
  }

  onEditDisbursement(loanAppSeq: number) {
    this.disbursementService.loanAppSeq = loanAppSeq;
    sessionStorage.setItem('loanAppSeq', loanAppSeq.toString());
    this.router.navigate(['disbursement/voucher']);
  }
  get af() {
    return this.adjustPayment.controls;
  }

  openAdjustPayment(recoveryClosingDto: RecoveryClosingDto) {
    this.recoveryClosingDto = recoveryClosingDto;
    this.adjustPayment.reset();
    console.log(recoveryClosingDto);
    (<any>$('#AdjustPayment')).modal('show');
    this.adjustPayment.patchValue({
      loanId: recoveryClosingDto.loanId,
      clientNm: recoveryClosingDto.clientName,
      clntId: recoveryClosingDto.clientId,
      trxId: recoveryClosingDto.txId,
      rcvryTypsSeq: +recoveryClosingDto.recoveryTypeSeq,
      instr: recoveryClosingDto.instrument,
      adjPymtDt: new Date(recoveryClosingDto.paymentDate),
      pymtAmt: recoveryClosingDto.amount
    });
  }
  onAdjustPaymentSubmit() {
    const result = this.adjustPayment.value;
    console.log(result);
    (<any>$('#AdjustPayment')).modal('hide');
    this.recoveryService.adjustPayment(result).subscribe(d => {
      this.recoveryClosingDto.recoveryTypeSeq = result.rcvryTypsSeq;
      this.recoveryClosingDto.instrument = result.instr;
      this.recoveryClosingDto.amount = result.pymtAmt;
    });
  }
  onEditExpenses(exp) {
    (<any>$('#businessector')).modal('show');
    this.addExpense.expSeq = +exp.expenseId;
    this.expenseForm = this.fb.group({
      pymtTypSeq: [exp.mode, Validators.required],
      expnsStsKey: [''],
      //expnsId: [exp.expenseId],
      expnsDscr: [exp.description, Validators.required],
      instrNum: [exp.instrumentNum, Validators.required],
      expnsAmt: [exp.amount, Validators.required],
      expnsTypSeq: [exp.catogory, Validators.required],
      pymtRctFlg: [exp.flg == "" ? +1 : +exp.flg, Validators.required]
    });
  }
  public addExpense: Expense = new Expense();
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));

  addExpensesSubmit() {
    if (this.expenseForm.invalid) {
      return;
    }
    this.addExpense.pymtTypSeq = this.expenseForm.value.pymtTypSeq;
    this.addExpense.brnchSeq = this.auth.emp_branch;
    this.addExpense.expnsStsKey = this.expenseForm.value.expnsStsKey;
    this.addExpense.expnsDscr = this.expenseForm.value.expnsDscr;
    this.addExpense.instrNum = this.expenseForm.value.instrNum;
    this.addExpense.expnsAmt = this.expenseForm.value.expnsAmt;
    this.addExpense.expnsTypSeq = this.expenseForm.value.expnsTypSeq;
    this.addExpense.pymtRctFlg = this.expenseForm.value.pymtRctFlg;
    this.addExpense.expnsStsKey = 200;

    (<any>$('#businessector')).modal('hide');
    this.expenseService.updateExpense(this.addExpense).subscribe(data => {
      this.addExpense = data;
      this.recoveryClosingService.getExpenseClosing().subscribe(data => {
        this.allExpenses = data;
        this.expenseTxCounter = this.allExpenses.length;
        this.allExpenses.forEach(element => {
          this.expenseAmountCalculator += parseInt(element.amount);
        });
      });
    });
  }



  onItDelete(Expenses, i) {

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
        this.expenseService.deleteItExpense(Expenses).subscribe(data => {
          console.log(data);
          this.expenseService.getItExpenses(this.auth.user.role).subscribe(data => {
            this.expenses = data;
            this.allExpenses.splice(i, 1);
          });
          this.refreshExpense();
        });
      }
    });

    console.log(Expenses);
  }


  // EXPENSES

  displayedColumns: string[] = [ 'txId', 'expenseId', 'description', 'expenseType', 'instrumentNum', 'amount', 'status', 'action'];
  dataSource = new MatTableDataSource<ExpenseClosingDto>(this.allExpenses);
  selection = new SelectionModel<ExpenseClosingDto>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ExpenseClosingDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.expenseId + 1}`;
  }

  //RECOVERY


  displayedColumnsRecovery: string[] = [ 'txId', 'clientId', 'clientName', 'product', 'loanId', 'paymentMode', 'instrument', 'amount', 'status', 'action'];
  dataSourceRecovery = new MatTableDataSource<RecoveryClosingDto>(this.allRecoveries);
  selectionRecovery = new SelectionModel<RecoveryClosingDto>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedRecoveries() {
    const numSelected = this.selectionRecovery.selected.length;
    const numRows = this.dataSourceRecovery.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleRecoveries() {
    this.isAllSelectedRecoveries() ?
      this.selectionRecovery.clear() :
      this.dataSourceRecovery.data.forEach(row => this.selectionRecovery.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelRecoveries(row?: RecoveryClosingDto): string {
    if (!row) {
      return `${this.isAllSelectedRecoveries() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionRecovery.isSelected(row) ? 'deselect' : 'select'} row ${row.clientId + 1}`;
  }


  //Disbursment


  displayedColumnsDisbursment: string[] = [ 'txId', 'clientId', 'clientName', 'product', 'voucherDate', 'paymentMode', 'amount', 'status', 'action'];
  dataSourceDisbursment = new MatTableDataSource<DisbursementClosingDto>(this.allDisbursements);
  selectionDisbursment = new SelectionModel<DisbursementClosingDto>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedDisbursment() {
    const numSelected = this.selectionDisbursment.selected.length;
    const numRows = this.dataSourceDisbursment.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleDisbursment() {
    this.isAllSelectedDisbursment() ?
      this.selectionDisbursment.clear() :
      this.dataSourceDisbursment.data.forEach(row => this.selectionDisbursment.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelDisbursment(row?: DisbursementClosingDto): string {
    if (!row) {
      return `${this.isAllSelectedDisbursment() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionDisbursment.isSelected(row) ? 'deselect' : 'select'} row ${row.clientId + 1}`;
  }

  refreshExpense() {
    this.recoveryClosingService.getExpenseClosing().subscribe((data) => {
      this.allExpenses = data;
      this.dataSource = new MatTableDataSource(this.allExpenses);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    });
  }

  
  refreshRecovery() {
    this.recoveryClosingService.getRecoveryClosing().subscribe(data => {
      this.allRecoveries = data;
      this.dataSourceRecovery = new MatTableDataSource(this.allRecoveries);
      this.dataSourceRecovery.paginator = this.paginator;
      this.dataSourceRecovery.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    });
  }

  refreshDisbursment(){
    this.recoveryClosingService.getDisbursementClosing().subscribe(data => {
      this.allDisbursements = data;
      this.dataSourceDisbursment = new MatTableDataSource(this.allDisbursements);
      this.dataSourceDisbursment.paginator = this.paginator;
      this.dataSourceDisbursment.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    });
  }
  


  closingMods =   [ {
    "modSeq" : 1,
    "modNm" : "Home",
    "modCmnts" : "Dashboard",
    "modUrl" : "dashboard/bm",
    "subMods" : [ {
      "sbModSeq" : 2,
      "modSeq" : 1,
      "subModNm" : "BM Landing",
      "subModUrl" : null,
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    } ]
  },{
    "modSeq" : 9,
    "modNm" : "Process Application",
    "modCmnts" : "BM LO",
    "modUrl" : "loan-origination",
    "subMods" : [ {
      "sbModSeq" : 3,
      "modSeq" : 9,
      "subModNm" : "Process Application",
      "subModUrl" : null,
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    } ]
  },{
    "modSeq" : 5,
    "modNm" : "Reports",
    "modCmnts" : "reports",
    "modUrl" : "reports",
    "subMods" : [ {
      "sbModSeq" : 7,
      "modSeq" : 5,
      "subModNm" : "Overdue Credit",
      "subModUrl" : "/overdue",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 8,
      "modSeq" : 5,
      "subModNm" : "Portfolio Monitoring",
      "subModUrl" : "/portfolio",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 11,
      "modSeq" : 5,
      "subModNm" : "Funds Report",
      "subModUrl" : "/funds-report",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 41,
      "modSeq" : 5,
      "subModNm" : "Client Wise Disbursement ",
      "subModUrl" : "/finance/organization-tagging-report",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 40,
      "modSeq" : 5,
      "subModNm" : "EMP Remittance Ratio",
      "subModUrl" : "/finance/fund-managment-tool",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 42,
      "modSeq" : 5,
      "subModNm" : "Product Wise Disbursement",
      "subModUrl" : "/finance/product-wise-disbursement",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 43,
      "modSeq" : 5,
      "subModNm" : "Validation Report",
      "subModUrl" : "/validation",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 44,
      "modSeq" : 5,
      "subModNm" : "Account Ledger",
      "subModUrl" : "/accounts-ledger",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 45,
      "modSeq" : 5,
      "subModNm" : "BB/CB Details",
      "subModUrl" : "/book-details",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 46,
      "modSeq" : 5,
      "subModNm" : "Due Recovery",
      "subModUrl" : "/due-recovery",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 47,
      "modSeq" : 5,
      "subModNm" : "Client Health Beneficiary",
      "subModUrl" : "/client-health-beneficiary",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 48,
      "modSeq" : 5,
      "subModNm" : "Branch Turnover Analysis 1",
      "subModUrl" : "/brnch-turnover-anlysis",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 49,
      "modSeq" : 5,
      "subModNm" : "Insurance Claim",
      "subModUrl" : "/insurance-claim",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 50,
      "modSeq" : 5,
      "subModNm" : "PAR Branch Wise",
      "subModUrl" : "/par-branch-wise",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 51,
      "modSeq" : 5,
      "subModNm" : "5 Days Advance Recovery Trends",
      "subModUrl" : "/five-days-advance-recovery",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 52,
      "modSeq" : 5,
      "subModNm" : "Top Sheet",
      "subModUrl" : "/top-sheet",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 53,
      "modSeq" : 5,
      "subModNm" : "Projected Clients Loan Completion",
      "subModUrl" : "/projected-clients-loan-completeion",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 54,
      "modSeq" : 5,
      "subModNm" : "ADCs and Branch Wise Recovery",
      "subModUrl" : "/adc-wise-branch-recovery",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 55,
      "modSeq" : 5,
      "subModNm" : "Pending Clients",
      "subModUrl" : "/pending-clients",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 56,
      "modSeq" : 5,
      "subModNm" : "Tagged Overdue Clients Detail",
      "subModUrl" : "/tagged-client-claim",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 57,
      "modSeq" : 5,
      "subModNm" : "Transferred Clients",
      "subModUrl" : "/transferred-clients",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 58,
      "modSeq" : 5,
      "subModNm" : "Consolidated Loan",
      "subModUrl" : "/operations/consolidated-loans",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 59,
      "modSeq" : 5,
      "subModNm" : "Portfolio Segmentation",
      "subModUrl" : "/operations/op-portfolio-segmentation",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 60,
      "modSeq" : 5,
      "subModNm" : "Portfolio At Risk",
      "subModUrl" : "/operations/op-portfolio-at-risk",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 61,
      "modSeq" : 5,
      "subModNm" : "Risk Flagging",
      "subModUrl" : "/operations/app-risk-flagging",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 62,
      "modSeq" : 5,
      "subModNm" : "Turn Around Time",
      "subModUrl" : "/turn-around-time",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 63,
      "modSeq" : 5,
      "subModNm" : "Female Participation",
      "subModUrl" : "/female-participation",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 64,
      "modSeq" : 5,
      "subModNm" : "Portfolio Status",
      "subModUrl" : "/operations/op-portfolio-status",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 65,
      "modSeq" : 5,
      "subModNm" : "Rate Of Renewal",
      "subModUrl" : "/operations/rate-of-renewal",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 66,
      "modSeq" : 5,
      "subModNm" : "Monthly Status",
      "subModUrl" : "/operations/monthly-status",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 67,
      "modSeq" : 5,
      "subModNm" : "Credit Utilization",
      "subModUrl" : "/operations/loan-utlization",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 68,
      "modSeq" : 5,
      "subModNm" : "Portfolio At Risk Time Series",
      "subModUrl" : "/operations/opp-portfolio-at-risk-time-series",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 69,
      "modSeq" : 5,
      "subModNm" : "Female Participation Ratio",
      "subModUrl" : "/operations/op-female-participation-ratio",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 70,
      "modSeq" : 5,
      "subModNm" : "Branch Target Managment ",
      "subModUrl" : "/operations/branch-target-managment",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 71,
      "modSeq" : 5,
      "subModNm" : "Portfolio Status Duration",
      "subModUrl" : "/operations/oop-portfolio-status-duration",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 72,
      "modSeq" : 5,
      "subModNm" : "Recovery\n  Report",
      "subModUrl" : "/finance/recovery-report",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 73,
      "modSeq" : 5,
      "subModNm" : "Disbursement Report ",
      "subModUrl" : "finance/disbursment-report",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 74,
      "modSeq" : 5,
      "subModNm" : "E & P Remittance Ratio",
      "subModUrl" : "/finance/fund-managment-tool",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 75,
      "modSeq" : 5,
      "subModNm" : "Client wise Disbursment ",
      "subModUrl" : "/finance/organization-tagging-report",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 76,
      "modSeq" : 5,
      "subModNm" : "Product Wise Disbursement",
      "subModUrl" : "/finance/product-wise-disbursement",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 77,
      "modSeq" : 5,
      "subModNm" : "Date Wise Disbursement",
      "subModUrl" : "/finance/organization-time",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 80,
      "modSeq" : 5,
      "subModNm" : "Trail Balance",
      "subModUrl" : "/trail-balance",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 79,
      "modSeq" : 5,
      "subModNm" : "Reversal Entries",
      "subModUrl" : "/reversed-enteries",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    }, {
      "sbModSeq" : 9,
      "modSeq" : 5,
      "subModNm" : "Funds Statement",
      "subModUrl" : "/fund-stmnt",
      "readFlg" : true,
      "writeFlg" : true,
      "delFlg" : true
    } ]
  }

];

}
