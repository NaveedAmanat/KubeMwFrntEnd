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
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.component.html',
  styleUrls: ['./next-of-kin.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NextOfKinComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true: false;
  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];

  model: any; formSaved = false;
  now: any; date: any;
  eightenYearsBefore: any;
  minDobYear: any;
  nominee: any;
  validated = true;
  matcher = new MyErrorStateMatcher();
  hasPermission = false;
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
  history: History = new History();
  validate() {
    if (/^([0-9])\1*$/.test(this.model.nextOfKin.cnicNum)) {
      this.toaster.error("Invalid CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.nextOfKin.cnicExpryDate == undefined || this.model.nextOfKin.cnicExpryDate == '') {
      this.toaster.error("Select CNIC Expiry Date"); return;
    }
    if (this.model.nextOfKin.cnicIssueDate == undefined || this.model.nextOfKin.cnicIssueDate == '') {
      this.toaster.error("Select CNIC Issue Date"); return;
    }
    this.spinner.show();

    this.loanService.validateCNIC(this.model.nextOfKin.cnicNum).subscribe((res) => {
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
        } else if (this.history.type == "2") {
          this.history.title = "Coborrower";
        } else if (this.history.type == "3") {
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
    if (+this.model.nextOfKin.cnicNum % 2) {
      this.model.nextOfKin.genderKey = this.findKeyFromValue('MALE', this.gender);
    } else {
      this.model.nextOfKin.genderKey = this.findKeyFromValue('FEMALE', this.gender);
    }
  }
  ngDoCheck() {
    sessionStorage.setItem('isSavedNominee', this.formSaved.toString());
  }
  hasNom = false; hasBoth = false;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });

    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));
    if (this.model.forms) {
      this.hasBoth = false;
      this.model.forms.forEach(element => {
        if (element.formUrl == 'nominee') {
          this.model.forms.forEach(form => {
            if (form.formUrl == 'next-of-kin') {
              this.hasBoth = true;
              form.hasNextOfKin = true;
              element.hasNextOfKin = true;
              this.hasBoth = true;
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
            if (this.hasBoth) {
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
            if (this.hasBoth) {
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
    if (!this.model.nextOfKin) {
      this.model.nextOfKin = new Nominee();
    } else if (this.model.nextOfKin.cnicNum != null || this.model.nextOfKin.cnicNum != undefined) {
      if (this.model.nextOfKin.cnicNum.length > 0) {
        this.setPattern();
        this.validated = this.model.nextOfKin.isValidated;
        this.clientPhone = this.model.nextOfKin.phone;
        this.age = this.calculateAge(new Date(this.model.nextOfKin.dob));
      }
    }
    this.model.nextOfKin.loanAppSeq = this.model.loanAppSeq;
    this.model.nextOfKin.formSeq = this.model.formSeq;
    this.model.nextOfKin.clientSeq = this.model.clientSeq;
    this.model.nextOfKin.typFlg = 2;
    console.log(this.model.nextOfKin);
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.formSaved = true;
      this.spinner.show();
      this.loanService.getClntRel(this.model.nextOfKin).subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        if (res != null && +res.cnicNum != 0) {
          this.hasNom = true;
          this.validated = true;
          res.clientSeq = this.model.clientSeq;
          //Added by Areeba
          res.formSeq = this.model.formSeq;
          //Ended by Areeba
          this.model.nextOfKin = res;
          this.setPattern();
          let array;
          if (this.model.nextOfKin.dob) {
            array = this.model.nextOfKin.dob.split('T', 1);
            console.log(array.length);
            if (array.length) {
              this.model.nextOfKin.dob = array[0];
            }
          }
          if (this.model.nextOfKin.cnicExpryDate) {
            array = this.model.nextOfKin.cnicExpryDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.nextOfKin.cnicExpryDate = array[0];
            }
          }
          if (this.model.nextOfKin.cnicIssueDate) {
            array = this.model.nextOfKin.cnicIssueDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.nextOfKin.cnicIssueDate = array[0];
            }
          }
          this.clientPhone = this.model.nextOfKin.phone;
          this.age = this.calculateAge(new Date(this.model.nextOfKin.dob));
        } else {
          this.hasNom = false;
          this.getPreviousClientRel();
        }
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
      });
    } else if (this.model.nextOfKin.clntRelSeq != undefined && this.model.nextOfKin.clntRelSeq != 0) {
      this.hasNom = true; this.validated = true;
      this.clientPhone = this.model.nextOfKin.phone;
      this.age = this.calculateAge(new Date(this.model.nextOfKin.dob));
      this.setPattern();
    } else {
      this.hasNom = false;
      this.getPreviousClientRel();
    }
    this.loadLovs();
    this.setPattern();
    if (this.model.nextOfKin.dob)
      this.age = this.calculateAge(new Date(this.model.nextOfKin.dob));
    if (this.model.nextOfKin.phone)
      this.clientPhone = this.model.nextOfKin.phone;

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('next-of-kin',this.model);
    // end
  }

  getPreviousClientRel() {
    this.loanService.getClientRelFromPreviousLoan(this.model.nextOfKin).subscribe((res: any) => {
      if (res != null && +res.cnicNum != 0) {
        this.validated = true;
        res.clientSeq = this.model.clientSeq;
        res.loanAppSeq = this.model.loanAppSeq;
        //Added by Areeba
        res.formSeq = this.model.formSeq;
        //Ended by Areeba
        this.model.nextOfKin = res;
        this.setPattern();
        let array;
        if (this.model.nextOfKin.dob) {
          array = this.model.nextOfKin.dob.split('T', 1);
          console.log(array.length);
          if (array.length) {
            this.model.nextOfKin.dob = array[0];
          }
        }
        if (this.model.nextOfKin.cnicExpryDate) {
          array = this.model.nextOfKin.cnicExpryDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.nextOfKin.cnicExpryDate = array[0];
          }
        }
        if (this.model.nextOfKin.cnicIssueDate) {
          array = this.model.nextOfKin.cnicIssueDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.nextOfKin.cnicIssueDate = array[0];
          }
        }
        this.clientPhone = this.model.nextOfKin.phone;
        this.age = this.calculateAge(new Date(this.model.nextOfKin.dob));
      }
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, 'Error');
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  age;
  cnicPatternObj: CNICPattern = new CNICPattern();
  setPattern() {
    ///  CNIC Pattern
    if(this.model.nextOfKin.cnicNum == undefined || this.model.nextOfKin.cnicNum == null)
      return;
    this.cnicPatternObj.nomCnic = "";
    let str = this.model.nextOfKin.cnicNum + "";
    let charArray = str.split("");
    charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + '-';
      this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + item;
    })
  }
  continueClicked() {
    if (this.model.isSAN || this.model.selfPDC) {
      // this.router.navigate(['loan-origination/business-appraisal']);
      if (this.model.forms) {
        let i = 0;
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 2].formUrl]);
            }
            i++;
          }
        );
      }
    } else {
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
      // this.router.navigate(['loan-origination/co-borrower']);
    }
  }

  onNomineeFormSubmit() {
    if(!this.model.isNomDetailAvailable){
      if(!(this.cnicPatternObj.nomCnic || this.model.nextOfKin.cnicIssueDate || this.model.nextOfKin.cnicExpryDate)){
        this.toaster.info('Please input valid value', 'Information')
        return ;
      }
    }

   
    this.model.nextOfKin.typFlg = 2; this.model.nextOfKin.isValidated = this.validated;
    this.spinner.show();

    this.loanService.saveStatus(this.model.clientSeq, this.model.isNomDetailAvailable).subscribe((res) => {
      if (this.model.isNomDetailAvailable) {
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = false;
              }
            }
          );
        }
      }

      sessionStorage.setItem('model', JSON.stringify(this.model));
    }, (error) => {
      // this.toaster.error(error.error.error, 'Error');
      // this.spinner.hide();
      console.log('err In Loan Service');
      console.log('err', error);
    });

    if (this.model.isNomDetailAvailable) {
      if (this.model.forms) {
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              forms.isSaved = false;
              this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
            }
          }
        );
      }
      this.formSaved = true;
      sessionStorage.setItem('model', JSON.stringify(this.model));
      this.spinner.hide(); return;
    }
    if (this.hasNom) {
      console.log('EDIT');
      console.log(this.model.nextOfKin);
      this.model.nextOfKin.loanAppSeq = this.model.loanAppSeq;
      this.loanService.updateClientRel(this.model.nextOfKin).subscribe((res) => {
        console.log(res);
        //this.model.nextOfKin.clntRelSeq = res.clientRelSeq;
        this.spinner.hide();
        this.toaster.success('Saved');
        if (this.model.isSAN) {
          this.model.coBorrower = this.model.nextOfKin;
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        this.toaster.error(error.error.error, 'Error');
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      console.log(this.model.nextOfKin);
      this.loanService.saveClientRel(this.model.nextOfKin).subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        this.toaster.success('Saved');
        this.hasNom = true;
        this.model.nextOfKin.clntRelSeq = res.clntRelSeq;
        if (this.model.isSAN) {
          this.model.coBorrower = this.model.nextOfKin;
          if (this.model.forms) {
            this.model.forms.forEach(
              forms => {
                if (forms.formUrl == 'co-borrower') {
                  forms.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
                }
              }
            );
          }
          sessionStorage.setItem('model', JSON.stringify(this.model));
        }
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        this.toaster.error(error.error.error, 'Error');
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }
  }


  relationType: any;
  occupation: any;
  gender: any;
  maritalStatus: any;
  disability: any;
  residenceArray: any = [];
  communityArray: any;

  loadLovs() {
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


    this.commonService.getValues(REF_CD_GRP_KEYS.RELATION_TYPE_NOMINEE).subscribe((res) => {
      this.relationType = res;
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

  sameAsClientSpaouseChange() {
    if (this.model.nextOfKin.fatherSpzFlag) {
      if (this.model.fathrFirstName.length) {
        this.model.nextOfKin.firstName = this.model.fathrFirstName;
        this.model.nextOfKin.lastName = this.model.fathrLastName;
      } else {
        this.model.nextOfKin.firstName = this.model.spzFirstName;
        this.model.nextOfKin.lastName = this.model.spzLastName;
      }
      this.model.nextOfKin.fatherFirstName = "";
      this.model.nextOfKin.fatherLastName = "";
    } else {
      this.model.nextOfKin.firstName = "";
      this.model.nextOfKin.lastName = "";
    }
  }
  onDOBChange(dob: string) {
    this.age = this.calculateAge(new Date(dob));
  }

  calculateAge(birthday) { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  cnicMandatory = false;
  cnicPattern(event: any, type: any) {
    if(this.readonly){
      this.readonly = false;
    }
    console.log(event)
    this.validated = false;
    let dt = this.model.nextOfKin.cnicExpryDate;
    this.model.nextOfKin = new Nominee();
    this.model.nextOfKin.cnicExpryDate= dt;

    let cnicIssueDate = this.model.nextOfKin.cnicIssueDate;
    this.model.nextOfKin.cnicIssueDate= cnicIssueDate;

    this.age = "";
    if (event.keyCode == 9
      || event.keyCode == 27 || event.keyCode == 13
      || (event.keyCode == 65 && event.ctrlKey === true))
      return;
    if ((event.keyCode < 48 || event.keyCode > 57))
      event.preventDefault();
    let oldSeq = this.model.nextOfKin.clntRelSeq;
    this.model.nextOfKin = new Nominee();
    this.model.nextOfKin.loanAppSeq = this.model.loanAppSeq;
    this.model.nextOfKin.formSeq = this.model.formSeq;
    this.model.nextOfKin.clientSeq = this.model.clientSeq;
    this.model.nextOfKin.clntRelSeq = oldSeq;
    this.model.nextOfKin.typFlg = 2;
    this.age = "";
    this.clientPhone = "";

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
    } else if (type == "nextOfKin") {
      if (this.cnicPatternObj.nomCnic.length)
        length = this.cnicPatternObj.nomCnic.length;
      this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic.replace(/-/g, '');
      let array = this.cnicPatternObj.nomCnic.split('');
      this.cnicPatternObj.nomCnic = "";
      this.model.nextOfKin.cnicNum = "";
      array.forEach((char, index) => {
        let asciiCode = char.charCodeAt(0);
        if (asciiCode >= 48 && asciiCode <= 57) {
          if (index == 5 || index == 12) {
            this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + "-";
          }
          if (this.cnicPatternObj.nomCnic.length < 15) {
            this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + char;
            this.model.nextOfKin.cnicNum = this.model.nextOfKin.cnicNum + char;
          }
        }
      });
    } else if (type == "clientRel") {
      if (this.cnicPatternObj.cobCNIC.length)
        length = this.cnicPatternObj.cobCNIC.length;
      if (length < 15) {

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
    console.log(this.model.nextOfKin.cnicNum)
    if (this.model.nextOfKin.cnicNum.length > 0) {
      this.validated = false;
      this.cnicMandatory = true;

    } else {
      this.cnicMandatory = false;
      this.validated = true;
    }
  }
  // cnicPattern(event: any, type: any) {
  //   console.log(event)
  //   this.validated = false;
  //   if (event.charCode == 8 || event.charCode == 9
  //     || event.charCode == 27 || event.charCode == 13
  //     || (event.charCode == 65 && event.ctrlKey === true))
  //     return;
  //   if ((event.charCode < 48 || event.charCode > 57))
  //     event.preventDefault();


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
  //   } else if (type == "nextOfKin") {
  //     if (this.cnicPatternObj.nomCnic.length)
  //       length = this.cnicPatternObj.nomCnic.length;
  //     if (length < 15) {
  //       if (length == 5 || length == 13)
  //         this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + "-";
  //       if (this.model.nextOfKin.cnicNum == undefined)
  //         this.model.nextOfKin.cnicNum = "";
  //       this.model.nextOfKin.cnicNum = this.cnicPatternObj.nomCnic.replace(/-/g, '');
  //       this.model.nextOfKin.cnicNum = this.model.nextOfKin.cnicNum + event.key;
  //     }
  //   } else if (type == "co-borrower") {
  //     if (this.cnicPatternObj.cobCNIC.length)
  //       length = this.cnicPatternObj.cobCNIC.length;
  //     if (length < 15) {
  //       if (length == 5 || length == 13)
  //         this.cnicPatternObj.cobCNIC = this.cnicPatternObj.cobCNIC + "-";
  //       this.model.coBorrower.cnicNum = this.cnicPatternObj.cobCNIC.replace(/-/g, '');
  //       this.model.coBorrower.cnicNum = this.model.coBorrower.cnicNum + event.key;
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
      this.model.nextOfKin.phone = this.clientPhone.replace(/[(]/g, '');
      this.model.nextOfKin.phone = this.clientPhone.replace(/[)]/g, '');
      this.model.nextOfKin.phone = this.clientPhone.replace(/ /g, '');
      this.model.nextOfKin.phone = this.model.nextOfKin.phone + event.key;
    }
    console.log(this.model.nextOfKin.phone);
  }
}
