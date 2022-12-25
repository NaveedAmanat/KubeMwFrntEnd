import { map } from 'rxjs/operators';
import { Request } from '@angular/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAN_BREADCRUMBS, PRODUCTS } from '../../../../shared/mocks/mock_common_codes';
import { LoanProduct } from '../../../../shared/models/LoanProduct.model';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { Subject } from 'rxjs';
import { BreadCrumb } from '../../../../shared/models/BreadCrumb.model';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { Auth } from '../../../../shared/models/Auth.model';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { CommonService } from '../../../../shared/services/common.service';
import { ProductGroup } from 'src/app/shared/models/productGroup.model';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.css']
})
export class LoanInfoComponent implements OnInit, DoCheck {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  disFlags: any[] = [{ name: 'Table Screening', value: false }, { name: 'Field Screening', value: true }];
  productsList = PRODUCTS;
  bradcrumbs = false;
  matcher = new MyErrorStateMatcher();
  auth: Auth;
  model: any; formSaved = false;
  prdEditable;
  tableFieldScreeingKEL: boolean = false;
  tableScreening: boolean = false;
  fieldScreening: boolean = false;
  hasPermission = false;
  constructor(private router: Router
    , private commonService: CommonService, private loanService: LoanService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService) { }
  basicCrumbs: any[] = [];
  ngOnInit() {
    this.model = JSON.parse(sessionStorage.getItem('model'));
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach((element, index) => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
      if ('/loan-origination/app/' + element.formUrl === this.router.url) {
        this.model.formSeq = element.formSeq;
        this.formSaved = element.isSaved;
      }
    });
    if (this.model.loanCyclNum == 1) {
      this.model.tblScrn = false;
    }



    if (this.model.loanProd == -1 || this.model.loanProd == null || this.model.loanProd == undefined) {
      this.prdEditable = true;
    } else {
      this.prdEditable = false;
    }

