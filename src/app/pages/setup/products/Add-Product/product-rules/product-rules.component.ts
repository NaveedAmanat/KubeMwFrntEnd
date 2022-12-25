import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../../shared/models/Product.model';
import { ProductService } from '../../../../../shared/services/product.service';
import { MyErrorStateMatcher } from '../../../../../shared/helpers/MyErrorStateMatcher.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisbursementVoucherListItem } from '../../../../../shared/models/disbursementVoucherListItem.model';
import swal from 'sweetalert2';
import { LoanTerms, PrincipleAmount, Segregate, SegregateBody } from '../../../../../shared/models/principleAmount.model';
import { AdvanceRules, ProductRules } from '../../../../../shared/models/productRules.model';
import { CommonCode } from '../../../../../shared/models/commonCode.model';
import { CommonService } from '../../../../../shared/services/common.service';
import * as REF_CD_GRP_KEYS from '../../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-product-rules',
  templateUrl: './product-rules.component.html',
  styleUrls: ['./product-rules.component.css']
})
export class ProductRulesComponent implements OnInit {

  product: Product;
  matcher = new MyErrorStateMatcher();
  principleAmountForm: FormGroup;
  loanTermForm: FormGroup;
  allItemsPrincipleAmounts: PrincipleAmount[] = [];
  allItemsLoanTerms: LoanTerms[] = [];
  editPrinciple = false;
  editloan = false;
  allitemsRules: any[] = [];
  loanTermCurrent: LoanTerms;
  ruleCategories: CommonCode[] = [];
  loanTerms: CommonCode[] = [];
  ruleType: number;
  allProductRules: AdvanceRules[] = [];
  principleAmountCurrent: PrincipleAmount;
  segregateArray: SegregateBody[] = [];
  allsegregates: Segregate[];
  isEdit: string;
  constructor(private productService: ProductService
    , private fb: FormBuilder
    , private commonService: CommonService,
    private breadcrumbProvider: BreadcrumbProvider,
  private toaster:ToastrService) { }
  minTerms;
  ngOnInit() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.editPrinciple = false;
    this.editloan = false;
    this.product = JSON.parse(sessionStorage.getItem('product'));

    if(this.product.prdTypKey != 1165){
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }

    console.log(this.product)
    this.principleAmountForm = this.fb.group({
      minAmt: ['', Validators.required],
      maxAmt: ['', Validators.required],
      sgrtInstNum: ['', Validators.required],
      prdSeq: [''],
      rulSeq: [''],
      prdPpalLmtSeq: [''],
    });
    this.loanTermForm = this.fb.group({
      trmKey: ['', Validators.required],
      pymtFreqKey: ['', Validators.required],
      prdSeq: [''],
      rulSeq: [''],
      prdTrmSeq: [''],
    });
    this.loadBasics();
    this.getallLoanTerms();
    this.getAllPrincipleAmount();
  }
  // principle amount
  onSubmitPrincipleAmount() {
    const result: PrincipleAmount = Object.assign({}, this.principleAmountForm.value);
    console.log(result)
    if(+result.minAmt> +result.maxAmt){
      this.toaster.error("Min Amount can not exceed Max Amount");
      return;
    }
    (<any>$('#principleAmount')).modal('hide');
    result.prdSeq = this.product.productSeq;
    if(result.rulSeq==null){
      result.rulSeq = 30;
    }
    if (!this.editPrinciple) {
      this.productService.addPrincipleAmount(result).subscribe(d => {
        this.getAllPrincipleAmount();
      });
    } else {
      this.productService.updatePrincipleAmount(result).subscribe(d => {
        const itemIndex = this.allItemsPrincipleAmounts.findIndex(item => item.prdPpalLmtSeq === result.prdPpalLmtSeq);
        this.allItemsPrincipleAmounts[itemIndex] = result;
        this.editPrinciple = false;
      });
    }
  }
  calculateMin() {
    if (this.allItemsLoanTerms.length)
      this.minTerms = +this.getNameByKey(this.allItemsLoanTerms[0].trmKey, this.loanTerms);
    this.allItemsLoanTerms.forEach(obj => {
      if (+this.minTerms > +this.getNameByKey(obj.trmKey, this.loanTerms)) {
        this.minTerms = +this.getNameByKey(obj.trmKey, this.loanTerms)
      }
    });
  }
  openPrincipleAmount() {
    this.calculateMin();
    (<any>$('#principleAmount')).modal('show');
    this.principleAmountForm.reset();
  }
  editPrincipleAmount(voucher: PrincipleAmount) {
    (<any>$('#principleAmount')).modal('show');
    this.principleAmountForm.patchValue(voucher);
    this.editPrinciple = true;
  }
