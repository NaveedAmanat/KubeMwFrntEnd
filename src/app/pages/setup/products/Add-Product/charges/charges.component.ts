import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../shared/services/common.service';
import { ProductCharges } from '../../../../../shared/models/productCharges.model';
import { Product } from '../../../../../shared/models/Product.model';
import { CommonCode } from '../../../../../shared/models/commonCode.model';
import { PrincipleAmount, Segregate, SegregateBody } from '../../../../../shared/models/principleAmount.model';
import swal from 'sweetalert2';
import { MyErrorStateMatcher } from '../../../../../shared/helpers/MyErrorStateMatcher.helper';
import * as REF_CD_GRP_KEYS from '../../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.css']
})
export class ChargesComponent implements OnInit {
  chargesForm: FormGroup;
  allitemsCharges: ProductCharges[] = [];
  product: Product;
  chargeTypes = [];
  edit = false;
  matcher = new MyErrorStateMatcher();
  segregateArray: SegregateBody[] = [];
  allsegregates: Segregate[];
  isEdit: string;


  constructor(private productService: ProductService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.product = JSON.parse(sessionStorage.getItem('product'));
    this.isEdit = sessionStorage.getItem('isProductEdit');
    if (this.product.prdTypKey != 1165) {
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }
    this.chargesForm = this.fb.group({
      chrgTypSeq: ['', Validators.required],
      chrgVal: ['', Validators.required],
      upfrontFlg: [''],
      sgrtInstNum: ['', Validators.required],
      adjustRoundingFlg: [''],
      chargeName: [''],
      prdChrgSeq: [''],
      chrgCalcTypKey: ['', Validators.required]
    });
    this.loadBasics();
    this.getallLoanTerms();
  }
  onSubmitChares() {
    const result: ProductCharges = Object.assign({}, this.chargesForm.value);
    (<any>$('#Charges')).modal('hide');
    result.prdSeq = this.product.prdSeq;
    if(result.adjustRoundingFlg==null){
      result.adjustRoundingFlg = false;
    }
    if(result.upfrontFlg==null){
      result.upfrontFlg = false;
    }
    if (!this.edit) {
      result.prdSeq = this.product.productSeq;
      this.productService.addCharges(result).subscribe(d => {
        result.prdChrgSeq = d.PrdChrg.prdChrgSeq;
        this.allitemsCharges.push(result);
      });
    } else {
      this.productService.updateCharges(result).subscribe(d => {
        const itemIndex = this.allitemsCharges.findIndex(item => item.prdChrgSeq === result.prdChrgSeq);
        this.allitemsCharges[itemIndex] = result;
        this.edit = false;
      });
    }
  }
  openCharges() {
    this.reEvaluateLov();
    (<any>$('#Charges')).modal('show');
    this.chargesForm.reset();
  }
  editCharges(voucher: ProductCharges) {
    console.log(voucher);
    (<any>$('#Charges')).modal('show');
    this.chargesForm.patchValue(voucher);
    this.chargeTypes.push({ typSeq: voucher.chrgTypSeq, typStr: this.getNameByKeyTypes(voucher.chrgTypSeq, this.chargeTypesOrig) })
    this.edit = true;
  }

