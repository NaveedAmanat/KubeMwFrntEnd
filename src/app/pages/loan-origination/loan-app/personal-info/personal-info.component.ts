import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { LoanService } from '../../../../shared/services/loan.service';
import { Router } from '@angular/router';
import { Address } from '../../../../shared/models/address.model';
import { CommonService } from '../../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, Validators } from '@angular/forms';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { Auth } from '../../../../shared/models/Auth.model';
import { CNICPattern } from '../../../../shared/models/CNICPattern.model';
import { ValueTransformer } from '../../../../../../node_modules/@angular/compiler/src/util';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { MomentUtcDateAdapter } from 'src/app/shared/adapters/moment-date-adapter';
import { DataService } from 'src/app/shared/services/data.service';

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

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
})



export class PersonalInfoComponent implements OnInit, DoCheck {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  model: any; formSaved = false;
  now: any;
  date: any = new Date();
  eightenYearsBefore: any;
  minDobYear: any;
  isMarried = false;
  matcher = new MyErrorStateMatcher();
  cnicPattern: CNICPattern = new CNICPattern();

  formControl: FormControl; maxDate;

  totalmnthsOfResidence: number;
  hasExpired = false;

  hasPermission = false;
  constructor(private loanService: LoanService, private router: Router,
    private commonService: CommonService, private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider, private toaster: ToastrService,
    private dataService: DataService) {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    // this.readonly = (this.auth.role == 'admin') ? true: false;
    this.now = new Date();
    this.spinner.hide();
    let month: any;
    if ((this.now.getMonth() + 1) < 10) {
      month = '0' + (this.now.getMonth());
    } else {
      month = '' + (this.now.getMonth());
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
    this.eightenYearsBefore = new Date((year - 18), month, day);
    this.minDobYear = new Date((year - 64), month, (+day + 1));
    this.maxDate = (year + 100) + '-' + month + '-' + day;
  }
  isSingle = false;
  calculateTotalMonth() {
    if (this.model.mnthsOfResidence == null || this.model.mnthsOfResidence == '') { this.model.mnthsOfResidence = 0; }
    this.totalmnthsOfResidence = (+this.model.yearsOfResidence * 12) + +this.model.mnthsOfResidence;
  }
  maritalStatusChange() {
    if (this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) ===
      'MARRIED' || this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) ===
      'Married' || this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) === 'married') {
      this.isMarried = true;
      this.model.fathrFirstName = "";
      this.model.fathrLastName = "";
    } else {
      this.isMarried = false;
      this.model.spzFirstName = "";
      this.model.spzLastName = "";
    }
    if (this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) ===
      'SINGLE' || this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) ===
      'Single' || this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus) === 'single') {
      this.isSingle = true;
      this.model.numOfChidren = 0;
    } else {
      this.isSingle = false;
    }
  }
  ngDoCheck() {
    sessionStorage.setItem('isSavedPersonalInfo', this.formSaved.toString());
  }
  basicCrumbs: any[] = [];
  auth: Auth; charArray: any[] = []; str: string = "";
  checkExpiry() {
    return false;
  }
  ngOnInit() {
    this.spinner.show();
    this.model = JSON.parse(sessionStorage.getItem('model'));
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'personal-info' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    sessionStorage.setItem("model", JSON.stringify(this.model));
    this.isVerified = false;
    this.model.smHsldFlg = false;
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    if (this.model.expiryDate) {
      if ((new Date(this.model.expiryDate) < (new Date()))) {
        this.hasExpired = true;
      }
    }
    // this.model = this.loanService.landingModel;

    ///  CNIC Pattern
    this.str = this.model.cnicNum + "";
    this.charArray = this.str.split("");
    this.charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        this.cnicPattern.clientCNIC = this.cnicPattern.clientCNIC + '-';
      this.cnicPattern.clientCNIC = this.cnicPattern.clientCNIC + item;
    })

    this.clientPhone = this.model.phone;
    if (this.model.forms) {
      let hasboth = false;
      this.model.forms.forEach(element => {
        if (element.formUrl == 'nominee') {
          this.model.forms.forEach(form => {
            if (form.formUrl == 'next-of-kin') {
              hasboth = true;
              form.hasNextOfKin = true;
              element.hasNextOfKin = true;
              hasboth = true;
            }
          })
        }
      });
      this.model.forms.forEach(
        (element, index) => {
          if ((element.formUrl === 'co-borrower' && this.model.selfPDC) || (element.formUrl === 'co-borrower' && this.model.isSAN)) {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
          } else if (element.formUrl == "mfcib" || element.formUrl == "documents") {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          } else if (element.formUrl == 'next-of-kin') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {

                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else if (element.formUrl == 'nominee') {
            if (this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
              element.formNm = "Nominee Info / Murabaha User";
            }
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == false || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else {
            if (this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
              if(element.formUrl == 'insurance-info') {
                element.formNm = "Takaful Info";
              }
              if(element.formUrl == 'expected-loan-utilication') {
                element.formNm = "Murabaha Utilization Plan";
              }
            }
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          }
          if ('/loan-origination/app/' + element.formUrl === this.router.url) {
            this.model.formSeq = element.formSeq;
          }
        }
      );
    }
    // this.model.selfPDC = false;
    console.log(this.model);
    this.calculateTotalMonth();
    // this.maritalStatusChange(this.model.maritalStatusKey);
    // this.totalmnthsOfResidence = (this.model.yearsOfResidence*12)+this.model.mnthsOfResidence;
    let array;
    if (this.model.dob) {
      array = this.model.dob.split('T', 1);
      if (array.length) {
        this.model.dob = array[0];
        this.model.clntAge = this.calculateAge(new Date(this.model.dob));
      }
    }

    if (this.model.cnicIssueDate) {
      array = this.model.cnicIssueDate.split('T', 1);
      if (array.length) {
        this.model.cnicIssueDate = array[0];
      }
    }

    if (this.model.expiryDate) {
      array = this.model.expiryDate.split('T', 1);
      if (array.length) {
        this.model.expiryDate = array[0];
      }
    }
    this.getLocations();
    this.loadLovs();



    if (sessionStorage.getItem('editLoan') === 'true') {
      this.formSaved = true;
      this.loanService.getLoanApp(this.model.loanSeq).subscribe((res) => {
        // res.clientSeq = this.model.clientSeq;
        res.loanApp.clientSeq = this.model.clientSeq;
        res.loanApp.totIncmOfErngMemb = this.model.totIncmOfErngMemb;
        res.loanApp.bizDtl = this.model.bizDtl;
        this.model = Object.assign(this.model, res.loanApp, this.model);
        this.model.clntAge = this.calculateAge(new Date(this.model.dob));
        if (this.model.forms.length === 0) {
          this.model.forms = res.forms;
          // this.model.forms.forEach(
          //   forms => {
          //     if (forms.formUrl == "mfcib" || forms.formUrl == "documents") {
          //       forms.isSaved = true;
          //       this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
          //     } else if (forms.formUrl == "submit" && this.auth.role == 'bm') {
          //       forms.formNm = "Process Application";
          //       this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
          //     } else if (!(forms.formUrl === 'co-borrower' && this.model.isSelfPdc)) {
          //       this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
          //     } else {
          //       this.breadcrumbProvider.addDisabledItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, true);
          //     }
          //     if ('/loan-origination/app/' + forms.formUrl === this.router.url) {
          //       this.model.formSeq = forms.formSeq;
          //     }
          //   }
          // );
          if (this.model.forms) {
            let hasboth = false;
            this.model.forms.forEach(element => {
              if (element.formUrl == 'nominee') {
                this.model.forms.forEach(form => {
                  if (form.formUrl == 'next-of-kin') {
                    hasboth = true;
                    form.hasNextOfKin = true;
                    element.hasNextOfKin = true;
                    hasboth = true;
                  }
                })
              }
            });
            this.model.forms.forEach(
              (element, index) => {
                if ((element.formUrl === 'co-borrower' && this.model.selfPDC) || (element.formUrl === 'co-borrower' && this.model.isSAN)) {
                  element.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
                } else if (element.formUrl == "mfcib" || element.formUrl == "documents") {
                  element.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                } else if (element.formUrl == "submit" && this.auth.role == 'bm' || this.auth.role == 'ho') {
                  element.formNm = "Process Application";
                  this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
                } else if (element.formUrl == 'next-of-kin') {
                  if (hasboth) {
                    this.model.hasNextOfKin = true;
                    if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined) {

                      this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
                    } else {

                      this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                    }
                  } else {
                    this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                  }
                } else if (element.formUrl == 'nominee') {
                  if (this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
                      element.formNm = "Nominee Info / Murabaha User";
                  }
                  if (hasboth) {
                    this.model.hasNextOfKin = true;

                    if (this.model.isNomDetailAvailable == false || this.model.isNomDetailAvailable == undefined) {
                      this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
                    } else {
                      this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                    }
                  } else {
                    this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                  }
                } else {
                  if (this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
                    if(element.formUrl == 'insurance-info') {
                      element.formNm = "Takaful Info";
                    }
                    if(element.formUrl == 'expected-loan-utilication') {
                      element.formNm = "Murabaha Utilization Plan";
                    }
                  }
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                }

                // Modified by Areeba - 9-12-2022 - Credit Utilization Amt should be less than Approved Amt
                if (element.formUrl == 'expected-loan-utilication') {
                  this.loanService.getExpenseLoanInfo(this.model.loanAppSeq).subscribe((res) => {
                    this.model.recAmount = res.recAmount;
                    this.model.loanUtilization = res.loanUtilization;
                    sessionStorage.setItem("model", JSON.stringify(this.model));
                  }, (error) => {
                    console.log('err In Loan Service');
                    console.log('err', error);
                  });
                }
                // Ended by Areeba
                if ('/loan-origination/app/' + element.formUrl === this.router.url) {
                  this.model.formSeq = element.formSeq;
                }
              }
            );
          }
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));

      }, (error) => {
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }
    this.commonService.getValues(this.model.loanProdGrp=='21' ? REF_CD_GRP_KEYS.RESIDENCE_HIL : REF_CD_GRP_KEYS.RESIDENCE).subscribe((res) => {
      this.residenceArray = res;
    }, (error) => {
      console.log('err', error);
    });

    this.dataService.editPortfolio(this.model.portKey).subscribe((res) => {
      this.portfolio = res;
    });
    this.spinner.hide();
  }

  portfolio: any;

  ngAfterViewInit(){
    setTimeout(()=>{
       // Added by Naveed 29-07-2021
        this.hasPermission = this.commonService.checkPermission('personal-info', this.model);
    // end
    }, 1000)
  }

  addresses: Address[] = [];
  smhldddress: Address = new Address();
  getLocations() {
    this.loanService.getLocationsForPort(this.model.portSeq).subscribe((res) => {
      this.addresses = res;
      // this.addresses = res;
    }, (error) => {
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  onPersonalInfoSubmit() {
    // return;
    console.log(this.model);
    if (this.model.firstName == null || this.model.firstName == '' ||
      //this.model.motherMaidenName == null || this.model.motherMaidenName == '' ||
      this.model.phone == null || this.model.phone == '' ||
      this.model.dob == null || this.model.dob == '' ||
      this.model.genderKey == 0 || this.model.maritalStatusKey == 0 ||
      this.model.eduLvlKey == 0 || this.model.occupationKey == 0 ||
      this.model.residenceTypeKey == 0 || this.model.refCdLeadTypSeq == null) {
      $('#basic-tab').click();
      this.toaster.warning('Fields Missing in Personal-Info');
      return;
    }
    if (+this.model.numOfDependts > +this.model.houseHoldMember) {
      this.toaster.error("Dependents can not exceed Household Members"); $('#basic-tab').click(); return;
    }
    // if (+this.model.numOfChidren > +this.model.numOfDependts) {
    //   this.toaster.error("Children can not exceed Dependants"); $('#basic-tab').click(); return;
    // }
    if ((+this.model.earningMembers > +this.model.houseHoldMember)) {
      this.toaster.error("Earning Members can not exceed Household Members"); $('#basic-tab').click(); return;
    }
    if (this.model.earningMembers <= 0) {
      this.toaster.error("Invalid Number of Earning Members"); $('#basic-tab').click(); return;
    }
    if (this.isMarried) {
      if (this.model.spzFirstName == null || this.model.spzFirstName == '' ||
        this.model.spzLastName == null || this.model.spzLastName == '') {
        $('#basic-tab').click();
        this.toaster.warning('Fields Missing in Spouse’s Information');
        return;
      }
    } else {
      if (this.model.fathrFirstName == null || this.model.fathrFirstName == '' ||
        this.model.fathrLastName == null || this.model.fathrLastName == '') {
        $('#basic-tab').click();
        this.toaster.warning('Fields Missing in Father’s Information');
        return;
      }
      this.model.sameAsFS = { firstName: this.model.fathrFirstName, lastName: this.model.fathrLastName };
    }
    if (this.model.provinceName == null || this.model.provinceName == '' || this.model.otherDetails == null || this.model.otherDetails == '' ||
      this.model.houseNum == null || this.model.houseNum == '' || this.model.village == null || this.model.village == '' || this.model.otherDetails == null || this.model.otherDetails == ''
      || this.model.sreet_area == null || this.model.sreet_area == '' || this.model.community == null || this.model.community == '') {
      $('#address-tab').click();
      this.toaster.warning('Fields Missing in Address');
      return;
    } else {
      this.loanService.clientAddress.provinceName = this.model.provinceName;
      this.loanService.clientAddress.distName = this.model.districtName;
      this.loanService.clientAddress.tehsilName = this.model.tehsilName;
      this.loanService.clientAddress.ucName = this.model.ucName;
      this.loanService.clientAddress.cityName = this.model.cityName;
      this.loanService.clientAddress.houseNum = this.model.houseNum;
      this.loanService.clientAddress.sreet_area = this.model.sreet_area;
      this.loanService.clientAddress.village = this.model.village;
      this.loanService.clientAddress.otherDetails = this.model.otherDetails;
      this.loanService.clientAddress.otherDetails = this.model.otherDetails;
      this.loanService.clientAddress.community = this.model.community;
    }
    if (!this.model.isPermAddress) {
      if (this.model.permAddress == null || this.model.permAddress == '') {
        $('#address-tab').click();
        this.toaster.warning('Add Permament Address');
        return;
      }
    }
    if (+this.model.yearsOfResidence <= 0 && +this.model.mnthsOfResidence <= 0) {
      $('#address-tab').click();
      this.toaster.warning('Invalid Residence Tenure in Months');
      return;
    }
    if (this.hasExpired) {
      if (this.model.tokenNum == null || this.model.tokenNum == "") {
        $('#basic-tab').click();
        this.toaster.warning('Token Number Missing');
        return;
      }
      if (this.model.tokenDate == null || this.model.tokenDate == "") {
        $('#basic-tab').click();
        this.toaster.warning('Token Date Missing');
        return;
      }
    }
    this.spinner.show();
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.loanService.updatePersonalInfo(this.model).subscribe((res) => {
        this.spinner.hide();
        this.toaster.success('Personal-Info Saved');
        sessionStorage.setItem("model", JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        if (error.status == 500) {
          this.toaster.error('Internal Server Error', 'Error!');
        } else {
          this.toaster.error(error.error.error, 'Error!');
        }
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      this.loanService.savePersonalInfo(this.model).subscribe((res) => {

        this.basicCrumbs.forEach(element => {
          if (this.router.url == '/loan-origination/app/' + element.formUrl) {
            element.isSaved = true;

            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            // this.breadcrumbProvider.updateSavedStatusViaLabel(element.formNm, element.formUrl, element.isSaved);
          }
        });
        sessionStorage.setItem('basicCrumbs', JSON.stringify(this.basicCrumbs));
        this.spinner.hide();
        this.toaster.success('Personal-Info Saved');
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error('Internal Server Error', 'Error!');
        } else {
          this.toaster.error(error.error.error, 'Error!');
        }
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }
  }
  continueClicked() {
    this.router.navigate(['loan-origination/app/loan-info']);
  }
  onDOBChange(dob: string) {
    this.model.clntAge = this.calculateAge(new Date(dob));
    let date: any;
    if (this.model.dob) {
      date = new Date(this.model.dob);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.dob = date.getFullYear() + '-' + month + '-' + day;
    }
  }

  onExpChange(dob: string) {
    let date: any;
    if (this.model.expiryDate) {
      date = new Date(this.model.expiryDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.expiryDate = date.getFullYear() + '-' + month + '-' + day;
    }
    if (this.model.cnicIssueDate) {
      date = new Date(this.model.cnicIssueDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.cnicIssueDate = date.getFullYear() + '-' + month + '-' + day;
    }
  }

  calculateAge(birthday) { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  address: Address = new Address();
  selectAddress(add: Address) {
    this.address = add;
    Object.assign(this.model, add, this.model);
  }

  education: any;
  occupation: any;
  gender: any;
  maritalStatus: any;
  disability: any;
  residenceArray: any = [];
  communityArray: any;
  // Added by Areeba - Dated 13-05-2022
  lead : any;
  // Ended by Areeba

  loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.EDUCATION).subscribe((res) => {
      this.education = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.OCCUPATION).subscribe((res) => {
      this.occupation = res;
    }, (error) => {
      console.log('err', error);
    });

    //Added by Areeba - Dated - 13-05-2022
    this.commonService.getValuesByRefCdGRp('0110').subscribe(d => {
      this.lead = d
      console.log('RefCdLeadTyp:', d);
    }
    );
    //Ended by Areeba

    this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
      this.gender = res;
      if (sessionStorage.getItem('editLoan') != 'true') {
        if (+this.model.cnicNum % 2) {
          this.model.genderKey = this.findKeyFromValue('MALE', this.gender);
        } else {
          this.model.genderKey = this.findKeyFromValue('FEMALE', this.gender);
        }
      }
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.MARITAL_STATUS).subscribe((res) => {
      this.maritalStatus = res;
      this.maritalStatusChange();
    }, (error) => {
      console.log('err', error);
    });
    // this.disability = this.lovService("OCCUPATION");
    this.commonService.getValues(REF_CD_GRP_KEYS.NATURE_OF_DISABILITY).subscribe((res) => {
      this.disability = res;
    }, (error) => {
      console.log('err', error);
    });

    setTimeout(() => {
      this.commonService.getValues(this.model.loanProdGrp=='21' ? REF_CD_GRP_KEYS.RESIDENCE_HIL : REF_CD_GRP_KEYS.RESIDENCE).subscribe((res) => {
        this.residenceArray = res;
      }, (error) => {
        console.log('err', error);
      });
    }, 1000);

    this.commonService.getCommunityForPort(this.model.portKey).subscribe((res) => {
      this.communityArray = res;
    }, (error) => {
      console.log('err', error);
    });
  }

  lovService(name: string) {
    this.commonService.getValues(name).subscribe((res) => {
      return res;
    }, (error) => {
      console.log('err', error);
    });
  }
  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == key) {
          return array[i].codeValue;
        }
      }
    }
  }
  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  clientPhone: any = "";
  phoneNumber(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (this.clientPhone == null)
      this.clientPhone = "";
    if (this.clientPhone.length == 0)
      this.clientPhone = "(" + this.clientPhone;
    if (this.clientPhone.length == 5)
      this.clientPhone = this.clientPhone + ")";
    if (this.clientPhone.length < 13) {
      this.model.phone = this.clientPhone.replace(/[()]/g, '');
      this.model.phone = this.clientPhone.replace(/ /g, '');
      this.model.phone = this.model.phone + event.key;
    }
  }
  alphaNumeric(event: any) {
    const pattern = /[0-9a-zA-Z/ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  findKeyFromValue(value, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeValue == value) {
          return array[i].codeKey;
        }
      }
    }
  }

  selfPdcChange() {
    this.loanService.selfPDC = this.model.selfPDC;
  }

  disabilityChange() {
    if (!this.model.disableFlag)
      this.model.natureDisabilityKey = null;
  }

  hsldChange() {

  }

  verifyCnic() {
    if (this.cnicPatternObj.clientCNIC.length == 15) {
      this.loanService.getSmhldData(this.model.cnicNum).subscribe((res) => {
        if (res != null) {
          this.model.houseNum = res.houseNum;

          this.isVerified = true;
        }
        else {
          this.isVerified = false;
          this.toaster.error("Unable to find record");
        }
      }, (error) => {
        console.log('err In Loan Service');
        console.log('err', error);
      });
      return;
    }

  }

  isVerified: boolean;
  isValid: boolean;
  cnicPatternObj: CNICPattern = new CNICPattern();
  cnicPattern1(event: any, type: any) {
    this.isVerified = false;
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

  }

  PermAddressChange() {
    if (this.model.isPermAddress) {
      this.model.permAddress = "";
    }
  }
  checkValidity(val1, val2) {
    if (val1 > val2) {
      return true;
    }
    return false;
  }
  isDisabled(){
    if(this.model.loan_app_sts_seq == 700 || this.model.loan_app_sts_seq == 702){
      return false;
    }else{
      return true;
    }
  }
}
