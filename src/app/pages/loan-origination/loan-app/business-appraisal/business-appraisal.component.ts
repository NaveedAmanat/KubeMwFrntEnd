import { Component, DoCheck, OnInit } from '@angular/core';
import { Address } from '../../../../shared/models/address.model';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { PrimaryIncome } from '../../../../shared/models/PrimaryIncome.model';
import { BusinessExpense } from '../../../../shared/models/BusinessExpense.model';
import { BusinessAppraisal } from '../../../../shared/models/BusinessAppraisal.model';
import { CommonService } from '../../../../shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MFCIBLoan } from '../../../../shared/models/mfcib.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Nominee } from '../../../../shared/models/Nominee.model';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';

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
  selector: 'app-business-appraisal',
  templateUrl: './business-appraisal.component.html',
  styleUrls: ['./business-appraisal.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BusinessAppraisalComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  livestockForm: FormGroup;
  livestock = [];
  financeForm: FormGroup;
  finance = [];
  model: any; formSaved = false;
  coborrowerFormData: any = new Object();
  matcher = new MyErrorStateMatcher();
  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  hasPermission = false;
  nominee: any;
  businessRunningPersonal: any;

  constructor(private router: Router,
    private fb: FormBuilder,
    private loanService: LoanService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService) {

  }
  totalmnths: number; cpPercentage: string;
  onPersonelChange() {
    let p = this.findValueFromKey(this.model.businessAppraisal.personRunningBusinessKey, this.businessRunner);
    if (p == 'SELF') {
      this.cpPercentage = '100%';
    } else {
      this.cpPercentage = '50%';
    }
  }
  calculateTotalMonth() {
    if(this.model.businessAppraisal.monthsInBusiness==null || this.model.businessAppraisal.monthsInBusiness == ''){this.model.businessAppraisal.monthsInBusiness = 0;}
    if (this.model.businessAppraisal.yearsInBusiness == '' || this.model.businessAppraisal.yearsInBusiness == null){this.model.businessAppraisal.yearsInBusiness = 0;}
    if(this.model.businessAppraisal.monthsInBusiness == 0 && this.model.businessAppraisal.yearsInBusiness == 0){this.toaster.error('Invalid Years/Months');return;}
    
    if ((this.model.businessAppraisal.monthsInBusiness == undefined || this.model.businessAppraisal.monthsInBusiness == null) && (this.model.businessAppraisal.yearsInBusiness == undefined || this.model.businessAppraisal.yearsInBusiness == null)) {
      this.totalmnths = null;
    } else if (this.model.businessAppraisal.yearsInBusiness == undefined || this.model.businessAppraisal.yearsInBusiness == null) {
      this.totalmnths = +this.model.businessAppraisal.monthsInBusiness;
    } else if (this.model.businessAppraisal.monthsInBusiness == undefined || this.model.businessAppraisal.monthsInBusiness == null) {
      this.totalmnths = Math.floor((+this.model.businessAppraisal.yearsInBusiness * 12));
    } else {
      this.totalmnths = Math.floor((+this.model.businessAppraisal.yearsInBusiness * 12) + +this.model.businessAppraisal.monthsInBusiness);
    }
  }

  // calculate
  ngDoCheck() {
    sessionStorage.setItem('isSavedbusiness', this.formSaved.toString());
  }

  calculateTotalValues() {
    this.calculateTotalMonth();
    this.totalPrimaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.primaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.primaryIncome[i].incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
    }
    this.totalSecondaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.secondaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.secondaryIncome[i].incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
    }
    this.totalBusinessExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.businessExpense.length; i++) {
      const x = +this.model.businessAppraisal.businessExpense[i].expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
    }
    this.totalHouseholdExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.householdExpense.length; i++) {
      const x = +this.model.businessAppraisal.householdExpense[i].expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
    }
    this.incomeChange();
  }

  ngOnInit() {
    this.livestockForm = this.fb.group({
      kindOfAnimal: ['', Validators.required],
      breedVal: ['', Validators.required],
      headcount: ['', Validators.required],
      marketVal: ['', Validators.required],
      animalType: ['', Validators.required]
    });
    this.financeForm = this.fb.group({
      kindOfAnimal: ['', Validators.required],
      breedVal: ['', Validators.required],
      headcount: ['', Validators.required],
      purchaseVal: ['', Validators.required],
      animalType: ['', Validators.required],
      finCliVal: ['', Validators.required],
      finKshVal: ['', Validators.required]
    });

    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
    });
    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));
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
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          }
          if ('/loan-origination/app/' + element.formUrl === this.router.url) {
            this.model.formSeq = element.formSeq;
          }
        }
      );
    }

    if (!this.model.businessAppraisal) {
      this.model.businessAppraisal = new BusinessAppraisal(this.model.loanAppSeq, this.model.formSeq);
      this.model.businessAppraisal.businessAddress = new Address();
      this.model.businessAppraisal.primaryIncome = [];
      this.model.businessAppraisal.secondaryIncome = [];
      this.model.businessAppraisal.businessExpense = [];
      this.model.businessAppraisal.householdExpense = [];
    } else {
      this.calculateTotalValues();
    }
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.loanService.getBusinessAppraisal(this.model.loanAppSeq).subscribe((res) => {
        console.log('getBusinessAppraisal-Edit', res)
        // Added by Zohaib Asim - Dated 23-05-2022 - Business Running Personal
        this.businessRunningPersonal = res.BusinessApraisal.personRunningBusinessKey;
        
        if (res.BusinessApraisal != null && res.BusinessIncome != null) {
          // this.addresses = res;
          // this.addresses = res;
          // this.model.businessAppraisal = res.BusinessAprasal;
          Object.assign(this.model.businessAppraisal, res.BusinessApraisal, this.model.businessAppraisal);
          Object.assign(this.model.businessAppraisal, res.BusinessIncome, this.model.businessAppraisal);
          // this.model.businessAppraisal.primaryIncome = res.primaryIncome;
          // this.model.businessAppraisal.secondaryIncome = res.secondaryIncome;
          // this.model.businessAppraisal.businessExpense = res.businessExpense;
          // this.model.businessAppraisal.householdExpense = res.householdExpense;
          // this.model.businessAppraisal.businessAddress = res.BusinessAprasal;
          console.log('this.model.businessAppraisal:', this.model.businessAppraisal);

          let addr = res.BusinessApraisal;
          this.model.businessAppraisal.businessAddress = new Address();
          this.model.businessAppraisal.businessAddress.provinceName = addr.provinceName;
          this.model.businessAppraisal.businessAddress.districtName = addr.districtName;
          this.model.businessAppraisal.businessAddress.tehsilName = addr.tehsilName;
          this.model.businessAppraisal.businessAddress.ucName = addr.ucName;
          this.model.businessAppraisal.businessAddress.cityName = addr.cityName;
          this.model.businessAppraisal.businessAddress.houseNum = addr.houseNum;
          this.model.businessAppraisal.businessAddress.sreet_area = addr.sreet_area;
          this.model.businessAppraisal.businessAddress.village = addr.village;
          this.model.businessAppraisal.businessAddress.otherDetails = addr.otherDetails;
          this.model.businessAppraisal.businessAddress.city = addr.city;
          this.model.businessAppraisal.businessAddress.tehsil = addr.tehsil;
          this.model.businessAppraisal.businessAddress.district = addr.district;
          this.model.businessAppraisal.businessAddress.uc = addr.uc;
          this.model.businessAppraisal.businessAddress.community = addr.community;
          // Object.assign(this.model.businessAppraisal.businessAddress, res.BusinessApraisal, this.model.businessAppraisal.businessAddress);
          if (this.model.businessAppraisal.activityKey != null && this.model.businessAppraisal.activityKey != 0 && this.model.businessAppraisal.activityKey != undefined) {
            this.loanService.getBusinessActyForActySeq(this.model.businessAppraisal.activityKey).subscribe((res) => {
              console.log(res);
              // this.model.

              if (res.length > 0) {
                this.activity = res;
                this.model.businessAppraisal.sectorKey = res[0].bizSectSeq;
              }
            })
          }
        }
        this.calculateTotalValues();
        this.onPersonelChange();
        this.loadLovs();
        this.onSectorChangeLocal();
      }, (error) => {
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      this.loadLovs();
      this.onSectorChangeLocal();
    }
    this.model.businessAppraisal.clientSeq = this.model.clientSeq;
    this.model.businessAppraisal.loanAppSeq = this.model.loanSeq;
    this.getLocations();

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('business-appraisal', this.model);
    // end
  }
  otherLoanAmountPerMonth = 0;
  otherLoans: MFCIBLoan[] = [];
  addresses: Address[] = [];
  getLocations() {
    this.loanService.getLocationsForPort(this.model.portSeq).subscribe((res) => {
      console.log(res);
      this.addresses = res;
      // this.addresses = res;
    }, (error) => {
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  continueClicked() {
    // this.router.navigate(['loan-origination/expected-loan-utilication']);
    if (this.model.forms) {
      let i = 0;
      this.model.forms.forEach(
        forms => {
          if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
            this.router.navigate(["/loan-origination/app/" + this.model.forms[i + 1].formUrl]);
          }
          i++;
        }
      );
    }
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
  findKeyFromValue(value, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeValue == value) {
          return array[i].codeKey;
        }
      }
    }
    return -1;
  }

  findSeqFromCd(cd, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeRefCd == cd) {
          return array[i].codeKey;
        }
      }
    }
    return -1;
  }
  findCdFromSeq(seq, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == seq) {
          return array[i].codeRefCd;
        }
      }
    }
    return -1;
  }
  onBusinessAppraisalFormSubmit() {
    this.spinner.show();

    console.log( 'onBusinessAppraisalFormSubmit:', this.model.businessAppraisal);
    // this.coborrowerFormData = Object.assign(this.coborrowerFormData ,this.model.coBorrower,this.model.coBorrowerAddress);

    // this.model.businessAppraisal.businessAddress.tehsil = '1';
    // this.model.businessAppraisal.businessAddress.union = '1';
    // this.model.businessAppraisal.businessAddress.uc = '1';
    // this.model.businessAppraisal.businessAddress.district = '1';
    // this.model.businessAppraisal.businessAddress.city = '1';

    if(this.model.businessAppraisal.monthsInBusiness == 0 && this.model.businessAppraisal.yearsInBusiness == 0){this.toaster.error('Invalid Years/Months'); this.spinner.hide();return;}
    

    if (!this.model.businessAppraisal.isbizAddrSAC) {
      if (this.model.businessAppraisal.businessAddress.provinceName == null ||
        this.model.businessAppraisal.businessAddress.provinceName === '' ||
        this.model.businessAppraisal.businessAddress.otherDetails == null ||
        this.model.businessAppraisal.businessAddress.otherDetails === '' ||
        this.model.businessAppraisal.businessAddress.houseNum == null ||
        this.model.businessAppraisal.businessAddress.houseNum === '' ||
        this.model.businessAppraisal.businessAddress.village == null ||
        this.model.businessAppraisal.businessAddress.village === '' ||
        this.model.businessAppraisal.businessAddress.otherDetails == null ||
        this.model.businessAppraisal.businessAddress.otherDetails === '') {
        $('#address-tab').click();
        this.toaster.warning('Fields Missing in Address');
        this.spinner.hide();
        return;
      }
    }
    if (this.model.businessAppraisal.maxMonthSale === null ||
      this.model.businessAppraisal.maxMonthSale === '' ||
      this.model.businessAppraisal.maxSaleMonth == null || this.model.businessAppraisal.maxSaleMonth === '' ||
      this.model.businessAppraisal.minMonthSale == null || this.model.businessAppraisal.minMonthSale === '' ||
      this.model.businessAppraisal.minSaleMonth == null || this.model.businessAppraisal.minSaleMonth === '') {
      $('#incomeid').click();
      this.toaster.warning('Fields Missing in Income');
      this.spinner.hide();
      return;
    }
    console.log(this.model.businessAppraisal.maxSaleMonth + this.model.businessAppraisal.minSaleMonth)
    if (this.model.businessAppraisal.maxSaleMonth > 12 || this.model.businessAppraisal.maxSaleMonth < 0
      || this.model.businessAppraisal.minSaleMonth > 12 || this.model.businessAppraisal.minSaleMonth < 0) {
      $('#incomeid').click();
      this.toaster.warning('invalid Months');
      this.spinner.hide();
      return;
    }
    // if (this.model.businessAppraisal.primaryIncome != null || this.model.businessAppraisal.primaryIncome != undefined) {
    //   if (this.model.businessAppraisal.primaryIncome.length <= 0) {
    //     this.toaster.error("Primary Income Missing."); this.spinner.hide();
    //     return;
    //   }
    // }

    if (this.model.businessAppraisal.businessExpense != null || this.model.businessAppraisal.businessExpense != undefined) {
      if (this.model.businessAppraisal.businessExpense.length <= 0) {
        $('#expensesTab').click();
        this.toaster.error("Business Expense Missing."); this.spinner.hide();
        return;
      }
    }

    if (this.model.businessAppraisal.householdExpense != null || this.model.businessAppraisal.householdExpense != undefined) {
      if (this.model.businessAppraisal.householdExpense.length <= 0) {
        $('#expensesTab').click();
        this.toaster.error("Household Expense Missing."); this.spinner.hide();
        return;
      }
    }

    if(this.model.businessAppraisal.householdExpense!=null && this.model.businessAppraisal.householdExpense != undefined){
      if(this.model.businessAppraisal.householdExpense.length==1){
        if(this.findCdFromSeq(this.model.businessAppraisal.householdExpense[0].expTypKey, this.houseHoldExpenseTypeOrig)== "0017"){
          $('#expensesTab').click();
          this.toaster.error("Add Household Expense."); this.spinner.hide();
          return;
        }
      }
    }


    let formData: BusinessAppraisal = new BusinessAppraisal(this.model.loanAppSeq, this.model.formSeq);
    // let address = JSON.parse(JSON.stringify(this.model.businessAddress));
    // formData = Object.assign(this.model.businessAppraisal,formData, this.model.businessAddress);
    // console.log(formData)
    // console.log(this.model.businessAppraisal2);
    this.model.businessAppraisal = Object.assign(this.model.businessAppraisal, this.model.businessAppraisal.businessAddress, this.model.businessAppraisal);
    // console.log(this.model.businessAppraisal)
    this.model.businessAppraisal.loanAppSeq = this.model.loanAppSeq;
    this.model.businessAppraisal.formSeq = this.model.formSeq;
    if (this.model.businessAppraisal.bizAprslSeq != null && this.model.businessAppraisal.bizAprslSeq != "" && this.model.businessAppraisal.bizAprslSeq != 0) {
      this.formSaved = true;
      this.model.businessAppraisal.businessAddress.bizSeq = this.model.businessAppraisal.bizAprslSeq;
      console.log('EDIT');
      console.log(this.model.businessAppraisal);
      this.loanService.updateBusinessAppraisal(this.model.businessAppraisal).subscribe((res) => {
        console.log(res);
        this.formSaved = true;
        //   console.log(res.incomeHdrSeq);
        //   this.model.businessAppraisal.primaryIncome.forEach(obj => {
        //     obj.IncomeHdrSeq = res.incomeHdrSeq;
        //     this.incomeService(obj);
        //   });
        //   this.model.businessAppraisal.secondaryIncome.forEach(obj => {
        //     obj.IncomeHdrSeq = res.incomeHdrSeq;
        //     this.incomeService(obj);
        //   });
        //   this.model.businessAppraisal.businessExpense.forEach(obj =>{
        //     obj.bizAprslSeq = res.bizAprslSeq;
        //     this.loanService.saveExpense(obj);
        //   });
        //   this.model.businessAppraisal.householdExpense.forEach(obj =>{
        //     obj.bizAprslSeq = res.bizAprslSeq;
        //     this.loanService.saveExpense(obj);
        //   });
        //   console.log(this.model);

        // sessionStorage.setItem("model", JSON.stringify(this.model));
        this.formSaved = true;
        this.spinner.hide();
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
                forms.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          );
        }
        console.log(this.model)
        sessionStorage.setItem('model', JSON.stringify(this.model));
        console.log(JSON.parse(sessionStorage.getItem("model")))
        this.spinner.hide();

      }, (error) => {
        this.toaster.error("Error");
        this.spinner.hide();
        console.log('err In Business Appraisal Service');
        console.log('err', error);
      });
    } else {
      this.loanService.saveBusinessAppraisal(this.model.businessAppraisal).subscribe((res) => {
        console.log(res);
        this.toaster.success("Saved");
        // console.log(res.incomeHdrSeq);
        // this.model.businessAppraisal.primaryIncome.forEach(obj => {
        //   obj.IncomeHdrSeq = res.incomeHdrSeq;
        //   this.incomeService(obj);
        // });
        // this.model.businessAppraisal.secondaryIncome.forEach(obj => {
        //   obj.IncomeHdrSeq = res.incomeHdrSeq;
        //   this.incomeService(obj);
        // });
        // this.model.businessAppraisal.businessExpense.forEach(obj => {
        //   obj.bizAprslSeq = res.bizAprslSeq;
        //   this.expenseService(obj);
        // });
        // this.model.businessAppraisal.householdExpense.forEach(obj => {
        //   obj.bizAprslSeq = res.bizAprslSeq;
        //   this.expenseService(obj);
        // });
        this.model.businessAppraisal.bizAprslSeq = res.bizAprslSeq;
        this.model.businessAppraisal.bizAddressSeq = res.bizAddressSeq;
        this.model.businessAppraisal.incomeHdrSeq = res.incomeHdrSeq;
        this.model.businessAddress = res.bizAddressSeq;
        this.model.businessAppraisal.businessAddress.addrSeq = res.bizAddressSeq;
        console.log(this.model);
        this.spinner.hide();
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
                forms.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        console.log(JSON.parse(sessionStorage.getItem("model")))
        this.formSaved = true;

      }, (error) => {
        this.spinner.hide();
        console.log('err In Business Appraisal Service');
        console.log('err', error);
        this.toaster.error("Error");
      });
    }
    // console.log(this.coborrowerFormData);
    // console.log(this.model);
    // this.loanService.saveNominee(this.coborrowerFormData).subscribe((res) =>{
    //   console.log(res);
    //   sessionStorage.setItem("model", JSON.stringify(this.model));
    //   this.formSaved = true;
    // },(error)  => {
    //   console.log("err In Loan Service");
    // 	console.log("err", error);
    // });
  }
  address: Address = new Address();
  selectAddress(add: Address) {
    console.log(add)
    this.address = add;
    this.model.businessAppraisal.businessAddress.provinceName = add.provinceName;
    this.model.businessAppraisal.businessAddress.districtName = add.districtName;
    this.model.businessAppraisal.businessAddress.tehsilName = add.tehsilName;
    this.model.businessAppraisal.businessAddress.ucName = add.ucName;
    this.model.businessAppraisal.businessAddress.cityName = add.cityName;
    this.model.businessAppraisal.businessAddress.city = add.city;
    this.model.businessAppraisal.businessAddress.tehsil = add.tehsil;
    this.model.businessAppraisal.businessAddress.district = add.district;
    this.model.businessAppraisal.businessAddress.uc = add.uc;
    // Object.assign(this.model.businessAppraisal.businessAddress, add, this.model.businessAppraisal.businessAddress);
    console.log(this.model.businessAppraisal.businessAddress);
  }

  primaryIncome: PrimaryIncome = new PrimaryIncome();
  totalPrimaryIncome = 0;
  isEdit: boolean;
  addPrimaryIncome() {
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addPrimaryIncome')).modal('show');
    this.primaryIncome = new PrimaryIncome();
    this.isEdit = false;
  }
  addSecondaryIncome() {
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addSecondaryIncome')).modal('show');
    this.secondaryIncome = new PrimaryIncome();
    this.isEdit = false;
  }
  HouseholdExpenses() {
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#HouseholdExpenses')).modal('show');
    this.householdExpense = new BusinessExpense();
    this.isEdit = false;
  }
  BusinessExpenses() {
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#BusinessExpenses')).modal('show');
    this.businessExpense = new BusinessExpense();
    this.isEdit = false;
  }
  onPrimaryIncomeFormSubmit() {
    this.primaryIncome.incomeCategoryKey = 1;
    if (this.isEdit) {

      this.isEdit = false;
      this.totalPrimaryIncome = 0;
      this.model.businessAppraisal.primaryIncome[this.itemToEdit.index] = this.primaryIncome;
      for (let i = 0; i < this.model.businessAppraisal.primaryIncome.length; i++) {
        const x = +this.model.businessAppraisal.primaryIncome[i].incomeAmount;
        this.totalPrimaryIncome = this.totalPrimaryIncome + x;
      }
      ;
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#addPrimaryIncome')).modal('hide');
      this.primaryIncome = new PrimaryIncome();
    } else {
      console.log(this.primaryIncome);
      if (this.model.businessAppraisal.primaryIncome == undefined)
        this.model.businessAppraisal.primaryIncome = [];
      this.model.businessAppraisal.primaryIncome.push(this.primaryIncome);
      const x = +this.primaryIncome.incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
      (<any>$('#addPrimaryIncome')).modal('hide');
      this.removeItemsFromLOVUsingBizApp();
      this.primaryIncome = new PrimaryIncome();
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  totalSecondaryIncome = 0;
  secondaryIncome: PrimaryIncome = new PrimaryIncome();
  onSecondaryIncomeFormSubmit() {
    this.secondaryIncome.incomeCategoryKey = 2;
    if (this.isEdit) {
      this.isEdit = false;
      this.totalSecondaryIncome = 0;
      this.model.businessAppraisal.secondaryIncome[this.itemToEdit.index] = this.secondaryIncome;
      for (let i = 0; i < this.model.businessAppraisal.secondaryIncome.length; i++) {
        const x = +this.model.businessAppraisal.secondaryIncome[i].incomeAmount;
        this.totalSecondaryIncome = this.totalSecondaryIncome + x;
      }
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#addSecondaryIncome')).modal('hide');
      this.secondaryIncome = new PrimaryIncome();
    } else {
      console.log(this.secondaryIncome);
      if (this.model.businessAppraisal.secondaryIncome == undefined)
        this.model.businessAppraisal.secondaryIncome = [];
      this.model.businessAppraisal.secondaryIncome.push(this.secondaryIncome);
      const x = +this.secondaryIncome.incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
      (<any>$('#addSecondaryIncome')).modal('hide');
      this.secondaryIncome = new PrimaryIncome();
      this.removeItemsFromLOVUsingBizApp();
      console.log(this.model.businessAppraisal.secondaryIncome);
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  totalBusinessExpense = 0;
  businessExpense: BusinessExpense = new BusinessExpense();
  onBusinessExpenseFormSubmit() {
    this.businessExpense.expCategoryKey = 1;
    if (this.isEdit) {
      this.isEdit = false;
      this.totalBusinessExpense = 0;
      this.model.businessAppraisal.businessExpense[this.itemToEdit.index] = this.businessExpense;
      for (let i = 0; i < this.model.businessAppraisal.businessExpense.length; i++) {
        const x = +this.model.businessAppraisal.businessExpense[i].expAmount;
        this.totalBusinessExpense = this.totalBusinessExpense + x;
      }
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#BusinessExpenses')).modal('hide');
      this.businessExpense = new BusinessExpense();
    } else {
      if (this.model.businessAppraisal.businessExpense == undefined)
        this.model.businessAppraisal.businessExpense = [];
      this.model.businessAppraisal.businessExpense.push(this.businessExpense);
      const x = +this.businessExpense.expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
      this.businessExpense = new BusinessExpense();
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#BusinessExpenses')).modal('hide');
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }

  totalHouseholdExpense = 0;
  householdExpense: BusinessExpense = new BusinessExpense();
  onHouseholdExpenseFormSubmit() {
    this.householdExpense.expCategoryKey = 2;
    if (this.isEdit) {
      this.isEdit = false;

      this.totalHouseholdExpense = 0;
      this.model.businessAppraisal.householdExpense[this.itemToEdit.index] = this.householdExpense;
      for (let i = 0; i < this.model.businessAppraisal.householdExpense.length; i++) {
        const x = +this.model.businessAppraisal.householdExpense[i].expAmount;
        this.totalHouseholdExpense = this.totalHouseholdExpense + x;
      }
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#HouseholdExpenses')).modal('hide');
      this.householdExpense = new BusinessExpense();
    } else {
      if (this.model.businessAppraisal.householdExpense == undefined)
        this.model.businessAppraisal.householdExpense = [];
      this.model.businessAppraisal.householdExpense.push(this.householdExpense);
      const x = +this.householdExpense.expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
      this.householdExpense = new BusinessExpense();
      this.removeItemsFromLOVUsingBizApp();
      (<any>$('#HouseholdExpenses')).modal('hide');
      console.log(this.model.businessAppraisal.householdExpense);
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }

  incomeService(income: PrimaryIncome) {
    this.loanService.saveIncome(income).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log('err In ADD INCOME Service');
      console.log('err', error);
    });
  }

  expenseService(expense: BusinessExpense) {
    this.loanService.saveExpense(expense).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log('err In Expense Service');
      console.log('err', error);
    });
  }

  cancelClicked() {

  }
  itemToEdit: any;
  editPIncome(primaryIncome: PrimaryIncome) {
    console.log('primaryIncome:', primaryIncome);
    this.primaryIncome = JSON.parse(JSON.stringify(primaryIncome));
    this.itemToEdit = JSON.parse(JSON.stringify(primaryIncome));
    this.itemToEdit.index = this.model.businessAppraisal.primaryIncome.indexOf(primaryIncome);
    this.primaryIncomeTypeOrig.forEach(element => {
      if (element.codeKey == primaryIncome.incomeTypeKey) {
        this.primaryIncomeType.push(element);
      }
    });
    (<any>$('#addPrimaryIncome')).modal('show');
    this.isEdit = true;
  }
  pItemToDel;
  deletePIncome(pIncome) {
    (<any>$('#deletePConfirmation')).modal('show');
    this.pItemToDel = pIncome;
  }
  confirmPDelete() {
    const index = this.model.businessAppraisal.primaryIncome.indexOf(this.pItemToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.businessAppraisal.primaryIncome.splice(index, 1);
    }
    this.totalPrimaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.primaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.primaryIncome[i].incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addPrimaryIncome')).modal('hide');
    (<any>$('#deletePConfirmation')).modal('hide');
  }
  editSIncome(secondaryIncome: PrimaryIncome) {
    this.secondaryIncome = JSON.parse(JSON.stringify(secondaryIncome));
    this.itemToEdit = JSON.parse(JSON.stringify(secondaryIncome));
    this.itemToEdit.index = this.model.businessAppraisal.secondaryIncome.indexOf(secondaryIncome);
    (<any>$('#addSecondaryIncome')).modal('show');
    this.secondaryIncomeTypeOrig.forEach(element => {
      if (element.codeKey == secondaryIncome.incomeTypeKey) {
        this.secondaryIncomeType.push(element);
      }
    });
    this.isEdit = true;
  }
  sIncomeToDel;
  deleteSIncome(sIncome) {
    this.sIncomeToDel = sIncome;
    (<any>$('#deleteSConfirmation')).modal('show');
  }
  confirmSDelete() {
    const index = this.model.businessAppraisal.secondaryIncome.indexOf(this.sIncomeToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.businessAppraisal.secondaryIncome.splice(index, 1);
    }
    this.totalSecondaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.secondaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.secondaryIncome[i].incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addSecondaryIncome')).modal('hide');
    (<any>$('#deleteSConfirmation')).modal('hide');
  }
  editBExpense(bExpense) {
    this.businessExpense = JSON.parse(JSON.stringify(bExpense));
    this.itemToEdit = JSON.parse(JSON.stringify(bExpense));
    this.itemToEdit.index = this.model.businessAppraisal.businessExpense.indexOf(bExpense);
    (<any>$('#BusinessExpenses')).modal('show');
    this.businessExpenseTypeOrig.forEach(element => {
      if (element.codeKey == bExpense.expTypKey) {
        this.businessExpenseType.push(element);
      }
    });
    this.isEdit = true;
  }
  bExpenseToDel;
  deleteBExpense(bExpense) {
    this.bExpenseToDel = bExpense;
    (<any>$('#deleteBConfirmation')).modal('show');
  }
  confirmBDelete() {

    const index = this.model.businessAppraisal.businessExpense.indexOf(this.bExpenseToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.businessAppraisal.businessExpense.splice(index, 1);
    }
    this.totalBusinessExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.businessExpense.length; i++) {
      const x = +this.model.businessAppraisal.businessExpense[i].expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#BusinessExpenses')).modal('hide');
    (<any>$('#deleteBConfirmation')).modal('hide');
  }
  editHExpense(hExpense) {
    this.householdExpense = JSON.parse(JSON.stringify(hExpense));
    this.itemToEdit = JSON.parse(JSON.stringify(hExpense));
    this.itemToEdit.index = this.model.businessAppraisal.householdExpense.indexOf(hExpense);
    (<any>$('#HouseholdExpenses')).modal('show');
    this.houseHoldExpenseTypeOrig.forEach(element => {
      if (element.codeKey == hExpense.expTypKey) {
        this.houseHoldExpenseType.push(element);
      }
    });
    this.isEdit = true;
  }
  hExpenseToDel;
  deleteHExpense(hExpense) {
    this.hExpenseToDel = hExpense;
    (<any>$('#deleteHConfirmation')).modal('show');
  }
  confirmHDelete() {

    const index = this.model.businessAppraisal.householdExpense.indexOf(this.hExpenseToDel);
    console.log(index);
    if (index > -1) {
      this.model.businessAppraisal.householdExpense.splice(index, 1);
    }
    this.totalHouseholdExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.householdExpense.length; i++) {
      const x = +this.model.businessAppraisal.householdExpense[i].expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#HouseholdExpenses')).modal('hide');
    (<any>$('#deleteHConfirmation')).modal('hide');
  }
  sector: any;
  activity: any;
  businessRunner: any;
  businessOwnership: any;
  propertyOwnership: any;
  primaryIncomeType: any;
  secondaryIncomeType: any;
  businessExpenseType: any;
  houseHoldExpenseType: any;
  mfcibArray: any;

  primaryIncomeTypeOrig: any;
  secondaryIncomeTypeOrig: any;
  businessExpenseTypeOrig: any;
  houseHoldExpenseTypeOrig: any;

  onSectorChange() {
    if (this.model.businessAppraisal.sectorKey > 0) {
      this.model.businessAppraisal.activityKey = undefined;
      this.spinner.show();
      this.commonService.getActivity(this.model.businessAppraisal.sectorKey).subscribe((res) => {

        res.forEach(acty => {
          if (acty.bizActySortOrdr == null) {
            acty.bizActySortOrdr = 9999;
          }
        })
        this.activity = res;
        this.sorting(this.activity, 'bizActySortOrdr');
        this.spinner.hide();
      }, (error) => {
        console.log('err', error); this.spinner.hide();
      });
    }
  }

  onSectorChangeLocal() {
    if (this.model.businessAppraisal.sectorKey > 0) {
      this.spinner.show();
      this.commonService.getActivity(this.model.businessAppraisal.sectorKey).subscribe((res) => {
        this.spinner.hide();
        this.activity = res;
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
      });
    }
  }
  loadLovs() {
    this.commonService.getSectors(this.model.loanProd).subscribe((res) => {
      res.forEach(sect => {
        if (sect.bizSectSortOrdr == null) {
          sect.bizSectSortOrdr = 9999;
        }
      })
      this.sector = res;
      this.sorting(this.sector, 'bizSectSortOrdr');
      console.log(this.sector);
    }, (error) => {
      console.log('err', error);
    });

    // this.commonService.getValues(REF_CD_GRP_KEYS.ACTIVITY).subscribe((res) => {
    //   this.activity = res;
    // }, (error) => {
    //   console.log('err', error);
    // });

    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_LOCATION).subscribe((res) => {
      this.propertyOwnership = res;
    }, (error) => {
      console.log('err', error);
    });

    // Get Complete Business Runner - DropDown
    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_RUNNER).subscribe((res) => {
      // Zohaib Asim - Dated 09-03-2022 - 
      let arr = [191, 193];
      let relationKey = 0;
      let relationDesc = "";
      
      console.log("Complete DD List of BUSINESS_RUNNER:", res);
      console.log('Business Appraisal Object:', this.model.businessAppraisal);

      // Nominee Model
      this.model.nominee.loanAppSeq = this.model.loanAppSeq;
      if (this.model.isNomDetailAvailable){
        this.model.nominee.typFlg = 1;
      }
      else{
        this.model.nominee.typFlg = 2;
      }

      // Get Nominee Details for Relation
      this.loanService.getClntRel(this.model.nominee).subscribe((clntRelRes) => {
        console.log("Client Relation(Nominee/Next of Kin/Relative):", clntRelRes);
        relationKey = +clntRelRes.relationKey;

        // Get Relation Type Nominee
        this.commonService.getValues(REF_CD_GRP_KEYS.RELATION_TYPE_NOMINEE).subscribe((relTypNomRes) => {
          console.log('Nominee Relation:', relTypNomRes);
          // Only Compare for Nonimee
          if ( this.model.nominee.typFlg == 1 ){
            for(let index in relTypNomRes){
              if ( relTypNomRes[index].codeKey ==  relationKey){
                relationDesc = relTypNomRes[index].codeValue;
              }
            }
          }

          // 
          if( this.businessRunningPersonal == 191 ){
            this.model.businessAppraisal.personRunningBusinessKey = 191;
          }else if ( this.businessRunningPersonal == 193 ){
            this.model.businessAppraisal.personRunningBusinessKey = 193;
          }else{
            // Traverse to find Description Match
            for(let index in res){
              console.log('Travers', this.model.businessAppraisal.personRunningBusinessKey);
              if( res[index].codeValue == relationDesc){
                this.model.businessAppraisal.personRunningBusinessKey = res[index].codeKey;
                arr[2] = res[index].codeKey;
              }
            }
            // No Match Found, Set Self by Default
            if(arr.length < 3){
              this.model.businessAppraisal.personRunningBusinessKey = 191;
            }
          }
          this.businessRunner = res.filter(r => arr.includes(r.codeKey));
        }, (error) => {
          console.log('err', error);
        });
        // End
        
        this.onPersonelChange();
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
      });
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_OWNERSHIP).subscribe((res) => {
      this.businessOwnership = res;
    }, (error) => {
      console.log('err', error);
    });
    // this.disability = this.lovService("OCCUPATION");
    this.commonService.getValues(REF_CD_GRP_KEYS.INCOME_TYPE).subscribe((res) => {
      this.primaryIncomeType = res;
      this.primaryIncomeTypeOrig = JSON.parse(JSON.stringify(res));
      this.model.businessAppraisal.primaryIncome.forEach(x => {
        this.removeItemFromLOV(x.incomeTypeKey, this.primaryIncomeType);
      });
      console.log(res);
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.SECOND_INCOME_SOURCE).subscribe((res) => {
      this.secondaryIncomeType = res;
      this.secondaryIncomeTypeOrig = JSON.parse(JSON.stringify(res));
      this.model.businessAppraisal.secondaryIncome.forEach(x => {
        this.removeItemFromLOV(x.incomeTypeKey, this.secondaryIncomeType);
      });
      console.log(res);
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.HOUSEHOLD_EXPENSES).subscribe((res) => {
      this.houseHoldExpenseType = res;
      this.houseHoldExpenseTypeOrig = JSON.parse(JSON.stringify(res));
      this.model.businessAppraisal.householdExpense.forEach(x => {
        this.removeItemFromLOV(x.expTypKey, this.houseHoldExpenseType);
      });
      // Other Loans
      this.loanService.getMfcibLoans(this.model.loanAppSeq).subscribe((res) => {
        this.mfcibArray = res;
        let key = this.findSeqFromCd("0017", this.houseHoldExpenseTypeOrig);
        this.model.businessAppraisal.householdExpense.forEach(exp=>{
            if(exp.expTypKey == key){
              exp.DSED = true;
            }
        })
        res.forEach(obj => {
          if (obj.loanCompletionDate) {
            if (obj.isExpense) {
              let date = new Date();
              let months = this.monthDiff(date, new Date(obj.loanCompletionDate));
              if (months == 0) {
                this.otherLoanAmountPerMonth = +this.otherLoanAmountPerMonth + +obj.currentOutStandingAmount;
              } else {
                let amount = Math.floor(obj.currentOutStandingAmount / months);
                this.otherLoanAmountPerMonth = +this.otherLoanAmountPerMonth + +amount;
              }
            }
            const array = obj.loanCompletionDate.split('T', 1);
            if (array.length) {
              obj.loanCompletionDate = array[0];
            }

          }
        });
        if (this.otherLoanAmountPerMonth > 0) {

          let key = this.findSeqFromCd("0017", this.houseHoldExpenseTypeOrig);
          if (key >= 0) {
            this.model.businessAppraisal.householdExpense.forEach(expense => {
              if (expense.expTypKey == key) {
                let index = this.model.businessAppraisal.householdExpense.indexOf(expense);
                if (index >= 0) {
                  this.model.businessAppraisal.householdExpense.splice(index, 1);
                }
              }
            });
            let otherLoan = new BusinessExpense();
            otherLoan.expAmount = "" + this.otherLoanAmountPerMonth;
            otherLoan.expTypKey = key;
            otherLoan.expCategoryKey = 2;
            otherLoan.DSED = true;
            this.model.businessAppraisal.householdExpense.push(otherLoan);
            console.log(otherLoan)
            this.totalHouseholdExpense = this.totalHouseholdExpense + +otherLoan.expAmount;
            this.removeItemFromLOV(key, this.houseHoldExpenseType);
            console.log(this.houseHoldExpenseType);
            console.log(this.houseHoldExpenseTypeOrig);
          }

        }
        console.log(this.otherLoans)
      }, (error) => {
        console.log('err', error);
      });
    }, (error) => {
      console.log('err', error);
    });


    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_EXPENSES).subscribe((res) => {
      this.businessExpenseType = res;
      this.businessExpenseTypeOrig = JSON.parse(JSON.stringify(res));
      this.model.businessAppraisal.businessExpense.forEach(x => {
        this.removeItemFromLOV(x.expTypKey, this.businessExpenseType);
      });
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getCommunityForPort(this.model.portKey).subscribe((res) => {
      this.communityArray = res;
    }, (error) => {
      console.log('err', error);
    });
  }
  communityArray: any;
  removeItemsFromLOVUsingBizApp() {
    this.primaryIncomeType = JSON.parse(JSON.stringify(this.primaryIncomeTypeOrig));
    this.secondaryIncomeType = JSON.parse(JSON.stringify(this.secondaryIncomeTypeOrig));
    this.businessExpenseType = JSON.parse(JSON.stringify(this.businessExpenseTypeOrig));
    this.houseHoldExpenseType = JSON.parse(JSON.stringify(this.houseHoldExpenseTypeOrig));

    this.model.businessAppraisal.primaryIncome.forEach(x => {
      this.removeItemFromLOV(x.incomeTypeKey, this.primaryIncomeType);
    });
    this.model.businessAppraisal.secondaryIncome.forEach(x => {
      this.removeItemFromLOV(x.incomeTypeKey, this.secondaryIncomeType);
    });
    this.model.businessAppraisal.businessExpense.forEach(x => {
      this.removeItemFromLOV(x.expTypKey, this.businessExpenseType);
    });
    this.model.businessAppraisal.householdExpense.forEach(x => {
      this.removeItemFromLOV(x.expTypKey, this.houseHoldExpenseType);
    });
  }

  removeItemFromLOV(key, lov) {
    let index = -1;
    for (let i = 0; i < lov.length; i++) {
      if (key == lov[i].codeKey) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      lov.splice(index, 1);
    }
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  averageIncome = 0;
  incomeChange() {
    this.averageIncome = Math.floor(((this.model.businessAppraisal.maxMonthSale * this.model.businessAppraisal.maxSaleMonth) + (this.model.businessAppraisal.minMonthSale * this.model.businessAppraisal.minSaleMonth)) / 12);
    console.log(this.averageIncome);
    if (this.averageIncome == NaN)
      this.averageIncome = 0;
    this.calculateNetDeposible();
    this.calculateBusinessProfit();

  }

  maxMonthChange() {
    this.model.businessAppraisal.minSaleMonth = 12 - +this.model.businessAppraisal.maxSaleMonth;
    this.incomeChange();
  }
  minMonthChange() {
    this.model.businessAppraisal.maxSaleMonth = 12 - +this.model.businessAppraisal.minSaleMonth;
  }
  netDeposible = 0;
  calculateNetDeposible() {
    this.netDeposible = this.totalPrimaryIncome + this.totalSecondaryIncome + this.averageIncome - this.totalBusinessExpense - this.totalHouseholdExpense;
  }
  businessProfit = 0;
  calculateBusinessProfit() {
    this.businessProfit = +this.averageIncome - +this.totalBusinessExpense;
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  sameAsClientAddressChange() {
    console.log(this.model.city)
    if (this.model.businessAppraisal.isbizAddrSAC) {
      if (this.model.city == null || this.model.city <= 0) {
        this.toaster.show("Client Address not found!", "Error");
        this.model.businessAppraisal.isbizAddrSAC = false;
        return;
      }
      this.model.businessAppraisal.businessAddress = new Address();

      this.model.businessAppraisal.businessAddress.provinceName = this.model.provinceName;
      this.model.businessAppraisal.businessAddress.districtName = this.model.districtName;
      this.model.businessAppraisal.businessAddress.tehsilName = this.model.tehsilName;
      this.model.businessAppraisal.businessAddress.ucName = this.model.ucName;
      this.model.businessAppraisal.businessAddress.cityName = this.model.cityName;
      this.model.businessAppraisal.businessAddress.houseNum = this.model.houseNum;
      this.model.businessAppraisal.businessAddress.sreet_area = this.model.sreet_area;
      this.model.businessAppraisal.businessAddress.village = this.model.village;
      this.model.businessAppraisal.businessAddress.otherDetails = this.model.otherDetails;
      this.model.businessAppraisal.businessAddress.city = this.model.city;
      this.model.businessAppraisal.businessAddress.tehsil = this.model.tehsil;
      this.model.businessAppraisal.businessAddress.district = this.model.district;
      this.model.businessAppraisal.businessAddress.uc = this.model.uc;
      // this.model.businessAppraisal.businessAddress = <Address>JSON.parse(JSON.stringify(this.model));
      // this.model.businessAppraisal.businessAddress=Object.assign(this.model.businessAppraisal.businessAddress, this.model, this.model.businessAppraisal.businessAddress);
    } else {
      this.model.businessAppraisal.businessAddress = new Address();
    }
  }

  filterBy(prop: string, array) {
    if (array != undefined) {
      if (array.length) {
        return array.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
      }
    }
    return [];
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = (a[key] == null) ? 99 : a[key]; var y = (b[key] == null) ? 99 : b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  sorting(array, key) {
    function sortByKey(a, b) {
      var x = (a[key] == null) ? 99 : a[key]; var y = (b[key] == null) ? 99 : b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    // console.log(array.sort(sortByKey))
    array.sort(sortByKey);
  }
  //livestock
  openLivestock() {
    (<any>$('#livestock')).modal('show');
  }

  onSubmitLivestock() {
    console.log(this.livestockForm)
    this.livestock.push(this.livestockForm.value)
    console.log(this.livestock);
  }

  //finance
  openFinance() {
    (<any>$('#finance')).modal('show');
  }

  onSubmitFinance() {
    console.log(this.financeForm)
    this.finance.push(this.financeForm.value)
    console.log(this.finance);
  }
}
