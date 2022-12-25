import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../shared/models/Product.model';
import { ProductService } from '../../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { FormAssignment, FormAssignmentBody, ProductDocuments } from '../../../../../shared/models/FormAssignment.model';
import { CommonCode } from '../../../../../shared/models/commonCode.model';
import { CommonService } from '../../../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-documents-assignment',
  templateUrl: './documents-assignment.component.html',
  styleUrls: ['./documents-assignment.component.css']
})
export class DocumentsAssignmentComponent implements OnInit {
  model: ProductDocuments;
  product: Product;
  private isEdit: string;
  allFormsAssignment: ProductDocuments[] = [];
  private allFormsAssignmentSelected: ProductDocuments[] = [];
  private documents: CommonCode[] = [];
  constructor(private productService: ProductService,
    private router: Router,
    private commonService: CommonService,
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

    this.commonService.getValuesByGroupName('DOCUMENTATION CATEGORY').subscribe(
      d => this.documents = d
    );
    this.productService.getAllDocumentsAssignment().subscribe(d => {
      this.allFormsAssignment = d;
      if (this.product.productSeq != undefined) {
        this.productService.getAllDocumentsBySeq(this.product.productSeq).subscribe(s => {
          this.allFormsAssignmentSelected = s;
          this.allFormsAssignmentSelected.forEach(selected => {
            this.allFormsAssignment.forEach(form => {
              if (selected.docSeq === form.docSeq) {
                form.ischecked = true;
                form.mndtryFlg = selected.mndtryFlg;
                form.prdDocRelSeq = selected.prdDocRelSeq;
              }
            });
          });
        });
      }
    });
  }

  updateFromAssignment(form: ProductDocuments) {
    console.log(form);
    if (form.ischecked) {
      const formBody = new ProductDocuments();
      formBody.docSeq = form.docSeq;
      formBody.prdSeq = this.product.productSeq;
      this.productService.addProductDocument(formBody).subscribe(res=>{
        form.prdDocRelSeq = res.PrdDocRel.prdDocRelSeq;
      });
    } else {
      this.productService.deleteProductDocument(form.prdDocRelSeq).subscribe();
    }
  }
  updateDocumentMndatryFlg(form:ProductDocuments){
    console.log(form)
    form.prdSeq = this.product.productSeq;
    // updateProductDocumentRel
    this.productService.updateProductDocumentRel(form).subscribe();
  }
  onSave() {
    if (this.isEdit === 'true') {
      this.toastr.success('updated successfully', 'Success');
    } else {
      this.toastr.success('added successfully', 'Success');
    }
  }
}
