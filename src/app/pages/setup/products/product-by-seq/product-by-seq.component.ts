import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PRODUCTS} from '../../../../shared/mocks/mock_common_codes';
import {Product} from '../../../../shared/models/Product.model';
import {ProductGroup} from '../../../../shared/models/productGroup.model';
import {DataTableDirective} from 'angular-datatables';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import {ProductService} from '../../../../shared/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../../shared/services/common.service';
import {DataService} from '../../../../shared/services/data.service';
import swal from 'sweetalert2';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import {Rule} from '../../../../shared/models/Rule.model';

@Component({
  selector: 'app-product-by-seq',
  templateUrl: './product-by-seq.component.html',
  styleUrls: ['./product-by-seq.component.css']
})
export class ProductBySeqComponent implements OnInit {
  statusArray: any[];
  pager: any = {};
  isEdit = false;
  allItems: Product[] = [];
  pagedItems: Product[] = [];

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  productsForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  private name: string;
  private productTypes: any;
  private productGroup: ProductGroup;


  constructor(private productService: ProductService
    , private router: Router
    , private commonService: CommonService
    , private fb: FormBuilder
    , private dataService: DataService
    , private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.productsForm = this.fb.group({
      prdGrpId: [ ''],
      prdGrpSeq: [ ''],
      prdGrpNm: ['', Validators.required],
      prdGrpSts: ['', Validators.required],
    });
    this.loadBasics();
    this.productGroup = new ProductGroup(JSON.parse(sessionStorage.getItem('productGroup')));

  }

  findValueByKey(key, lov) {
    let status = 'not found';
    if (lov) {
      lov.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }
  findValueByKeyPT(key) {
    let status = 'not found';
    if (this.productTypes) {
      this.productTypes.forEach(s => {
        if (s.codeKey === key) {
          status =  s.codeValue;
        }
      });
    }
    return status;
  }

  onEdit(product) {
    product.prdGrpSeq = this.productGroup.prdGrpSeq;
    sessionStorage.setItem('isProductEdit' , 'true');
    product.productSeq = product.prdSeq;
    product.productName = product.prdNm;
    sessionStorage.setItem('product', JSON.stringify(product));
    console.log(JSON.stringify(product));
    this.router.navigate(['setup/addProduct/product-info']);
  }
  onAdd() {
    sessionStorage.setItem('product', JSON.stringify(new Product()));
    sessionStorage.setItem('isProductEdit' , 'false');
    this.router.navigate(['setup/addProduct']);
  }
  deleteItem(pG: Product) {
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
        this.productService.deleteProductByPrdSeq(pG.prdSeq).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(pG), 1);
          this.setPage(1);
          swal(
            'Deleted!',
            'Product has been deleted.',
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
  activities;status;
  onSubmit() {}
  private loadBasics() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('prdGrpNm');
    this.productService.getAllProductByGrpSeq(id).subscribe((data) => {
      this.allItems  = data;
      this.setPage(1);
    });
    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );
    this.commonService.getValuesByGroupName('ACTIVITY').subscribe(
      d => this.productTypes = d
    );
    this.commonService.getValues(REF_CD_GRP_KEYS.PRODUCT_TYPE).subscribe(
      d => this.activities = d
    );
    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe(
      d => this.status = d
    );
  }
}
