import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../../../../shared/services/product.service';
import {Product} from '../../../../../shared/models/Product.model';
import {Router} from '@angular/router';
import {AccountingSetup} from '../../../../../shared/models/FormAssignment.model';
import {MyErrorStateMatcher} from '../../../../../shared/helpers/MyErrorStateMatcher.helper';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-accounting-setup',
  templateUrl: './accounting-setup.component.html',
  styleUrls: ['./accounting-setup.component.css']
})
export class AccountingSetupComponent implements OnInit {
  product: Product = new Product();
  private isEdit: string;
  model1: AccountingSetup = new AccountingSetup();
  model2: AccountingSetup = new AccountingSetup();
  matcher = new MyErrorStateMatcher();
  constructor(private productService: ProductService,
    private breadcrumbProvider: BreadcrumbProvider,
              private router: Router) { }

  ngOnInit() {

    this.loadBasics();
  }

  onSubmit() {

    if (this.model1.prdAcctSetSeq != null && this.model1.prdAcctSetSeq != undefined && this.model1.prdAcctSetSeq != 0) {
      this.model1.prdSeq = this.product.productSeq;
      this.model2.prdSeq = this.product.productSeq;
      this.productService.updateAccountingSetup(this.model1).subscribe();
      this.productService.updateAccountingSetup(this.model2).subscribe();
    } else {
      this.model1.prdSeq = this.product.productSeq;
      this.model2.prdSeq = this.product.productSeq;
      this.model1.acctCtgryKey = 255;
      this.model2.acctCtgryKey = 256;
      this.productService.addAccountingSetup(this.model1).subscribe(res => {
        this.model1.prdAcctSetSeq = res.PrdAcctSet.prdAcctSetSeq;
        this.product.modal1 = this.model1;
        sessionStorage.setItem("product", JSON.stringify(this.product))
      });
      this.productService.addAccountingSetup(this.model2).subscribe(res => {
        this.model2.prdAcctSetSeq = res.PrdAcctSet.prdAcctSetSeq;
        this.product.modal2 = this.model2;
        sessionStorage.setItem("product", JSON.stringify(this.product))
      });
    }
  }
GlAccounts : any[] = [];
  private loadBasics() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.product = JSON.parse(sessionStorage.getItem('product'));

    this.productService.getGlAccounts().subscribe(res => {
      console.log(res);
      this.GlAccounts = res;
    }, error =>{
      console.log(error);
    })
    if(this.product.prdTypKey != 1165){
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }
    this.model1 = this.product.modal1 != null || this.product.modal1 != undefined ? this.product.modal1:new AccountingSetup();
    this.model2 = this.product.modal2 != null || this.product.modal2 != undefined ? this.product.modal2:new AccountingSetup();
    console.log(this.product)
    // alert(this.product.prdSeq)
    if (this.product.productSeq != undefined) {
      console.log(this.product);
      this.productService.getAccountingSetup(this.product.productSeq).subscribe((d: AccountingSetup[]) => {
        d.forEach(a => {
          if (a.acctCtgryKey === 255) {
            this.model1 = a;
          }
          if (a.acctCtgryKey === 256) {
            this.model2 = a;
          }
        });
      });
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9-]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
