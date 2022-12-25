import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanApplicant } from '../../../shared/models/LoanApplicant.model';
import { LoanService } from '../../../shared/services/loan.service';
import { Router, RoutesRecognized } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../shared/services/common.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { History } from '../../../shared/models/History.model';
import { MyErrorStateMatcher } from '../../../shared/helpers/MyErrorStateMatcher.helper';
import { Auth } from '../../../shared/models/Auth.model';
import { filter, pairwise, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CNICPattern } from '../../../shared/models/CNICPattern.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatTableModule } from '@angular/material';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { DataService } from '../../../shared/services/data.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { Product } from 'src/app/shared/models/Product.model';
import { LoanProduct, LoanProductAssoc } from 'src/app/shared/models/LoanProduct.model';
import { RecoveryService } from 'src/app/shared/services/recovery.service';
import { LoanServicingService } from 'src/app/shared/services/loan-servicing.service';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LandingComponent implements OnInit {

  reasonForRescheduling: any[];
  reScheduleForm: FormGroup;
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchVal = "";
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
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
  model = new LoanApplicant();
  date: any;
  now: any;
  maxDate: any;
  matcher = new MyErrorStateMatcher();
  private allItems: any = [];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any = [];
  formControl: FormControl;
  disgardForm: FormGroup;
  brnchs: any = [];
  constructor(private loanService: LoanService,
    private loanServicingService: LoanServicingService,
    private dataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private recoveryService: RecoveryService,
    private toaster: ToastrService, private commonService: CommonService) {
    this.now = new Date();
    this.now.setDate((this.now.getDate() + 1));
    this.spinner.hide();
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
    this.date = currentDate;
    this.maxDate = (year + 100) + '-' + month + '-' + day;
    this.branchForm = this.fb.group({
      branch: null,
    })
    $(document).ready(function () {
      $('.acc_trigger').toggleClass('inactive-header');
      $('.acc_trigger').click(function () {
        if ($(this).next().is(':hidden')) {
          $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        } else {
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        }
      });

      return false;
    });
    this.reScheduleForm = this.fb.group({
      methdSeq: ['1', Validators.required],
      // clntId: ['', Validators.required],
      clntSeq: ['', Validators.required],
      // clntNm: ['', Validators.required],
      loanAmt: ['', Validators.required],
      perd: [0, Validators.required],
      days: ['', Validators.required],
      rsnKey: ['', Validators.required],
      cmnt: ['']
    });
  }
  displayedColumns: string[] = [];
  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    if (this.auth.role == 'bm' || this.auth.role == 'ho') {
      this.displayedColumns = ['firstName', 'loanAppId', 'loanAppStatus', 'stsDate', 'prdNm', 'recAmount', 'empNm', 'verisys', 'action'];
    } else {
      this.displayedColumns = ['firstName', 'loanAppId', 'loanAppStatus', 'stsDate', 'prdNm', 'recAmount', 'verisys', 'action'];
    }
    this.loadLovs();

    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        console.log(e[0].urlAfterRedirects); // previous url
      });

    this.filterDto = new FilterDto(this.auth.user.username);

    this.disgardForm = this.fb.group({
      loanAppSeq: ['', Validators.required],
      role: [this.auth.role, Validators.required],
      cmnt: [''],
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.RELATION_WITH_RESCHEDULING).subscribe((res) => {
      this.reasonForRescheduling = res;
      console.log(this.reasonForRescheduling)
    })

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information');
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.brnchs = res;
      })
    } 
  }
  refreshButton(){
      this.getAllLoan();
  }
  public async onSelectBranch(e): Promise<void> {
    this.loanService.onBranchSelect.next(e.brnchSeq);
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == undefined || this.branchForm.controls['branch'].value == 0)
      return;
    this.getAllLoan();
  }
  ngAfterViewInit() {

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadLoansPage())
      )
      .subscribe();
  }

  oldApplicants: LoanApplicant[] = [];
  applicantHistory: LoanApplicant = new LoanApplicant();
  hashistory: boolean; isValid: boolean;
  clientHistory: History = new History();
  tag: Object = new Object();
  severinity: number = 2;
  nomSeverinity: number = 2;
  cobSeverinity: number = 2;
  nomHistory = new History();
  cobHistory = new History();
  hasNomhistory: boolean = false;
  hasCobhistory: boolean = false;
  onAddNewLoanSubmit() {
    this.hashistory = false;
    this.applicantHistory = new LoanApplicant();
    this.clientHistory = new History();
    this.nomHistory = new History();
    this.cobHistory = new History();
    this.hasCobhistory = false;
    this.hasNomhistory = false;
    this.tag = new Object();
    this.severinity = 2;
    this.nomSeverinity = 2;
    this.cobSeverinity = 2;
    this.isValid = false;
    this.oldApplicants = [];
    this.spinner.show();
    if (/^([0-9])\1*$/.test(this.model.cnicNum)) {
      this.toaster.error("Invalid Client CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.cnicNum.length < 13) {
      this.toaster.error("Please Enter 13 Digit CNIC", "CNIC Number"); this.spinner.hide();
      return;
    }
    if (this.model.expiryDate == undefined || this.model.expiryDate == "") {
      this.toaster.error("Please Select a Date", "Date Error"); this.spinner.hide();
      return;
    }
    if (/^([0-9])\1*$/.test(this.model.nominee.cnicNum)) {
      this.toaster.error("Invalid Nominee CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.nominee != undefined && this.model.nominee.cnicNum != undefined && this.model.nominee.cnicNum != '') {
      if (this.model.nominee.cnicNum.length == 13) {
        if (this.model.nominee.cnicExpryDate == null || this.model.nominee.cnicExpryDate == null) {
          this.toaster.error("Nominee Expiry Date Missing."); this.spinner.hide();
          return;
        }
      }
    }
    if (/^([0-9])\1*$/.test(this.model.coBorrower.cnicNum)) {
      this.toaster.error("Invalid Co-Borrower CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.coBorrower != undefined && this.model.coBorrower.cnicNum != undefined && this.model.coBorrower.cnicNum != '') {
      if (this.model.coBorrower.cnicNum.length == 13) {
        if (this.model.coBorrower.cnicExpryDate == null || this.model.coBorrower.cnicExpryDate == null) {
          this.toaster.error("Co-Borrower Expiry Date Missing."); this.spinner.hide();
          return;
        }
      }
    }

    if (this.model.nominee != undefined && this.model.nominee.cnicNum != undefined && this.model.nominee.cnicNum != '') {
      if (this.model.nominee.cnicNum.length == 13) {
        if (this.model.nominee.cnicNum == this.model.cnicNum) {
          this.toaster.error("Client CNIC can not be same as Nominee CNIC."); this.spinner.hide();
          return;
        }
      }
    }

    let history: History = new History();
    history.cnicNum = this.model.cnicNum;
    history.nomCnic = this.model.nominee.cnicNum;
    history.cobCnic = this.model.coBorrower.cnicNum;
    this.loanService.validateCNCCNIC(history).subscribe((res) => {
      this.spinner.hide();
      if (res) {
        // this.toaster.success('Validated', 'Success');
        // this.isValid = true;
        if (res.client) {
          if (res.client.client) {
            this.hashistory = true;

            this.clientHistory = res.client.client;
            this.clientHistory.title = "Client";
          } else if (res.client.clientRel) {
            this.clientHistory = res.client.clientRel;
            this.hashistory = true;
            if (this.clientHistory.type == "1") {
              this.clientHistory.title = "Nominee";
            } else if (this.clientHistory.type == "2") {
              this.clientHistory.title = "Coborrower";
            } else if (this.clientHistory.type == "3") {
              this.clientHistory.title = "Next-of-Kin";
            } else if (this.clientHistory.type == "4") {
              this.clientHistory.title = "Client Relative";
            }
          }

        }
        if (res.client) {
          if (res.client.tag) {
            this.severinity = res.client.tag.tagSeq;

          }
          // if(new Date(res.tags[0][1])> new Date() && new Date() > new Date(res.tags[0][1]))
        }

        //Nominee History

        if (res.nominee) {
          if (res.nominee.client) {
            this.hasNomhistory = true;

            this.nomHistory = res.nominee.client;
            this.nomHistory.title = "Client";
          } else if (res.nominee.clientRel) {
            this.nomHistory = res.nominee.clientRel;
            this.hasNomhistory = true;
            if (this.nomHistory.type == "1") {
              this.nomHistory.title = "Nominee";
            } else if (this.nomHistory.type == "2") {
              this.nomHistory.title = "Coborrower";
            } else if (this.nomHistory.type == "3") {
              this.nomHistory.title = "Next-of-Kin";
            } else if (this.nomHistory.type == "4") {
              this.nomHistory.title = "Client Relative";
            }
          }
          if (!this.hashistory) {
            $('#task-tab').click();
          }
          if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
            this.model.nominee.isValidated = true;
          } else {
            this.model.nominee.isValidated = false;
          }
        }
        if (res.nominee) {
          if (res.nominee.tag) {
            this.nomSeverinity = res.tag;
          }
          // if(new Date(res.tags[0][1])> new Date() && new Date() > new Date(res.tags[0][1]))
        }
        // if (res.nomHistory.length) {
        //   if (res.nomHistory[0].length) {
        //     this.hasNomhistory = true;
        //     console.log(this.nomHistory);
        //   }
        // }
        // if (res.nomTags.length) {
        //   if (res.nomTags[0].length) {
        //     this.nomSeverinity = res.nomTags[0][5];
        //   }
        // }

        // // Coborrower History

        if (res.coborrower) {
          if (res.coborrower.client) {
            this.hasCobhistory = true;

            this.cobHistory = res.coborrower.client;
            this.cobHistory.title = "Client";
          } else if (res.coborrower.clientRel) {
            this.cobHistory = res.coborrower.clientRel;
            this.hasCobhistory = true;
            if (this.cobHistory.type == "1") {
              this.cobHistory.title = "Nominee";
            } else if (this.cobHistory.type == "2") {
              this.cobHistory.title = "Coborrower";
            } else if (this.cobHistory.type == "3") {
              this.cobHistory.title = "Next-of-Kin";
            } else if (this.cobHistory.type == "4") {
              this.cobHistory.title = "Client Relative";
            }
          }
          if (!this.hashistory && !this.hasNomhistory)
            $('#tuc-tab').click();

          if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
            this.model.coBorrower.isValidated = true;
          } else {
            this.model.coBorrower.isValidated = false;
          }
        }
        if (res.coborrower) {
          if (res.coborrower.tag) {
            this.cobSeverinity = res.tag;
          }
          // if(new Date(res.tags[0][1])> new Date() && new Date() > new Date(res.tags[0][1]))
        }
        // if (res.cobHistory.length) {
        //   if (res.cobHistory[0].length) {
        //     this.hasCobhistory = true;

        //     this.cobHistory.loanAppSeq = res.cobHistory[0][0];
        //     this.cobHistory.status = res.cobHistory[0][1];
        //     this.cobHistory.clientName = res.cobHistory[0][2] + " " + res.cobHistory[0][3];
        //     this.cobHistory.clientSeq = res.cobHistory[0][4];
        //     this.cobHistory.clientCnic = res.cobHistory[0][5];
        //     this.cobHistory.fatherName = res.cobHistory[0][6] + " " + res.cobHistory[0][7];
        //     this.cobHistory.gender = res.cobHistory[0][8];
        //     this.cobHistory.maritalStatus = res.cobHistory[0][9];
        //     this.cobHistory.houseNum = res.cobHistory[0][10];
        //     this.cobHistory.city = res.cobHistory[0][11];
        //     this.cobHistory.uc = res.cobHistory[0][12];
        //     this.cobHistory.thsl = res.cobHistory[0][13];
        //     this.cobHistory.dist = res.cobHistory[0][14];
        //     this.cobHistory.state = res.cobHistory[0][15];
        //     this.cobHistory.country = res.cobHistory[0][16];
        //     this.cobHistory.portfolio = res.cobHistory[0][17];
        //     this.cobHistory.branch = res.cobHistory[0][18];
        //     this.cobHistory.area = res.cobHistory[0][19];
        //     this.cobHistory.reg = res.cobHistory[0][20];
        //     this.cobHistory.prdSeq = res.cobHistory[0][21];
        //     this.cobHistory.prdName = res.cobHistory[0][22];
        //     this.cobHistory.multi = res.cobHistory[0][23];

        //     this.cobHistory.nomSeq = res.cobHistory[0][24];
        //     this.cobHistory.nomFName = res.cobHistory[0][25];
        //     this.cobHistory.nomLName = res.cobHistory[0][26];
        //     this.cobHistory.nomPhone = res.cobHistory[0][27];
        //     this.cobHistory.nomRel = res.cobHistory[0][28];

        //     console.log(this.cobHistory);
        //   }
        // }
        // if (res.cobTags.length) {
        //   if (res.cobTags[0].length) {
        //     this.cobSeverinity = res.cobTags[0][5];
        //   }
        // }

        if (this.hashistory) {
          if (this.clientHistory.status == "Completed" || this.clientHistory.status == "COMPLETED" || this.clientHistory.status == "Deferred" || this.clientHistory.status == "DEFERRED") {
            if (this.hasNomhistory) {
              if (this.nomHistory.status == "Completed" || this.nomHistory.status == "COMPLETED") {
                if (this.hasCobhistory) {
                  if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
                    this.isValid = true;
                    this.model.coBorrower.isValidated = true;
                  } else {
                    this.isValid = false;
                  }
                } else {
                  this.isValid = true;
                  this.model.coBorrower.isValidated = true;
                }
              } else {
                this.isValid = false;
              }
            } else {
              if (this.hasCobhistory) {
                if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
                  this.isValid = true;
                } else {
                  this.isValid = false
                }
              } else {
                this.isValid = true;
              }
            }
          } else {
            this.isValid = false;
          }
        } else {
          if (this.hasNomhistory) {
            if (this.nomHistory.status == "Completed" || this.nomHistory.status == "COMPLETED") {
              if (this.hasCobhistory) {
                if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
                  this.isValid = true;
                } else {
                  this.isValid = false
                }
              } else {
                this.isValid = true;
                this.model.coBorrower.isValidated = true;
              }
            } else {
              this.isValid = false;
            }
          } else {
            if (this.hasCobhistory) {
              if (this.cobHistory.status == "Completed" || this.cobHistory.status == "COMPLETED") {
                this.isValid = true;
                this.model.coBorrower.isValidated = true;
              } else {
                this.isValid = false
              }
            } else {
              this.model.coBorrower.isValidated = true;
              this.isValid = true;
            }
          }
        }

        // if (res.client) {
        //   if (res.client.tag) {
        //     if(this.severinity == 1){
        //       if(new Date(res.client.tags)> new Date() && new Date() > new Date(res.client.tags[0][1])){
        //         this.isValid = false;
        //       }
        //     }

        //   }

        // }

      }
    }, (error) => {
      this.spinner.hide();
      console.log('err VALIDATE');
      console.log('err', error);
    });
  }
  createNewLoan() {
    if (this.severinity == 1) {
      this.toaster.error("This Client is Blacklisted.", "Error"); return;
    }
    if (this.hashistory) {
      if (this.clientHistory["status"].toLowerCase() != "completed" && this.clientHistory["status"].toLowerCase() != "deferred") {
        // if (this.clientHistory["multi"] != 1)
        this.toaster.error("Client Already has a " + this.clientHistory["status"] + " Loan.", "Error"); return;
      }
    }
    if (this.severinity == 0) {
      this.toaster.warning("Be aware with this client.", "Warning");
    }
    this.spinner.show();
    this.loanService.createLoan(this.model).subscribe((res) => {
      console.log(this.model);
      this.model.portfolioSeq = this.model.portKey;
      this.model.portSeq = this.model.portKey;
      let expDate = this.model.expiryDate;
      Object.assign(this.model, res, this.model);
      this.model.expiryDate = expDate;
      if (this.hashistory) {
        sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Personal Info", formUrl: "personal-info", isSaved: true }, { formNm: "Product Info", formUrl: "loan-info", isSaved: false }]))
      } else {
        sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Personal Info", formUrl: "personal-info", isSaved: false }, { formNm: "Product Info", formUrl: "loan-info", isSaved: false }]))
      }

      sessionStorage.setItem('model', JSON.stringify(this.model));
      // this.loanService.landingModel = this.model;

      sessionStorage.setItem('editLoan', 'false');
      sessionStorage.setItem('readonly', 'false');
      (<any>$('#cmmoncodes')).modal('hide');
      this.spinner.show();
      this.router.navigate(['loan-origination/app/personal-info']);
    }, (error) => {
      this.spinner.hide();
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  loans: LoanApplicant[] = [];
  auth: Auth; showFields = false;
  showField() {
    this.showFields = true;
  }
  cloaseField() {
    this.showFields = false;
  }
  // getAllLoan() {
  //   this.spinner.show();
  //   console.log(this.auth);
  //   this.loanService.getAllLoanInfo(this.auth.user.username, this.auth.role).subscribe((res) => {
  //     this.spinner.hide();
  //     this.loans = res;
  //     this.allItems = res;
  //     this.setAddressStringInAllItems();
  //     this.dataSource = new MatTableDataSource(res);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     // initialize to page 1
  //     // this.setPage(1);
  //   }, (error) => {
  //     this.spinner.hide();
  //     console.log('err All Loans Service');
  //     console.log('err', error);
  //   });
  //   // this.loanService.getAllLoanInfo(this.auth.user.username, this.auth.role).subscribe((res) => {
  //   //   this.spinner.hide();
  //   //   this.loans = res;
  //   //   this.allItems = res;
  //   //   this.setAddressStringInAllItems();
  //   //   this.dataSource = new MatTableDataSource(res);
  //   //   this.dataSource.paginator = this.paginator;
  //   //   this.dataSource.sort = this.sort;
  //   //   // initialize to page 1
  //   //   // this.setPage(1);
  //   // }, (error) => {
  //   //   this.spinner.hide();
  //   //   console.log('err All Loans Service');
  //   //   console.log('err', error);
  //   // });
  // }
  getAllLoan() {
    setTimeout(() => {
      this.spinner.show();
    }, 5);
    this.loanService.getAllLoanInfoPaged(this.auth.user.username, this.auth.role, this.paginator.pageIndex, 10, "loan_app_sts_dt", "desc", this.filterValue, this.branchForm.controls['branch'].value).subscribe((res) => {
      this.spinner.hide();
      this.loans = res.loans;
      this.allItems = res.loans;

      if (this.loans.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.setAddressStringInAllItems(this.allItems);
      this.dataSource = new MatTableDataSource(res.loans);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = res.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = res.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
      // this.dataSource = new MatTableDataSource(res);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      // initialize to page 1
      // this.setPage(1);
    }, (error) => {
      this.spinner.hide();
      console.log('err All Loans Service');
      console.log('err', error);
    });
  }
  datalength: Number = 0;
  lastPageIndex = 0;
  loadLoansPage() {
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    // console.log(((this.paginator.pageIndex + 1) * this.paginator.pageSize) + "  ----  " + this.dataSource.data.length + " ==== " + (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length))
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {

      setTimeout(() => this.spinner.show(), 5);

      this.loanService.getAllLoanInfoPaged(this.auth.user.username, this.auth.role, this.paginator.pageIndex, this.paginator.pageSize, "loan_app_sts_dt", "desc", this.filterValue, this.branchForm.controls['branch'].value).subscribe((res) => {
        this.spinner.hide();
        this.loans = res.loans;

        if (this.loans.length <= 0 && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };

        this.setAddressStringInAllItems(res.loans);
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(res.loans);
        this.datalength = 0;
        setTimeout(() => { this.datalength = res.count; }, 200);
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = res.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
        // console.log(this.dataSource)
        // console.log(this.paginator)
        // // this.datalength = res.count;
        // console.log(res);
      }, (error) => {
        this.spinner.hide();
        console.log('err All Loans Service');
        console.log('err', error);
      });
    }
  }
  dataBeforeFilter; countBeforeFilter; lastPageIndexBeforeFilter;
  getFilteredData(filterValue) {
    this.paginator.pageIndex = 0;

    setTimeout(() => { this.spinner.show() }, 5);

    this.loanService.getAllLoanInfoPaged(this.auth.user.username, this.auth.role, this.paginator.pageIndex, this.paginator.pageSize, "loan_app_sts_dt", "desc", filterValue, this.branchForm.controls['branch'].value).subscribe((res) => {
      this.spinner.hide();
      this.loans = res.loans;

      if (this.loans.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.setAddressStringInAllItems(res.loans);
      this.dataSource = new MatTableDataSource(res.loans);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = 0;
      setTimeout(() => { this.datalength = res.count; }, 200);
    }, (error) => {
      this.spinner.hide();
      console.log('err All Loans Service');
      console.log('err', error);
    });
  }
  setAddressStringInAllItems(loans) {
    loans.forEach(item => {
      item.addressString = "House No." + item.house_num + ", " + item.street + ", " + item.cmntyNm + ", " + item.village + ", " + item.other_detail + ".";
    })
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.loanService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  editLoan(loan, flg) {
    console.log(loan);
    this.spinner.show();
    this.loanService.getClientLoanInfo(loan.clientId).subscribe((res) => {
      if (res) {
        const loanApplicant = new LoanApplicant();
        Object.assign(loanApplicant, res, loanApplicant);
        console.log(loanApplicant);
        loanApplicant.loanAppSeq = loan.loanAppSeq;
        loanApplicant.loanSeq = loan.loanAppSeq;
        loanApplicant.clientSeq = loan.clientId;
        loanApplicant.portfolioSeq = loanApplicant.portKey;
        loanApplicant.portSeq = loanApplicant.portKey;
        
        sessionStorage.setItem('model', JSON.stringify(loanApplicant));
        sessionStorage.setItem('editLoan', 'true');
        sessionStorage.setItem('readonly', flg);
        console.log(flg)
        sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Personal Info", formUrl: "personal-info", isSaved: true }, { formNm: "Product Info", formUrl: "loan-info", isSaved: true }]))
        this.spinner.show();
        this.router.navigate(['loan-origination/app/personal-info']);
      }
      // this.spinner.hide();
      // initialize to page 1
    }, (error) => {
      this.spinner.hide();
      console.log('err All Loans Service');
      console.log('err', error);
    });
  }

  clientHistoryScreen(loan) {
    sessionStorage.setItem("historyLoan", JSON.stringify(loan));
    this.router.navigate(['loan-origination/client-history']);
  }
  loanAppToBeDeleted: any;
  deleteLoan(loanApp: any) {
    this.loanAppToBeDeleted = loanApp;
    (<any>$('#deleteConfirmation')).modal('show');
  }
  confirmDelete() {
    this.spinner.show();
    this.loanService.deleteLoan(this.loanAppToBeDeleted.loanAppSeq).subscribe(res => {
      let index = this.allItems.indexOf(this.loanAppToBeDeleted);
      this.spinner.hide();
      this.toaster.success("Application has been deleted successfully");
      (<any>$('#deleteConfirmation')).modal('hide');
      if (index > -1) {
        this.allItems.splice(index, 1);
        this.setPage(0);
      }
      this.allItems
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }
  addLoanModel() {
    (<any>$('#cmmoncodes')).modal('show');
    this.model = new LoanApplicant();
    this.hashistory = false;
    this.hasNomhistory = false;
    this.hasCobhistory = false;
    this.isValid = false;
    this.applicantHistory = new LoanApplicant();
    this.oldApplicants = [];
    this.cnicPatternObj = new CNICPattern();
  }
  // FILTERS

  filters: any[] = [];

  deleteFilter(filter: any) {
    const index = this.filters.indexOf(filter, 0);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
    if (filter.key == 'Gender') {
      this.genderSelected = '';
      this.filterDto.genderCd = null;
      this.getFilteredListing();
    }
    if (filter.key == 'Marital Status') {
      this.filterDto.maritalStsCd = null;
      this.getFilteredListing();
    }
    if (filter.key == 'Application Status') {
      this.filterDto.StatusCd = null;
      this.getFilteredListing();
    }
    if (filter.type == 'geography') {
      this.allItems = this.loans;
      this.setPage(0);
      if (this.genderSelected != '') {
        this.genderFilter();
      }
    }
    if (filter.key == 'Organization') {
      this.filterDto.geographyQuery = "";
      this.getFilteredListing();
    }
  }
  genderSelected: any = '';
  filterDto: FilterDto;

  genderFilter() {

    if (this.genderSelected != undefined && this.genderSelected != null && this.genderSelected != "") {
      this.filterDto.genderCd = this.genderSelected;
      var index = -1;
      for (let j = 0; j < this.filters.length; j++) {
        if (this.filters[j].key == 'Gender') {
          index = j;
          break;
        }
      }
      if (index > -1) {
        this.filters[index].value = this.findValueFromGrpCd(this.genderSelected, this.gender);
      } else {
        this.filters.push({ key: 'Gender', value: this.findValueFromGrpCd(this.genderSelected, this.gender) });
      }

      // let found = false;
      // for (let j = 0; j < this.filters.length; j++) {
      //   if (this.filters[j].key == 'Gender') {
      //     found = true;

      //     break;
      //   }
      // }
      // if (!found) {
      //   this.filters.push({ key: 'Gender', value: this.genderSelected });
      // } else if (this.filters.length <= 1) {
      //   this.allItems = this.loans;
      // }
    } else {
      this.filterDto.genderCd = "";
    }

    this.getFilteredListing();

    // const filteredItems = [];
    // for (let i = 0; i < this.allItems.length; i++) {
    //   console.log(i);
    //   if (this.allItems[i].gender == this.genderSelected) {
    //     console.log(this.allItems[i]);
    //     filteredItems.push(this.allItems[i]);
    //   }
    // }
    // console.log(filteredItems);
    // this.allItems = filteredItems;
    // this.setPage(0);
  }

  maritalStatusFilter() {
    console.log(this.genderSelected);

    if (this.filterDto.maritalStsCd != undefined && this.filterDto.maritalStsCd != null && this.filterDto.maritalStsCd != "") {

      var index = -1;
      for (let j = 0; j < this.filters.length; j++) {
        if (this.filters[j].key == 'Marital Status') {
          index = j;
          break;
        }
      }
      if (index > -1) {
        this.filters[index].value = this.findValueFromGrpCd(this.filterDto.maritalStsCd, this.maritalStatus);
      } else {
        this.filters.push({ key: 'Marital Status', value: this.findValueFromGrpCd(this.filterDto.maritalStsCd, this.maritalStatus) });
      }
      // this.filters.push({ key: 'Marital Status', value: this.findValueFromGrpCd(this.filterDto.maritalStsCd, this.maritalStatus )});
    } else {
      this.filterDto.maritalStsCd = "";
    }

    this.getFilteredListing();
  }

  statusFilter() {
    if (this.filterDto.StatusCd != undefined && this.filterDto.StatusCd != null && this.filterDto.StatusCd != "") {

      var index = -1;
      for (let j = 0; j < this.filters.length; j++) {
        if (this.filters[j].key == 'Application Status') {
          index = j;
          break;
        }
      }
      if (index > -1) {
        this.filters[index].value = this.findValueFromGrpCd(this.filterDto.StatusCd, this.status);
      } else {
        this.filters.push({ key: 'Application Status', value: this.findValueFromGrpCd(this.filterDto.StatusCd, this.status) });
      }
      // this.filters.push({ key: 'Marital Status', value: this.findValueFromGrpCd(this.filterDto.maritalStsCd, this.maritalStatus )});
    } else {
      this.filterDto.StatusCd = "";
    }

    this.getFilteredListing();
  }
  gender: any;
  maritalStatus: any;
  organization: any;
  geography: any; status;
  loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
      this.gender = res;
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.MARITAL_STATUS).subscribe((res) => {
      this.maritalStatus = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.APPLICATION_STATUS).subscribe((res) => {
      this.status = res;
    }, (error) => {
      console.log('err', error);
    });

    // this.commonService.getAllFilters().subscribe((res) => {
    //   this.organization = res.organization;
    //   this.geography = res.geography;

    // }, (error) => {
    //   console.log('err', error);
    // });

    this.commonService.getOrganizationforUser(this.auth.user.username).subscribe(res => {
      this.org = res;
    })
  }
  org;
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
  regionClick(region) {
    console.log(region);
  }
  areaClick(area) {
    console.log(area)
    var index = -1;
    for (let j = 0; j < this.filters.length; j++) {
      if (this.filters[j].key == 'Organization') {
        index = j;
        break;
      }
    }
    if (index > -1) {
      this.filters[index].value = area.areaName;
      this.filterDto.geographyQuery = " and area.area_seq=" + area.areaSeq + " ";
    } else {
      this.filters.push({ key: 'Organization', value: area.areaName });
      this.filterDto.geographyQuery = " and area.area_seq=" + area.areaSeq + " ";
    }
    this.getFilteredListing();
  }

  branchClick(branch) {
    console.log(branch);
    this.branchForm.controls['branch'].setValue(branch.branchSeq);
    this.loadLoansPage();
    // var index = -1;
    // for (let j = 0; j < this.filters.length; j++) {
    //   if (this.filters[j].key == 'Organization') {
    //     index = j;
    //     break;
    //   }
    // }
    // if (index > -1) {
    //   this.filters[index].value = branch.branchName;
    //   this.filterDto.geographyQuery = " and brnch.brnch_seq=" + branch.branchSeq + " ";
    // } else {
    //   this.filters.push({ key: 'Organization', value: branch.branchName });
    //   this.filterDto.geographyQuery = " and brnch.brnch_seq=" + branch.branchSeq + " ";
    // }
    // this.getFilteredListing();
  }
  portSeq = 0;
  portClick(port) {
    console.log(port);
    this.portSeq = port.portSeq;
    this.loadLoansPage();

    // var index = -1;
    // for (let j = 0; j < this.filters.length; j++) {
    //   if (this.filters[j].key == 'Organization') {
    //     index = j;
    //     break;
    //   }
    // }
    // if (index > -1) {
    //   this.filters[index].value = port.portfolioName;
    //   this.filterDto.geographyQuery = " and port.port_seq=" + port.portSeq + " ";
    // } else {
    //   this.filters.push({ key: 'Organization', value: port.portfolioName });
    //   this.filterDto.geographyQuery = " and port.port_seq=" + port.portSeq + " ";
    // }
    // this.getFilteredListing();
  }
  stateClick(state: any) {
    this.appendGeographyFilter('State', state.provName);
    this.commonService.applyFilter('state', state.provSeq).subscribe((res) => {
      this.allItems = res;
      if (this.genderSelected != '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); this.spinner.hide() });
  }

  districtClick(district: any) {
    this.appendGeographyFilter('District', district.districtName);
    this.commonService.applyFilter('district', district.districtSeq).subscribe((res) => {
      this.allItems = res;
      if (this.genderSelected != '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); this.spinner.hide() });
  }


  tehsilClick(tehsil: any) {
    this.appendGeographyFilter('Tehsil', tehsil.thslName);
    this.commonService.applyFilter('tehsil', tehsil.thslSeq).subscribe((res) => {
      this.allItems = res;
      if (this.genderSelected != '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); this.spinner.hide() });
  }



  ucClick(uc: any) {
    this.appendGeographyFilter('UC', uc.ucName + '-' + uc.ucDescription);
    this.commonService.applyFilter('uc', uc.ucSeq).subscribe((res) => {
      this.allItems = res;
      if (this.genderSelected != '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); this.spinner.hide() });
  }

  appendGeographyFilter(key, value) {

    let found = false;
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].type == 'geography') {
        found = true;
        this.filters[i].key = key;
        this.filters[i].value = value;
      }
    }
    if (!found) {
      this.filters.push({ key: key, value: value, type: 'geography' });
    }
    if (this.genderSelected != '') {
      this.genderFilter();
    }
  }


  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  onlyAlphaNumbers(event: any) {
    const pattern = /[a-zA-Z0-9 ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  cnicPatternObj: CNICPattern = new CNICPattern();

  cnicPattern(event: any, type: any) {
    if (event.code == "Backspace")
      this.isValid = false;

    if (event.keyCode == 8 || event.keyCode == 9
      || event.keyCode == 27 || event.keyCode == 13
      || (event.keyCode == 65 && event.ctrlKey === true))
      return;
    if ((event.keyCode < 48 || event.keyCode > 57))
      event.preventDefault();


    let length: number = 0;
    this.isValid = false;


    if (type == "client") {
      if (this.cnicPatternObj.clientCNIC.length)
        length = this.cnicPatternObj.clientCNIC.length;
      this.cnicPatternObj.clientCNIC = this.cnicPatternObj.clientCNIC.replace(/-/g, '');
      let array = this.cnicPatternObj.clientCNIC.split('');
      this.cnicPatternObj.clientCNIC = "";
      this.model.cnicNum = "";
      array.forEach((char, index) => {
        let asciiCode = char.charCodeAt(0);
        if (asciiCode >= 48 && asciiCode <= 57) {
          if (index == 5 || index == 12) {
            this.cnicPatternObj.clientCNIC = this.cnicPatternObj.clientCNIC + "-";
          }
          if (this.cnicPatternObj.clientCNIC.length < 15) {
            this.cnicPatternObj.clientCNIC = this.cnicPatternObj.clientCNIC + char;
            this.model.cnicNum = this.model.cnicNum + char;
          }
        }
      });
    } else if (type == "nominee") {
      if (this.cnicPatternObj.nomCnic.length)
        length = this.cnicPatternObj.nomCnic.length;
      this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic.replace(/-/g, '');
      let array = this.cnicPatternObj.nomCnic.split('');
      this.cnicPatternObj.nomCnic = "";
      this.model.nominee.cnicNum = "";
      array.forEach((char, index) => {
        let asciiCode = char.charCodeAt(0);
        if (asciiCode >= 48 && asciiCode <= 57) {
          if (index == 5 || index == 12) {
            this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + "-";
          }
          if (this.cnicPatternObj.nomCnic.length < 15) {
            this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + char;
            this.model.nominee.cnicNum = this.model.nominee.cnicNum + char;
          }
        }
      });
    } else if (type == "co-borrower") {
      if (this.cnicPatternObj.cobCNIC.length)
        length = this.cnicPatternObj.cobCNIC.length;
      this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC.replace(/-/g, '');
      let array = this.cnicPatternObj.cobCNIC.split('');
      this.cnicPatternObj.cobCNIC = "";
      this.model.coBorrower.cnicNum = "";
      array.forEach((char, index) => {
        let asciiCode = char.charCodeAt(0);
        if (asciiCode >= 48 && asciiCode <= 57) {
          if (index == 5 || index == 12) {
            this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + "-";
          }
          if (this.cnicPatternObj.cobCNIC.length < 15) {
            this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + char;
            this.model.coBorrower.cnicNum = this.model.coBorrower.cnicNum + char;
          }
        }
      });
    }
  }

  cnicPatternUpEvent(event: any, type: any) {
    // console.log("UP EVENT")
    // console.log(event)

  }
  getDate(str) {
    if (str.length > 0)
      return new Date(str)
    return "";
  }
  assocApprovedAmount = 0;
  assocProducts = [];
  assocProductSeq = null;
  selectedAssocLoan;
  associateLoan(loan) {

    // this.commonService.getRecoveryStatus(loan.loanAppId).subscribe((res) => {
    //   console.log(res);
    //   if (res.inst_num >= 4 && res.inst_num <= 7) {
    this.assocProducts = [];
    this.assocApprovedAmount = 0;
    this.assocProductSeq = null;
    this.selectedAssocLoan = loan;
    this.selectedAssocProduct = new LoanProduct();
    console.log(loan)
    this.spinner.show();
    let dto = {
      "clientSeq": loan.clientId,
      "productSeq": loan.prdSeq,
      "loanAppSeq": loan.loanAppSeq
    };
    console.log(dto);
    this.commonService.getAssociateProductsForProduct(JSON.stringify(dto)).subscribe((res) => {
      this.assocProducts = res;
      this.spinner.hide();
      (<any>$('#associateProductModel')).modal('show');
    }, (error) => { console.log(error); this.spinner.hide() });
    //   } else {
    //     this.toaster.error("Paid Installments must be between 3 & 6 \n Installment No. " + res.inst_num + " is due on " + this.getDateString(res.due_dt));
    //     this.spinner.hide();
    //   }
    // }, (error) => { console.log(error); this.spinner.hide() });

  }
  selectedAssocProduct = new LoanProduct();
  onAssocProductSelect(e) {
    this.assocProducts.forEach(p => {
      if (p.productSeq == e) {
        this.selectedAssocProduct = p;
      }
    });
  }
  getDateString(str) {
    let date = new Date(str);
    return ((date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate()) + "-" + (((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear();
  }
  onAssocProductSubmit() {
    // if(this.selectedAssocLoan.ODAmount>0){
    //   this.toaster.error("This Client is in Over Due.");
    //   return;
    // }
    if (this.selectedAssocProduct.minAmount > this.assocApprovedAmount) {
      this.toaster.error("Approved Amount should be more than or equal to Minimum Amount");
      return;
    }
    if (this.selectedAssocProduct.maxAmount < this.assocApprovedAmount) {
      this.toaster.error("Approved Amount should not exceed Maximum Amount");
      return;
    }
    if ((+this.assocApprovedAmount % 1000) > 0) {
      this.toaster.error("Approved Amount should be multiple of 1000");
      return;
    }
    let assocLoanProductDto = new LoanProductAssoc();
    assocLoanProductDto.approvedAmount = this.assocApprovedAmount;
    assocLoanProductDto.loanProd = this.selectedAssocProduct.productSeq;
    assocLoanProductDto.installments = this.selectedAssocProduct.installments;
    assocLoanProductDto.limitRule = this.selectedAssocProduct.limitRule;
    assocLoanProductDto.prdRul = this.selectedAssocProduct.prdRul;
    assocLoanProductDto.termRule = this.selectedAssocProduct.termRule;
    assocLoanProductDto.clientSeq = +this.selectedAssocLoan.clientId;
    assocLoanProductDto.prntLoanAppSeq = +this.selectedAssocLoan.loanAppSeq;
    this.spinner.show();
    this.loanService.submitAssocLoanApp(assocLoanProductDto).subscribe(res => {
      // this.spinner.hide();
      // Modified By Naveed - Date - 24-02-2022
      // KSK show Message 
      if(res['warning']){
        this.toaster.warning(res['warning'], 'Warning')
      }else if(res['success']){
        this.toaster.success("Application Submitted", 'Success');
      } // Ended By Naveed
      (<any>$('#associateProductModel')).modal('hide');
      this.getAllLoan();
    }, error => {
      this.spinner.hide();
      this.toaster.error(error.error.text, "Error");
      console.log('err', error);
    });
    // (<any>$('#associateProductModel')).modal('hide');
  }
  cancelClicked() {
    (<any>$('#associateProductModel')).modal('hide');
  }
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);


  findValueFromGrpCd(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeRefCd == key) {
          return array[i].codeValue;
        }
      }
    }
  }
  getFilteredListing() {
    // this.loanService.
    this.spinner.show();
    this.filterDto.role = this.auth.role;
    this.loanService.getAllLoanInfoFiltered(this.filterDto).subscribe(res => {
      this.spinner.hide();
      this.loans = res;
      this.allItems = res;
      // this.setPage(0);
      this.setAddressStringInAllItems(this.allItems);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinner.hide();
    })
  }
  deferedLoan;
  disgardApp(loan) {
    (<any>$('#disgardApp')).modal('show');
    this.disgardForm = this.fb.group({
      //update
      loanAppSeq: [loan.loanAppSeq, Validators.required],
      role: [ this.auth.role, Validators.required ],
      cmnt: [''],
    });
    this.deferedLoan = loan;
  }

  onSubmitDisgardApp() {
    (<any>$('#disgardApp')).modal('hide');
    this.disgardForm.value.cmnt == null ? " " : this.disgardForm.value.cmnt;
    this.recoveryService.deleteApplication(this.disgardForm.value).subscribe(() => {
      //update 
      this.deferedLoan.loanAppStatus = 'Deferred';
      // this.recoveryService.defferApplicationLoanService(this.disgardForm.value).subscribe(() => {
      // });
    }, error => console.log('There was an error: ', error));

  }
  rescheduleMonthChange(e) {
    let v = e.value * 30;
    this.reScheduleForm.controls['days'].setValue(v);
    this.reScheduleForm.controls['perd'].setValue(e.value);
  }

  rescheduleMethodChange(e) {
    this.reScheduleForm.controls['methdSeq'].setValue(e.value);

  }

  reSchedule(clnt) {
    console.log(clnt);
    (<any>$('#reSchedule')).modal('show');
    this.reScheduleForm = this.fb.group({
      methdSeq: [{ value: 1, disabled: false }, Validators.required],
      // clntId: [{ value: clnt.clientId, disabled: true }, Validators.required],
      clntSeq: [clnt.clientSeq, Validators.required],
      // clntNm: [{ value: clnt.firstName + ' ' + clnt.lastName, disabled: true }, Validators.required],
      loanAppSeq: [{ value: clnt.loanAppSeq, disabled: true }, Validators.required],
      days: ['', Validators.required],
      perd: [0, Validators.required],
      rsnKey: ['', Validators.required],
      cmnt: ['']
    });
  }
  // submitReschedule() {
  //   (<any>$('#reSchedule')).modal('hide');
  //   let clntSeq = this.reScheduleForm.get('clntSeq').value;
  //   let months = this.reScheduleForm.get('months').value;
  //   let method = this.reScheduleForm.get('method').value;
  //   this.loanServicingService.reschedule(method, clntSeq, months).subscribe(d => {
  //   });
  // }


  submitReschedule() {
    this.spinner.show();
    this.loanServicingService.rescheduleForPosting(this.reScheduleForm.getRawValue()).subscribe(d => {
      (<any>$('#reSchedule')).modal('hide');
      this.spinner.hide();
      this.toaster.success('Credit Reschedule', "Success")
      console.log(d)
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        this.toaster.error(error.error.error, "Error")
      }
    });
  }

}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export class FilterDto {
  userId;
  genderCd;
  genderQuery;
  maritalStsCd;
  maritalQuery;
  geographyCd;
  geographyQuery;
  StatusCd;
  role;
  constructor(id) {
    this.userId = id;
  }

}