loadAdvRules(){
  if (this.product.productSeq != undefined) {
    this.productService.getAllRulesBySeq(this.product.productSeq).subscribe(
      d => {
        this.allProductRules = d;
        this.allProductRules.forEach(pr => {
          this.advRules.forEach(item=>{
            if(item.rulSeq == pr.rulSeq){
              pr.isAdded = true;item.isAdded=true;
            }
          })
          // this.allitemsRules[this.allitemsRules.indexOf(pr)].isAdded = true;
        })
      });
  }
}
  openAdvRules(){
    this.loadAdvRules();
    (<any>$('#AdvanceRules')).modal('show');
  }

  deletePrincipleAmount(voucher: PrincipleAmount) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this principle amount?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.productService.deletePrinicipleAmount(voucher.prdPpalLmtSeq).subscribe(() => {
          this.allItemsPrincipleAmounts.splice(this.allItemsPrincipleAmounts.indexOf(voucher), 1);
          swal(
            'Deleted!',
            'principle amount values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });

  }

  // loan terms

  onSubmitLoanTerms() {
    const result: LoanTerms = Object.assign({}, this.loanTermForm.value);
    (<any>$('#LoanTermst')).modal('hide');
    result.prdSeq = this.product.productSeq;
    if(result.rulSeq==null){
      result.rulSeq = 30;
    }
  
    if (!this.editloan) {
      this.productService.addLoanTerm(result).subscribe(d => {
        this.getallLoanTerms();
      });
    } else {
      this.productService.updateLoanTerm(result).subscribe(d => {
        this.editloan = false;
        this.getallLoanTerms();
      });
    }
  }
  openLoanTerm() {
    (<any>$('#LoanTermst')).modal('show');
    this.loanTermForm.reset();
  }
  editLoanTerm(voucher: PrincipleAmount) {
    (<any>$('#LoanTermst')).modal('show');
    this.loanTermForm.patchValue(voucher);
    this.editloan = true;
  }

  deleteLoanTerm(voucher: LoanTerms) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Loan term?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.productService.deleteLoanTerm(voucher.prdTrmSeq).subscribe(() => {
          this.allItemsLoanTerms.splice(this.allItemsLoanTerms.indexOf(voucher), 1);
          swal(
            'Deleted!',
            'loan term values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });

  }


  updateRule() {
    (<any>$('#AssignRule')).modal('hide');
    if (this.ruleType === 1) {
      this.productService.updateLoanTerm(this.loanTermCurrent).subscribe(d => {
        // const itemIndex = this.allItemsLoanTerms.indexOf(this.loanTermCurrent);
        // this.allItemsLoanTerms[itemIndex] = this.loanTermCurrent;
        this.editloan = false;
        this.getallLoanTerms();
      });
    } else if (this.ruleType === 2) {
      this.productService.updatePrincipleAmount(this.principleAmountCurrent).subscribe(d => {
        this.getAllPrincipleAmount();
        this.editPrinciple = false;
      });
    }
  }
  openAssignRule(current, number) {
    (<any>$('#AssignRule')).modal('show');
    console.log(current)
    console.log(this.allitemsRules)
    console.log(this.allProductRules)
    this.ruleType = number;
    if (number === 1) {
      this.loanTermCurrent = current;
      this.basicRules.forEach(element => {
        element.ruleSeq = undefined;
        if (current.rulSeq != undefined && current.rulSeq != null) {
          if(element.rulSeq == current.rulSeq){
            element.ruleSeq = current.rulSeq;
          }
        } 
      })
    } else if (number === 2) {

      // this.allProductRules
      this.basicRules.forEach(element => {
        element.ruleSeq = undefined;
        if (current.rulSeq != undefined && current.rulSeq != null) {
          if(element.rulSeq == current.rulSeq){
            element.ruleSeq = current.rulSeq;
          }
        } 
      })
      
      this.principleAmountCurrent = current;
    }
  }
  onRuleChange(value) {
    console.log(value);
    if (this.ruleType === 1) {
      this.loanTermCurrent.rulSeq = value;
    } else if (this.ruleType === 2) {
      this.principleAmountCurrent.rulSeq = value;
    }
  }
  addProductRule(rule: AdvanceRules) {
    rule.isAdded = !rule.isAdded;
    
    const ad = new AdvanceRules();
    ad.rulSeq = rule.rulSeq;
    ad.prdSeq = this.product.productSeq;
    // const seq = this.advRules[this.advRules.findIndex(item => item.rulSeq === ad.rulSeq)].prdAdvRulSeq;
    console.log(rule);
    if (rule.isAdded) {
      this.productService.addProductRule(ad).subscribe(res=>{
        rule.prdAdvRulSeq = res.PrdAdvRul.prdAdvRulSeq;
        this.loadAdvRules();
      });
    } else {
      this.allProductRules.forEach(rul=>{
        if(rul.rulSeq == rule.rulSeq){
          this.productService.deleteProductRule(rul.prdAdvRulSeq).subscribe(res=>{
            this.loadAdvRules();
          });
        }
      })
      
    }
  }
  pr;totalSegs = 0;
  openSegregate(pr: PrincipleAmount) {
    (<any>$('#AssignCheque')).modal('show');
    const segregate = new Segregate();
    this.pr = pr;
    segregate.entyTypStr = 'PRINCIPLE';
    segregate.sgrtEntySeq = pr.prdPpalLmtSeq;
    // update here
    this.segregateArray = [];
    for (let i = 1; i <= this.minTerms; i++) {
      this.segregateArray.push({ instNum: i, ischecked: false, prdPpalLmtSeq: pr.prdPpalLmtSeq, prdSgrtInstSeq: 0, sgrtEntySeq: pr.prdPpalLmtSeq });
    }
    this.totalSegs = 0;
    this.productService.getSegregates(segregate).subscribe(
      d => {
        this.allsegregates = d;
        this.allsegregates.forEach(seg => {
          this.totalSegs++;
          this.segregateArray[seg.instNum - 1].ischecked = true;
          this.segregateArray[seg.instNum - 1].prdSgrtInstSeq = seg.prdSgrtInstSeq;
        });
      }
    );

  }
  segregateAdded() {
    (<any>$('#AssignCheque')).modal('hide');
    this.segregateArray = [];
  }
  addUpdateSegrigate(seg, event) {
    // console.log(this.segregateArray);
    // console.log(this.totalSegs);
    // // if(this.)
    // console.log(event)
    
    // console.log(seg);
    if (seg.ischecked) {
      if(this.totalSegs==this.pr.sgrtInstNum){
        this.toaster.error("Can not exceed max Segregate Number");event.checked=false;event.source.checked=false;seg.ischecked=false;return;
      }
      this.totalSegs++;
      const segrigate = new Segregate();
      segrigate.sgrtEntySeq = seg.prdPpalLmtSeq;
      segrigate.entyTypStr = 'PRINCIPLE';
      segrigate.instNum = seg.instNum;
      this.productService.addSegregate(segrigate).subscribe();
    } else {
      console.log(seg);
      this.productService.deleteSegregate(seg.prdSgrtInstSeq).subscribe();
    }
  }
  getRuleNameBySeq(seq) {
    let status = 'not found';
    if (this.allitemsRules) {
      this.allitemsRules.forEach(s => {
        if (s.rulSeq === seq) {
          status = s.rulNm;
        }
      });
    }
    return status;
  }
  getNameByKey(key, array: CommonCode[]) {
    let status = 'not found';
    if (this.allitemsRules) {
      array.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }
  frequency;basicRules = [];advRules = [];
  private loadBasics() {
    this.commonService.getValuesByGroupName('RULE CATEGORY').subscribe(
      d => this.ruleCategories = d
    );
    this.commonService.getValuesByGroupName('LOAN TERMS').subscribe(
      d => this.loanTerms = d
    );

    this.commonService.getValues(REF_CD_GRP_KEYS.LOAN_FREQUENCY).subscribe(
      d => this.frequency = d
    );

    this.productService.getAllRules().subscribe(d => {
      this.allitemsRules = d;
      this.basicRules = []; this.advRules = [];
      d.forEach(item=>{
        if(item.rulCtgryKey == 1){
          this.basicRules.push(item);
        } else if(item.rulCtgryKey == 2){
          this.advRules.push(item);
        }
      })

    });
    // if (this.isEdit === 'true') {

      console.log('i am editing you');
      this.getAllPrincipleAmount();
      this.getallLoanTerms();
      if (this.product.productSeq != undefined) {
        this.productService.getAllRulesBySeq(this.product.productSeq).subscribe(d => this.allProductRules = d);
        if (this.allProductRules) {
          this.allProductRules.forEach(pr => {
            this.allitemsRules[this.allitemsRules.indexOf(pr)].isAdded = true;
          });
        }
      }
    // }
  }
  getallLoanTerms() {
    if (this.product.productSeq != undefined) {
      this.productService.getAllLoanTerms(this.product.productSeq).subscribe(d => {
      this.allItemsLoanTerms = d;
        this.calculateMin();
      });
    }
  }
  getAllPrincipleAmount() {
    if (this.product.productSeq != undefined) {
      this.productService.getAllPrincipleAmounts(this.product.productSeq).subscribe(d => {
        this.allItemsPrincipleAmounts = d;
        // this.allItemsPrincipleAmounts.forEach((pr, index) => {
        //   pr.sgrtInstNum = index;
        // });
      });
    }
  }


  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
