import { filter } from 'rxjs/operators';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { VehicleLoansService } from '../../../../shared/services/vehicle-loans.service';
import { InsuranceMember } from '../../../../shared/models/InsuranceMembers.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../shared/services/common.service';
import { InsurancePlan } from '../../../../shared/models/InsurancePlan.model';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { lov } from '../../../../shared/models/lov.model';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { vehicleLoan } from '../../../../shared/models/vehicleLoan.model';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { Product } from 'src/app/shared/models/Product.model';
import { LoanProduct } from 'src/app/shared/models/LoanProduct.model';

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
  selector: 'app-insurance-info',
  templateUrl: './insurance-info.component.html',
  styleUrls: ['./insurance-info.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InsuranceInfoComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;

  disFlags: any[] = [{ name: 'Yes', value: true }, { name: 'No', value: false }];

  hasPlan = false;
  model: any; formSaved = false;
  now: any; date: any; eightenYearsBefore: any;
  matcher = new MyErrorStateMatcher();
  clientAge: any;
  isCnicDisable: boolean;
  isRelationDisable: boolean;
  minYear: any;
  year: any;
  day: any;
  month: any;
  isDobDisable: boolean;
  loanAppSeq;
  breadEarner: lov[] = [];
  loanApplicationInfo: any;
  addingChildAfterDisbursement: boolean = true;
  hasPermission = false;
  clientSeq: string;
  plans: InsurancePlan[] = []; formSeq;
  insurnaceMemberFromData;

  //
  vehicleLoan: vehicleLoan;

  product: LoanProduct;
  productsa: LoanProduct[] = [];
  products: LoanProduct[] = [];

  installments: any;


constructor(private loanService: LoanService, private router: Router, private commonService: CommonService,
  private spinner: NgxSpinnerService
  , private toaster: ToastrService
  , private breadcrumbProvider: BreadcrumbProvider
  , private vehicleLoansService: VehicleLoansService,) {
  this.now = new Date();
  this.date = this.now;
  this.minYear = 0;
  if ((this.now.getMonth() + 1) < 10) {
    this.month = '0' + (this.now.getMonth() + 1);
  } else {
    this.month = '' + (this.now.getMonth() + 1);
  }
  if ((this.now.getDate() + 1) < 10) {
    this.day = '0' + (this.now.getDate());
  } else {
    this.day = '' + (this.now.getDate());
  }
  this.year = this.now.getFullYear();
}


titleValue = "Insurance";

ngOnInit() {
  let basicCrumbs: any[] = [];
  basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
  basicCrumbs.forEach(element => {
    this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
  });
  this.model = JSON.parse(sessionStorage.getItem('model'));
  this.loanAppSeq = this.model.loanAppSeq;

  if(this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
    this.titleValue = "Takaful";
  }

  this.loanService.getInsuranceMembers(this.model.loanAppSeq).subscribe((res) => {
    this.insurnaceMemberFromData = res;
    console.log(this.insurnaceMemberFromData)
  });

  // bm adding child 
  this.loanService.getLoanApp(this.model.loanSeq).subscribe((res) => {
    this.loanApplicationInfo = res.loanApp;
    if (res.loanApp.loan_app_sts_seq == "703" && this.auth.role == "bm") {
      this.addingChildAfterDisbursement = false;
      this.minYear = res.loanApp.loan_app_sts_dt;
      let a = new Date(this.loanApplicationInfo.loan_app_sts_dt);
      let today = new Date();
      let checkingYearFromDisbursmentDate = new Date(a.setMonth(a.getMonth() + 12))
      if (today < checkingYearFromDisbursmentDate) {
        this.date = new Date();
      } else {
        this.date = checkingYearFromDisbursmentDate;
      }
    } else {
      this.addingChildAfterDisbursement = true;
    }
  });


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
          this.formSeq = element.formSeq;
        }
      }
    );
  }
  this.member = new InsuranceMember(this.model.loanAppSeq);
  // this.model.hlthInsrFlag = false;
  this.spinner.show();
  this.loanService.getInsurancePlans().subscribe((res) => {
    console.log(res);
    this.spinner.hide();
    this.plans = res;
    this.planChanged();
  }, (error) => {
    this.spinner.hide();
    console.log(error);
  });


  if (sessionStorage.getItem('editLoan') == 'true') {
    this.formSaved = true;
    console.log('EDIT');
    this.loanService.getSavedInsurancePlan(this.model.loanAppSeq).subscribe((res) => {
      Object.assign(this.model, res, this.model);
      console.log(this.model);
      this.model.formSeq = this.formSeq;
      this.planChanged();
    }, (error) => {
      console.log('err In Loan Info Service');
      console.log('err', error);
    });
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
      this.savedPlans = res;

      console.log(res);
    }, (error) => {
      console.log('err In Loan Info Service');
      console.log('err', error);
    });
  }
  this.loadLovs();
  // console.log(this.member.memberName)
  // console.log(this.loanApplicationInfo.loan_app_sts_dt)

  // Added by Naveed 29-07-2021
  this.hasPermission = this.commonService.checkPermission('insurance-info', this.model);
  // end
  this.vehicleLoansService.getVehicleInfoByLoan(this.loanAppSeq).subscribe((respose) => {
    this.spinner.hide();
      if(respose['success']){
        this.model.vehiclePurchaseAmt = respose['success'].insurdAmt;
      }
  }, (error) => {
    this.toaster.error(error.error.error, "Error");
    console.log('err', error);
   
  });
  this.loanService.getProducts(this.model).subscribe((res) => {
    var i = 0;
    res.forEach(prd => {
      if (prd.prdGrpSeq == this.model.loanProdGrp) {
        this.productsa[i++] = prd;
      }
    });
    this.products = this.productsa;

    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].productSeq == this.model.loanProd) {
        this.product = this.products[i];
        break;
      }
    }
    this.installments = this.product.installments;


    if (this.selectedPlan.anlPremAmt == 100) {
      if (this.model.loanProdGrp == 23) {
        this.annualInsrFee = Math.round((this.selectedPlan.anlPremAmt * this.installments) / 2);
      }
      else {
        this.annualInsrFee = 100 * this.installments;
      }
    }
    else if (this.selectedPlan.anlPremAmt == 25) {
      this.annualInsrFee = this.selectedPlan.anlPremAmt * this.installments;
    }
    else {
      this.annualInsrFee = this.selectedPlan.anlPremAmt;
    }
  });
}
annualInsrFee: any;
selectedPlan: InsurancePlan = new InsurancePlan();
planChanged() {
  for (let i = 0; i < this.plans.length; i++) {
    //Edited by Areeba - 2-12-2022
    if (this.plans[i].hlthInsrPlanSeq == this.model.healthInsrPlanSeq) {
      this.selectedPlan = this.plans[i];
    }
  }  
}
disableMainEarner = false;
relationChanged(flag) {
  if (flag) {
    this.model.mainBreadEarnerName = "";
  }
  this.disableMainEarner = false;

  let husbandKey = -1; let selfkey = -1;
  this.breadEarner.forEach((relation, index) => {
    if (relation.codeValue.toLowerCase() == 'husband') {
      husbandKey = relation.codeKey;
    }
    if (relation.codeValue.toLowerCase() == 'self') {
      selfkey = relation.codeKey;
    }
  })

  if (this.model.relWithBreadEarnerKey == husbandKey) {

    if (this.model.spzFirstName != null && this.model.spzFirstName != undefined && this.model.spzFirstName.length > 0
      && this.model.spzLastName != null && this.model.spzLastName != undefined && this.model.spzLastName.length > 0) {
      this.disableMainEarner = true;
      this.model.mainBreadEarnerName = this.model.spzFirstName + " " + this.model.spzLastName;
    }
  }
  if (this.model.relWithBreadEarnerKey == selfkey) {
    if (this.model.firstName != null && this.model.firstName != undefined && this.model.firstName.length > 0) {
      this.disableMainEarner = true;
      this.model.mainBreadEarnerName = this.model.firstName + " " + this.model.lastName;
    }
  }
}
onDOBChange(dob) {
  this.clientAge = this.calculateAge(new Date(dob));
  this.member.dob = this.commonService.formatDateCustom(dob, 'yyyy-MM-dd');
  this.isCnicDisable = this.clientAge < 18;
  if (this.clientAge < 18)
    this.member.memberCnicNum = "";
  console.log(this.member.dob);
  console.log(this.clientAge);
}
calculateAge(birthday) { // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
saveClicked() {
  console.log("Test", this.model);
  this.model.formSeq = this.formSeq;
  this.model.loanAppSeq = this.loanAppSeq;

  // Added by Zohaib Asim - Dated 23-09-2022 - KSWK
  if (this.model.loanProd == 49 || this.model.loanProd == 50) {
    if (this.model.vehiclePurchaseAmt == null || this.model.vehiclePurchaseAmt == undefined
      || this.model.vehiclePurchaseAmt == 0 || this.model.vehiclePurchaseAmt < this.model.approvedAmount
      || this.model.vehiclePurchaseAmt > 300000) {
      this.toaster.info("In-Valid Value of Vehicle Purchase Amount", "Information");
      return;
    }

    //
    this.vehicleLoan = new vehicleLoan(this.model, this.model.vehiclePurchaseAmt);

    console.log('this.model.vehiclePurchaseAmt', this.model.vehiclePurchaseAmt);
    this.vehicleLoansService.getVehicleInfoByLoan(this.model.loanAppSeq).subscribe((findDataResp) => {
      console.log('find', findDataResp);
      if(findDataResp['failed']){
        this.vehicleLoansService.addVehicleInsrForm(this.vehicleLoan).subscribe((respose) => {
          this.spinner.hide();
            if(respose['success']){
              this.toaster.success(respose['success'], 'Success');
            }else if(respose['error']){
              this.toaster.warning(respose['error'], 'Warning');
              return;
            }
        }, (error) => {
          this.toaster.error(error.error.error, "Error");
          console.log('err', error);
          return;
        });
      }else if(findDataResp['success']){
        this.vehicleLoansService.updateVehicleInsrForm(this.vehicleLoan).subscribe((respose) => {
          this.spinner.hide();
            if(respose['success']){
              this.toaster.success(respose['success'], 'Success');
            }else if(respose['error']){
              this.toaster.warning(respose['error'], 'Warning');
              return;
            }
        }, (error) => {
          this.toaster.error(error.error.error, "Error");
          console.log('err', error);
          return;
        });
      }
    });
  }
  // End

  if (this.model.hlthInsrFlag) {
    // this.model.mainBreadEarnerName = "";
    // this.model.relWithBreadEarnerKey = 0;
    // this.model.healthInsurancePlanSeq = 0;
    // this.model.healthInsrPlanSeq = 0;
    if (this.model.exclusionCategoryKey == null || this.model.exclusionCategoryKey == undefined || this.model.exclusionCategoryKey == 0) {
      this.toaster.error("Field Missing"); return;
    }
    if (this.model.clntHlthInsrSeq == '' || this.model.clntHlthInsrSeq == null || this.model.clntHlthInsrSeq == 0) {
      // this.model.exclusionCategory = '1';
      // this.model.loanAppSeq = this.model.loanSeq;
      this.loanService.saveInsuranceInfo(this.model).subscribe((res) => {

        this.model.forms.forEach(
          form => {
            if ('/loan-origination/app/' + form.formUrl == this.router.url) {
              form.isSaved = true; form.formSaved = true;
            }
          }
        );
        console.log(res);

        sessionStorage.setItem('model', JSON.stringify(this.model));
        // this.formSaved = true;
        this.toaster.success("Health Insurance Saved")
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    } else {
      this.loanService.updateInsuranceInfo(this.model).subscribe((res) => {
        console.log(res);
        this.model.forms.forEach(
          form => {
            if ('/loan-origination/app/' + form.formUrl == this.router.url) {
              form.isSaved = true; form.formSaved = true;
            }
          }
        );
        sessionStorage.setItem('model', JSON.stringify(this.model));
        // this.formSaved = true;
        this.toaster.success("Health Insurance Saved")
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }
  } else {
    if (this.model.mainBreadEarnerName == undefined || this.model.mainBreadEarnerName == null || this.model.mainBreadEarnerName == ""
      || this.model.relWithBreadEarnerKey == undefined || this.model.relWithBreadEarnerKey == null || this.model.relWithBreadEarnerKey == 0
      || this.model.healthInsrPlanSeq == undefined || this.model.healthInsrPlanSeq == null || this.model.healthInsrPlanSeq == 0) {
      this.toaster.error("Fields Missing"); return;
    }
    if (this.model.clntHlthInsrSeq == '' || this.model.clntHlthInsrSeq == null || this.model.clntHlthInsrSeq == 0) {

      this.loanService.saveInsuranceInfo(this.model).subscribe((res) => {

        this.model.forms.forEach(
          form => {
            if ('/loan-origination/app/' + form.formUrl == this.router.url) {
              form.isSaved = true; form.formSaved = true;
            }
          }
        );
        console.log(res);

        sessionStorage.setItem('model', JSON.stringify(this.model));
        // this.formSaved = true;
        this.toaster.success("Health Insurance Saved")
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    } else {
      this.loanService.updateInsuranceInfo(this.model).subscribe((res) => {
        console.log(res);
        this.model.forms.forEach(
          form => {
            if ('/loan-origination/app/' + form.formUrl == this.router.url) {
              form.isSaved = true; form.formSaved = true;
            }
          }
        );
        sessionStorage.setItem('model', JSON.stringify(this.model));
        // this.formSaved = true;
        this.toaster.success("Health Insurance Saved")
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }
  }
  this.formSaved = true;
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

  }
  sessionStorage.setItem('model', JSON.stringify(this.model));
}
continueClicked() {
  if (this.model.forms) {
    let i = 0;
    this.model.forms.forEach(
      forms => {
        if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
          if (this.model.isNomDetailAvailable) {
            this.router.navigate(["/loan-origination/app/" + this.model.forms[i + 1].formUrl]);
          } else {
            this.router.navigate(["/loan-origination/app/" + this.model.forms[i + 2].formUrl]);
          }

        }
        i++;
      }
    );
  }
  // this.router.navigate(['loan-origination/nominee']);
}
savedPlans: any[] = [];
ngDoCheck() {
  sessionStorage.setItem('isSavedInsurance', this.formSaved.toString());
}
onInsuranceFormSubmit() {
  this.cnicMandatory = true;
  this.memberCnic = "";

  //
  console.log(this.model.vehiclePurchaseAmt);


  // console.log(this.model.clntHlthInsrSeq);
  // console.log(this.model.clntHlthInsrSeq != 0 && this.model.clntHlthInsrSeq != null && this.model.clntHlthInsrSeq != '' || this.model.clntHlthInsrSeq != undefined)
  this.spinner.show();
  this.isEdit = false;
  this.isCnicDisable = true;
  // this.model.exclusionCategoryKey = 0;
  this.model.loanAppSeq = this.loanAppSeq;
  // console.log(this.model);
  if (this.model.clntHlthInsrSeq != 0 && this.model.clntHlthInsrSeq != null && this.model.clntHlthInsrSeq != '' && this.model.clntHlthInsrSeq != undefined) {
    this.loanService.updateInsuranceInfo(this.model).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      this.model.clntHlthInsrSeq = res.clntHlthInsrSeq;
      this.member = new InsuranceMember(this.model.loanSeq);
      this.model.forms.forEach(
        form => {
          if ('/loan-origination/app/' + form.formUrl == this.router.url) {
            form.isSaved = true; form.formSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(form.formNm, '/loan-origination/app/' + form.formUrl, form.isSaved, false);
          }
        }
      );

      let husbandKey = -1; let i = -1;
      this.relationType.forEach((relation, index) => {
        console.log(relation.codeValue)
        if (relation.codeValue.toLowerCase() == 'husband') {
          husbandKey = relation.codeKey;
          i = index;
        }
      })
      if (husbandKey) {
        this.model.insuranceMembers.forEach(member => {
          if (member.relKey == husbandKey) {
            if (i >= 0) {
              this.relationType.splice(i, 1);
            }
          }
        })
      }

      // this.member = new InsuranceMember(this.model.clntHlthInsrSeq);
      (<any>$('#addmember')).modal('show');
      sessionStorage.setItem('model', JSON.stringify(this.model));
      this.spinner.hide();
      // this.formSaved = true;

      this.loanService.getLoanApp(this.model.loanSeq).subscribe((res) => {
        this.loanApplicationInfo = res.loanApp;
        if (res.loanApp.loan_app_sts_seq == "703" && this.auth.role == "bm") {
          console.log('i am inside on insurance form submit');
          this.member.maritalStatusKey = 21;
          for (let i = 0; i < this.relationType.length; i++) {
            if (this.relationType[i].codeKey == 434) {
              this.relationType.splice(i, 1);
            }
          }
        }
      });

    }, (error) => {
      this.spinner.hide();
      console.log('err In Loan Info Service');
      console.log('err', error);
    });


  } else {
    // this.model.exclusionCategory = '1';
    // this.model.loanAppSeq = this.model.loanSeq;
    this.loanService.saveInsuranceInfo(this.model).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      this.model.clntHlthInsrSeq = res.clntHlthInsrSeq;
      this.member = new InsuranceMember(this.model.loanSeq);

      let husbandKey = -1; let i = -1;
      this.relationType.forEach((relation, index) => {
        if (relation.codeValue.toLowerCase() == 'husband') {
          husbandKey = relation.codeKey;
          i = index;
        }
      })
      if (husbandKey) {
        this.model.insuranceMembers.forEach(member => {
          if (member.relKey == husbandKey) {
            if (i >= 0) {
              this.relationType.splice(i, 1);
            }
          }
        })
      }
      (<any>$('#addmember')).modal('show');
      this.model.forms.forEach(
        form => {
          if ('/loan-origination/app/' + form.formUrl == this.router.url) {
            form.isSaved = true; form.formSaved = true;
          }
        }
      );


      sessionStorage.setItem('model', JSON.stringify(this.model));
      // this.formSaved = true;
    }, (error) => {
      console.log('err In Loan Info Service');
      console.log('err', error);
    });
  }
}
isEdit: boolean;
onRadioChange(radio: boolean) {
  this.hasPlan = radio;
  if (!this.hasPlan) {
    // this.model.insuranceMembers = [];
  } else {
    // this.model.exclusionCategoryKey = 0;
  }
  console.log(this.hasPlan);
}
member: InsuranceMember;
onAddInsuranceMemberFormSubmit() {

  let valueOfName = this.member.memberName;
  let genderKey = this.member.genderKey;
  let statusKey = this.member.maritalStatusKey;
  let cnicNm = this.member.memberCnicNum;
  let relKey = this.member.relKey;
  let dob = this.member.dob;

  if (this.loanApplicationInfo.loan_app_sts_seq == "703" && this.auth.role == "bm") {
    console.log(this.loanApplicationInfo.loan_app_sts_seq)
    console.log(this.auth.role)
    console.log(valueOfName)
    for (let a = 0; a < this.model.insuranceMembers.length; a++) {

      if (this.model.insuranceMembers[a].memberName.trim().toLowerCase().split(' ').join('') == valueOfName.trim().toLowerCase().split(' ').join('') &&
        this.model.insuranceMembers[a].memberCnicNum == cnicNm && this.model.insuranceMembers[a].relKey == relKey &&
        this.model.insuranceMembers[a].genderKey == genderKey && this.model.insuranceMembers[a].maritalStatusKey == statusKey && this.model.insuranceMembers[a].dob == dob) {
        this.toaster.error('Record Already Exist', 'Error');
        return;
      }
    }
  }


  if (this.auth.role == "admin" || this.auth.role == "ito") {
    for (let i = 0; i < this.model.insuranceMembers.length; i++) {
      if (this.model.insuranceMembers[i].memberName.trim().toLowerCase().split(' ').join('') == valueOfName.trim().toLowerCase().split(' ').join('') &&
        this.model.insuranceMembers[i].memberCnicNum == cnicNm && this.model.insuranceMembers[i].relKey == relKey &&
        this.model.insuranceMembers[i].genderKey == genderKey && this.model.insuranceMembers[i].maritalStatusKey == statusKey && this.model.insuranceMembers[i].dob == dob) {
        this.toaster.error('Record Already Exist', 'Error');
        return;
      }
    }
  }

  console.log(this.model);
  // console.log(this.model.insuranceMembers)
  // if (this.model.insuranceMembers.loanAppStatus == "ACTIVE") {
  //   console.log('i am active loan');
  //   return;
  // }
  this.spinner.show();
  this.member.clntHlthInsrSeq = this.model.clntHlthInsrSeq;
  this.member.loanAppSeq = this.model.loanAppSeq;
  console.log(this.member);
  if (this.isEdit) {
    this.loanService.updateInsuranceMember(this.member).subscribe((res) => {
      this.spinner.hide();
      console.log('resEdit', res);
      this.toaster.success("Updated Plan");
      (<any>$('#addmember')).modal('hide');
      // sessionStorage.setItem("model", JSON.stringify(this.model));
      // this.formSaved = true;

      this.model.insuranceMembers.filter((element) => {
        if (+element.hlthInsrMemberSeq === +res.htlhInsrMemberSeq) {
          let index = this.model.insuranceMembers.indexOf(element)
          this.model.insuranceMembers.splice(index, 1);
          this.member.hlthInsrMemberSeq = res.htlhInsrMemberSeq;
          this.model.insuranceMembers.push(this.member);
          sessionStorage.setItem('model', JSON.stringify(this.model));

        } else {
          console.log('else case', +element.hlthInsrMemberSeq, +res.htlhInsrMemberSeq)
        }
      })

    }, (error) => {
      this.spinner.hide();
      console.log('err In Loan Info Service');
      console.log('err', error);
    });
  } else {
    this.loanService.saveInsuranceMember(this.member).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      this.toaster.success("Saved");
      this.member.hlthInsrMemberSeq = res.hlthInsrMemberSeq;
      this.model.insuranceMembers.push(this.member);
      (<any>$('#addmember')).modal('hide');
      this.member = new InsuranceMember(this.model.loanAppSeq);
      sessionStorage.setItem('model', JSON.stringify(this.model));
      // this.formSaved = true;
    }, (error) => {
      console.log('err In Loan Info Service');
      console.log('err', error);
    });
  }


}

cancelClicked() {
  this.member = new InsuranceMember(this.model.clntHlthInsrSeq);
  (<any>$('#addmember')).modal('hide');
}

editMember(member: InsuranceMember) {
  // this.isRelationDisable = 

  let husbandKey = -1; let i = -1;
  this.relationTypeOrig.forEach((relation, index) => {
    if (relation.codeValue.toLowerCase() == 'husband') {
      husbandKey = relation.codeKey;
      i = index;
    }
  })
  if (member.relKey == husbandKey) {
    this.relationType = JSON.parse(JSON.stringify(this.relationTypeOrig))
  }
  if (member.memberCnicNum == null) {
    member.memberCnicNum = '';
  }

  this.member = Object.assign({}, member);
  this.isEdit = true;
  this.handleChanges(member.relKey);
  this.onDOBChange(member.dob);
  this.memberCnic = "";
  //  CNIC Pattern
  let str = this.member.memberCnicNum + "";
  let charArray = str.split("");
  charArray.forEach((item, index) => {
    if (index == 5 || index == 12)
      this.memberCnic = this.memberCnic + '-';
    this.memberCnic = this.memberCnic + item;
  });

  this.gender = JSON.parse(JSON.stringify(this.genderOrig));
  this.maritalStatus = JSON.parse(JSON.stringify(this.maritalStatusOrig));
  (<any>$('#addmember')).modal('show');
}
itemToBeDeleted: InsuranceMember;
deleteMember(member: InsuranceMember) {
  (<any>$('#deleteConfirmation')).modal('show');
  this.itemToBeDeleted = member;
}
returnCNICPattern(cnic) {
  let string = '';
  let str = cnic + "";
  let charArray = str.split("");
  charArray.forEach((item, index) => {
    if (index == 5 || index == 12)
      string = string + '-';
    string = string + item;
  });
  return string;
}
confirmDelete() {
  this.spinner.show();
  this.loanService.deleteInsuranceMember(this.itemToBeDeleted.hlthInsrMemberSeq, this.itemToBeDeleted.loanAppSeq).subscribe((res) => {
    console.log(res);
    (<any>$('#deleteConfirmation')).modal('hide');
    this.spinner.hide();
    this.toaster.success("Deleted");
    const index = this.model.insuranceMembers.indexOf(this.itemToBeDeleted, 0);
    if (index > -1) {
      this.model.insuranceMembers.splice(index, 1);
      sessionStorage.setItem('model', JSON.stringify(this.model));
    }
  }, (error) => {
    this.spinner.hide();
    this.toaster.error(error.error.error, "Error")
    console.log(error);
  });

}


healthInsurancePlan: any;
exclusionCategory: any;
gender: any;
maritalStatus: any;
relationType: any;
genderOrig; maritalStatusOrig; relationTypeOrig;

loadLovs() {
  this.commonService.getValues(REF_CD_GRP_KEYS.HEALTH_INSURANCE_PLAN).subscribe((res) => {
    this.healthInsurancePlan = res;
  }, (error) => {
    console.log('err', error);
  });

  this.commonService.getValues(REF_CD_GRP_KEYS.KSZB_EXCLUSION_CATEGORY).subscribe((res) => {
    this.exclusionCategory = res;
  }, (error) => {
    console.log('err', error);
  });

  this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
    this.gender = res;
    this.genderOrig = JSON.parse(JSON.stringify(res));
  }, (error) => {
    console.log('err', error);
  });

  this.commonService.getValues(REF_CD_GRP_KEYS.MARITAL_STATUS).subscribe((res) => {
    this.maritalStatus = res;
    this.maritalStatusOrig = JSON.parse(JSON.stringify(res));
  }, (error) => {
    console.log('err', error);
  });

  this.commonService.getValues(REF_CD_GRP_KEYS.INSURANCE_RELATION).subscribe((res) => {
    this.relationType = JSON.parse(JSON.stringify(res));
    this.relationTypeOrig = JSON.parse(JSON.stringify(res));
    console.log("================")
    console.log(this.relationTypeOrig)
  }, (error) => {
    console.log('err', error);
  });

  this.commonService.getValues(REF_CD_GRP_KEYS.BREAD_EARNER).subscribe((res) => {
    this.breadEarner = res;
    this.relationChanged(false);
    //Added by Areeba
    console.log(this.breadEarner);
    console.log(this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus));
    if (this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus).toLowerCase() == "widow"
      || this.findValueFromKey(this.model.maritalStatusKey, this.maritalStatus).toLowerCase() == "divorced") {
      if (this.findValueFromKey(this.model.relWithBreadEarnerKey, this.breadEarner).toLowerCase() == "husband") {
        this.model.relWithBreadEarnerKey = null;
      }
      this.breadEarner.forEach((relation, index) => {
        if (relation.codeValue.toLowerCase() == "husband") {
          this.delIndex = index;
        }
      });
      if (this.delIndex != null)
        this.breadEarner.splice(this.delIndex, 1);
    }
    //Ended By Areeba
  }, (error) => {
    console.log('err', error);
  });
}
delIndex: any = null;
findValueFromKey(key, array) {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].codeKey == key) {
        return array[i].codeValue;
      }
    }
  }
}

