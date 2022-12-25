import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { FormAssignment, FormAssignmentBody } from '../../../../../shared/models/FormAssignment.model';
import { Product } from '../../../../../shared/models/Product.model';

import { optimizeGroupPlayer } from '../../../../../../../node_modules/@angular/animations/browser/src/render/shared';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-forms-assignment',
  templateUrl: './forms-assignment.component.html',
  styleUrls: ['./forms-assignment.component.css']
})
export class FormsAssignmentComponent implements OnInit {
  model: FormAssignment;
  product: Product;
  private isEdit: string;
  allFormsAssignment: FormAssignment[] = [];
  private allFormsAssignmentSelected: FormAssignment[] = [];
  constructor(private productService: ProductService,
    private router: Router,
    private breadcrumbProvider: BreadcrumbProvider,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.product = JSON.parse(sessionStorage.getItem('product'));
    if(this.product.prdTypKey != 1165){
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }
    this.loadBasics();
  }

  onSubmit() {
    this.router.navigate(['setup/products/add/documents-assignment']);
  }

  loadBasics() {
    // this.allFormsAssignment = FORMSASSIGNMENT;
    if (this.product.productSeq != undefined) {
      this.productService.getAllFormsAssignments().subscribe(d => {
        this.allFormsAssignment = d;
        this.productService.getAllFormsAssignmentsBySeq(this.product.productSeq).subscribe(s => {
          this.allFormsAssignmentSelected = s;
          this.allFormsAssignmentSelected.forEach(selected => {
            this.allFormsAssignment.forEach(form => {
              if (selected.formSeq === form.formSeq) {
                form.ischecked = true;
                form.prdFormRelSeq = selected.prdFormRelSeq;
                form.formSortOrdr = selected.formSortOrdr;
                form.isSaved = true;
              }
            });
          });
        });
      });
    }
  }

  updateFromAssignment(form: FormAssignment) {
    console.log(form);
    if(form.formSortOrdr == 0 || form.formSortOrdr == undefined || form.formSortOrdr == null){
      this.toastr.error('Please provide sort Order', 'Error');
      return;
    }
    if (form.ischecked) {
      const formBody = new FormAssignmentBody();
      formBody.formSeq = form.formSeq;
      formBody.prdSeq = this.product.productSeq;
      formBody.formSortOrdr = form.formSortOrdr;
      this.productService.addFormAssignment(formBody).subscribe(res=>{
        form.prdFormRelSeq = res.PrdFormRel.prdFormRelSeq;
        form.isSaved = true;
      });
    } else {
      this.productService.deleteFormAssignment(form.prdFormRelSeq).subscribe();
    }
  }

  onSave() {
    if (this.isEdit === 'true') {
      this.toastr.success('updated successfully', 'Success');
    } else {
      this.toastr.success('added successfully', 'Success');
    }
  }
form;
openOrderModal(form) {
  if (!form.ischecked) {
    this.productService.deleteFormAssignment(form.prdFormRelSeq).subscribe(res=>{
      form.isSaved = false;
      form.formSortOrdr = null;
    });
  }
}
  onlyNumbers(event: any, form) {
    form.isSaved = false;
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  cancelClicked(){
    this.form.ischecked = false;
    (<any>$('#setorder')).modal('hide');
  }
}
