import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { PaymentType } from '../../../../shared/models/paymentType.model';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/services/data.service';
import { PaymentTypesService } from '../../../../shared/services/paymentTypes.service';
import swal from 'sweetalert2';
import { CommonService } from '../../../../shared/services/common.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-charge-types',
  templateUrl: './charge-types.component.html',
  styleUrls: ['./charge-types.component.css']
})
export class ChargeTypesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      return;
    }
    this.getFilteredData(filterValue.trim().toLowerCase())
  }

  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      this.datalength = 0;
      setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  typeNumber = 1;
  paymentTypesForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  submitted = false;
  showFields = false;
  // array of all items to be paged
  private allItems: PaymentType[] = [];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: PaymentType[] = [];
  isEdit = false;
  allStatuses: any[] = [];
  statusArray: any[];
  GlAccounts: any[] = [];

    
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  constructor(private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private paymentTypesService: PaymentTypesService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.displayedColumns = ['typId', 'typStr', 'desc','brnchSeq', 'typStsKey', 'action'];
    this.paymentTypesForm = this.fb.group({
      typId: ['', Validators.required],
      typStr: ['', Validators.required],
      glAcctNum: ['', Validators.required],
      typStsKey: ['', Validators.required],
      typSeq: [''],
      brnchSeq: ['', Validators.required]
    });
    this.commonService.getValuesByGroupName('\tSTATUS').subscribe((d) => {
      this.statusArray = d;
    });

    this.commonService.getGlAccounts().subscribe((d) => {
      this.GlAccounts = d;
    });
    this.loadStatuses();
    this.loadPayment()

    this.paymentTypesService.getAllBrnches().subscribe(res=>{
      this.allBrnches=res;
    })
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }

  loadPayment(){
    this.isCount =true;
    this.spinner.show();
    this.paymentTypesService.getAllTypesByCategory(this.typeNumber, this.paginator.pageIndex, 10, "", this.isCount, 0).subscribe((data) => {
      this.allItems = data.typs;
      this.spinner.hide();

       this.dataSource = new MatTableDataSource(this.allItems);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
  
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = data.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log(error)
    });
  }
  loadNextPage(){
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.paymentTypesService.getAllTypesByCategory(this.typeNumber, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount, 0).subscribe(data => {
        this.spinner.hide();
        this.allItems = data.typs;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.typs);

        data.count = this.datalength; 
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
          this.spinner.hide();
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue:string){
    this.isCount = true;
      this.paginator.pageIndex = 0;
      this.lastPageIndex = 0;
      this.spinner.show();
      this.paymentTypesService.getAllTypesByCategory(this.typeNumber, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount, 0).subscribe(data => {
        this.allItems = data.typs;
        this.spinner.hide();
        if (this.allItems.length <= 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
  
        this.dataSource = new MatTableDataSource(this.allItems);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
      }, error =>{
        this.spinner.hide();
        console.log('err', error);
        });
  }

  allBrnches = [];
  openTypeModal() {
    (<any>$('#addprduct')).modal('show');
    this.paymentTypesForm.reset();
    this.isEdit = false;
  }
  findValueByKey(key) {
    let status = 'not found';
    this.statusArray.forEach(s => {
      if (s.codeKey === key) {
        status = s.codeValue;
      }
    });
    return status;
  }
  findBranchBySeq(key) {
    if(key == null || key == undefined)
    return "Not Assigned";
    if(key==0)
    return "Global";
    let status = 'not found';
    this.allBrnches.forEach(s => {
      if (s.brnchSeq === key) {
        status = s.brnchNm;
      }
    });
    return status;
  }
  editItem(paymentType: PaymentType) {
    (<any>$('#addprduct')).modal('show');
    this.paymentTypesForm.patchValue(paymentType);
    this.isEdit = true;
  }
  deleteItem(type) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this payment type?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.paymentTypesService.deleteType(type.typSeq).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(type.pdcId), 1);
          swal(
            'Deleted!',
            'Payments types has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });
  }
  onSubmit() {
    const result: PaymentType = Object.assign({}, this.paymentTypesForm.value);
    result.typCtgryKey = this.typeNumber;
    (<any>$('#addprduct')).modal('hide');
    if (this.isEdit) {
      this.paymentTypesService.updateType(result).subscribe();
      const itemIndex = this.allItems.findIndex(item => item.typId === result.typId);
      this.allItems[itemIndex] = result;
      this.setPage(this.pager.currentPage);
    } else {
      this.paymentTypesService.addType(result).subscribe();
      this.allItems.push(result);
      this.setPage(this.pager.currentPage);
    }
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.dataService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  private loadStatuses() {
    this.paymentTypesService.getTypeStatus().subscribe((d) => {
      this.allStatuses = d;
    });
  }
  
  showField() {
    this.showFields = true;
  }

  findDscForAccountNo(acc_num) {
    let str = "GL ACCOUNT NUMBER NOT FOUND!";
    this.GlAccounts.forEach(acc => {
      if (acc.accNum == acc_num) {
        str = acc.desc;
      }
    });
    return str;
  }
}
