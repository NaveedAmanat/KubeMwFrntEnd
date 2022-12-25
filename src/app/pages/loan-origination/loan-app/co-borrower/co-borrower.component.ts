import { Component, DoCheck, OnInit } from '@angular/core';
import { Address } from '../../../../shared/models/address.model';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { Nominee } from '../../../../shared/models/Nominee.model';
import { CommonService } from '../../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { CNICPattern } from '../../../../shared/models/CNICPattern.model';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { History } from '../../../../shared/models/History.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
  selector: 'app-co-borrower',
  templateUrl: './co-borrower.component.html',
  styleUrls: ['./co-borrower.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CoBorrowerComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  model: any; formSaved = false;
  now: any; date: any; eightenYearsBefore: any;
  coborrowerFormData: any = new Object();
  matcher = new MyErrorStateMatcher();
  validated = false;
  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  hasPermission= false;
  constructor(private router: Router, private loanService: LoanService, private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService) {
    this.now = new Date();
    this.now.setDate((this.now.getDate() + 1));
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
    this.eightenYearsBefore = new Date((year - 18), month, (+day - 1));
    this.minDobYear = new Date((year - 64), month, (+day + 1));
  }
  history: History = new History(); minDobYear;
  validate() {
    if (/^([0-9])\1*$/.test(this.model.coBorrower.cnicNum)) {
      this.toaster.error("Invalid CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.coBorrower.cnicExpryDate == undefined || this.model.coBorrower.cnicExpryDate == '') {
      this.toaster.error("Select CNIC Expiry Date"); return;
    }
    if (this.model.coBorrower.cnicIssueDate == undefined || this.model.coBorrower.cnicIssueDate == '') {
      this.toaster.error("Select CNIC Issue Date"); return;
    }
    this.spinner.show();

    this.loanService.validateCNIC(this.model.coBorrower.cnicNum).subscribe((res) => {
      this.spinner.hide();
      console.log(res);
      if (res.client) {
        this.history = Object.assign(this.history, res.client, this.history);
        this.history.title = "Client";
        if (this.history.status != "Completed" && this.history.status != "COMPLETED") {
          this.toaster.error("Active as " + this.history.title + " with Loan ID [" + this.history.loanAppSeq + "] Client Name [" + this.history.firstName + " " + this.history.lastName + "] Status [" + this.history.status + "]")
        } else {
          this.validated = true;
        }
      } else if (res.clientRel) {
        this.history = Object.assign(this.history, res.clientRel, this.history);
        this.history.title = "Client";
        if (this.history.type == "1") {
          this.history.title = "Nominee";
        } else if (this.history.type == "3") {
          this.history.title = "Coborrower";
        } else if (this.history.type == "2") {
          this.history.title = "Next-of-Kin";
        } else if (this.history.type == "4") {
          this.history.title = "Client Relative";
        }
        if (this.history.status != "Completed" && this.history.status != "COMPLETED") {
          this.toaster.error("Active as " + this.history.title + " with Loan ID [" + this.history.loanAppSeq + "] Client Name [" + this.history.firstName + " " + this.history.lastName + "] Status [" + this.history.status + "]")
        } else {
          this.validated = true;
        }
      } else {
        this.validated = true;
      }
      console.log(this.history);

    }, (error) => {
      this.spinner.hide();

    })
    if (+this.model.coBorrower.cnicNum % 2) {
      this.model.coBorrower.genderKey = this.findKeyFromValue('MALE', this.gender);
    } else {
      this.model.coBorrower.genderKey = this.findKeyFromValue('FEMALE', this.gender);
    }
  }
  ngDoCheck() {
    sessionStorage.setItem('isSavedBorrower', this.formSaved.toString());
  }
  hasCob = false;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });
    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));
    console.log(this.model);
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
          if ((element.formUrl === 'co-borrower' && this.model.selfPDC)) {
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
    if (!this.model.coBorrower) {
      this.model.coBorrower = new Nominee();
    } else if (this.model.coBorrower.cnicNum != null || this.model.coBorrower.cnicNum != undefined) {
      if (this.model.coBorrower.cnicNum.length > 0) {
        this.setPattern();
        this.validated = this.model.coBorrower.isValidated;
      }
    }
    this.model.coBorrower.loanAppSeq = this.model.loanAppSeq;
    this.model.coBorrower.formSeq = this.model.formSeq;
    this.model.coBorrower.typFlg = 3;
    if (!this.model.coBorrowerAddress) {
      this.model.coBorrowerAddress = new Address();
    }
    this.model.coBorrower.clientSeq = this.model.clientSeq;
    this.getLocations();
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.loanService.getClntRel(this.model.coBorrower).subscribe((res) => {
        console.log(res);
        if (res != null && +res.cnicNum != 0) {
          this.validated = true;
          this.formSaved = true;
          this.hasCob = true;
          res.clientSeq = this.model.clientSeq;
          this.model.coBorrower = res;
          // let addr = Object.assign(this.model.coBorrowerAddress, res, this.model.coBorrowerAddress);
          // this.model.coBorrowerAddress = new Address();
          // this.model.coBorrowerAddress.provinceName = addr.provinceName;
          // this.model.coBorrowerAddress.districtName = addr.districtName;
          // this.model.coBorrowerAddress.tehsilName = addr.tehsilName;
          // this.model.coBorrowerAddress.ucName = addr.ucName;
          // this.model.coBorrowerAddress.cityName = addr.cityName;
          // this.model.coBorrowerAddress.houseNum = addr.houseNum;
          // this.model.coBorrowerAddress.sreet_area = addr.sreet_area;
          // this.model.coBorrowerAddress.village = addr.village;
          // this.model.coBorrowerAddress.otherDetails = addr.otherDetails;


          let array;
          if (this.model.coBorrower.dob) {
            array = this.model.coBorrower.dob.split('T', 1);
            console.log(array.length);
            if (array.length) {
              this.model.coBorrower.dob = array[0];
            }
          }

          if (this.model.coBorrower.cnicExpryDate) {
            array = this.model.coBorrower.cnicExpryDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.coBorrower.cnicExpryDate = array[0];
            }
          }

          if (this.model.coBorrower.cnicIssueDate) {
            array = this.model.coBorrower.cnicIssueDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.coBorrower.cnicIssueDate = array[0];
            }
          }

          this.setPattern();
          this.clientPhone = this.model.coBorrower.phone;
          this.age = this.calculateAge(new Date(this.model.coBorrower.dob));
        } else {
          this.getPreviousClientRel();
        }
      }, (error) => {
        console.log('err', error);
      });
      console.log(this.model);
    } else if (this.model.coBorrower.clntRelSeq != undefined && this.model.coBorrower.clntRelSeq != 0) {
      this.hasCob = true;
      this.validated = true;
      this.clientPhone = this.model.coBorrower.phone;
      this.age = this.calculateAge(new Date(this.model.coBorrower.dob));
      if (this.cnicPatternObj.cobCNIC == '' || this.cnicPatternObj.cobCNIC.length <= 0)
        this.setPattern();

    } else {
      this.getPreviousClientRel();
    }

    this.loadLovs();
    
    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('co-borrower', this.model);
   // end

  }

  getPreviousClientRel() {
    this.loanService.getClientRelFromPreviousLoan(this.model.coBorrower).subscribe((res: any) => {
      if (res != null && +res.cnicNum != 0) {
        this.validated = true; res.clntRelSeq = null;
        res.clientSeq = this.model.clientSeq;
        this.model.coBorrower = res;
        res.loanAppSeq = this.model.loanAppSeq;
        let array;
        if (this.model.coBorrower.dob) {
          array = this.model.coBorrower.dob.split('T', 1);
          console.log(array.length);
          if (array.length) {
            this.model.coBorrower.dob = array[0];
          }
        }

        if (this.model.coBorrower.cnicExpryDate) {
          array = this.model.coBorrower.cnicExpryDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.coBorrower.cnicExpryDate = array[0];
          }
        }

        if (this.model.coBorrower.cnicIssueDate) {
          array = this.model.coBorrower.cnicIssueDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.coBorrower.cnicIssueDate = array[0];
          }
        }

        this.setPattern();
        this.clientPhone = this.model.coBorrower.phone;
        this.age = this.calculateAge(new Date(this.model.coBorrower.dob));
      }
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, 'Error');
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  age;
  onDOBChange(dob: string) {
    this.age = this.calculateAge(new Date(dob));
  }
  calculateAge(birthday) { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  continueClicked() {
    // this.router.navigate(['loan-origination/business-appraisal']);
    if (this.model.forms) {
      let i = 0;
      this.model.forms.forEach(
        forms => {
          if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
            this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 1].formUrl]);
          }
          i++;
        }
      );
    }
  }
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
  onCoBorrowerFormSubmit() {
    this.spinner.show(); this.model.coBorrower.isValidated = true; this.model.coBorrower.typFlg = 3;

    if (this.model.coBorrower.firstName == null || this.model.coBorrower.firstName === '' || this.model.coBorrower.fatherFirstName == null ||
      this.model.coBorrower.fatherFirstName === '' ||
      this.model.coBorrower.fatherLastName == null || this.model.coBorrower.fatherLastName === '' || this.model.coBorrower.phone == null ||
      this.model.coBorrower.phone === '' || this.model.coBorrower.dob == null || this.model.coBorrower.dob === ''
      || this.model.coBorrower.genderKey == null || this.model.coBorrower.genderKey === ''
      || this.model.coBorrower.occupationKey == null || this.model.coBorrower.occupationKey === ''
      || this.model.coBorrower.relationKey == null || this.model.coBorrower.relationKey === ''
      || this.model.coBorrower.maritalStatusKey == null || this.model.coBorrower.maritalStatusKey === '') {
      $('#nominee').click();
      this.toaster.warning('Fields Missing in Basic-Info');
      this.spinner.hide();
      return;
    }

    if (!this.model.relAddrAsClntFlg) {
      if (this.model.coBorrower.provinceName == null || this.model.coBorrower.provinceName === '' || this.model.coBorrower.otherDetails == null ||
        this.model.coBorrower.otherDetails === '' ||
        this.model.coBorrower.houseNum == null || this.model.coBorrower.houseNum === '' || this.model.coBorrower.village == null ||
        this.model.coBorrower.village === '' || this.model.coBorrower.otherDetails == null || this.model.coBorrower.otherDetails === '') {
        $('#address-tab').click();
        this.toaster.warning('Fields Missing in Address');
        this.spinner.hide();
        return;
      }
    }

    // this.model.coBorrower = Object.assign(this.model.coBorrower, this.model.coBorrower, this.model.coBorrowerAddress);

    // this.coborrowerFormData.tehsil = '1';
    // this.coborrowerFormData.union = '1';
    // this.coborrowerFormData.uc = '1';
    // this.coborrowerFormData.district = '1';
    // this.coborrowerFormData.city = '1';
    // this.coborrowerFormData.province='1';

    console.log(this.coborrowerFormData);
    this.model.coBorrower.formSeq = this.model.formSeq;
    this.model.coBorrower.loanAppSeq = this.model.loanAppSeq;
    this.model.coBorrower.relAddrAsClntFlg = this.model.relAddrAsClntFlg;
    console.log(this.model);

    if (this.hasCob) {
      console.log('EDIT');
      this.model.coBorrower.typFlg = 3;
      this.model.coBorrower.isCoBorrower = true;
      console.log(this.coborrowerFormData);
      this.loanService.updateClientRel(this.model.coBorrower).subscribe((res) => {
        this.spinner.hide();
        console.log(res);
        this.model.coBorrower.clntRelSeq = res.clntRelSeq;
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
        this.toaster.success('Saved');
      }, (error) => {
        this.spinner.hide();
        // this.toaster.error(error.error.error, 'Error');
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      this.model.coBorrower.typFlg = 3;
      this.loanService.saveClientRel(this.model.coBorrower).subscribe((res: any) => {
        this.spinner.hide();
        console.log(res);
        this.model.coBorrower.clntRelSeq = res.clntRelSeq;
        this.formSaved = true;
        this.hasCob = true;
        this.toaster.success('Saved');
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              console.log(forms);
              console.log(this.router.url);
              console.log('/loan-origination/app/' + forms.formUrl);
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = true;
                console.log('TREIIII');
                console.log(forms);
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
      }, (error) => {
        this.spinner.hide();
        this.toaster.error(error.error.error, 'Error');
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }
  }
  address: Address = new Address();
  selectAddress(add: Address) {
    this.address = add;
    Object.assign(this.model.coBorrower, add, this.model.coBorrower);
    console.log(this.model.coBorrower);
  }
  relationType: any;
  occupation: any;
  gender: any;
  maritalStatus: any;
  disability: any;
  residenceArray: any = [];
  communityArray: any;

  loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.RELATION_TYPE_COBORROWER).subscribe((res) => {
      this.relationType = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.OCCUPATION).subscribe((res) => {
      this.occupation = res;
    }, (error) => {
      console.log('err', error);
    });

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

    this.commonService.getCommunityForPort(this.model.portKey).subscribe((res) => {
      this.communityArray = res;
    }, (error) => {
      console.log('err', error);
    });
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
  cnicPatternObj: CNICPattern = new CNICPattern();
  setPattern() {
    ///  CNIC Pattern
    this.cnicPatternObj.cobCNIC = "";
    let str = this.model.coBorrower.cnicNum + "";
    let charArray = str.split("");
    charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + '-';
      this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + item;
    })
  }

  cnicPattern(event: any, type: any) {
    if (this.readonly) {
      this.readonly = false;
    }
    this.validated = false;

    let dt = this.model.coBorrower.cnicExpryDate;
    this.model.coBorrower = new Nominee();
    this.model.coBorrower.cnicExpryDate = dt;
    let cnicIssueDate = this.model.coBorrower.cnicIssueDate;
    this.model.coBorrower.cnicIssueDate = cnicIssueDate;

    this.age = "";

    if (event.keyCode == 8 || event.keyCode == 9
      || event.keyCode == 27 || event.keyCode == 13
      || (event.keyCode == 65 && event.ctrlKey === true))
      return;
    if ((event.keyCode < 48 || event.keyCode > 57))
      event.preventDefault();


    let length: number = 0;


    if (type == "client") {
      if (this.cnicPatternObj.clientCNIC.length)
        length = this.cnicPatternObj.clientCNIC.length;
      if (length <= 15) {
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
    } else if (type == "nominee") {
      if (this.cnicPatternObj.nomCnic.length)
        length = this.cnicPatternObj.nomCnic.length;
      if (length < 15) {


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
      }
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

  findKeyFromValue(value, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeValue == value) {
          return array[i].codeKey;
        }
      }
    }
  }

  onExpChange(dob: string) {
    let date: any;
    if (this.model.coBorrower.cnicExpryDate) {
      date = new Date(this.model.coBorrower.cnicExpryDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.coBorrower.cnicExpryDate = date.getFullYear() + '-' + month + '-' + day;
    }

    if (this.model.coBorrower.cnicIssueDate) {
      date = new Date(this.model.coBorrower.cnicIssueDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.coBorrower.cnicIssueDate = date.getFullYear() + '-' + month + '-' + day;
    }

  }

  clientPhone: any = "";
  phoneNumber(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (this.clientPhone.length == 0)
      this.clientPhone = "(" + this.clientPhone;
    if (this.clientPhone.length == 5)
      this.clientPhone = this.clientPhone + ")";
    if (this.clientPhone.length < 13) {
      this.model.coBorrower.phone = this.clientPhone.replace(/[(]/g, '');
      this.model.coBorrower.phone = this.clientPhone.replace(/[)]/g, '');
      this.model.coBorrower.phone = this.clientPhone.replace(/ /g, '');
      this.model.coBorrower.phone = this.model.coBorrower.phone + event.key;
    }
    console.log(this.model.nominee.phone);
  }
}
