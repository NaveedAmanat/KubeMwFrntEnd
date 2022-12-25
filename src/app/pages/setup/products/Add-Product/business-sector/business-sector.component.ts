import { Component, OnInit } from '@angular/core';
import { BusinessSector, FormAssignment, FormAssignmentBody } from '../../../../../shared/models/FormAssignment.model';
import { Product } from '../../../../../shared/models/Product.model';
import { ProductService } from '../../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';

@Component({
  selector: 'app-business-sector',
  templateUrl: './business-sector.component.html',
  styleUrls: ['./business-sector.component.css']
})
export class BusinessSectorComponent implements OnInit {
  model: BusinessSector;
  product: Product;
  private isEdit: string;
  allFormsAssignment: BusinessSector[] = [];
  private allFormsAssignmentSelected: BusinessSector[] = [];
  constructor(private productService: ProductService,
    private breadcrumbProvider: BreadcrumbProvider,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.product = JSON.parse(sessionStorage.getItem('product'));
    if (this.product.prdTypKey != 1165) {
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }
    this.loadBasics();
  }

  onSubmit() {
    this.router.navigate(['setup/products/add/documents-assignment']);
  }

  loadBasics() {
    // this.allFormsAssignment = FORMSASSIGNMENT;
    this.productService.getAllBusinessSectors().subscribe(d => {
      this.allFormsAssignment = d;
      if (this.product.productSeq != undefined) {
        this.productService.getAllBusinessSectorBySeq(this.product.productSeq).subscribe(s => {
          this.allFormsAssignmentSelected = s;
          this.allFormsAssignmentSelected.forEach(selected => {
            this.allFormsAssignment.forEach(form => {
              if (selected.bizSectSeq === form.bizSectSeq) {
                form.ischecked = true;
                form.prdBizSectRelSeq = selected.prdBizSectRelSeq;
              }
            });
          });
        });
      }
    });
  }

  updateFromAssignment(form: BusinessSector) {
    console.log(form);
    if (form.ischecked) {
      const formBody = new BusinessSector();
      formBody.bizSectSeq = form.bizSectSeq;
      formBody.prdSeq = this.product.productSeq;
      this.productService.addBusinessSector(formBody).subscribe(res => {
        form.prdBizSectRelSeq = res.PrdBizSectRel.prdBizSectRelSeq;
      });
    } else {
      this.productService.deleteBusinessSector(form.prdBizSectRelSeq).subscribe();
    }
  }
  onSave() {
    if (this.isEdit === 'true') {
      this.toastr.success('updated successfully', 'Success');
    } else {
      this.toastr.success('added successfully', 'Success');
    }
  }
  onContinue() {
    if (this.product.prdTypKey == 1165) {
      this.router.navigate(['/setup/products']);
    } else {
      this.router.navigate(['/setup/addProduct/associate-product-assignment']);
    }
  }
}
