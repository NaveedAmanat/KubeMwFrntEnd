import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { PRODUCTS } from '../../../shared/mocks/mock_common_codes';
import {Router} from '@angular/router';
import {Product} from '../../../shared/models/Product.model';
import {ProductService} from '../../../shared/services/product.service';
import {Observable} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CommonService} from '../../../shared/services/common.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../shared/helpers/MyErrorStateMatcher.helper';
import {PaymentType} from '../../../shared/models/paymentType.model';
import swal from 'sweetalert2';
import {DataService} from '../../../shared/services/data.service';
import {ProductGroup} from '../../../shared/models/productGroup.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  model = new Product();
  statusArray: any[];
  pager: any = {};
  isEdit = false;

  allItems: ProductGroup[] = [];
  pagedItems: ProductGroup[] = [];

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  productsForm: FormGroup;
  matcher = new MyErrorStateMatcher();


  constructor(private productService: ProductService
              , private router: Router
              , private commonService: CommonService
              , private fb: FormBuilder
              , private dataService: DataService) {
  }
  ngOnInit() {
    this.productsForm = this.fb.group({
      prdGrpId: [ ''],
      prdGrpSeq: [ ''],
      prdGrpNm: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      prdGrpSts: ['', Validators.required],
    });
    this.loadBasics();
  }

  openModal() {
    (<any>$('#addprduct')).modal('show');
    this.productsForm.reset();
    this.isEdit = false;
  }
  findValueByKey(key) {
    let status = 'not found';
    if (this.statusArray) {
      this.statusArray.forEach(s => {
        if (s.codeKey === key) {
          status =  s.codeValue;
        }
      });
    }
    return status;
  }
  editItem(productGroup: ProductGroup) {
    (<any>$('#addprduct')).modal('show');
    this.productsForm.patchValue(productGroup);
    this.isEdit = true;
  }

  onSubmit() {
    // this.productService.updateCurrentProduct(this.model);
    // this.router.navigate(['setup/products/add']);
    const result: ProductGroup = Object.assign({}, this.productsForm.value);
    (<any>$('#addprduct')).modal('hide');
    if (this.isEdit) {
      this.productService.updateProductGroup(result).subscribe(res=>{
        this.loadAll();
      });
      // const itemIndex = this.allItems.findIndex(item => item.prdGrpSeq === result.prdGrpSeq);
      // this.allItems[itemIndex] = result;
      // this.setPage(this.pager.currentPage);
      
    } else {
      this.productService.addProductGroup(result).subscribe(res=>{
        this.loadAll();
      } );
      // this.allItems.push(result);
      // this.setPage(this.pager.currentPage);
      
    }
  }
  deleteItem(pG: ProductGroup) {
    swal({
      title: 'Are you sure?',
      text: 'Are you Sure, Want to Delete This ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.productService.deleteProductGroup(pG.prdGrpSeq).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(pG), 1);
          this.setPage(1);
          swal(
            'Deleted!',
            'Product group has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.dataService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  private loadBasics() {
    this.loadAll();
    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );
  }

  navigateToProduct(product) {
    sessionStorage.setItem('productGrpSeq', product.prdGrpSeq);
    sessionStorage.setItem('productGroup', JSON.stringify(product));
    this.router.navigate(['/setup/products', product.prdGrpNm , product.prdGrpSeq ]);
  }

  // ngAfterViewInit(): void {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.columns().every(function () {
  //       const that = this;
  //       $('input', this.footer()).on('keyup change', function () {
  //         if (that.search() !== this['value']) {
  //           that
  //             .search(this['value'])
  //             .draw();
  //         }
  //       });
  //     });
  //   });
  // }
  private loadAll() {
    this.productService.getAllProductGroups().subscribe((data) => {
      this.allItems  = data;
      this.setPage(this.pager.currentPage);
    });
  }
}
