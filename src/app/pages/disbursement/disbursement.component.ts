import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisbursementService } from '../../shared/services/disbursement.service';
import { Disbursement } from '../../shared/models/disbursement';
import { ErrorStateMatcher, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { CommonService } from '../../shared/services/common.service';
import { MyErrorStateMatcher } from '../../shared/helpers/MyErrorStateMatcher.helper';
import { DISBUCEMENTS } from '../../shared/mocks/mock_common_codes';
import { collectExternalReferences } from '@angular/compiler';
import * as REF_CD_GRP_KEYS from '../../shared/models/REF_CODE_GRP_KEYS.mocks';
import swal from 'sweetalert2';
import { Auth } from 'src/app/shared/models/Auth.model';
import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css']
})
export class DisbursementComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  disburmentForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  submitted = false;
  model: any; formSaved = true;
  disburment: Disbursement = new Disbursement();
  disbs: Disbursement[] = [];
  allItems: any[] = [];
  pager: any = {};
  // paged items
  pagedItems: any = [];
  branchs: Branch[];
  branchForm: FormGroup;
  onBranchSelection: boolean = false;
  isCount = false;
  filters: any[] = [];

  genderSelected: any = '';
  gender: any;
  maritalStatus: any;
  organization: any;
  geography: any;
  date: any;
  now: any;
  disgardForm: FormGroup;
  displayedColumns = [];
  filterValue: any = "";

  kmPrdList = ['6', '24']

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }

  searchVal = "";
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
    this.getFilteredData(filterValue.trim().toLowerCase());
  }
  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      // this.dataSource.sort = this.sort;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      console.log(this.dataSource)
      return;
    }
  }

  getFilteredData(filterValue) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
  
    setTimeout( () => {  this.spinner.show()}, 10);

    this.disbursementService.getAllDisbursements(this.branchForm.controls['branch'].value, this.paginator.pageIndex + 1, this.paginator.pageSize, filterValue, this.isCount).subscribe((data) => {
      this.spinner.hide();
      this.allItems = data.data;
      
      if (this.allItems.length <= 0  && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

   
      this.dataSource = new MatTableDataSource(data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 200);
    }, (error) => {
      this.spinner.hide();
      console.log('err Disbursement Service');
      console.log('err', error);
    });
  }

  constructor(private router: Router,
    private disbursementService: DisbursementService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private transfersService: TransfersService,
    private commonService: CommonService, private toaster: ToastrService) {
    this.now = new Date();
    this.spinner.hide();
    let month: any;
    if ((this.now.getMonth() + 1) < 10) {
      month = '0' + (this.now.getMonth() + 1);
    } else {
      month = '' + (this.now.getMonth() + 1);
    }
    let day: any;
    if ((this.now.getDate() + 1) < 10) {
      day = '0' + (this.now.getDate());
    } else {
      day = '' + (this.now.getDate());
    }
    const year: any = this.now.getFullYear();
    const currentDate: any = year + '-' + month + '-' + day;
    this.date = currentDate;
    console.log(this.date);

    $(document).ready(function () {
      $('.acc_trigger').toggleClass('inactive-header');
      $('.acc_trigger').click(function () {
        if ($(this).next().is(':hidden')) {
          $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        } else {
          $(this).toggleClass('active-header').toggleClass('inactive-header');
          $(this).next().slideToggle().toggleClass('open-content');
        }
      });

      return false;
    });
  }

  ngOnInit() {
    this.displayedColumns = ['applicantid', 'clientid', 'clientname', 'appdate', 'approvaldate', 'amount', 'product', 'bdo', 'action'];
    this.disburmentForm = this.fb.group({
      loanNumber: ['', Validators.required],
      clientName: ['', Validators.required],
      appDate: ['', Validators.required],
      approvalDate: ['', Validators.required],
      amount: ['', Validators.required],
      product: ['', Validators.required],
    });
    this.disgardForm = this.fb.group({
      loanAppSeq: ['', Validators.required],
      cmnt: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z ]+$")]],
    });

    this.branchForm = this.fb.group({
      branch: [this.auth.emp_branch],
    });

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        this.toaster.info('Please Select Branch', 'Information')
      })
    } 
    this.loadLovs();

  }

  ngAfterViewInit() {
    // this.paginator.pageIndex = 110;
    this.getAllItems();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDisbursementPage())
      )
      .subscribe();
  }

  onEditDisbursement(loanAppSeq: number) {
    this.disbursementService.loanAppSeq = loanAppSeq;
    sessionStorage.setItem('loanAppSeq', loanAppSeq.toString());
    console.log(sessionStorage.setItem('loanAppSeq', loanAppSeq.toString()));
    this.router.navigate(['disbursement/voucher']);
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.commonService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  datalength = 0;
  getAllItems() {

    this.isCount =true;
 
    this.allItems = [];
    this.dataSource = new MatTableDataSource(this.allItems);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.filterValue = '';
    this.searchVal ='';
    this.lastPageIndex = 0;

    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.dataSource = null;
      this.datalength = 0;
      return;
    }
    setTimeout( () => {  this.spinner.show()}, 10);
    this.disbursementService.getAllDisbursements(this.branchForm.controls['branch'].value, this.paginator.pageIndex + 1, this.paginator.pageSize, "", this.isCount).subscribe((data) => {
      this.allItems = data.data;
        if (this.allItems.length <= 0  && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.allItems.forEach((d, index) => {
        this.spinner.hide();
        if (d.clientDto) {
          this.allItems[index].clientId = d.clientDto.clntId;
          this.allItems[index].clientName = d.clientDto.frstNm + ' ' + d.clientDto.lastNm;
        }
        if (d.mwPrdDTO) {
          this.allItems[index].product = d.mwPrdDTO.prdNm;
        }
        if (d.mwPortDTO) {
          this.allItems[index].portNm = d.mwPortDTO.portNm;
        }
        this.disbs = this.allItems;
      });

      this.dataSource = new MatTableDataSource(this.allItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error =>{
        console.log(error);
        this.spinner.hide();
    });

  }
  lastPageIndex = 0; dataBeforeFilter; countBeforeFilter; lastPageIndexBeforeFilter;
  loadDisbursementPage() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {

      setTimeout( () => {  this.spinner.show()}, 10);
      this.disbursementService.getAllDisbursements(this.branchForm.controls['branch'].value, this.paginator.pageIndex + 1, this.paginator.pageSize, this.filterValue, this.isCount).subscribe((data) => {
        this.spinner.hide();
        this.allItems = data.data;

        if (this.allItems.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information');
        };

        this.dataSource.data = this.dataSource.data.concat(this.allItems);
        this.lastPageIndex = this.lastPageIndex + 1;
        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);
      }, error => {
        this.spinner.hide();
        console.log(error)
      });
    }
  }

  onSubmitBranchForm(){
    console.log(this.branchForm.value);
  }

  get df() { return this.disgardForm.controls; }
  disgardApp(app: Disbursement) {
    (<any>$('#disgardApp')).modal('show');
    this.disgardForm.patchValue(app);
  }


  onSubmitDisgardApp() {
    (<any>$('#disgardApp')).modal('hide');
    
    setTimeout(() => {
      this.spinner.show();
    }, 5);
    this.disgardForm.value.cmnt == null ? ' ' : this.disgardForm.value.cmnt;

    this.disbursementService.deleteApplication(this.disgardForm.value).subscribe(() => {
      this.spinner.hide();
      const index = this.allItems.findIndex(r => r.loanAppSeq === this.disgardForm.value.loanAppSeq);
      this.allItems.splice(index, 1);
      this.dataSource = new MatTableDataSource<Element>(this.allItems);
      this.setPage(0);
    }, error =>{
      this.spinner.hide();
      console.log('There was an error: ', error)
    });
  }


  revertApp(app: Disbursement) {
    (<any>$('#revertApp')).modal('show');
    this.disgardForm.patchValue(app);
  }
  onSubmitRevertApp() {
    if (!this.disgardForm.valid) {
      return false;
    }

    setTimeout(() => {
      this.spinner.show();
    }, 5);
    (<any>$('#revertApp')).modal('hide');
    // tslint:disable-next-line:no-unused-expression
    this.disgardForm.value.cmnt == null ? ' ' : this.disgardForm.value.cmnt;
    this.disbursementService.revertApplication(this.disgardForm.value).subscribe(() => {
      const index = this.allItems.findIndex(r => r.loanAppSeq === this.disgardForm.value.loanAppSeq);
      this.spinner.hide();
      this.allItems.splice(index, 1);
      this.dataSource = new MatTableDataSource<Element>(this.allItems);
      this.setPage(0);
    }, error => { 
        this.spinner.hide();
        console.log('There was an error: ', error)});
  }


  printDisbs() {
    if (this.allItems.length > 0) {
      const tempdisbs = this.allItems.filter((d: Disbursement) => d.isChecked === true);
      console.log(tempdisbs);
    }
  }

  editPdcs(loanAppSeq: number) {
    this.disbursementService.loanAppSeq = loanAppSeq;
    sessionStorage.setItem('loanAppSeq', loanAppSeq.toString());
    this.router.navigate(['disbursement/edit-voucher']);
  }



  // FILTERS

  deleteFilter(filter: any) {
    const index = this.filters.indexOf(filter, 0);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
    if (filter.key === 'Gender') {
      this.genderSelected = '';
      this.allItems = this.disbs;
      this.setPage(0);
    }
    if (filter.type === 'geography') {
      this.allItems = this.disbs;
      this.setPage(0);
      if (this.genderSelected !== '') {
        this.genderFilter();
      }
    }
  }

  genderFilter() {
    console.log(this.genderSelected);
    let found = false;
    for (let j = 0; j < this.filters.length; j++) {
      if (this.filters[j].key === 'Gender') {
        found = true;
        break;
      }
    }
    if (!found) {
      this.filters.push({ key: 'Gender', value: this.genderSelected });
    } else if (this.filters.length < 1) {
      this.allItems = this.disbs;
    }
    const filteredItems = [];
    for (let i = 0; i < this.allItems.length; i++) {
      console.log(i);
      if (this.allItems[i].gender === this.genderSelected) {
        console.log(this.allItems[i]);
        filteredItems.push(this.allItems[i]);
      }
    }
    console.log(filteredItems);
    this.allItems = filteredItems;
    this.setPage(0);
  }

  loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
      this.gender = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.MARITAL_STATUS).subscribe((res) => {
      this.maritalStatus = res;
    }, (error) => {
      console.log('err', error);
    });

    // this.commonService.getAllFilters().subscribe((res) => {
    //   console.log(res);
    //   this.organization = res.organization;
    //   this.geography = res.geography;
    // }, (error) => {
    //   console.log('err', error);
    // });
  }

  navClick(element) {
    const parent = $(element).parent();
    if (parent.hasClass('toparrow')) {
      $('.sub-menu:first', parent).hide(300);
      parent.removeClass('toparrow');
    } else {
      $('.sub-menu:first', parent).show(300);
      parent.addClass('toparrow');
    }
  }
  regionClick(region) {
    console.log(region);
  }
  stateClick(state: any) {
    this.appendGeographyFilter('State', state.provName);
    this.commonService.applyFilter('state', state.provSeq).subscribe((res) => {
      console.log(res);
      this.allItems = res;
      if (this.genderSelected !== '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); });
  }

  districtClick(district: any) {
    this.appendGeographyFilter('District', district.districtName);
    this.commonService.applyFilter('district', district.districtSeq).subscribe((res) => {
      console.log(res);
      this.allItems = res;
      if (this.genderSelected !== '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); });
  }


  tehsilClick(tehsil: any) {
    this.appendGeographyFilter('Tehsil', tehsil.thslName);
    this.commonService.applyFilter('tehsil', tehsil.thslSeq).subscribe((res) => {
      console.log(res);
      this.allItems = res;
      if (this.genderSelected !== '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); });
  }



  ucClick(uc: any) {
    this.appendGeographyFilter('UC', uc.ucName + '-' + uc.ucDescription);
    this.commonService.applyFilter('uc', uc.ucSeq).subscribe((res) => {
      console.log(res);
      this.allItems = res;
      if (this.genderSelected !== '') {
        this.genderFilter();
      }
      this.setPage(0);
    }, (error) => { console.log(error); });
  }

  appendGeographyFilter(key, value) {
    let found = false;
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].type === 'geography') {
        found = true;
        this.filters[i].key = key;
        this.filters[i].value = value;
      }
    }
    if (!found) {
      this.filters.push({ key: key, value: value, type: 'geography' });
    }
    if (this.genderSelected !== '') {
      this.genderFilter();
    }
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }
  
  isKmProduct(value){
    if (this.kmPrdList.includes(value))
      return false;
    else
      return true;
  }
}
