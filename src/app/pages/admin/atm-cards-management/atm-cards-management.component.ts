import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort, MatPaginator, PageEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { RecoveryService } from '../../../shared/services/recovery.service';
import { JVoucher } from 'src/app/shared/models/recovery.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ToastrService } from 'ngx-toastr';
import { AtmCardsManagementService } from 'src/app/shared/services/atm-cards-management.service';
import { AtmCards } from 'src/app/shared/models/atmCards.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-atm-cards-management',
  templateUrl: './atm-cards-management.component.html',
  styleUrls: ['./atm-cards-management.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AtmCardsManagementComponent implements OnInit {
  pageEvent: PageEvent;
  dataSource: any;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  role: any = this.auth.role;
  filters: any[] = [];
  columnsToDisplay: string[] = ['bdoName', 'clientId', 'clientName', 'clientCnic', 'walletNum', 'atmCardNum','atmCardReceivingDate', 'atmCardDeliveredDate', 'action'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchVal = "";
  journelVouchersArray: any;
  journelVoucherDetailsArray: any;
  limit: number = 10;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [];
  filterValue: any = "";
  datalength: Number = 0;

  branchs: Branch[];

  
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  isCount: boolean = true;

  public isEdit: Boolean = false;
  public atmCardsManagementForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  isReadOnlyAtmCardNum: boolean =  false;
  isReadOnlyRcvDt: boolean =  false;
  isReadOnlyDelvDt: boolean =  false;

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

  constructor(
    private toaster: ToastrService,
    private recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private transfersService: TransfersService,
    private commonService: CommonService,
    private atmCardsService: AtmCardsManagementService,
    private formBuilder: FormBuilder
  ) { 
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth()-1);
    this.atmCardsManagementForm = this.formBuilder.group({
      walletSeq: [''],
      bdoName: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      clientCnic: ['', Validators.required],
      walletNum: ['', Validators.required],
      atmCardNum: [''],
      atmCardReceivingDate: [''],
      atmCardDeliveredDate: [''],
  });
  }

  ngOnInit() {
    this.branchForm = this.fb.group({
      branch: [this.auth.emp_branch],
    });
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')
      
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        console.log(res)
      })
    } else {
      this.onSelectBranch();
    }
    
  }

  onSelectBranch(){
    this.isCount = true;

    this.journelVouchersArray = [];
    this.dataSource = new MatTableDataSource(this.journelVouchersArray);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;
    this.searchVal = '';
    this.filterValue = '';

    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.journelVouchersArray = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      return;
    }
    setTimeout( () => {  this.spinner.show()}, 10)
    this.atmCardsService.getAtmCardsListing(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "",this.isCount).subscribe((data => {
      this.journelVouchersArray = data.atmCards;
     
      this.spinner.hide();

      if (this.journelVouchersArray.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.journelVouchersArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }), error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }

  ngAfterViewInIt() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.changePage())
      )
      .subscribe();
  }
  
  showFields = false;
  showField() {
    this.showFields = true;
  }

  changePage(){
    this.isCount = false;
    setTimeout( () => {  this.spinner.show()}, 10)
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.atmCardsService.getAtmCardsListing(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue,this.isCount).subscribe(data => {
        this.journelVouchersArray = data.atmCards
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.atmCards);
       
        this.spinner.hide();

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

  getFilteredData(filterValue) {
    this.isCount = true;
    setTimeout( () => {  this.spinner.show()}, 10)
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.atmCardsService.getAtmCardsListing(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe((data) => {

      this.journelVouchersArray = data.atmCards;

      this.dataSource = new MatTableDataSource(this.journelVouchersArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalLength = 0;
      this.datalength = data.count;

      if (this.journelVouchersArray.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.spinner.hide();

    }, (error) => {
       this.spinner.hide();
      console.log('err', error);
    });
  }

  onEdit(clnt){
    this.isEdit = true;
    console.log(clnt)
    let atmCardNum = clnt['atmCardNum'];
    let atmCardReceivingDate = clnt['atmCardReceivingDate']; 
    let atmCardDeliveredDate = clnt['atmCardDeliveredDate'];

    this.isReadOnlyAtmCardNum = this.isReadOnly(atmCardNum);
    this.isReadOnlyRcvDt = this.isReadOnly(atmCardReceivingDate);
    this.isReadOnlyDelvDt = this.isReadOnly(atmCardDeliveredDate);

    console.log('isReadOnlyAtmCardNum', this.isReadOnlyAtmCardNum)
    console.log('isReadOnlyRcvDt', this.isReadOnlyRcvDt)
    console.log('isReadOnlyDelvDt', this.isReadOnlyDelvDt)

    this.atmCardsManagementForm.patchValue(clnt);
    (<any>$('#atmCardsModel')).modal('show');
  }

  addAtmCard(){
    if(this.atmCardsManagementForm.value.atmCardReceivingDate == null || 
        this.atmCardsManagementForm.value.atmCardDeliveredDate == null ||
        this.atmCardsManagementForm.value.atmCardNum == null ||
        this.atmCardsManagementForm.value.atmCardNum == '' ){
          return ;
      }
    let atmObject = this.atmCardsManagementForm.value;
    atmObject['atmCardReceivingDate'] = new DatePipe('en-US').transform(this.atmCardsManagementForm.get('atmCardReceivingDate').value, 'yyyy-MM-dd HH:mm:ss.S')
    atmObject['atmCardDeliveredDate'] = new DatePipe('en-US').transform(this.atmCardsManagementForm.get('atmCardDeliveredDate').value, 'yyyy-MM-dd HH:mm:ss.S')

    this.spinner.show();
    this.atmCardsService.EditAtmCard(atmObject).subscribe(res => {
      this.onSelectBranch();
      (<any>$('#atmCardsModel')).modal('hide');
      this.spinner.hide();
      console.log('res', res)
      if(res['warning']){
        this.toaster.warning(res['warning'], 'Warning')
      }
      if(res['success']){
        this.toaster.success(res['success'], 'Success')
      }
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }

  get form() 
  { 
    return this.atmCardsManagementForm.controls; 
  }
  numeric(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isReadOnly(value){
    if(value == null || value == ''){
      return false;
    }else{
      if(this.auth.role == 'admin' || this.auth.role == 'ito'){
        return false
      }else{
        return true;
      }
    }
  }
}
