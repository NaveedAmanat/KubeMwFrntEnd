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
import { InsuranceMember } from 'src/app/shared/models/InsuranceMembers.model';

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
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NomineeComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];

  model: any; formSaved = false;
  now: any; date: any;
  eightenYearsBefore: any;
  minDobYear: any;
  nominee: any;
  validated = false;
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

    if (/^([0-9])\1*$/.test(this.model.nominee.cnicNum)) {
      this.toaster.error("Invalid CNIC", "CNIC Number"); this.spinner.hide(); return;
    }
    if (this.model.nominee.cnicExpryDate == undefined || this.model.nominee.cnicExpryDate == '') {
      this.toaster.error("Select CNIC Expiry Date"); return;
    }
    if (this.model.nominee.cnicIssueDate == undefined || this.model.nominee.cnicIssueDate == '') {
      this.toaster.error("Select CNIC Issue Date"); return;
    }
    
    if (this.model.nominee.cnicNum == this.model.cnicNum) {
      this.toaster.error("Client CNIC can not be same as Nominee CNIC"); return;
    }
    this.spinner.show();

    this.loanService.validateCNIC(this.model.nominee.cnicNum).subscribe((res) => {
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
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    //   this.toaster.success("validated");
    //   this.validated = true;
    // }, 2800);
    if (+this.model.nominee.cnicNum % 2) {
      this.model.nominee.genderKey = this.findKeyFromValue('MALE', this.gender);
    } else {
      this.model.nominee.genderKey = this.findKeyFromValue('FEMALE', this.gender);
    }
  }
  cobFormSeq;
  ngDoCheck() {
    sessionStorage.setItem('isSavedNominee', this.formSaved.toString());
  }
  hasNom = false; hasBoth = false;
  isActive : boolean= false;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });

    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));

    // Disable Next of Kin and Nominee updation for KTK & HIL
    // or prev outstanding > 0 => active
    if(this.auth.role == 'bm' && (this.model.loanProdGrp == 23 || this.model.loanProdGrp == 21)){
      this.isActive = true;
    }
    else{
      this.isActive = false;
    }

    if (this.model.isNomDetailAvailable == undefined) {
      this.model.isNomDetailAvailable = true;
    }
    if (this.model.forms) {
      let hasboth = false;
      this.model.forms.forEach(element => {
        if (element.formUrl == 'nominee') {
          this.model.forms.forEach(form => {
            if (form.formUrl == 'next-of-kin') {
              hasboth = true;
              this.hasBoth = true;
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
    if (!this.model.nominee) {
      this.model.nominee = new Nominee();
    } else if (this.model.nominee.cnicNum != null || this.model.nominee.cnicNum != undefined) {
      if (this.model.nominee.cnicNum.length > 0) {
        this.clientPhone = this.model.nominee.phone;
        this.age = this.calculateAge(new Date(this.model.nominee.dob));
        this.setPattern();
        this.validated = this.model.nominee.isValidated;
      }
    }
    this.model.nominee.loanAppSeq = this.model.loanAppSeq;
    this.model.nominee.formSeq = this.model.formSeq;
    this.model.nominee.clientSeq = this.model.clientSeq;
    this.model.nominee.typFlg = 1;
    console.log(this.model);
    if (sessionStorage.getItem('editLoan') == 'true') {
      this.spinner.show();
      this.loanService.getClntRel(this.model.nominee).subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        if (res != null && +res.cnicNum != 0) {
          this.hasNom = true; this.validated = true; this.formSaved = true;
          res.clientSeq = this.model.clientSeq;
          this.model.nominee = res;
          this.setPattern();
          let array;
          if (this.model.nominee.dob) {
            array = this.model.nominee.dob.split('T', 1);
            console.log(array.length);
            if (array.length) {
              this.model.nominee.dob = array[0];
            }
          }
          if (this.model.nominee.cnicExpryDate) {
            array = this.model.nominee.cnicExpryDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.nominee.cnicExpryDate = array[0];
            }
          }
          if (this.model.nominee.cnicIssueDate) {
            array = this.model.nominee.cnicIssueDate.split('T', 1);
            console.log(array.length);
            console.log(array[0]);
            if (array.length) {
              this.model.nominee.cnicIssueDate = array[0];
            }
          }
          this.clientPhone = this.model.nominee.phone;
          this.age = this.calculateAge(new Date(this.model.nominee.dob));
        } else {
          this.hasNom = false;
          console.log(this.model)
          this.model.nominee.loanAppSeq = this.model.loanAppSeq;
          this.getPreviousClientRel();
        }
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
      });
    } else if (this.model.nominee.clntRelSeq != undefined && this.model.nominee.clntRelSeq != 0) {
      this.hasNom = true; this.validated = true;
      this.clientPhone = this.model.nominee.phone;
      if (this.cnicPatternObj.nomCnic == '' || this.cnicPatternObj.nomCnic.length <= 0)
        this.setPattern();
      this.age = this.calculateAge(new Date(this.model.nominee.dob));

    } else {
      this.getPreviousClientRel();
    }
    this.loadLovs();
    this.loanService.getInsuranceMembers(this.model.loanAppSeq).subscribe((res) => {
      res.forEach(obj => {
        if (obj.dob) {
          const array = obj.dob.split('T', 1);
          console.log(array.length);
          if (array.length) {
            obj.dob = array[0];
          }
        }
      });
      this.model.insuranceMembers = res;
    });

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('nominee', this.model);
    // end
  }

  getPreviousClientRel() {
    this.loanService.getClientRelFromPreviousLoan(this.model.nominee).subscribe((res: any) => {
      if (res != null && +res.cnicNum != 0) {
        this.validated = true; res.clientRelSeq = null;
        res.clientSeq = this.model.clientSeq;
        res.loanAppSeq = this.model.loanAppSeq;
        this.model.nominee = res;
        this.setPattern();
        let array;
        if (this.model.nominee.dob) {
          array = this.model.nominee.dob.split('T', 1);
          console.log(array.length);
          if (array.length) {
            this.model.nominee.dob = array[0];
          }
        }
        if (this.model.nominee.cnicExpryDate) {
          array = this.model.nominee.cnicExpryDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.nominee.cnicExpryDate = array[0];
          }
        }
        if (this.model.nominee.cnicIssueDate) {
          array = this.model.nominee.cnicIssueDate.split('T', 1);
          console.log(array.length);
          console.log(array[0]);
          if (array.length) {
            this.model.nominee.cnicIssueDate = array[0];
          }
        }
        this.clientPhone = this.model.nominee.phone;
        this.age = this.calculateAge(new Date(this.model.nominee.dob));
      }
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, 'Error');
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }

  changeSAN() {
    // if (!this.model.isSAN) {
    //   this.model.coBorrower = new Nominee();
    // }
  }
  age;
  cnicPatternObj: CNICPattern = new CNICPattern();
  setPattern() {
    ///  CNIC Pattern
    this.cnicPatternObj.nomCnic = "";
    let str = this.model.nominee.cnicNum + "";
    let charArray = str.split("");
    charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + '-';
      this.cnicPatternObj.nomCnic = this.cnicPatternObj.nomCnic + item;
    })
  }
  continueClicked() {
    if (this.model.isNomDetailAvailable) {
      if (this.model.forms) {
        let i = 0;
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              if (this.model.isSAN) {
                if (this.hasBoth) {
                  this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 3].formUrl]);
                } else {
                  this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 2].formUrl]);
                }
              } else {
                if (this.hasBoth) {
                  this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 2].formUrl]);
                } else {
                  this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 1].formUrl]);
                }
              }
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
    }
  }
  getCdForVal(seq, arr) {
    let cd = "";
    arr.forEach(item => {
      if (item.codeKey == seq) {
        cd = item.codeRefCd
      }
    })
    return cd;
  }
  findSeqForCd(cd, arr) {
    let seq = 0;
    arr.forEach(item => {
      if (item.codeRefCd == cd) {
        seq = item.codeKey
      }
    })
    return seq;
  }
  onNomineeFormSubmit() {
    this.model.nominee.isSAN = this.model.isSAN;
    this.model.nominee.typFlg = 1;
    this.model.nominee.loanAppSeq = this.model.loanAppSeq; this.model.nominee.formSeq = this.model.formSeq;

    console.log(this.model.nominee);
    console.log(this.model.nominee.relationKey)
    console.log(this.getCdForVal(this.model.nominee.relationKey, this.relationType))
    if (this.getCdForVal(this.model.nominee.relationKey, this.relationType) == "0008") {
      if (this.model.insuranceMembers.length <= 0) {
        let member = new InsuranceMember(this.model.loanAppSeq);
        member.dob = this.model.nominee.dob;
        member.genderKey = this.model.nominee.genderKey;
        member.maritalStatusKey = this.model.nominee.maritalStatusKey;
        member.memberCnicNum = this.model.nominee.cnicNum;
        member.memberName = this.model.nominee.firstName + " " + this.model.nominee.lastName;
        member.relKey = this.findSeqForCd(this.getCdForVal(this.model.nominee.relationKey, this.relationType), this.relationTypeInsurance);
        // this.model.loanAppSeq = this.model.loanSeq;
        this.loanService.saveInsuranceMember(member).subscribe((res) => {
          console.log(res);
          this.spinner.hide();
          this.toaster.success("Saved");
          (<any>$('#addmember')).modal('hide');
          sessionStorage.setItem('model', JSON.stringify(this.model));
          // this.formSaved = true;
        }, (error) => {
          console.log('err In Loan Info Service');
          console.log('err', error);
        });


        // this.loanService.saveInsuranceInfo(this.model).subscribe((res) => {
        //   this.model.clntHlthInsrSeq = res.clntHlthInsrSeq;
        //   this.member = new InsuranceMember(this.model.loanSeq);
        //   let husbandKey = -1; let i = -1;
        //   this.relationType.forEach((relation, index) => {
        //     if (relation.codeValue.toLowerCase() == 'husband') {
        //       husbandKey = relation.codeKey;
        //       i = index;
        //     }
        //   })
        //   if (husbandKey) {
        //     this.model.insuranceMembers.forEach(member => {
        //       if (member.relKey == husbandKey) {
        //         if (i >= 0) {
        //           this.relationType.splice(i, 1);
        //         }
        //       }
        //     })
        //   }
        //   (<any>$('#addmember')).modal('show');
        //   this.model.forms.forEach(
        //     form => {
        //       if ('/loan-origination/app/' + form.formUrl == this.router.url) {
        //         form.isSaved = true; form.formSaved = true;
        //       }
        //     }
        //   );


        //   sessionStorage.setItem('model', JSON.stringify(this.model));
        //   // this.formSaved = true;
        // }, (error) => {
        //   console.log('err In Loan Info Service');
        //   console.log('err', error);
        // });
      } else {
        console.log("ALREAFE");
        this.model.insuranceMembers.forEach(member => {
          console.log(member);
          //     let member = new InsuranceMember(this.model.loanAppSeq);
          // member.dob = this.model.nominee.dob;
          // member.genderKey = this.model.nominee.genderKey;
          // member.maritalStatusKey = this.model.nominee.maritalStatusKey;
          // member.memberCnicNum = this.model.nominee.cnicNum;
          // member.memberName = this.model.nominee.firstName + " " + this.model.nominee.lastName;
          // member.relKey = this.findSeqForCd(this.getCdForVal(this.model.nominee.relationKey, this.relationType), this.relationTypeInsurance);
        });
      }
      // this.model.insuranceMembers.forEach(member=>{
      //   console.log(member);
      //   if()
      // });
    }
    // return;
    this.spinner.show(); this.model.nominee.isValidated = true; this.model.nominee.cobFormSeq = this.cobFormSeq;
    console.log(this.model.clientSeq + "--" + this.model.isNomDetailAvailable);
    this.loanService.saveStatus(this.model.clientSeq, this.model.isNomDetailAvailable).subscribe((res) => {
      if (!this.model.isNomDetailAvailable) {
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
      }

      sessionStorage.setItem('model', JSON.stringify(this.model));
    }, (error) => {
      // this.toaster.error(error.error.error, 'Error');
      // this.spinner.hide();
      console.log('err In Loan Service');
      console.log('err', error);
    });

    if (!this.model.isNomDetailAvailable) {
      // if (this.model.forms) {
      //   this.model.forms.forEach(
      //     forms => {
      //       if (forms.formUrl == 'co-borrower') {
      //         if (this.model.isSAN && !this.model.selfPDC) {
      //           forms.isSaved = false;
      //           this.model.coBorrower = new Nominee();
      //         }
      //       }
      //     }
      //   );
      // }
      this.model.isSAN = false;
      this.loanService.saveStatusisSAN(this.model.clientSeq, this.model.isSAN).subscribe((res) => {
      }, (error) => {
        console.log('err', error);
      });
      this.model.nominee = new Nominee();
      sessionStorage.setItem('model', JSON.stringify(this.model)); this.formSaved = true;
      this.spinner.hide(); return;
    }
    this.loanService.saveStatusisSAN(this.model.clientSeq, this.model.isSAN).subscribe((res) => {
    }, (error) => {
      console.log('err', error);
    });
    this.model.nominee.typFlg = 1;
    if (this.hasNom) {
      console.log('EDIT');
      console.log(this.model.nominee);
      this.model.nominee.loanAppSeq = this.model.loanAppSeq;
      this.loanService.updateClientRel(this.model.nominee).subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        this.toaster.success('Saved');
        this.model.nominee.clntRelSeq = res.clntRelSeq;
        if (this.model.isSAN) {
          // this.model.coBorrower = this.model.nominee;
          this.model.forms.forEach(
            (element, index) => {
              if (element.formUrl === 'co-borrower') {
                element.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              }
            });
        } else {
          this.model.forms.forEach(
            (element, index) => {
              if (element.formUrl == 'co-borrower') {
                element.isSaved = false;
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            });
        }
        // else if (!this.model.selfPDC) {
        //   this.model.forms.forEach(
        //     (element, index) => {
        //       if (element.formUrl === 'co-borrower') {
        //         element.isSaved = false;
        //       }
        //     });
        // }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        // this.toaster.error(error.error.error, 'Error');
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      console.log(this.model);
      this.loanService.saveClientRel(this.model.nominee).subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        this.toaster.success('Saved');
        this.hasNom = true;
        this.model.nominee.clntRelSeq = res.clntRelSeq;
        if (this.model.isSAN) {
          // this.model.coBorrower = this.model.nominee;
          if (this.model.forms) {
            this.model.forms.forEach(
              forms => {
                if (forms.formUrl == 'co-borrower') {
                  forms.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, true);
                }
              }
            );
          }
        } else {
          this.model.forms.forEach(
            (element, index) => {
              if (element.formUrl == 'co-borrower') {
                element.isSaved = false;
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            });
        }
        // else if (!this.model.selfPDC) {
        //   if (this.model.forms) {
        //     this.model.forms.forEach(
        //       forms => {
        //         if (forms.formUrl == 'co-borrower') {
        //           forms.isSaved = false;
        //         }
        //       }
        //     );
        //   }
        // }
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = true;
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
    this.commonService.getValues(REF_CD_GRP_KEYS.INSURANCE_RELATION).subscribe((res) => {
      this.relationTypeInsurance = JSON.parse(JSON.stringify(res));
      console.log("================")
    }, (error) => {
      console.log('err', error);
    });
  }
  relationTypeInsurance;
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

  // sameAsClientSpaouseChangeOld() {
  //   console.log(this.model.nominee.fatherSpzFlag);
  //   if (this.model.nominee.fatherSpzFlag) {
  //     if (this.model.fathrFirstName.length) {
  //       this.model.nominee.firstName = this.model.fathrFirstName;
  //       this.model.nominee.lastName = this.model.fathrLastName;
  //       this.model.nominee.relationKey = this.findKeyFromVal("father", this.relationType);
  //     } else {
  //       this.model.nominee.relationKey = this.findKeyFromVal("husband", this.relationType);
  //       this.model.nominee.firstName = this.model.spzFirstName;
  //       this.model.nominee.lastName = this.model.spzLastName;
  //     }
  //     this.model.nominee.fatherFirstName = "";
  //     this.model.nominee.fatherLastName = "";
  //   } else {
  //     this.model.nominee.firstName = "";
  //     this.model.nominee.lastName = "";
  //   }
  // }
  sameAsClientSpaouseChange() {
    console.log(this.model.nominee.fatherSpzFlag);
    if (this.model.nominee.fatherSpzFlag) {
      if (this.model.fathrFirstName.length) {
        this.model.nominee.firstName = this.model.fathrFirstName;
        this.model.nominee.lastName = this.model.fathrLastName;
        this.model.nominee.relationKey = this.findKeyFromVal("father", this.relationType);
      } else {
        this.model.nominee.relationKey = this.findKeyFromVal("husband", this.relationType);
        this.model.nominee.firstName = this.model.spzFirstName;
        this.model.nominee.lastName = this.model.spzLastName;
      }
      // this.model.nominee.fatherFirstName = "";
      // this.model.nominee.fatherLastName = "";
    } else {
      // this.model.nominee.firstName = "";
      // this.model.nominee.lastName = "";
    }
  }
  onDOBChange(dob: string) {
    this.age = this.calculateAge(new Date(this.model.nominee.dob));
    let date: any;
    if (this.model.nominee.dob) {
      date = new Date(this.model.nominee.dob);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.nominee.dob = date.getFullYear() + '-' + month + '-' + day;
    }
  }

  calculateAge(birthday) { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  cnicPattern(event: any, type: any) {
    
    this.validated = false;
    let dt = this.model.nominee.cnicExpryDate;
    this.model.nominee = new Nominee();
    this.model.nominee.cnicExpryDate= dt;
    let cnicIssueDate = this.model.nominee.cnicIssueDate;
    this.model.nominee.cnicIssueDate= cnicIssueDate;

    this.age = "";
    if(this.readonly){
      this.readonly = false;
    }
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
      if (length < 15) {

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
      this.model.nominee.phone = this.clientPhone.replace(/[(]/g, '');
      this.model.nominee.phone = this.clientPhone.replace(/[)]/g, '');
      this.model.nominee.phone = this.clientPhone.replace(/ /g, '');
      this.model.nominee.phone = this.model.nominee.phone + event.key;
    }
    console.log(this.model.nominee.phone);
  }

  findKeyFromVal(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeValue.toLowerCase() == key.toLowerCase()) {
          return array[i].codeKey;
        }
      }
    }
    return 0;
  }

  onExpChange(dob: string){
    let date: any;
    if (this.model.nominee.cnicExpryDate) {
      date = new Date(this.model.nominee.cnicExpryDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.nominee.cnicExpryDate = date.getFullYear() + '-' + month + '-' + day;
    }
    if (this.model.nominee.cnicIssueDate) {
      date = new Date(this.model.nominee.cnicIssueDate);
      let month = (date.getMonth() + 1);
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      this.model.nominee.cnicIssueDate = date.getFullYear() + '-' + month + '-' + day;
    }
  }
}
