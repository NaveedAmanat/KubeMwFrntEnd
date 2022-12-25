import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { FormAssignment, FormAssignmentBody, AsocProduct } from '../../../../../shared/models/FormAssignment.model';
import { Product } from '../../../../../shared/models/Product.model';

import { optimizeGroupPlayer } from '@angular/animations/browser/src/render/shared';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-associate-product-assignment',
  templateUrl: './associate-product-assignment.component.html',
  styleUrls: ['./associate-product-assignment.component.css']
})
export class AssociateProductAssignment implements OnInit {
  model: FormAssignment;
  product: Product;
  private isEdit: string;
  allAssocProducts: Product[] = [];
  private assocProducts: AsocProduct[] = [];
  constructor(private productService: ProductService,
    private router: Router,
    private spinner:NgxSpinnerService,
    private toastr: ToastrService) {
    }

  ngOnInit() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.product = JSON.parse(sessionStorage.getItem('product'));
    this.loadBasics();
  }

  onSubmit() {
    this.router.navigate(['setup/products/add/documents-assignment']);
  }

  loadBasics() {
    this.spinner.show();
    // this.allFormsAssignment = FORMSASSIGNMENT;
    if (this.product.prdTypKey != undefined) {
      this.productService.getProductsByTypSeq(1165).subscribe(d => {
        this.allAssocProducts = d;
        this.productService.getAllAsocProductRel(this.product.productSeq).subscribe(s => {
          this.spinner.hide();
          this.assocProducts = s;
          this.assocProducts.forEach(asoc=>{
            this.allAssocProducts.forEach(product=>{
              if(product.productSeq == asoc.asocPrdSeq){
                product.isChecked = true;
                product.asocPrdRelSeq = asoc.asocPrdRelSeq;
              }
            })
          })
          // this.allFormsAssignmentSelected.forEach(selected => {
          //   this.allFormsAssignment.forEach(form => {
          //     if (selected.prdSeq === form.prdSeq) {
          //       form.isChecked = true;
          //       form.prdFormRelSeq = selected.prdFormRelSeq;
          //     }
          //   });
          // });
        });
      });
    }
  }

  updateFromAssignment(form) {
    console.log(form);
    if (form.isChecked) {
      const formBody = new AsocProduct();
      formBody.prdSeq = this.product.productSeq;
      formBody.asocPrdSeq = form.productSeq;
      this.productService.addAssocProductAssignment(formBody).subscribe(res=>{
        form.asocPrdRelSeq = res.rel.asocPrdRelSeq;
      });
    } else {
      this.productService.deleteAssocProductAssignment(form.asocPrdRelSeq).subscribe();
    }
  }

  onSave() {
    if (this.isEdit === 'true') {
      this.toastr.success('updated successfully', 'Success');
    } else {
      this.toastr.success('added successfully', 'Success');
    }
  }
}