  deleteCharges(voucher: ProductCharges) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Charges amount?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.productService.deleteCharges(voucher.prdChrgSeq).subscribe(() => {
          this.allitemsCharges.splice(this.allitemsCharges.indexOf(voucher), 1);
          swal(
            'Deleted!',
            'Charges amount values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });

  }
  pr; totalSegs = 0;
  openSegregate(pr: ProductCharges) {
    (<any>$('#AssignCheque')).modal('show');
    const segregate = new Segregate();
    this.pr = pr;
    segregate.entyTypStr = 'SERVICE CHARGE';
    segregate.sgrtEntySeq = pr.prdChrgSeq;
    // update here
    this.segregateArray = [];
    for (let i = 1; i <= this.minTerms; i++) {
      this.segregateArray.push({ instNum: i, ischecked: false, prdPpalLmtSeq: pr.prdChrgSeq, prdSgrtInstSeq: 0, sgrtEntySeq: pr.prdChrgSeq });
    }
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
  addUpdateSegrigate(seg, event) {
    console.log(seg);
    if (seg.ischecked) {
      if (this.totalSegs == this.pr.sgrtInstNum) {
        this.toaster.error("Can not exceed max Segregate Number"); event.checked = false; event.source.checked = false; seg.ischecked = false; return;
      }

      this.totalSegs++;
      const segrigate = new Segregate();
      segrigate.sgrtEntySeq = seg.prdChrgSeq;
      seg.entyTypStr = 'SERVICE CHARGE';
      segrigate.instNum = seg.instNum;
      seg.prdSeq = this.product.productSeq;

      this.productService.addSegregate(seg).subscribe(res => {
        console.log(res)
        seg.prdSgrtInstSeq = res.PrdSgrtInst.prdSgrtInstSeq;
      });
    } else {
      console.log(seg);
      this.productService.deleteSegregate(seg.prdSgrtInstSeq).subscribe();
    }
  }
  segregateAdded() {
    (<any>$('#AssignCheque')).modal('hide');
    this.segregateArray = [];
  }
  chargeTypesOrig;
  loadBasics() {
    console.log(this.product.productSeq + "===" + this.product.prdSeq)
    if (this.product.productSeq != undefined) {
      this.productService.getAllCharges(this.product.productSeq).subscribe(d => { this.allitemsCharges = d; this.reEvaluateLov(); });
    }
    this.productService.getChargesTypes().subscribe(d => { this.chargeTypesOrig = d; this.chargeTypes = JSON.parse(JSON.stringify(d)); });
  }

  isSag: boolean = true;
  upFrontChangeListener(event: any) {
    if (event.checked) {
      this.isSag = true;
    } else {
      this.isSag = false;
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getNameByKeyTypes(key, array: any[]) {
    let status = 'not found';
    array.forEach(s => {
      if (s.typSeq === key) {
        status = s.typStr;
      }
    });
    return status;
  }
  allItemsLoanTerms;
  getallLoanTerms() {
    if (this.product.productSeq != undefined) {
      this.productService.getAllLoanTerms(this.product.productSeq).subscribe(d => {
        this.allItemsLoanTerms = d;

        this.commonService.getValuesByGroupName('LOAN TERMS').subscribe(
          d => {
            this.loanTerms = d;
            this.calculateMin();
          }
        );
      });
    }
  }
  loanTerms: CommonCode[] = [];
  minTerms = 0;
  calculateMin() {
    if (this.allItemsLoanTerms.length)
      this.minTerms = +this.getNameByKey(this.allItemsLoanTerms[0].trmKey, this.loanTerms);
    this.allItemsLoanTerms.forEach(obj => {
      if (+this.minTerms > +this.getNameByKey(obj.trmKey, this.loanTerms)) {
        this.minTerms = +this.getNameByKey(obj.trmKey, this.loanTerms)
      }
    });
  }
  getNameByKey(key, array: CommonCode[]) {
    let status = 'not found';
    if (array) {
      array.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  reEvaluateLov() {
    this.chargeTypes = JSON.parse(JSON.stringify(this.chargeTypesOrig));
    this.allitemsCharges.forEach(item => {
      this.removeItemFromLOV(item.chrgTypSeq, this.chargeTypes);
    });
  }
  removeItemFromLOV(key, lov) {
    let index = -1;
    for (let i = 0; i < lov.length; i++) {
      if (key == lov[i].typSeq) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      lov.splice(index, 1);
    }
  }


  chrgForSlb = { slbs: [{ prdChrgSlbSeq: null, prdChrgSeq: null, endLmt: null, startLmt: null, val: null }] };
  openProductChargeSlbModal(chrg) {
    this.chrgForSlb = chrg;
    if (this.chrgForSlb.slbs.length <= 0) {
      this.chrgForSlb.slbs.push({ prdChrgSlbSeq: null, prdChrgSeq: this.chrgForSlb['prdChrgSeq'], endLmt: null, startLmt: 0, val: null })
    }
    (<any>$('#value')).modal('show');
  }

  repeatArray = [];
  addLine() {
    this.chrgForSlb.slbs.push({ prdChrgSlbSeq: null, prdChrgSeq: this.chrgForSlb['prdChrgSeq'], startLmt: (this.chrgForSlb.slbs.length <= 0) ? null : this.chrgForSlb.slbs[this.chrgForSlb.slbs.length - 1].endLmt + 1, endLmt: null, val: null })
  }
  deleteLine(a) {
    this.chrgForSlb.slbs.splice(this.chrgForSlb.slbs.indexOf(a), 1);
    this.chrgForSlb.slbs[this.chrgForSlb.slbs.length - 1].endLmt = null;
  }

  SlbSubmit() {
    console.log(this.chrgForSlb)
  }
}