    // this.loanService.breadcrumbs.forEach(
    //   breadcrumb => this.breadcrumbProvider.addCheckedItem(breadcrumb.label, breadcrumb.href, breadcrumb.isSaved)
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
    this.spinner.hide();
    console.log(this.model);
    if (sessionStorage.getItem('editLoan') === 'true') {
      this.formSaved = true;
      console.log('EDIT');
      this.loanService.getLoanApp(this.model.loanSeq).subscribe((res) => {
        // res.clientSeq = this.model.clientSeq;
        res.loanApp.clientSeq = this.model.clientSeq;

        // this.prdEditable = true;
        res.loanApp.totIncmOfErngMemb = this.model.totIncmOfErngMemb;
        res.loanApp.bizDtl = this.model.bizDtl;
        Object.assign(this.model, res.loanApp, this.model);

        if (this.model.forms.length == 0) {
          this.model.forms = res.forms;
          this.model.forms.forEach(
            forms => {
              if (!(forms.formUrl === 'co-borrower' && this.model.selfPDC)) {
                this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
              } else {
                this.breadcrumbProvider.addDisabledItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
              }
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                this.model.formSeq = forms.formSeq;
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.onRecommendAmountChange(false);
        console.log(res);
      }, (error) => {
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }


    this.spinner.show();
    if (this.auth.role != "admin") {
      this.loanService.getProductsGroups(this.auth.emp_branch).subscribe((res) => {
        this.spinner.hide();
        console.log(res);
        this.productGroup = res;
        this.onProductGroupSelect();
        console.log(this.model)
      }, (error) => {
        this.spinner.hide();
        this.toaster.error(error.error.error, 'Error!');
        console.log(error);
      });
    } else {
      this.loanService.onBranchSelect.subscribe(value => {
        this.loanService.getProductsGroups(value).subscribe((res) => {
          this.spinner.hide();
          console.log(res);
          this.productGroup = res;
          this.onProductGroupSelect();
          console.log(this.model)
        }, (error) => {
          this.spinner.hide();
          this.toaster.error(error.error.error, 'Error!');
          console.log(error);
        })
      })
    }

    this.loanService.getAllFormsAssignments().subscribe(res => {
      this.allForms = res;
    }, error => {
      console.log(error);
    })

  if(this.model.loanProd==41 || this.model.loanProd==42 || this.model.loanProd==43){
    this.commonService.getValues(REF_CD_GRP_KEYS.LOAN_PURPOSE_KFK).subscribe((res) => {
      this.loanPurpose = res;
      // Added Naveed - Date: 27-10-2021
      // Credit Purpose Biz detail not show incase we select "Other"
      let other  = this.loanPurpose.some(m =>{ m.codeValue == this.model.bizDtl});
      if(!other){
        this.loanPurpose.push({"codeValue": this.model.bizDtl})
      }
      // Ended By Naveed - Date: 27-10-2021
    }, (error) => {
      console.log('err', error);
    });
  }else{
    this.commonService.getValues(REF_CD_GRP_KEYS.LOAN_PURPOSE).subscribe((res) => {
      this.loanPurpose = res;
      // Added Naveed - Date: 27-10-2021
      // Credit Purpose Biz detail not show incase we select "Other"
      let other  = this.loanPurpose.some(m =>{ m.codeValue == this.model.bizDtl});
      if(!other){
        this.loanPurpose.push({"codeValue": this.model.bizDtl})
      }
      // Ended By Naveed - Date: 27-10-2021
    }, (error) => {
      console.log('err', error);
    });
  }

    


    if (this.model.loan_app_sts_seq == 703 || this.model.loan_app_sts_seq == 704) {
      this.tableScreening = true;
      this.fieldScreening = true;
    } else if (this.model.loanProdGrp == 13) {
      this.tableScreening = false;
      this.fieldScreening = false;
    } else if (this.model.loanProdGrp !== 13 && this.model.loanCyclNum == 1) {
      this.tableScreening = true;
      this.fieldScreening = true;
    } else {
      this.tableScreening = false;
      this.fieldScreening = false;
    }
  }
  loanPurpose: any = [];
  ngDoCheck() {
    sessionStorage.setItem('isSavedLoanInfo', this.formSaved.toString());
  }
  onProductSelect(val, flag) {
    if (flag) {
      this.model.totIncmOfErngMemb = 0;
      this.model.bizDtl = '';
    }
    console.log(val);
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].productSeq == val) {
        this.product = this.products[i];
        break;
      }
    }
    this.onRecommendAmountChange(false);

    this.checkBusinessAppraisalForm();

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('loan-info', this.model);
    // end
  }

  productsa: LoanProduct[] = [];
  onProductGroupSelect() {
    this.loanService.getProducts(this.model).subscribe((res) => {
      this.spinner.hide();
      console.log(res);

      var i = 0;

      res.forEach(prd => {
        if (prd.prdGrpSeq == this.model.loanProdGrp) {
          this.productsa[i++] = prd;
        }
      });
      this.products = this.productsa;
      this.onProductSelect(this.model.loanProd, false);
      console.log(this.model)
      
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, 'Error!');
      console.log(error);
    });
  }

