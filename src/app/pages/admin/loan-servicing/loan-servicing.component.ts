import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanServicingService, LoanServicing } from 'src/app/shared/services/loan-servicing.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { PaymentType } from 'src/app/shared/models/paymentType.model';
import { Expense } from 'src/app/shared/models/expense.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { TagsService } from 'src/app/shared/services/tags.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RecoveryClosingService } from 'src/app/shared/services/recovery-closing.service';
import { Router } from '@angular/router';

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
  selector: 'app-loan-servicing',
  templateUrl: './loan-servicing.component.html',
  styleUrls: ['./loan-servicing.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LoanServicingComponent implements OnInit {

  auth = JSON.parse(sessionStorage.getItem("auth"))
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
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
      console.log(this.datalength, this.countBeforeFilter);
      return;
    }
  }

  allClnt: any[];
  deathForm: FormGroup;
  reScheduleForm: FormGroup;
  adjustLoanForm: FormGroup;
  funralForm: FormGroup;
  isCash: boolean = false;
  tempInstituteArray: any[] = [];
  expenseTyp: string;
  temp: PaymentType;
  exp: Expense;
  ls: LoanServicing;
  client: LoanServicing;
  minDate: Date;
  maxDate: Date;
  reverseForm: FormGroup;

  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  //Added by Areeba
  disabilityForm: FormGroup;
  receivableForm: FormGroup;
  reverseDisabilityForm: FormGroup;
  tempInstituteArrayDsblty: any[] = [];
  //Ended by Areeba

  // Zohaib Asim - Dated 28-09-2022
  expenses: Expense[] = [];

  constructor(
    private loanServicingService: LoanServicingService,
    private fb: FormBuilder,
    private recoveryService: RecoveryService,
    private paymentTypesService: PaymentTypesService,
    private recoveryClosingService: RecoveryClosingService,
    private reportsService: ReportsService,
    private expenseService: ExpenseService,
    private tagsService: TagsService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService) {

    this.deathForm = this.fb.group({
      clntId: [''],
      clntSeq: ['', Validators.required],
      clntNm: [''],
      loanAmt: [''],
      gender: ['', Validators.required],
      deathDt: ['', Validators.required],
      dethCase: ['', Validators.required],
      deathcertf: ['', Validators.required],
      prntLoanAppSeq: ['', Validators.required]
    });
    this.funralForm = this.fb.group({
      clntId: [''],
      dthRptSeq: ['', Validators.required],
      clntNm: [''],
      amt: [''],
      rcvblAmt: [''],
      rcvryTypsSeq: ['', Validators.required],
      instr: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
    });
    this.reScheduleForm = this.fb.group({
      clntId: ['', Validators.required],
      clntSeq: ['', Validators.required],
      clntNm: ['', Validators.required],
      loanAmt: ['', Validators.required],
      days: ['', Validators.required]
    });
    this.adjustLoanForm = this.fb.group({
      clntId: ['', Validators.required],
      clntSeq: ['', Validators.required],
      clntNm: ['', Validators.required],
      loanAmt: ['', Validators.required],
    });

    //Added by Areeba
    this.disabilityForm = this.fb.group({
      clntId: [''],
      clntSeq: ['', Validators.required],
      clntNm: [''],
      loanAmt: [''],
      gender: ['', Validators.required],
      dtOfDsblty: ['', Validators.required],
      cmnt: [''],
      prntLoanAppSeq: ['', Validators.required]
    });
    this.receivableForm = this.fb.group({
      dsbltyRptSeq: ['', Validators.required],
      clntId: [''],
      clntNm: [''],
      receivableAmt: [''],
      rcvryTypsSeq: ['', Validators.required]
    });
    //Ended by Areeba
  }
  brnchs = [];
  branchForm: FormGroup;
  ngOnInit() {
    this.displayedColumns = ['clntId', 'frstNm', 'prd', 'loanAmt', 'sercvChrgs', 'rcvdAmt', 'remainingamount', 'status', 'action'];
    this.temp = new PaymentType();
    this.temp.typId = '0424';
    this.temp.typCtgryKey = 2;

    this.expenseService.getPaymentModes().subscribe((data) => {
      this.tempInstituteArray = data;
    });
    //Added by Areeba
    this.expenseService.getPaymentModeCashOnly().subscribe((data) => {
      this.tempInstituteArrayDsblty = data;
    });
    //Ended by Areeba
    this.temp.brnchSeq = 0;
    this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;
      });


    this.reverseForm = this.fb.group({
      dthRptSeq: ['', Validators.required],
      //Modified by Areeba
      dsbltyRptSeq: ['', Validators.required],
      cmnt: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z ]+$")]],
    });

    this.tagsService.getTags().subscribe(res => {
      this.tags = res;
      if (this.auth.role != 'admin') {
        for (let tg of this.tags) {
          if (tg.tagId === '0005') {
            this.tags.splice(this.tags.indexOf(tg), 1);
            break;
          }
        }
      }
    })

    this.commonService.getValues("0278").subscribe((res) => {
      this.causeOfDeath = res;
    }, (error) => {
      console.log('err', error);
    });
    this.branchForm = this.fb.group({
      branch: this.auth.emp_branch,
    });
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')

      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.brnchs = res;
        console.log(res)
      })
    } else {
      this.loadData();
    }
  }
  onSelectBranch() {
    this.loadData();
  }



  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSelectBranch())
      )
      .subscribe();
  }


  loadData() {
    this.isCount = true;
    this.allClnt = [];
    this.dataSource = new MatTableDataSource(this.allClnt);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.lastPageIndex = 0;
    this.filterValue = '';
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.allClnt = [];
      this.dataSource = null;
      this.datalength = 0;
      return;
    }
    setTimeout(() => { this.spinner.show() }, 10);
    this.loanServicingService.getAllClnts(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "", this.isCount).subscribe((response) => {
      this.allClnt = response.clnts;
      this.spinner.hide()
      if (this.allClnt.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allClnt);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = response.count;

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
      console.log('err All Clnts Service');
      console.log('err', error);
    });

  }


  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    setTimeout(() => { this.spinner.show() }, 10);
    this.loanServicingService.getAllClnts(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe((response) => {
      this.allClnt = response.clnts;
      this.spinner.hide();

      if (this.allClnt.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allClnt);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = response.count;
    }, error => {
      this.spinner.hide();
      console.log('err All Clnts Service');
      console.log('err', error);
    });
  }

  loadSelectBranch() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      setTimeout(() => { this.spinner.show() }, 10);
      this.loanServicingService.getAllClnts(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe((response) => {

        this.allClnt = response.clnts;
        this.spinner.hide();

        if (this.allClnt.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.allClnt);

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
        console.log('err All Expense Service');
        console.log('err', error);
      });
    }
  }
  causeOfDeath;
  tags; tagClient; clnt;
  onClntTagClick(obj) {
    console.log(obj);
    this.clnt = obj;
    this.taggedSeq = null;
    this.spinner.show();
    this.loanServicingService.getClntTagForCnic
    this.loanServicingService.getClientBySeq(obj.clntSeq).subscribe(res => {
      this.loanServicingService.getClntTagForCnic(res.cnicNum).subscribe(tag => {
        this.spinner.hide();
        this.tagClient = res;
        (<any>$('#cmmoncodes')).modal('show');
        if (tag.mwClntTagList != null || tag.mwClntTagList != undefined)
          this.taggedSeq = tag.mwClntTagList.tagsSeq;
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }, error => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong");
    });
  }
  taggedSeq;

  onTagSubmit() {
    this.spinner.show();
    this.loanServicingService.addClntTagForCnic(this.tagClient.cnicNum, this.taggedSeq).subscribe(res => {

      (<any>$('#cmmoncodes')).modal('hide');
      this.toaster.success("Tagged");
    }, error => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong");
    });
  }

  reportAnimalDeath(clnt) {
    if (clnt.dthRptSeq > 0 && (clnt.rcvryCrntRecFlg == null || clnt.rcvryCrntRecFlg == 0)) {
      this.toaster.warning("Enter Client Adjustment First");
    }
    else {
      this.router.navigate(['/admin/animal-death', clnt.clntSeq]);
    }
  }
  reportDeath(clnt) {
    if (clnt.anmlDthSeq > 0 && (clnt.rcvryCrntRecFlg == null || clnt.rcvryCrntRecFlg == 0)) {
      this.toaster.warning("Enter Animal Adjustment First");
    }
    else {
      (<any>$('#ReportDeath')).modal('show');
      this.client = null;
      this.client = clnt;
      console.log(this.client)
      console.log(this.client['disDate'])
      this.minDate = new Date(this.client['disDate']);
      this.maxDate = new Date();
      this.deathForm = this.fb.group({
        clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
        clntSeq: [clnt.clntSeq, Validators.required],
        clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
        loanAmt: [{ value: clnt.loanAmt, disabled: true }, Validators.required],
        gender: [0, Validators.required],
        deathDt: ['', Validators.required],
        dethCase: ['', Validators.required],
        deathcertf: ['', Validators.required],
        prntLoanAppSeq: [clnt.prntLoanAppSeq, Validators.required]
      });
    }
  }

  submitDeathReport() {
    this.spinner.show();
    if (!this.deathForm.valid) {
      return;
    }
    (<any>$('#ReportDeath')).modal('hide');
    this.deathForm.controls['deathDt'].setValue(moment.parseZone(this.deathForm.controls['deathDt'].value.format('YYYY-MM-DDTHH:mm:ss')));
    this.loanServicingService.reportDeath(this.deathForm.value).subscribe(d => {
      this.spinner.hide();
      this.toaster.success("Saved")
      this.client.dthRptSeq = d.expSeq.dthRptSeq;
      this.client.amt = d.expSeq.amt;
      this.client.paid = false;
    }, (error) => {
      this.spinner.hide();
      if (error.status === 400)
        this.toaster.error(error.error.error)
      else
        this.toaster.error("Something went wrong!")
      console.log(error)
    });
  }

  payFuneralClaim(clnt) {
    // (<any>$('#payFuneralClaim')).modal('show');
    var rcvblAmtLocal = 0;
    var funeralClaimAmt = 0;

    this.client = null;
    this.client = clnt;
    this.ls = clnt;
    this.funralForm.reset();
    //
    if (clnt.amt < 0) {
      funeralClaimAmt = 0;
      rcvblAmtLocal = Math.abs(clnt.amt);
    } else {
      funeralClaimAmt = clnt.amt;
      rcvblAmtLocal = 0;
    }

    //
    this.funralForm = this.fb.group({
      clntId: [clnt.clntId, Validators.required],
      dthRptSeq: [clnt.dthRptSeq, Validators.required],
      clntNm: [clnt.clntNm != undefined ? clnt.clntNm : '' +
        clnt.frstNm != undefined ? clnt.frstNm : ' ' +
          clnt.lastNm != undefined ? clnt.lastNm : '', Validators.required],
      amt: [funeralClaimAmt, Validators.required],
      rcvblAmt: [rcvblAmtLocal, Validators.required],
      rcvryTypsSeq: ['', Validators.required],
      instr: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
    });

    (<any>$('#payFuneralClaim')).modal('show');
  }

  submitFunralClaims() {
    this.spinner.show();
    (<any>$('#payFuneralClaim')).modal('hide');
    this.client.paid = true;
    //Modified by Areeba
    this.temp = new PaymentType();
    this.temp.typId = '0424';
    this.temp.typCtgryKey = 2;
    this.temp.brnchSeq = 0;
    this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;

        //
        const instr = this.funralForm.get('instr').value;
        const rcvryTypsSeq = this.funralForm.get('rcvryTypsSeq').value.typSeq;

        //
        var rcvblAmtLocal = 0;
        var funeralClaimAmt = 0;

        //
        if (this.ls.amt < 0) {
          funeralClaimAmt = 0;
          rcvblAmtLocal = Math.abs(this.ls.amt);
        } else {
          funeralClaimAmt = this.ls.amt;
          rcvblAmtLocal = 0;
        }

        //
        this.exp = new Expense();
        this.exp.pymtTypSeq = rcvryTypsSeq;
        this.exp.brnchSeq = this.ls.brnchSeq;
        this.exp.expnsDscr = this.temp.typStr;
        this.exp.instrNum = instr;
        this.exp.expnsAmt = funeralClaimAmt;
        this.exp.expnsStsKey = 200;
        this.exp.expnsTypSeq = this.temp.typSeq;
        this.exp.expRef = this.ls.clntSeq;
        this.exp.pymtRctFlg = 1;

        //
        this.loanServicingService.payFuneralClaim(this.exp).subscribe(d => {
          this.toaster.success('Funeral Charges Payed', 'Success!')
          this.printHealthCard(this.ls.clntSeq);

          //
          this.spinner.hide();
        });
      });
  }

  // Zohaib Asim - Dated 28-09-2022
  collectCash(funeralFormData) {
    this.spinner.show();

    // UpFront Cash Collection Before Funeral Posting
    this.loanServicingService.collectUpFrontCash(funeralFormData).subscribe(response => {
      if(response['success']){

        (<any>$('#payFuneralClaim')).modal('hide');

        this.applyFilter(funeralFormData.clntId);
        // this.payFuneralClaim(funeralFormData);

        this.recoveryService.getSingleRecoveryForDisability(funeralFormData.clntId).subscribe((data) => {
          this.spinner.hide();    
          // Recovery KCR
          this.postedReport(data.rcvryTrxSeq, 0);
        })

        this.toaster.success('Up-Front Cash Payed', 'Success!');
      }    
      //
      this.spinner.hide();  
    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong", "Error");
    });
  }
  // End


  reSchedule(clnt) {
    (<any>$('#reSchedule')).modal('show');
    this.reScheduleForm = this.fb.group({
      clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
      clntSeq: [clnt.clntSeq, Validators.required],
      clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
      loanAmt: [{ value: clnt.loanAmt, disabled: true }, Validators.required],
      days: ['', Validators.required]
    });
  }
  submitReschedule() {
    (<any>$('#reSchedule')).modal('hide');
    let clntSeq = this.reScheduleForm.get('clntSeq').value;
    let days = this.reScheduleForm.get('days').value;
    this.loanServicingService.reschedule(1, clntSeq, days).subscribe(d => {
    });
  }

  printHealthCard(clntSeq: number) {
    this.reportsService.printInsuClmForm(clntSeq).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }


  adjustLoan(clnt) {
    console.log(clnt.prd.toLowerCase().includes('kfk'));
    (<any>$('#AdjustLoan')).modal('show');
    this.client = null;
    this.client = clnt;
    //Added by Areeba
    if (clnt.dsbltyRptSeq > 0) {
      this.adjustLoanForm = this.fb.group({
        clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
        clntSeq: [clnt.clntSeq, Validators.required],
        clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
        loanAmt: [{ value: clnt.loanAmt + clnt.sercvChrgs - clnt.rcvdAmt, disabled: true }, Validators.required],
      });
    }
    else {
      this.adjustLoanForm = this.fb.group({
        clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
        clntSeq: [clnt.clntSeq, Validators.required],
        clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
        loanAmt: [{ value: clnt.loanAmt + clnt.sercvChrgs - clnt.rcvdAmt, disabled: true }, Validators.required],
      });
    }
    //Ended by Areeba
  }

  reverseClnt(clnt) {
    (<any>$('#reverseClnt')).modal('show');
    this.client = null;
    this.client = clnt;
    console.log(this.client);
    this.reverseForm.patchValue(clnt);
  }


  //Modified by Areeba
  onSubmitReverseClnt() {
    (<any>$('#reverseClnt')).modal('hide');
    this.reverseForm.value.cmnt == null ? ' ' : this.reverseForm.value.cmnt;
    this.spinner.show();
    if (this.reverseForm.value.dthRptSeq != 0) {
      this.loanServicingService.reversReportDeath(this.reverseForm.value.dthRptSeq, this.reverseForm.value.cmnt).subscribe(d => {
        this.client.dthRptSeq = 0;
        this.spinner.hide();
      });
    }
    else if (this.reverseForm.value.dsbltyRptSeq != 0) {
      this.loanServicingService.reverseReportDisability(this.reverseForm.value.dsbltyRptSeq, this.reverseForm.value.cmnt).subscribe(d => {
        this.client.dsbltyRptSeq = 0;
        this.spinner.hide();
      });
    }
  }

  submitAdjustLoan() {
    (<any>$('#AdjustLoan')).modal('hide');
    setTimeout(() => this.spinner.show(), 5);
    let clntSeq = this.adjustLoanForm.get('clntSeq').value;

    // Zohaib Asim - Dated 04-11-2021 - Sanction List Phase 2
    // Condition Modified
    this.loanServicingService.loanAdjustment(clntSeq).subscribe(d => {
      if (d == -1) {
        this.spinner.hide();
        this.toaster.warning('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
      } else {
        const index = this.allClnt.findIndex(c => c.clntSeq === this.client.clntSeq);
        this.allClnt.splice(index, 1);
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(this.allClnt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toaster.success('Loan Adjusted', 'Success!');
      }
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
    const instr = this.funralForm.get('instr');
    if (this.funralForm.get('rcvryTypsSeq').value.typId === '0001') {
      this.isCash = true;
      instr.clearValidators();
    } else {
      this.isCash = false;
      instr.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
    }
    instr.updateValueAndValidity();
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  reverseFunralPayment(clnt) {
    console.log(clnt)
    let exp: Expense = new Expense();
    exp.expSeq = clnt.expSeq;
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Reverse Funral Payment?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reverse it!'
    }).then((result) => {
      if (result.value) {
        this.expenseService.reverseExpense(exp).subscribe(data => {
          clnt.paid = false;
          clnt.post = false;
          this.toaster.success("Funeral Charges Reversed")
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

  // Added by Areeba - SCR - Disability Recoveries
  reportDisability(clnt) {
    (<any>$('#ReportDisability')).modal('show');
    this.client = null;
    this.client = clnt;
    console.log(this.client)
    console.log(this.client['disDate'])
    this.minDate = new Date(this.client['disDate']);
    this.maxDate = new Date();
    this.disabilityForm = this.fb.group({
      clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
      clntSeq: [clnt.clntSeq, Validators.required],
      clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
      loanAmt: [{ value: clnt.loanAmt, disabled: true }, Validators.required],
      gender: [0, Validators.required],
      dtOfDsblty: ['', Validators.required],
      cmnt: [''],
      prntLoanAppSeq: [clnt.prntLoanAppSeq, Validators.required]
    });
  }

  submitDisabilityReport() {
    this.spinner.show();
    if (!this.disabilityForm.valid) {
      return;
    }
    (<any>$('#ReportDisability')).modal('hide');
    this.disabilityForm.controls['dtOfDsblty'].setValue(moment.parseZone(this.disabilityForm.controls['dtOfDsblty'].value.format('YYYY-MM-DDTHH:mm:ss')));
    this.loanServicingService.reportDisability(this.disabilityForm.value).subscribe(d => {
      console.log("Receivable amount: ", d);
      console.log("Receivable amount: ", d.expSeq);
      this.spinner.hide();
      this.toaster.success("Saved");
      this.client.dsbltyRptSeq = d.expSeq.dsbltyRptSeq;
      this.client.dsbltyAmt = d.expSeq.amt;
      this.client.paid = false;
    }, (error) => {
      this.spinner.hide();
      if (error.status === 400)
        this.toaster.error(error.error.error)
      else
        this.toaster.error("Something went wrong!")
      console.log(error)
    });
  }

  collectDisabilityReceivable(clnt) {
    (<any>$('#collectDsbltyReceivable')).modal('show');
    console.log(this.client);
    this.client = null;
    this.client = clnt;
    this.ls = clnt;
    this.receivableForm.reset();
    this.receivableForm = this.fb.group({
      dsbltyRptSeq: [clnt.dsbltyRptSeq, Validators.required],
      clntId: [{ value: clnt.clntId, disabled: true }, Validators.required],
      clntNm: [{ value: clnt.frstNm + ' ' + clnt.lastNm, disabled: true }, Validators.required],
      receivableAmt: [{ value: clnt.dsbltyAmt, disabled: true }, Validators.required],
      rcvryTypsSeq: ['', Validators.required]
    });
  }

  checkRcvryRvrsl(clnt) {
    this.recoveryService.getReversedRecoveryForDisability(clnt.clntSeq).subscribe(data => {
      console.log(data);
      return true;
    });
  }

  submitDsbltyRcvry() {

    if (!this.receivableForm.valid) {
      return;
    }
    console.log(this.client);
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post Disability Recovery?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        (<any>$('#collectDsbltyReceivable')).modal('hide');
        console.log(this.receivableForm.value)
        this.client.paid = true;
        this.temp = new PaymentType();
        this.temp.typId = '0423';
        this.temp.typCtgryKey = 2;
        this.temp.brnchSeq = 0;
        this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
          d => {
            this.temp = d;
            this.exp = new Expense();
            const rcvryTypsSeq = this.receivableForm.get('rcvryTypsSeq').value.typSeq;
            this.exp.pymtTypSeq = rcvryTypsSeq;
            this.exp.brnchSeq = this.ls.brnchSeq;
            this.exp.expnsDscr = this.temp.typStr;
            this.exp.instrNum = null;
            this.exp.expnsAmt = 0;//this.ls.dsbltyAmt;
            this.exp.expnsStsKey = 200;
            this.exp.expnsTypSeq = this.temp.typSeq;
            this.exp.expRef = this.ls.clntSeq;
            this.exp.pymtRctFlg = 1;

            if (this.ls.dsbltyAmt == 0) {
              this.toaster.success('Submitted with Zero Receivable', 'Success!');
              this.client.post = true;
              this.spinner.hide();
            }
            else {
              this.loanServicingService.payFuneralClaim(this.exp).subscribe((exp) => {
                this.spinner.hide();
                this.printHealthCardForDisability(this.ls.clntSeq);
                console.log(exp);
                console.log(exp.expnsId);
                this.recoveryClosingService.postSingleDisabilityExpense(exp.exp.expnsId).subscribe((temp) => {
                  this.client.post = true;
                  this.printKCR(this.ls.clntSeq);
                });
                this.toaster.success('Disability Receivable Posted', 'Success!');
                console.log(this.ls);
              });
            }
          });
      }
    });
  }

  reverseDsbltyRcvry(clnt) {
    console.log(clnt)
    let exp: Expense = new Expense();
    exp.expSeq = clnt.expSeq;
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Reverse Disability Recovery?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reverse it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.expenseService.reverseExpense(exp).subscribe(data => {
          clnt.paid = false;
          clnt.post = false;
          this.spinner.hide();
          this.toaster.success("Disability Recovery Reversed")
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

  printKCR(clntSeq) {

    this.spinner.show();
    this.recoveryService.getSingleRecoveryForDisability(clntSeq).subscribe((data) => {
      this.spinner.hide();
      //if data.crntrecflg = 0 dont show kcr button.
      console.log(data);

      this.postedReport(data.rcvryTrxSeq, 4);
    })
  }

  // KCR Printing
  postedReport(trx: string,type:number) {
    this.recoveryService.getPostedReport(trx, type).subscribe((response) => {
      let binaryData : any[]=[];
      binaryData.push(response);
      if(response.byteLength>0){
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
     }
    });
  }

  printHealthCardForDisability(clntSeq: number) {
    this.spinner.show();
    this.reportsService.printInsuClmFormForDsblty(clntSeq).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }

  // Ended by Areeba
}
