import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../shared/models/Product.model';
import { ProductService } from '../../../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCTS } from '../../../../../shared/mocks/mock_common_codes';
import { CommonService } from '../../../../../shared/services/common.service';
import { MyErrorStateMatcher } from '../../../../../shared/helpers/MyErrorStateMatcher.helper';
import { stringify } from 'querystring';
import { ProductGroup } from '../../../../../shared/models/productGroup.model';
import * as REF_CD_GRP_KEYS from '../../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  disFlags: any[] = [{ name: 'IRR', value: true }, { name: 'Flat', value: false }];
  matcher = new MyErrorStateMatcher();
  product: Product;
  productsList = PRODUCTS;
  pr: Product = new Product();
  isEdit: any;
  activities: any;
  productGroup: ProductGroup;
  constructor(private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService
  ) { }
  formSaved;
  ngOnInit() {
    this.loadBasics();
    this.isEdit = sessionStorage.getItem('isProductEdit'); // productGroup
    this.formSaved = this.isEdit;
    console.log(this.formSaved)
    this.productGroup = new ProductGroup(JSON.parse(sessionStorage.getItem('productGroup')));
    this.product = JSON.parse(sessionStorage.getItem('product'));

    // this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');

    if (this.product.prdTypKey != 1165) {
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }

    // if (this.isEdit === 'true') {
    //   console.log('editing');
    //   this.product = new Product(JSON.parse(sessionStorage.getItem('product')));
    //   console.log(this.product);
    // } else {
    //   this.product = JSON.parse(sessionStorage.getItem('product'));
    // }
    this.product.prdGrpSeq = this.productGroup.prdGrpSeq;
    // this.product = this.productService.product;
  }
  onSubmit() {
    if (this.product.prdSeq == undefined || this.product.prdSeq == null || this.product.prdSeq == 0) {
      this.product.productSeq = this.product.prdSeq;
      this.product.productName = this.product.prdNm;
      console.log(this.product)
      this.productService.addProduct(this.product).subscribe(res => {
        this.product.productSeq = res.Product.prdSeq;
        sessionStorage.setItem('product', JSON.stringify(this.product));
        this.formSaved = true;
      }, error => {
        this.toaster.error(error.error.error)
        console.log(error);
      });
    } else {
      this.productService.updateProduct(this.product).subscribe(res => {
        sessionStorage.setItem('product', JSON.stringify(this.product));
      }, error => {
        this.toaster.error(error.error.error)
        console.log(error)
      });
    }
  }


  add() {
    // this.product.name.trim();
    // this.product.fundedBy.trim();
    // this.product.currency.trim();
    // if (!this.product.name) { return; }
    // if (!this.product.fundedBy) { return; }
    // if (!this.product.id) { return; }
    // if (!this.product.currency) { return; }
    // this.productService.getProduct(this.product)
    //   .subscribe(p => console.log(p));
  }
  status;
  loadBasics() {
    this.commonService.getValues(REF_CD_GRP_KEYS.PRODUCT_TYPE).subscribe(
      d => this.activities = d
    );
    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe(
      d => this.status = d
    );
  }

  onContinue() {
    this.router.navigate(['setup/addProduct/rules']);
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

  onlyNumberWithPoint(event: any) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  irrChange() {
    if (this.product.irrFlg)
      this.product.irrVal = null;
  }
}