  onRecommendAmountChange(flag) {
    if (this.product != undefined && this.product.charges != undefined) {
      this.product.charges.forEach(charge => {
        if (charge.type == 2) {
          let totalCharge = 0;
          if (charge.slbs != null && charge.slbs != undefined) {
            let totalAmount = +this.model.recAmount;
            let remainingAmount = +this.model.recAmount;
            charge.slbs.forEach(slb => {
              if (+this.model.recAmount > +slb.startLmt) {
                if (slb.endLmt != null) {
                  remainingAmount = remainingAmount - (+slb.endLmt);
                  let chrgeAmt = Math.round(((+slb.endLmt - +slb.startLmt) * +slb.val) / 100);
                  totalCharge = totalCharge + chrgeAmt;
                } else {
                  let chrgeAmt = Math.round((remainingAmount * +slb.val) / 100);
                  totalCharge = totalCharge + chrgeAmt;
                }
              }
            })
          }
          this.product.totalRecieveable = Math.floor((+this.model.recAmount) + totalCharge);
          this.product.chargesStr = "" + totalCharge;
        }
        else {
          let totalCharge = 0;
          if (charge.slbs != null && charge.slbs != undefined) {
            let totalAmount = +this.model.recAmount;
            let remainingAmount = +this.model.recAmount;
            charge.slbs.forEach(slb => {
              console.log(+this.model.recAmount > +slb.startLmt)
              if (+this.model.recAmount > +slb.startLmt) {
                if (slb.endLmt != null) {
                  remainingAmount = remainingAmount - (+slb.endLmt);
                  let chrgeAmt = Math.round(((+slb.endLmt - +slb.startLmt) + +slb.val));
                  totalCharge = totalCharge + chrgeAmt;
                  console.log("11")
                } else {
                  let chrgeAmt = Math.round((remainingAmount + slb.val));
                  totalCharge = totalCharge + chrgeAmt;
                  console.log(totalCharge)
                }
              }
            })
          }
          this.product.totalRecieveable = Math.floor(+this.model.recAmount + +charge.charge);
          this.product.chargesStr = "" + Math.round(totalCharge);
        }
      })
      if (flag)
        this.model.approvedAmount = this.model.recAmount;
    }
    // if (this.product.calcType == 'Percentage') {
    //   this.product.totalRecieveable = Math.floor((+this.model.recAmount) + (+this.product.serviceCharges * +this.model.recAmount) / 100);
    // } else {
    //   this.product.totalRecieveable = Math.floor(+this.model.recAmount + +this.product.serviceCharges);
    // }
    // this.product.installmentAmount = Math.floor(this.product.totalRecieveable / this.product.installments);
    // this.product.chargesStr = '' + Math.floor((this.product.serviceCharges * this.model.recAmount) / 100);
  }
  product: LoanProduct = new LoanProduct();
  products: LoanProduct[] = [];
  productGroup: ProductGroup[] = [];
  continueClicked() {
    if (this.model.forms) {
      this.router.navigate(['/loan-origination/app/' + this.model.forms[0].formUrl]);
    }
  }
  onLoanInfoFormSubmit() {
    console.log(this.model)

    if (this.model.firstName == null || this.model.firstName == "N/A") {
      this.toaster.error("Save basic info first");
      return;
    }

    if ((+this.model.reqAmount % 1000) > 0) {
      this.toaster.error("Recommended amount should be multiple of 1000");
      return;
    }
    if ((+this.model.recAmount % 1000) > 0) {
      this.toaster.error("Recommended amount should be multiple of 1000");
      return;
    }
    if (+this.model.reqAmount < +this.model.recAmount) {
      this.toaster.error("Recommended amount exceeds Requested Amount");
      return;
    }
    if (+this.model.recAmount > +this.product.maxAmount) {
      this.toaster.error("Recommended amount exceeds Maximum amount");
      return;
    }
    if (+this.model.recAmount < +this.product.minAmount) {
      this.toaster.error("Recommended amount is less than Minimum amount");
      return;
    }

    if (+this.model.reqAmount < +this.model.approvedAmount) {
      this.toaster.error("Approved amount exceeds Requested Amount");
      return;
    }

    // if (this.auth.role == 'bm') {
      if ((+this.model.approvedAmount % 1000) > 0) {
        this.toaster.error("Approved amount should be multiple of 1000");
        return;
      }
      if (+this.model.approvedAmount <= 0) {
        this.toaster.error("Please Enter Valid Amount.");
        return;
      }
      if (+this.model.reqAmount < +this.model.approvedAmount) {
        this.toaster.error("Approved amount exceeds Requested Amount");
        return;
      }

      if (+this.product.maxAmount < +this.model.approvedAmount) {
        this.toaster.error("Approved amount exceeds Product's Max Amount");
        return;
      }

      if (+this.product.minAmount > +this.model.approvedAmount) {
        this.toaster.error("Approved amount less than Product's Min Amount");
        return;
      }
    // }
    console.log(JSON.stringify(this.model));
    this.spinner.show();
    // if (sessionStorage.getItem('editLoan') === 'true') {
    //   console.log('EDIT');
    //   console.log(this.model);
    //   this.loanService.updateLoanInfo(this.model).subscribe((res) => {
    //     console.log(res);
    //     this.spinner.hide();
    //     this.toaster.success('Saved');
    //     if (res.loanSeq) {
    //       this.model.loanSeq = res.loanSeq;
    //       this.model.loanAppSeq = res.loanSeq;
    //     }
    //     if (res.forms) {
    //       this.model.loanProduct = this.product;
    //       this.model.forms = res.forms;
    //       this.breadcrumbProvider._addItem = new Subject<BreadCrumb>();
    //       this.basicCrumbs.forEach(element => {
    //         if (element.formUrl == "mfcib" || element.formUrl == "documents") {
    //           element.isSaved = true;
    //           this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    //         } else if (element.formUrl == "submit" && this.auth.role == 'bm') {
    //           element.formNm = "Process Application";
    //           this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    //         } else if (!(element.formUrl === 'co-borrower' && this.model.isSelfPdc)) {
    //           this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    //         } else {
    //           this.breadcrumbProvider.addDisabledItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    //         }
    //         if ('/loan-origination/app/' + element.formUrl === this.router.url) {
    //           this.model.formSeq = element.formSeq;
    //         }
    //       });
    //       this.model = JSON.parse(sessionStorage.getItem('model'));
    //       if (this.model.forms) {
    //         this.model.forms.forEach(
    //           forms => {
    //             if (!(forms.formUrl === 'co-borrower' && this.model.selfPDC)) {
    //               this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
    //             } else {
    //               this.breadcrumbProvider.addDisabledItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
    //             }
    //             if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
    //               this.model.formSeq = forms.formSeq;
    //             }
    //           }
    //         );
    //       }
    //     }
    //     sessionStorage.setItem('model', JSON.stringify(this.model));
    //     this.formSaved = true;
    //   }, (error) => {
    //     if (error.status == 500) {
    //       this.toaster.error('Internal Server Error', 'Error!');
    //     } else {
    //       this.toaster.error(error.error.error, 'Error!');
    //     }
    //     this.spinner.hide();
    //     console.log('err In Loan Info Service');
    //     console.log('err', error);
    //   });
    // } else {
    this.model.prdRul = this.product.prdRul;
    this.model.termRule = this.product.termRule;
    this.model.limitRule = this.product.limitRule;
    console.log(this.model);
    if (this.model.loanAppSeq == undefined || this.model.loanAppSeq == '' || this.model.loanAppSeq == null) {
      this.loanService.saveLoanInfo(this.model).subscribe((res) => {
        console.log(res);

        this.spinner.hide(); this.toaster.success('Saved');

        if (res.loanSeq) {
          // this.model.loanSeq = res.loanSeq;
          this.model.loanProduct = this.product;
          // this.model.loanAppSeq = res.loanSeq;
        }
        if (res.forms) {
          this.model.forms = res.forms;
          if (!this.bradcrumbs) {
            res.forms.forEach(
              (form, index) => {
                if (!(form.formUrl === 'co-borrower' && this.model.selfPDC)) {
                  this.breadcrumbProvider.addCheckedItem(form.formNm, '/loan-origination/app/' + form.formUrl, form.isSaved);
                } else {
                  this.breadcrumbProvider.addCheckedItem(form.formNm, '/loan-origination/app/' + form.formUrl, form.isSaved);
                }
              }
            );
            this.bradcrumbs = true;
          }
          this.basicCrumbs.forEach(element => {
            if (this.router.url == '/loan-origination/app/' + element.formUrl) {
              element.isSaved = true;
              this.breadcrumbProvider.updateSavedStatusViaLabel2(element);
            }
          });
        }
        sessionStorage.setItem('basicCrumbs', JSON.stringify(this.basicCrumbs));
        sessionStorage.setItem('model', JSON.stringify(this.model));

        this.formSaved = true;
      }, (error) => {
        if (error.status == 500) {
          this.toaster.error('Internal Server Error', 'Error!');
        } else {
          this.toaster.error(error.error.error, 'Error!');
        }
        this.spinner.hide();
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    } else {
      this.loanService.updateLoanInfo(this.model).subscribe((res) => {
        console.log(res);
        console.log(this.basicCrumbs)
        this.spinner.hide(); this.toaster.success('Saved');
        this.prdEditable = false;
        // if (res.loanSeq) {
        //   this.model.loanSeq = res.loanSeq;
        //   this.model.loanAppSeq = res.loanSeq;
        // }

        //change here
        let hasNom = false;
        let hasboth = false
        if (res.forms) {
          res.forms.forEach(element => {
            if (element.formUrl == 'nominee') {
              res.forms.forEach(form => {
                if (form.formUrl == 'next-of-kin') {
                  hasboth = true;
                  form.hasNextOfKin = true;
                  element.hasNextOfKin = true;
                  hasboth = true;
                }
              })
            }
          });

          this.model.forms = res.forms;
          if (this.model.forms.length < 1) {
            res.forms.forEach(
              (element, index) => {
                if (element.formUrl == "mfcib" || element.formUrl == "documents") {
                  element.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                } else if (element.formUrl == "submit" && this.auth.role == 'bm' && this.auth.role == 'ho') {
                  element.formNm = "Process Application";
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
                } else if ((element.formUrl === 'co-borrower' && this.model.selfPDC) || (element.formUrl === 'co-borrower' && this.model.isSAN)) {
                  element.isSaved = true;
                  this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
                } else if (element.formUrl == 'next-of-kin') {
                  if (hasboth) {
                    this.model.hasNextOfKin = true;
                    if (this.model.isNomDetailAvailable) {
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
                    if (!this.model.isNomDetailAvailable) {
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
                  element.isSaved = true;
                }
              }
            );
          }
          // this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
          this.basicCrumbs.forEach((element, index) => {
            if ('/loan-origination/app/' + element.formUrl === this.router.url) {
              this.model.formSeq = element.formSeq;
              element.formSaved = true; element.isSaved = true;
            }
          });
          // this.basicCrumbs.forEach(element => {
          //   if (this.router.url == '/loan-origination/app/' + element.formUrl) {
          //     element.isSaved = true;
          //     this.breadcrumbProvider.updateSavedStatusViaLabel2(element);
          //   }
          // });
        }
        sessionStorage.setItem('basicCrumbs', JSON.stringify(this.basicCrumbs));
        sessionStorage.setItem('model', JSON.stringify(this.model));

        this.formSaved = true;

        // if (res.forms) {
        //   this.model.loanProduct = this.product;
        //   this.model.forms = res.forms;
        //   this.breadcrumbProvider._addItem = new Subject<BreadCrumb>();
        //   this.basicCrumbs.forEach(element => {
        //     if (element.formUrl == "mfcib" || element.formUrl == "documents") {
        //       element.isSaved = true;
        //       this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
        //     } else if (element.formUrl == "submit" && this.auth.role == 'bm') {
        //       element.formNm = "Process Application";
        //       this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
        //     } else if (!(element.formUrl === 'co-borrower' && this.model.isSelfPdc)) {
        //       this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
        //     } else {
        //       this.breadcrumbProvider.addDisabledItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
        //     }
        //     if ('/loan-origination/app/' + element.formUrl === this.router.url) {
        //       this.model.formSeq = element.formSeq;
        //     }
        //   });
        //   // this.model = JSON.parse(sessionStorage.getItem('model'));
        //   // if (this.model.forms) {
        //   //   this.model.forms.forEach(
        //   //     forms => {
        //   //       if (!(forms.formUrl === 'co-borrower' && this.model.selfPDC)) {
        //   //         this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
        //   //       } else {
        //   //         this.breadcrumbProvider.addDisabledItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
        //   //       }
        //   //       // this.breadcrumbProvider.addCheckedItem(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved);
        //   //       if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
        //   //         this.model.formSeq = forms.formSeq;
        //   //       }
        //   //     }
        //   //   );
        //   // }
        // }
        sessionStorage.setItem('model', JSON.stringify(this.model));
        this.formSaved = true;
      }, (error) => {
        if (error.status == 500) {
          this.toaster.error('Internal Server Error', 'Error!');
        } else {
          this.toaster.error(error.error.error, 'Error!');
        }
        this.spinner.hide();
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }
    // }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  alphaNumeric(event: any) {
    const pattern = /[0-9a-zA-Z/ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  showFields = false;
  allForms;
  checkBusinessAppraisalForm() {
    let found = false;
    this.showFields = false;
    if (this.product.productSeq != undefined) {
      this.loanService.getAllFormsAssignmentsBySeq(this.product.productSeq).subscribe(res => {
        res.forEach(form => {
          this.allForms.forEach(oform => {
            if (form.formSeq == oform.formSeq) {
              if (oform.formUrl == "business-appraisal") {
                found = true;
              }
              if (oform.formUrl == "school-appraisal") {
                found = true;
              }
              if (oform.formUrl == "live-stock-appraisal") {
                found = true;
              }

            }
          });
        });
        if (!found) {
          this.showFields = true; 
        }
      }, error => {
        console.log(error);
      })
    }
  }

  isDisabled(){
    if(this.model.loan_app_sts_seq == 700 || this.model.loan_app_sts_seq == 702){
      return false;
    }else{
      return true;
    }
  }
}
