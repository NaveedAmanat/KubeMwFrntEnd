import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../shared/services/common.service';
import { RecoveryService } from '../../shared/services/recovery.service';
import { MyErrorStateMatcher } from '../../shared/helpers/MyErrorStateMatcher.helper';
import { ApplyPayment, Recovery, AdjustPayment } from '../../shared/models/recovery.model';
import { formatDate } from '@angular/common';
import { PRODUCTS2 } from '../../shared/mocks/mock_common_codes';
import { forEach } from '@angular/router/src/utils/collection';
import { RecoverySub } from '../../shared/models/recovery.subModel';
import { Observable, of, merge } from 'rxjs';
import * as REF_CD_GRP_KEYS from '../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MatTableDataSource, MatSort, Sort, MatPaginator, PageEvent } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SplitPipe } from './split.pipe';
import { MergePipe } from './mere.pipe';
import { map, tap, concatAll } from 'rxjs/operators';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';
import { DatePipe } from '@angular/common'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { Auth } from 'src/app/shared/models/Auth.model';
import { CommonCode } from 'src/app/shared/models/commonCode.model';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RecoveryComponent implements OnInit {
  pageEvent: PageEvent;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  role: any = this.auth.role;
  columnsToDisplay: string[] = ['frstNm', 'clntSeq', 'prd', 'bdo', 'totalDue', 'totalRecv', 'totalremain', 'nextDue', 'status'];
  expandedElement: Recovery;
  applyPayment: FormGroup;
  excessPayment: FormGroup;
  adjustPayment: FormGroup;
  matcher = new MyErrorStateMatcher();
  submitted = false;
  test = 1233;
  filters: any[] = [];

  allItems: Recovery[] = [];
  beforefiltereItems: Recovery[] = [];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any = [];
  organization: any;
  institution: any;
  now: any;
  filterEasyPaisa: boolean;
  filterMobiCash: boolean;
  filterNadra: boolean;
  filterPosted: boolean;
  filterOverdue: boolean;
  dueDateTo: string;
  dueDateFrom: string;
  paymentDateFrom: string;
  paymentDateTo: string;
  oldClientId: string;
  recovery: Recovery;
  tempInstituteArray: any[] = [];
  dataSource: any;
  chargesDetails: any[] = [];
  minDate: Date;
  maxDate: Date;
  scheduleForm: FormGroup;
  isCash: boolean = false;
  disgardForm: FormGroup;
  history: any[] = [];
  last: number;
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  isCount = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  searchVal = "";
  applyFilter(filterValue: string) {
    // console.log(filterValue)
    // console.log(filterValue.trim().toLowerCase().length)
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
    this.getFilteredData(filterValue.trim().toLowerCase());
  }
  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      // this.dataSource.sort = this.sort;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      console.log(this.dataSource)
      return;
    }
  }


  filterValue: any = "";
  constructor(private router: Router,
    private recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private commonService: CommonService, private disbursementService: DisbursementService, public datepipe: DatePipe,
    private toaster: ToastrService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    // this.minDate.setDate(this.maxDate.getDate() - 30);
    this.now = new Date();
    let month: any;
    if ((this.now.getMonth() + 1) < 10) {
      month = '0' + (this.now.getMonth() + 1);
    } else {
      month = '' + (this.now.getMonth() + 1);
    }
    let day: any;
    if ((this.now.getDate() + 1) < 10) {
      day = '0' + (this.now.getDate());
    } else {
      day = '' + (this.now.getDate());
    }
    const year: any = this.now.getFullYear();
    const currentDate: any = year + '-' + month + '-' + day;

    this.scheduleForm = this.fb.group({
      frstInstDt: [new Date(), Validators.required],
    });

    this.disgardForm = this.fb.group({
      loanAppSeq: ['', Validators.required],
      cmnt: ['', Validators.required],
    });
    //
    // $(document).ready(function () {
    //   $('.acc_trigger').toggleClass('inactive-header');
    //   $('.acc_trigger').click(function () {
    //     if ($(this).next().is(':hidden')) {
    //       $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
    //       $(this).toggleClass('active-header').toggleClass('inactive-header');
    //       $(this).next().slideToggle().toggleClass('open-content');
    //     } else {
    //       $(this).toggleClass('active-header').toggleClass('inactive-header');
    //       $(this).next().slideToggle().toggleClass('open-content');
    //     }
    //   });
    //
    //   return false;
    // });
    // this.loadScript();
  }

  ngOnInit() {

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
      totaldue: [{ value: '', disabled: true }],
      post: [''],
      prntLoanApp:['']
    });
    this.excessPayment = this.fb.group({
      branchNm: [{ value: '', disabled: true }, Validators.required],
      prd: [{ value: '', disabled: true }, Validators.required],
      clientNm: [{ value: '', disabled: true }, Validators.required],
      clntId: [{ value: '', disabled: true }, Validators.required],
      installmentAmountDue: [{ value: '', disabled: true }, Validators.required],
      rcvryTypsSeq: ['', Validators.required],
      instr: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      pymtDt: [new Date(), Validators.required],
      pymtAmt: ['', Validators.required],
      clientId: [''],
      totaldue: [{ value: '', disabled: true }],
      post: [''],
      prntLoanApp:['']
    });

    this.adjustPayment = this.fb.group({
      prd: [{ value: '', disabled: true }],
      clientNm: [{ value: '', disabled: true }],
      clntId: [{ value: '', disabled: true }],
      rcvryTypsSeq: new FormControl({ value: "", disabled: true }),
      instr: new FormControl({ value: "", disabled: true }),
      adjPymtDt: new FormControl({ value: "", disabled: true }),
      pymtAmt: new FormControl({ value: "", disabled: true }),//, this.validate.bind(this)),
      totaldue: [{ value: '', disabled: true }],
      trxId: [''],
      rcvryReverRea: [''],
      post: [''],
      chngRsnKey: new FormControl('', Validators.required),
      chngRsnCmnt: new FormControl('', Validators.required),
    });
    this.loadLovs();

    this.branchForm = this.fb.group({
      branch: this.auth.emp_branch,
    });

    // this.branchForm = this.fb.group({
    //   branch: [this.auth.emp_branch],
    // });

    // this.dataSource.sort = this.sort;

    // this.recoveries$ = this.allItems.includes('MobiCash');
  }
  refreshButton(){
    this.getAllItems();
  }
  onSelectBranch() {
    console.log(this.branchForm.controls['branch'].value);
    this.getAllItems();
  }
  brnchs: any = [];
  ngAfterViewInit() {
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.brnchs = res;
      })
    }
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadRecoveryPage())
      )
      .subscribe();
  }
  lastPageIndex = 0; dataBeforeFilter; countBeforeFilter; lastPageIndexBeforeFilter;
  loadRecoveryPage() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      setTimeout(() => { this.spinner.show() }, 5);
      this.recoveryService.getPagedRecoveries(this.paginator.pageIndex + 1, this.paginator.pageSize, this.filterValue, this.branchForm.controls['branch'].value, this.isCount).subscribe((data) => {
        this.allItems = data.data;

        if (this.allItems.length <= 0 && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };


        this.dataSource.data = this.dataSource.data.concat(this.allItems);
        this.lastPageIndex = this.lastPageIndex + 1;
        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 10);

        this.spinner.hide();

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
        // this.setPage(1);
      }, error => {
        this.spinner.hide();
        console.log(error)
      });
    }
  }
  getFilteredData(filterValue) {
    this.paginator.pageIndex = 0;
    this.isCount = true;
    setTimeout(() => { this.spinner.show() }, 5);
    this.recoveryService.getPagedRecoveries(this.paginator.pageIndex + 1, this.paginator.pageSize, filterValue, this.branchForm.controls['branch'].value, this.isCount).subscribe((data) => {
      this.allItems = data.data;
      this.spinner.hide();
      if (this.allItems.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 10);

    }, (error) => {
      this.spinner.hide();
      console.log('err All Loans Service');
      console.log('err', error);
    });
  }
  validate(control: AbstractControl) {
    let pymtAmt = control;
    let totaldue = control.parent.get('totaldue') as FormControl;
    return of(pymtAmt.value > totaldue.value).pipe(
      map(result => result ? { paymtamterror: true } : null)
    );

  }

  // sortData(sort: Sort) {
  //   const data = this.dataSource.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.dataSource = data;
  //     return;
  //   }

  //   this.dataSource = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'name': return compare(a.name, b.name, isAsc);
  //       case 'calories': return compare(a.calories, b.calories, isAsc);
  //       case 'fat': return compare(a.fat, b.fat, isAsc);
  //       case 'carbs': return compare(a.carbs, b.carbs, isAsc);
  //       case 'protein': return compare(a.protein, b.protein, isAsc);
  //       default: return 0;
  //     }
  //   });
  //   function compare(a: number | string, b: number | string, isAsc: boolean) {
  //     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  //   }
  // }



  onRecoveryChange() {
    const pymtDt = this.applyPayment.get('pymtDt');
    const instr = this.applyPayment.get('instr');
    if (this.applyPayment.get('rcvryTypsSeq').value.typId === '0001') {
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

  setPage(page: number) {
    // get pager object from service
    this.pager = this.commonService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    // this.dataSource = this.pagedItems;


  }
  get fApplyPayment() {
    return this.applyPayment.controls;
  }
  get fadjustPayment() {
    return this.adjustPayment.controls;
  }
  get ef() {
    return this.excessPayment.controls;
  }


  getAllItems() {
    this.isCount = true;
    this.allItems = [];
    this.dataSource = new MatTableDataSource(this.allItems);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.filterValue = '';
    this.searchVal = '';
    this.lastPageIndex = 0;
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.dataSource = null;
      this.datalength = 0;
      if (this.auth.role != 'bm' && this.auth.role != 'bdo')
        return
    }
    setTimeout(() => { this.spinner.show() }, 5);
    this.recoveryService.getPagedRecoveries(this.paginator.pageIndex + 1, this.paginator.pageSize, this.filterValue, this.branchForm.controls['branch'].value, this.isCount).subscribe((data) => {
      this.allItems = data.data;

      this.spinner.hide();

      if (this.allItems.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };
      /*
      let clntSeq;
      data.forEach((r: Recovery) => {
        r.recoverySub = [];
        if (clntSeq !== r.clntSeq) {
          data.forEach(r2 => {
            if (r2.clntSeq === r.clntSeq) {
              r.recoverySub.push(new RecoverySub(r2));
            }
          });
          this.allItems.push(r);
        }
        clntSeq = r.clntSeq;
      });

      this.allItems.forEach((r: Recovery) => {
        let totaldue: number = 0;
        let totalpaid: number = 0;
        let v = 0;
        r.recoverySub.forEach((s: RecoverySub) => {
          totaldue = +totaldue + +s.totalDueAmount;
          let toArray = s.pymtAmt === null ? null : s.pymtAmt.split(",");

          toArray.forEach(p => {
            totalpaid = +totalpaid + +p;
          });
        });

        r.totalpaid = totalpaid;
        r.totaldue = totaldue;
      });*/

      this.dataSource = new MatTableDataSource(this.allItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator.p
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  datalength = 0;

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  openApplyPayment(recovery: Recovery) {

    this.recoveryService.getClntRecoveryTypes(recovery.clntSeq).subscribe((data => {
      this.tempInstituteArray = data;
    }));

    this.recovery = recovery;
    this.applyPayment.reset();

    let v = 0;
    let inst: string = "";
    let cur_amt = 0;

    recovery.recoverySub.forEach((s: RecoverySub) => {
      let totalpaid: number = 0;
      let toArray = s.pymtAmt === null ? null : s.pymtAmt.split(",");
      toArray.forEach(p => {
        totalpaid = +totalpaid + +p;
      });

      console.log(totalpaid)
      if (s.dueDt == inst && v == 1) {
        cur_amt = cur_amt + (s.ppalAmtDue + s.totChrgDue) - totalpaid;
        v = 2;
      } else if ((s.ppalAmtDue + s.totChrgDue) > totalpaid && v == 0) {
        cur_amt = cur_amt + (s.ppalAmtDue + s.totChrgDue) - totalpaid;
        console.log(cur_amt)
        v = 1;
        inst = s.dueDt;
      }
    });

    this.applyPayment.patchValue({
      prd: recovery.prd,
      clientNm: recovery.frstNm + ' ' + recovery.lastNm,
      clientId: recovery.clntSeq,
      clntId: recovery.clntSeq,
      totaldue: recovery.totalDue - recovery.totalRecv,
      pymtAmt: cur_amt,
      prntLoanApp: recovery.prntLoanAppSeq,
      pymtDt: new Date()

    });
    (<any>$('#ApplyPayment')).modal('show');
  }
  revaslReasnsList: CommonCode[];
  openAdjustPayment(recovery: Recovery, trx: number, amt: number, inst: string, type: number, dt: string) {

    this.recoveryService.getClntRecoveryTypes(recovery.clntSeq).subscribe((data => {
      this.tempInstituteArray = data;
    }));

    this.recovery = null;
    this.recovery = recovery;
    this.adjustPayment.reset();
    (<any>$('#AdjustPayment')).modal('show');
    // this.commonService.getValuesByRefCdGRp('0358').subscribe(d=>{
    //   this.revaslReasnsList = d;
    // }
    // ); 
    this.commonService.getValues('0338').subscribe(d => {
      this.revaslReasnsList = d;
      console.log(this.revaslReasnsList)
    }
    );

    this.adjustPayment.patchValue({
      prd: recovery.prd,
      clientNm: recovery.frstNm + ' ' + recovery.lastNm,
      clntId: recovery.clntSeq,
      totaldue: recovery.totalDue - recovery.totalRecv,
      trxId: trx,
      rcvryTypsSeq: +type,
      instr: inst,
      adjPymtDt: new Date(dt),// new Date(this.datepipe.transform(dt, "MM/dd/yyyy")),
      pymtAmt: amt,
      chngRsnKey: [],
      chngRsnCmnt: [],
    });
  }
  onAdjustPaymentSubmit() {
    if (!this.adjustPayment.valid) {
      this.toaster.error("Enter Missing Fields", "Error")
      // return;
    } else {
      const result: AdjustPayment = Object.assign({}, this.adjustPayment.value);
      console.log(result);
      (<any>$('#AdjustPayment')).modal('hide');
      result.pymtAmt = '0';
      this.recoveryService.adjustPayment(result).subscribe(d => {
        this.toaster.success("Reverted Successfully", "Success")
        this.recovery.recoverySub = d;
        let totalpaid: number = 0;
        this.recovery.recoverySub.forEach((s: RecoverySub) => {
          let toArray = s.pymtAmt === null ? null : s.pymtAmt.split(",");
          toArray.forEach(p => {
            totalpaid = +totalpaid + +p;
          });

        });
        this.recovery.totalRecv = totalpaid;

      }, (error) => {
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
  }
  disbFlg = false;
  onApplyPaymentSubmit() {
    this.disbFlg = true;
    const result: any = Object.assign({}, this.applyPayment.value);
    let isCash: boolean = result.rcvryTypsSeq.typId === '0001';
    result.pymtDt = this.commonService.formatDate(result.pymtDt);
    result.rcvryTypsSeq = result.rcvryTypsSeq.typSeq;
    this.recoveryService.applyPayment(result).subscribe(d => {
      (<any>$('#ApplyPayment')).modal('hide');
      this.recovery.recoverySub = d.recovery;
      let totalpaid: number = 0;
      let v: number = 0;
      this.recovery.recoverySub.forEach((s: RecoverySub) => {
        let toArray = s.pymtAmt === null ? null : s.pymtAmt.split(",");
        let payed: number = 0;
        toArray.forEach(p => {
          totalpaid = +totalpaid + +p;
          payed = +payed + +p;
        });
        if ((s.ppalAmtDue + s.totChrgDue) > totalpaid && v == 0) {
          this.recovery.nextDue = s.dueDt;
        }
        this.disbFlg = false;

      }, error => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
        (<any>$('#ApplyPayment')).modal('hide');
        this.disbFlg = false;
      });

      this.recovery.totalRecv = totalpaid;
      if (result.post && isCash) {
        this.postedReport(d.trxSeq);
      }
      if (this.recovery.totalDue - totalpaid == 0) {
        const index = this.allItems.findIndex(r => r.clntSeq === this.recovery.clntSeq)
        this.allItems.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.allItems);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.getFilteredData(this.filterValue)
    });
  }

  loadLovs() {
    // this.commonService.getValues('GENDER').subscribe((res) => {
    //   this.gender = res;
    // }, (error) => {
    //   console.log('err', error);
    // });
    //
    // this.commonService.getValues('INSTITUTION').subscribe((res) => {
    //   this.institution = res;
    // }, (error) => {
    //   console.log('err', error);
    // });

    // this.commonService.getAllFilters().subscribe((res) => {

    //   this.organization = res.organization;
    //   // this.geography = res.geography;
    // }, (error) => {
    //   console.log('err', error);
    // });
  }
  navClick(element) {
    const parent = $(element).parent();
    if (parent.hasClass('toparrow')) {
      $('.sub-menu:first', parent).hide(300);
      parent.removeClass('toparrow');
    } else {
      $('.sub-menu:first', parent).show(300);
      parent.addClass('toparrow');
    }
  }
  deleteFilterValue(value) {
    this.filters.forEach((filter, index) => {
      if (filter.value === value) {
        this.filters.splice(index, 1);
      }
    });
    this.setPage(0);
  }
  deleteFilter(filter: any) {
    const index = this.filters.indexOf(filter, 0);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
    // if (filter.key === 'Gender') {
    //   this.genderSelected = '';
    //   this.allItems = this.disbs;
    //   this.setPage(0);
    // }
    // if (filter.type === 'geography') {
    //   this.allItems = this.disbs;
    //   this.setPage(0);
    //   if (this.genderSelected !== '') {
    //     this.genderFilter();
    //   }
    // }
  }
  appendFilter(key, value) {
    let found = false;
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].type === key) {
        found = true;
        this.filters[i].key = key;
        this.filters[i].value = value;
      }
    }
    if (!found) {
      this.filters.push({ key: key, value: value, type: key });
    }
  }

  portfolioClick(port) {
    this.appendFilter('Organization', port.portfolioName);
  }

  onFilterCheckChange(event) {
    switch (event) {
      case 'Easy Paisa':
        this.filterEasyPaisa = !this.filterEasyPaisa;
        if (this.filterEasyPaisa) {
          this.filterAllItems(event, 'Institution');
          this.appendFilter('Institution', event);
        } else {
          this.allItems = this.beforefiltereItems;
          this.deleteFilterValue(event);
        }
        break;
      case 'MobiCash':
        this.filterMobiCash = !this.filterMobiCash;
        if (this.filterMobiCash) {
          this.filterAllItems(event, 'Institution');
          this.appendFilter('Institution', event);
        } else {
          this.allItems = this.beforefiltereItems;
          this.deleteFilterValue(event);
        }
        break;
      case 'Nadra':
        this.filterNadra = !this.filterNadra;
        if (this.filterNadra) {
          this.filterAllItems(event, 'Institution');
          this.appendFilter('Institution', event);
        } else {
          this.allItems = this.beforefiltereItems;
          this.deleteFilterValue(event);
        }
        break;
      case 'Overdue':
        this.filterOverdue = !this.filterOverdue;
        if (this.filterOverdue) {
          this.filterAllItems(event, 'Status');
          this.appendFilter('Status', event);
        } else {
          this.allItems = this.beforefiltereItems;
          this.deleteFilterValue(event);
        }
        break;
      case 'Posted':
        this.filterPosted = !this.filterPosted;
        if (this.filterPosted) {
          this.filterAllItems(event, 'Status');
          this.appendFilter('Status', event);
        } else {
          this.allItems = this.beforefiltereItems;
          this.deleteFilterValue(event);
        }
        break;
      default:
        this.getAllItems();
        break;
    }
    if (!this.filterNadra && !this.filterEasyPaisa && !this.filterMobiCash && !this.filterPosted && !this.filterOverdue) {
      this.getAllItems();
    }
  }
  filterAllItems(event, filterName) {
    //update
    /*
    this.beforefiltereItems = this.allItems;
    if (filterName === 'Institution') {
      this.allItems = this.allItems.filter(
        r => r.recoverySub.find((rs => rs.rcvryTyp === event)));
    } else if (filterName === 'Status') {
      this.allItems = this.allItems.filter(
        r => r.recoverySub.find((rs => rs.refCd === event))
      );
    } else if (filterName === 'clientOldId') {
      // this.allItems = this.allItems.filter(r => r.paySchedDtlSeq === event);
    }
    // this.setPage(0);
    this.dataSource = new MatTableDataSource(this.allItems);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.allItems);
    */
  }
  onSearchOldClient(event) {
    this.oldClientId = event;
    this.filterAllItems(this.oldClientId, 'clientOldId');
    this.appendFilter('Client Id', event);
  }
  onDateFilterChange(event, s) {

    switch (s) {
      case 'dueFrom':
        this.dueDateFrom = this.commonService.formatDate(event);
        console.log('dueFrom' + this.dueDateFrom);
        break;
      case 'dueTo':
        this.dueDateTo = this.commonService.formatDate(event);
        console.log('dueTo' + this.dueDateTo);
        break;
      case 'paymentFrom':
        this.paymentDateFrom = this.commonService.formatDate(event);
        console.log('paymentFrom' + this.paymentDateFrom);
        break;
      case 'paymentTo':
        this.paymentDateTo = this.commonService.formatDate(event);
        console.log('paymentTo' + this.paymentDateTo);
        break;
    }
  }
  onCharges(number) {
    (<any>$('#chargesdetails')).modal('show');
    this.disbursementService.getPaymenrScheduleDetail(number).subscribe(d => {
      this.chargesDetails = d;
      this.chargesDetails.forEach((as: any, index) => {
        this.chargesDetails[index].chrgTyp = as.chargesTypesDTO.chrgTyp;
      });
    });

  }

  bulkPosting() {
    this.recoveryService.bulkPosting().subscribe((data) => {

    });
  }
  generateSchedule() {
    (<any>$('#generatemodal')).modal('show');
  }

  disgardApp(recovery: Recovery) {
    (<any>$('#disgardApp')).modal('show');
    this.disgardForm = this.fb.group({
      //update
      // loanAppSeq: [recovery.loanId, Validators.required],
      cmnt: ['', Validators.required],
    });
  }

  onSubmitDisgardApp() {
    (<any>$('#disgardApp')).modal('hide');
    this.disgardForm.value.cmnt == null ? " " : this.disgardForm.value.cmnt;
    this.recoveryService.deleteApplication(this.disgardForm.value).subscribe(() => {
      //update 
      const index = 0//this.allItems.findIndex(r => r.loanId === this.disgardForm.value.loanAppSeq);
      this.allItems.splice(index, 1);
      // this.dataSource = this.allItems;
      // this.setPage(0);
      this.dataSource = new MatTableDataSource(this.allItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => console.log('There was an error: ', error));

  }

  postedReport(trx: string) {
    this.recoveryService.getPostedReport(trx, 0).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }

  expandFunction(element: Recovery) {
    console.log(element)
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.recoveryService.getSingleRecovery(element.clntSeq, element.prntLoanAppSeq, element.prd).subscribe(d => {
        element.recoverySub = d;
        let recoveries: number[] = [];
        element.recoverySub.forEach((r, i) => {
          if (r.trxSeq != "") {
            let test: number[] = r.trxSeq.split(",").map(Number);
            let sorted = test.sort((a, b) => a - b);
            recoveries = recoveries.concat(test);
            this.last = sorted[sorted.length - 1];
          }
        });

        // let sorted = recoveries.sort((a, b) => a - b);
        // this.last=sorted[sorted.length - 1];
        this.expandedElement = element
      });


    }

  }

  showFields = false;
  showField() {
    this.showFields = true;
  }

  onSelectionChanged(w) {
    console.log(w);
    if (this.adjustPayment.controls['chngRsnKey'].value == 1485) {
      console.log(this.adjustPayment.controls['chngRsnKey'].value)
      this.adjustPayment.get('rcvryTypsSeq').disable();
      this.adjustPayment.get('instr').disable();
      this.adjustPayment.get('adjPymtDt').disable();
      this.adjustPayment.get('pymtAmt').disable();
    } else {
      this.adjustPayment.get('rcvryTypsSeq').enable();
      this.adjustPayment.get('instr').enable();
      this.adjustPayment.get('adjPymtDt').enable();
      this.adjustPayment.get('pymtAmt').disable();
    }
  }


  revoceryVoucherHistry(clntSeq: number) {
    this.history = null;
    this.recoveryService.getJvHistory(clntSeq).subscribe((data => {
      this.history = data;
    }));
    (<any>$('#jvHistory')).modal('show');
  }
  onExcessRecoverClick(recovery: Recovery) {
    this.recoveryService.getClntRecoveryTypes(recovery.clntSeq).subscribe((data => {
      this.tempInstituteArray = data;
    }));
    this.recovery = recovery;
    this.excessPayment.reset();
    (<any>$('#exxcess_recovery')).modal('show');
    console.log(this.excessPayment.controls);
    this.excessPayment.patchValue({
      prd: recovery.prd,
      clientNm: recovery.frstNm + ' ' + recovery.lastNm,
      clientId: recovery.clntSeq,
      clntId: recovery.clntSeq,
      totaldue: recovery.totalDue - recovery.totalRecv,
      pymtAmt: 0,
      pymtDt: new Date(),
      prntLoanApp: recovery.prntLoanAppSeq
    });
  }
  onPaymentModeChange() {
    const pymtDt = this.excessPayment.get('pymtDt');
    const instr = this.excessPayment.get('instr');
    if (this.excessPayment.get('rcvryTypsSeq').value.typId === '0001') {
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
  excessDisable = false;
  onExcessRecoverSubmitt() {
    this.spinner.show();
    this.excessDisable = true;
    const result: any = Object.assign({}, this.excessPayment.value);
    let isCash: boolean = result.rcvryTypsSeq.typId === '0001';
    result.pymtDt = this.commonService.formatDate(result.pymtDt);
    result.rcvryTypsSeq = result.rcvryTypsSeq.typSeq;
    this.recoveryService.payExcessRecovery(result).subscribe(d => {
      this.excessDisable = false; this.spinner.hide();
      (<any>$('#exxcess_recovery')).modal('hide');
      if (result.post && isCash) {
        this.postedReport(d.trxSeq);
      }


    }, error => {
      (<any>$('#exxcess_recovery')).modal('hide');
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
      this.excessDisable = false;
    });
  }
}
