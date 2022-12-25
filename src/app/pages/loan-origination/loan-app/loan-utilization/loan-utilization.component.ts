import { Component, DoCheck, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { LoanUtilization } from '../../../../shared/models/LoanUtilization.model';
import { CommonService } from '../../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';

@Component({
  selector: 'app-loan-utilization',
  templateUrl: './loan-utilization.component.html',
  styleUrls: ['./loan-utilization.component.css']
})
export class LoanUtilizationComponent implements OnInit, DoCheck {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  model: any; formSaved = false;
  matcher = new MyErrorStateMatcher();
  constructor(private router: Router, private loanService: LoanService, private commonService: CommonService,
    private spinner: NgxSpinnerService, private toaster: ToastrService
    , private breadcrumbProvider: BreadcrumbProvider) { }

  loanUtilization: LoanUtilization;
  min: number;
  maxAmount: number;
  now: any;
  titleValue = "Credit";
  ngOnInit() {
    const date = new Date();
    this.now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });
    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));
    if(this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
      this.titleValue = "Murabaha";
    }
    this.maxAmount = this.model.recAmount;
    this.setBreadCrumbs();

    this.loanUtilization = new LoanUtilization(this.model.loanSeq, this.model.formSeq);
    this.calculateTotalExpense();

    if (sessionStorage.getItem('editLoan') == 'true') {
      this.formSaved = true;
      this.loanService.getExpenseLoanInfo(this.model.loanAppSeq).subscribe((res) => {
        console.log(res);
        this.model.recAmount = res.recAmount;
        this.model.loanUtilization = res.loanUtilization;
        sessionStorage.setItem("model",JSON.stringify(this.model));
        this.calculateTotalExpense();
        // this.model.recAmount = res.recommended;
        // this.model.loanUtilization = res.plans;
        console.log(this.model);
      }, (error) => {
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }
    this.loadLovs();
  }

  setBreadCrumbs() {
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
  }
  expenseTypeArray: any;
  expenseTypeArrayOrig: any;
  loadLovs() {

    let expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE;
    this.loanService.getMwPrdBySeq(this.model.loanProd).subscribe(res => {
      if (res != null)
          if (res.prdGrpSeq == 9) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_SCHOOL;
          } else if (res.prdGrpSeq == 16) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_DAIRY; 
          }
          else if (res.prdGrpSeq == 5305) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_MEAT; 
          }
          //Added by Areeba
          else if (res.prdGrpSeq == 22) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_VEHICLE; 
          }
          // Added by Areeba - 9-12-2022 - HIL values
          else if (res.prdGrpSeq == 21) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_HIL;
            console.log("expense_group_code",expense_group_code);
          }
          //Added by Areeba - 12-1-2022
          else if (res.prdGrpSeq == 24) {
            expense_group_code = REF_CD_GRP_KEYS.LOAN_UTILIZATION_EXPENSE_KMWK_KM; 
          }
       this.commonService.getValues(expense_group_code).subscribe((res) => {
              this.expenseTypeArray = res;
              this.expenseTypeArrayOrig = JSON.parse(JSON.stringify(res));
              console.log('Expense');
              console.log(this.expenseTypeArray);
            }, (error) => {
              console.log('err', error);
            });
    })


  }
  addExpense() {
  }
  onSubmit() {
  }
  ngDoCheck() {
    sessionStorage.setItem('isSavedExpected', this.formSaved.toString());
  }
  continueClicked() {
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
  @Output() form = new EventEmitter();
  saveClicked() {
    this.formSaved = true;
    if (this.model.loanUtilization.length <= 0) {
      this.toaster.error("Add Loan Utilizataion");
    } else {
      if (this.model.forms) {
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              if (this.model.recAmount == this.totalExpense) {
                forms.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              } else {
                forms.isSaved = false;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          }
        );
      }
      sessionStorage.setItem('model', JSON.stringify(this.model));
    }
  }
  totalExpense = 0;
  calculateTotalExpense() {
    this.totalExpense = 0;
    for (let i = 0; i < this.model.loanUtilization.length; i++) {
      const x = +this.model.loanUtilization[i].loanUtilAmount;
      this.totalExpense = this.totalExpense + x;
      this.maxAmount = this.maxAmount - x;
    }
  }

  onLoanUtilizationForm() {
    if (+this.loanUtilization.loanUtilAmount <= 0) {
      this.toaster.error('Invalid Amount!', 'Error');
      return;
    }
    if (this.isEdit) {
      if ((+this.editTotal + +this.loanUtilization.loanUtilAmount) > this.model.recAmount) {
        this.toaster.error('Your Amount Exceeds Recommended Amount!', 'Error');
        (<any>$('#setUtilAmount')).modal('show');
        return;
      }
    } else {
      this.calculateTotalExpense();
      let total = +this.totalExpense + +this.loanUtilization.loanUtilAmount;
      if (total > this.model.recAmount) {
        this.toaster.error('Your Amount Exceeds Recommended Amount!', 'Error');
        (<any>$('#setUtilAmount')).modal('show');
        return;
      }
    }
    this.spinner.show();
    if (this.isEdit) {
      this.loanUtilization.loanAppSeq = this.model.loanAppSeq;
      this.loanUtilization.formSeq = this.model.formSeq;
      this.loanService.updateExpenseLoan(this.loanUtilization).subscribe((res) => {
        console.log(res);
        console.log(this.model);
        this.model.loanUtilization[this.loanUtilization.index] = this.loanUtilization;
        this.calculateTotalExpense();
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                if (this.model.recAmount == this.totalExpense) {
                  forms.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
                } else {
                  forms.isSaved = false;
                  this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
                }
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.loanUtilization = new LoanUtilization(this.model.loanSeq, this.model.formSeq);
        this.spinner.hide();
        (<any>$('#addmember')).modal('hide');
        this.saveClicked();
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    } else {
      console.log(this.model);
      console.log(this.loanUtilization);
      console.log(this.model.loanAppSeq);
      this.loanUtilization.loanAppSeq = this.model.loanAppSeq;
      this.loanService.addExpenseLoan(this.loanUtilization).subscribe((res) => {
        console.log(res);
        console.log(this.model);
        if (res.utilPlanSeq) {
          const x = +this.loanUtilization.loanUtilAmount;
          this.totalExpense = this.totalExpense + x;
          this.loanUtilization.utilPlanSeq = res.utilPlanSeq;
          this.model.loanUtilization.push(this.loanUtilization);
          this.maxAmount = this.maxAmount - x;
          if (this.model.forms) {
            this.model.forms.forEach(
              forms => {
                if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                  if (this.model.recAmount == this.totalExpense) {
                    forms.isSaved = true;
                    this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
                  } else {
                    forms.isSaved = false;
                    this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
                  }
                }
              }
            );
          }
          sessionStorage.setItem('model', JSON.stringify(this.model));
          this.loanUtilization = new LoanUtilization(this.model.loanSeq, this.model.formSeq);
          (<any>$('#addmember')).modal('hide');
         
        }
        this.spinner.hide();
      }, (error) => {
        this.toaster.error(error.error.error, "Error");
        this.spinner.hide();
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }
  }
  isEdit: boolean;
  addLoan() {
    this.removeItemsFromLOVUsingLoans();
    this.isEdit = false;
    this.loanUtilization = new LoanUtilization(this.model.loanSeq, this.model.formSeq);
    (<any>$('#addmember')).modal('show');
  }
  editTotal;
  editLoan(expense) {
    this.removeItemsFromLOVUsingLoans();
    this.isEdit = true;
    this.loanUtilization = JSON.parse(JSON.stringify(expense));
    this.loanUtilization.index = this.model.loanUtilization.indexOf(expense);
    this.editTotal = this.totalExpense - (+expense.loanUtilAmount);
    (<any>$('#addmember')).modal('show');
    this.expenseTypeArrayOrig.forEach(element => {
      if (element.codeKey == expense.loanUtilType) {
        this.expenseTypeArray.push(element);
      }
    });
  }
  itemToDelete: any;
  deleteLoan(expense: LoanUtilization) {
    (<any>$('#deleteLConfirmation')).modal('show');
    this.itemToDelete = expense;
  }
  confirmLDelete() {
    this.spinner.show();
    this.loanService.deleteExpectedLoanUtil('' + this.itemToDelete.utilPlanSeq).subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.toaster.success("Deleted");
      const index = this.model.loanUtilization.indexOf(this.itemToDelete);

      console.log(index)
      if (index > -1) {
        this.model.loanUtilization.splice(index, 1);
      }
      sessionStorage.setItem("model",JSON.stringify(this.model));
      this.calculateTotalExpense();
      (<any>$('#deleteLConfirmation')).modal('hide');
      if (this.model.forms) {
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              if (this.model.recAmount == this.totalExpense) {
                forms.isSaved = true;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              } else {
                forms.isSaved = false;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          }
        );
      }
      sessionStorage.setItem('model', JSON.stringify(this.model))
    }, error => { console.log(error); this.spinner.hide(); this.toaster.error(error.error.error); });
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
  removeItemsFromLOVUsingLoans() {
    this.expenseTypeArray = JSON.parse(JSON.stringify(this.expenseTypeArrayOrig));
    this.model.loanUtilization.forEach(x => {
      this.removeItemFromLOV(x.loanUtilType, this.expenseTypeArray);
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

  confirmUpdateAmount(){
    // console.log(this.model.recAmount - +th
    if (this.isEdit) {
      console.log(+this.editTotal)
      console.log(this.model.recAmount - +this.editTotal  )
      this.loanUtilization.loanUtilAmount = this.model.recAmount - +this.editTotal;
    }else{
      console.log(this.model.recAmount - +this.totalExpense )
      this.loanUtilization.loanUtilAmount = this.model.recAmount - +this.totalExpense;
    }
    (<any>$('#setUtilAmount')).modal('hide');
  }
}