findCodeFromKey(key, array) {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].codeKey == key) {
        return array[i].codeRefCd;
      }
    }
  }
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
cnicMandatory = true;
handleChanges(event) {
  console.log(this.relationType);
  console.log(event);
  this.isRelationDisable = false;
  this.isDobDisable = false;
  this.cnicMandatory = true;
  this.gender = JSON.parse(JSON.stringify(this.genderOrig));
  this.maritalStatus = JSON.parse(JSON.stringify(this.maritalStatusOrig));
  this.minYear = new Date(this.year - 64, this.month, this.day);
  // alert(this.member.relKey)
  if (this.findCodeFromKey(this.member.relKey, this.relationType).toLowerCase() == '0013') { // if relation is son than age cannot exceed 25 and status should be single
    this.minYear = new Date((this.year - 25), this.month, this.day);
    // this.member.genderKey = null;
    // this.findKeyFromVal();
    let i = -1;
    this.cnicMandatory = false;
    this.gender.forEach((gender, index) => {
      if (gender.codeValue.toLowerCase() == 'female') {
        i = index;
        // if(this.member.genderKey == gender.codeKey){
        //   this.member.genderKey = null;
        // }
      }
    });
    this.member.genderKey = this.findKeyFromVal("male", this.gender);
    if (i >= 0) {
      this.gender.splice(i, 1);
    }
    this.member.maritalStatusKey = this.findKeyFromVal("single", this.maritalStatus);

    this.isRelationDisable = true;
  } else if (this.findCodeFromKey(this.member.relKey, this.relationType).toLowerCase() == '0014') { // daughter
    this.cnicMandatory = false;
    // this.member.genderKey = null
    // this.member.maritalStatusKey = null;
    let i = -1;
    this.gender.forEach((gender, index) => {
      if (gender.codeValue.toLowerCase() == 'male') {
        i = index;
        if (this.member.genderKey == gender.codeKey) {
          this.member.genderKey = null;
        }
      }
    });
    this.member.genderKey = this.findKeyFromVal('female', this.gender);
    if (i >= 0) {
      this.gender.splice(i, 1);
    }
    i = -1;
    this.maritalStatus.forEach((sts, index) => {
      if (sts.codeValue.toLowerCase() == "married") {
        i = index;
        if (this.member.maritalStatusKey == sts.codeKey) {
          this.member.maritalStatusKey = null;
        }
      }
    });
    if (i >= 0) {
      this.maritalStatus.splice(i, 1);
    }
    this.minYear = new Date(this.model.dob);
  } else if (this.findCodeFromKey(this.member.relKey, this.relationType).toLowerCase() == '0008') {
    let i = -1;
    this.gender.forEach((gender, index) => {
      if (gender.codeValue.toLowerCase() == "female") {
        i = index;
        if (this.member.genderKey == gender.codeKey) {
          this.member.genderKey = null;
        }
      }
    });
    this.member.genderKey = this.findKeyFromVal('male', this.gender);
    if (i >= 0) {
      this.gender.splice(i, 1);
    }
    this.member.maritalStatusKey = this.findKeyFromVal("married", this.maritalStatus);

    this.isRelationDisable = true;
  } else if (this.findCodeFromKey(this.member.relKey, this.relationType).toLowerCase() == '1050') {
    let i = -1;
    this.gender.forEach((gender, index) => {
      if (gender.codeValue.toLowerCase() == "male") {
        i = index;
        if (this.member.genderKey == gender.codeKey) {
          this.member.genderKey = null;
        }
      }
    });

    if (i >= 0) {
      this.gender.splice(i, 1);
    }
    this.member.maritalStatusKey = this.findKeyFromVal('married', this.maritalStatus);
    this.member.genderKey = this.findKeyFromVal('female', this.gender);
    this.isRelationDisable = true;
  }

  if (this.auth.role == "bm" && this.loanApplicationInfo.loan_app_sts_seq == "703") {
    let a = new Date(this.loanApplicationInfo.loan_app_sts_dt);
    this.minYear = new Date(this.loanApplicationInfo.loan_app_sts_dt);
    let today = new Date();
    let checkingYearFromDisbursmentDate = new Date(a.setMonth(a.getMonth() + 12))
    if (today < checkingYearFromDisbursmentDate) {
      this.date = new Date();
    } else {
      this.date = checkingYearFromDisbursmentDate
    }
  }
}


memberCnic: String = "";

cnicPattern(event: any) {
  console.log(event)

  if (event.charCode == 8 || event.charCode == 9
    || event.charCode == 27 || event.charCode == 13
    || (event.charCode == 65 && event.ctrlKey === true))
    return;
  if ((event.charCode < 48 || event.charCode > 57))
    event.preventDefault();


  let length: number = 0;

  if (this.memberCnic.length)
    length = this.memberCnic.length;
  if (length < 15) {
    if (length == 5 || length == 13)
      this.memberCnic = this.memberCnic + "-";
    this.member.memberCnicNum = this.memberCnic.replace(/-/g, '');
    this.member.memberCnicNum = this.member.memberCnicNum + event.key;
  }
}
isDisabled() {
  if (this.model.loan_app_sts_seq == 700 || this.model.loan_app_sts_seq == 702) {
    return false;
  } else {
    return this.auth.role == 'bm' ? true : false
  }
}
}
