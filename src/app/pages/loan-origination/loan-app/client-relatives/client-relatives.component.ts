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
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { CNICPattern } from '../../../../shared/models/CNICPattern.model';
import { History } from '../../../../shared/models/History.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
  selector: 'app-client-relatives',
  templateUrl: './client-relatives.component.html',
  styleUrls: ['./client-relatives.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ClientRelativesComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true: false;
  model: any; formSaved = false;
  now: any; date: any; eightenYearsBefore: any;
  clientRelFormData: any = new Object();
  matcher = new MyErrorStateMatcher();
  validated = false;minDobYear;
  hasPermission = false;
  constructor(private router: Router, private loanService: LoanService, private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService) {
    this.validated = true;
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
    this.eightenYearsBefore = new Date((year - 18), month, (+day-1));
    this.minDobYear = new Date((year - 64), month, (+day + 1));
  }
  history: History = new History();
  validate() {
    if (/^([0-9])\1*$/.test(this.model.clientRel.cnicNum)) {
      this.toaster.error("Invalid CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.clientRel.cnicExpryDate == undefined || this.model.clientRel.cnicExpryDate == '') {
      this.toaster.error("Select CNIC Expiry Date"); return;
    }
    if (this.model.clientRel.cnicIssueDate == undefined || this.model.clientRel.cnicIssueDate == '') {
      this.toaster.error("Select CNIC Issue Date"); return;
    }
    if (this.model.cnicNum == this.model.clientRel.cnicNum) {
      this.toaster.error("Client Relative can not be same as Client"); return;
    }
    let newNom = new Nominee();
    newNom.cnicNum = this.model.clientRel.cnicNum;
    newNom.cnicExpryDate = this.model.clientRel.cnicExpryDate;
    newNom.cnicIssueDate = this.model.clientRel.cnicIssueDate;
    this.model.clientRel = newNom;
    this.clientPhone = "";
    this.age = null;

    this.spinner.show();

    this.loanService.validateCNIC(this.model.clientRel.cnicNum).subscribe((res) => {
      this.spinner.hide();
      console.log(res);

      // if(res.canProceed){
      //   if (res.client) {
      //     this.history = Object.assign(this.history, res.client, this.history);
      //     this.model.clientRel = this.history;
      //   }else if (res.clientRel) {
      //     this.history = Object.assign(this.history, res.clientRel, this.history);
      //     this.model.clientRel = this.history;
      //   }
      //   this.validated = true;
      // }else if( !res.canProceed){
      //   this.toaster.error(res.reason);
      // }

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
    if (+this.model.clientRel.cnicNum % 2) {
      this.model.clientRel.genderKey = this.findKeyFromValue('MALE', this.gender);
    } else {
      this.model.clientRel.genderKey = this.findKeyFromValue('FEMALE', this.gender);
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
          }else if (element.formUrl == 'next-of-kin') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined ) {
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
    if (!this.model.clientRel) {
      this.model.clientRel = new Nominee();
    }
    this.model.clientRel.loanAppSeq = this.model.loanAppSeq;
    this.model.clientRel.formSeq = this.model.formSeq;
    this.model.clientRel.typFlg = 4;
    if (!this.model.clientRelAddress) {
      this.model.clientRelAddress = new Address();
    }
    this.model.clientRel.clientSeq = this.model.clientSeq;
    this.getLocations();
    console.log(this.model)
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.loanService.getClntRel(this.model.clientRel).subscribe((res) => {
        console.log(res);
        if (res != null && +res.cnicNum != 0) {
          this.validated = true;
          this.formSaved = true;
          this.hasCob = true;
          res.clientSeq = this.model.clientSeq;
          this.model.clientRel = res;
          // Object.assign(this.model.clientRelAddress, res, this.model.clientRel);
          let array;
          if (this.model.clientRel.dob) {
            array = this.model.clientRel.dob.split('T', 1);
            console.log(array.length);
            if (array.length) {
              this.model.clientRel.dob = array[0];
            }
          }

          if (this.model.clientRel.cnicExpryDate) {
            array = this.model.clientRel.cnicExpryDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.clientRel.cnicExpryDate = array[0];
            }
          }
          if (this.model.clientRel.cnicIssueDate) {
            array = this.model.clientRel.cnicIssueDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.clientRel.cnicIssueDate = array[0];
            }
          }

          this.setPattern();
          this.clientPhone = this.model.clientRel.phone;
          this.age = this.calculateAge(new Date(this.model.clientRel.dob));
        } else {
          this.getPreviousClientRel();
        }
      }, (error) => {
        console.log('err', error);
      });
      console.log(this.model);
    } else if (this.model.clientRel.clntRelSeq != undefined && this.model.clientRel.clntRelSeq != 0) {
      this.hasCob = true;
      this.validated = true;
      this.clientPhone = this.model.clientRel.phone;
      this.age = this.calculateAge(new Date(this.model.clientRel.dob));
      this.setPattern();
    } else {
      this.getPreviousClientRel();
    }

    this.loadLovs();
   
    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('client-relatives', this.model);
   // end
    

  }
  getPreviousClientRel() {
    this.loanService.getClientRelFromPreviousLoan(this.model.clientRel).subscribe((res: any) => {
      if (res != null) {
        this.validated = true;
        res.clientSeq = this.model.clientSeq;
        res.loanAppSeq = this.model.loanAppSeq;
        res.clientRelSeq = null;
        res.formSeq = this.model.formSeq;
        res.clntRelSeq=null;
        this.model.clientRel = res;
        // Object.assign(this.model.clientRelAddress, res, this.model.clientRel);
        let array;
        if (this.model.clientRel.dob) {
          array = this.model.clientRel.dob.split('T', 1);
          console.log(array.length);
          if (array.length) {
            this.model.clientRel.dob = array[0];
          }
        }

        if (this.model.clientRel.cnicExpryDate) {
          array = this.model.clientRel.cnicExpryDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.clientRel.cnicExpryDate = array[0];
          }
        }
        if (this.model.clientRel.cnicIssueDate) {
          array = this.model.clientRel.cnicIssueDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.clientRel.cnicIssueDate = array[0];
          }
        }
        this.setPattern();
        this.clientPhone = this.model.clientRel.phone;
        this.age = this.calculateAge(new Date(this.model.clientRel.dob));
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
  onclientRelFormSubmit() {
    this.spinner.show();
    if (this.model.clientRel.provinceName == null || this.model.clientRel.provinceName === '' || this.model.clientRel.otherDetails == null ||
      this.model.clientRel.otherDetails === '' ||
      this.model.clientRel.houseNum == null || this.model.clientRel.houseNum === '' || this.model.clientRel.village == null ||
      this.model.clientRel.village === '' || this.model.clientRel.otherDetails == null || this.model.clientRel.otherDetails === '') {
      $('#address-tab').click();
      this.toaster.warning('Fields Missing in Address');
      this.spinner.hide();
      return;
    }
    // this.model.clientRel = Object.assign(this.clientRelFormData, this.model.clientRel, this.model.clientRel);
    this.model.clientRel.formSeq = this.model.formSeq;
    // this.clientRelFormData.tehsil = '1';
    // this.clientRelFormData.union = '1';
    // this.clientRelFormData.uc = '1';
    // this.clientRelFormData.district = '1';
    // this.clientRelFormData.city = '1';
    // this.clientRelFormData.province='1';

    console.log(this.clientRelFormData);
    this.model.clientRel.loanAppSeq = this.model.loanAppSeq;
    console.log(this.model);

    if (this.hasCob) {
      console.log('EDIT');
      this.model.clientRel.typFlg = 4;
      this.model.clientRel.isclientRel = true;
      console.log(this.clientRelFormData);
      this.loanService.updateClientRel(this.model.clientRel).subscribe((res) => {
        this.spinner.hide();
        console.log(res);
        this.model.clientRel.clntRelSeq = res.clntRelSeq;
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
      this.model.clientRel.typFlg = 4;
      this.loanService.saveClientRel(this.model.clientRel).subscribe((res: any) => {
        this.spinner.hide();
        console.log(res);
        this.model.clientRel.clntRelSeq = res.clntRelSeq;

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
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
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
    Object.assign(this.model.clientRel, add, this.model.clientRel);
    console.log(this.model.clientRel);
  }
  relationType: any;
  occupation: any;
  gender: any;
  maritalStatus: any;
  disability: any;
  residenceArray: any = [];
  communityArray: any;

  loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.RELATIVE_RELATION_KEL).subscribe((res) => {
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
    let str = this.model.clientRel.cnicNum + "";
    let charArray = str.split("");
    charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + '-';
      this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + item;
    })
  }
  cnicPattern(event: any, type: any) {
    if(this.readonly){
      this.readonly = false;
    }
    // this.validated = false;
    let dt = this.model.clientRel.cnicExpryDate;
    this.model.clientRel = new Nominee();
    this.model.clientRel.cnicExpryDate= dt;
    let cnicIssueDate = this.model.clientRel.cnicIssueDate;
    this.model.clientRel.cnicIssueDate= dt;

    this.age = "";
    // this.model.clientRel = new Nominee();
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
    } else if (type == "clientRel") {
      if (this.cnicPatternObj.cobCNIC.length)
        length = this.cnicPatternObj.cobCNIC.length;
      this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC.replace(/-/g, '');
      let array = this.cnicPatternObj.cobCNIC.split('');
      this.cnicPatternObj.cobCNIC = "";
      this.model.clientRel.cnicNum = "";
      array.forEach((char, index) => {
        let asciiCode = char.charCodeAt(0);
        if (asciiCode >= 48 && asciiCode <= 57) {
          if (index == 5 || index == 12) {
            this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + "-";
          }
          if (this.cnicPatternObj.cobCNIC.length < 15) {
            this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + char;
            this.model.clientRel.cnicNum = this.model.clientRel.cnicNum + char;
          }
        }
      });
    }
  }
  // cnicPattern(event: any, type: any) {
  //   console.log(event)

  //   if (event.charCode == 8 || event.charCode == 9
  //     || event.charCode == 27 || event.charCode == 13
  //     || (event.charCode == 65 && event.ctrlKey === true))
  //     return;
  //   if ((event.charCode < 48 || event.charCode > 57))
  //     event.preventDefault();

  // this.validated = false;
  //   let length: number = 0;



  //   if (type == "client") {
  //     if (this.cnicPatternObj.clientCNIC.length)
  //       length = this.cnicPatternObj.clientCNIC.length;
  //     if (length < 15) {
  //       if (length == 5 || length == 13)
  //         this.cnicPatternObj.clientCNIC = this.cnicPatternObj.clientCNIC + "-";
  //       this.model.cnicNum = this.cnicPatternObj.clientCNIC.replace(/-/g, '');
  //       this.model.cnicNum = this.model.cnicNum + event.key;
  //     }
  //   } else if (type == "nominee") {
  //     if (this.cnicPatternObj.nomCnic.length)
  //       length = this.cnicPatternObj.nomCnic.length;
  //     if (length < 15) {
  //       if (length == 5 || length == 13)
  //         this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + "-";
  //       if (this.model.nominee.cnicNum == undefined)
  //         this.model.nominee.cnicNum = "";
  //       this.model.nominee.cnicNum = this.cnicPatternObj.nomCnic.replace(/-/g, '');
  //       this.model.nominee.cnicNum = this.model.nominee.cnicNum + event.key;
  //     }
  //   } else if (type == "clientRel") {
  //     if (this.cnicPatternObj.cobCNIC.length)
  //       length = this.cnicPatternObj.cobCNIC.length;
  //     if (length < 15) {
  //       if (length == 5 || length == 13)
  //         this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + "-";
  //       this.model.clientRel.cnicNum = this.cnicPatternObj.cobCNIC.replace(/-/g, '');
  //       this.model.clientRel.cnicNum = this.model.clientRel.cnicNum + event.key;
  //     }
  //   }
  // }

  findKeyFromValue(value, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeValue == value) {
          return array[i].codeKey;
        }
      }
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
      this.model.clientRel.phone = this.clientPhone.replace(/[(]/g, '');
      this.model.clientRel.phone = this.clientPhone.replace(/[)]/g, '');
      this.model.clientRel.phone = this.clientPhone.replace(/ /g, '');
      this.model.clientRel.phone = this.model.clientRel.phone + event.key;
    }
    console.log(this.model.nominee.phone);
  }
}
