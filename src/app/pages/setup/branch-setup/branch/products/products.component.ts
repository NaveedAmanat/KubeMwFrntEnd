import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/shared/models/Product.model';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { DataService } from 'src/app/shared/services/data.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private transferService: TransfersService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private dataService: DataService) { }

  basicCrumbs: any[] = [];
  formSaved = false;
  brmodel: any;
  product: Product;
  products: any;
  invalid: boolean = false;
  productsForm: FormGroup;
  editBranch: boolean = false;

  ngOnInit() {

    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'products' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));
    this.editBranch = JSON.parse(sessionStorage.getItem('editBranch'));

    this.transferService.getAllProducts().subscribe(data => {
      this.products = data;
    });

    this.productsForm = this.formBuilder.group({
      branchSeq: [''],
      prdSeq: ['']
    });
  }

  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'products' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
  }

  findProduct(prdSeq) {
    if (this.products) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].prdSeq == prdSeq) {
          return this.products[i];
        }
      }
    }
  }
  findProductAlreadyAdded(prdSeq, prds) {
    if (prds) {
      for (let i = 0; i < prds.length; i++) {
        if (prds[i].prdSeq == prdSeq) {
          return true;
        }
      }
      return false;
    }
  }

  continueClicked() {
    this.formSaved = true;
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'products' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));

    this.router.navigate(['setup/branch/bank-info']);
  }

  addProducts() {
    (<any>$('#addProducts')).modal('show');
  }

  onProductsFormSubmit(productsForm) {
    // stop here if form is invalid
    if (productsForm.prdSeq == null) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }


    this.productsForm.reset();
    this.productsForm = this.formBuilder.group({
      branchSeq: [this.brmodel.brnchSeq],
      prdSeq: [productsForm.prdSeq]
    });


    if (!this.findProductAlreadyAdded(productsForm.prdSeq, this.brmodel.products)) {
      //this.brmodel.products.push(this.findProduct(productsForm.prdSeq));
      this.brmodel.products.unshift(this.findProduct(productsForm.prdSeq));
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));

      this.spinner.show();
      this.dataService.addProduct(this.productsForm.value).subscribe((data) => {
        this.toaster.success('Product mapped with this branch successfully');
        this.formSaved = true;
        this.spinner.hide();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
        this.spinner.hide();
      });
    }
    else {
      this.toaster.info('Product already mapped with this branch');
    }
    (<any>$('#addProducts')).modal('hide');
    productsForm = null;
  }

  deleteProduct(prd) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to remove this Product from this Branch?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!'
    }).then((result) => {
    this.spinner.show();
    this.productsForm.reset();
    this.productsForm = this.formBuilder.group({
      branchSeq: [this.brmodel.brnchSeq],
      prdSeq: [prd.prdSeq]
    });
    this.dataService.removeProduct(this.productsForm.value).subscribe((data) => {
      this.toaster.success('Product deleted');
      for (let i = 0; i < this.brmodel.products.length; i++) {
        if (this.brmodel.products[i].prdSeq == prd.prdSeq) {
          this.brmodel.products.splice(i, 1);
          break;
        }
      }
      this.spinner.hide();
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
  });
  }

  prevScreen(){
    this.router.navigate(['setup/branch/port-loc-info']);
  }

}
