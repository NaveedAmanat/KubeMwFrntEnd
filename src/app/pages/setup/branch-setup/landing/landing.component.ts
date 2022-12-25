import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { Branch } from 'src/app/shared/models/branch.model';
import { BranchService } from 'src/app/shared/services/branch.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { DataService } from 'src/app/shared/services/data.service';

/* Authored by Areeba
   Branch Setup
*/

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  brmodel = new Branch();
  branchTypes: any = [];
  areas: any = [];
  branches: Branch[] = [];
  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  ucFilterValue: any = "";
  searchVal = "";
  ucSearchVal = "";
  isCount: boolean = true;

  auth: Auth;

  constructor(private commonService: CommonService,
    private branchService: BranchService, private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataService: DataService) { }

  ngOnInit() {
    this.displayedColumns = ['brnchCode', 'areaName', 'brnchName', 'desc', 'typ', 'phone', 'email', 'hr_loc_cd', 'action'];
    this.commonService.getValuesByGroupName('BRANCH TYPE').subscribe(
      d => this.branchTypes = d
    );
    this.getAllBranches();
    this.branchService.getAllAreaNames().subscribe(
      a => this.areas = a
    );

    this.auth = JSON.parse(sessionStorage.getItem('auth'));
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }

  loadNextPage() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.branchService.getBranches(this.paginator.pageIndex, 10, "", this.isCount).subscribe(res => {
        this.spinner.hide();
        this.branches = res.brnchs;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(res.brnchs);

        res.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = res.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = res.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err', error);
      });
    }
  }

  findValueByKey(key, array) {
    let status = 'not found';
    array.forEach(s => {
      if (s.codeKey === key) {
        status = s.codeValue;
      }
    });
    return status;
  }

  findAreaNameBySeq(key, array) {
    let status = 'not found';
    array.forEach(s => {
      if (s[0] === key) {
        status = s[1];
      }
    });
    return status;
  }

  openBranch(branch) {
    sessionStorage.setItem("branch", JSON.stringify(branch));
  }

  getAllBranches() {
    this.isCount = true;
    this.spinner.show();
    this.branches = [];
    this.dataSource = new MatTableDataSource(this.branches);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    this.branchService.getBranches(this.paginator.pageIndex, 10, "", this.isCount).subscribe(res => {
      this.spinner.hide();
      this.branches = res.brnchs;

      this.dataSource = new MatTableDataSource(this.branches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = res.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = res.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

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
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      this.datalength = 0;
      setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.spinner.show();
    this.branchService.getBranches(this.paginator.pageIndex, 10, filterValue, this.isCount).subscribe(res => {
      this.branches = res.brnchs;
      this.spinner.hide();
      if (this.branches.length <= 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.branches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = res.count;
    }, error => {
      this.spinner.hide();
      console.log('err', error);
    });
  }

  addBranchModel() {
    this.brmodel = new Branch();
    console.log(this.brmodel);
    sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
    sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Branch Info", formUrl: "branch-info", isSaved: false }]));
    // if (this.auth.role == "admin") {
    //   sessionStorage.setItem("hasPermission", JSON.stringify(true));
    // }
    //else 
    sessionStorage.setItem("hasPermission", JSON.stringify(true));
    sessionStorage.setItem("editBranch", JSON.stringify(false));
    this.goToNextScreen();
  }
  editBranch(branch) {
    let uc, portfolio, community, product, bank, remitBank;
    uc = portfolio = community = product = bank = remitBank = false;
    this.spinner.show();
    this.branchService.getBranchInfo(branch.brnchSeq).subscribe((res) => {
      this.spinner.hide();
      const brmodel = new Branch();
      Object.assign(brmodel, res, brmodel); 
      sessionStorage.setItem("brmodel", JSON.stringify(brmodel));
      sessionStorage.setItem("editBranch", JSON.stringify(true));

      if(brmodel.ucs.length > 0)
       uc = true;
      if(brmodel.ports.length > 0)
      portfolio = true;
      if(brmodel.communities.length > 0)
      community = true;
      if(brmodel.products.length > 0)
      product = true;
      if(brmodel.brnchAcctSetSeq > 0 || brmodel.brnchRemitSeq > 0)
      bank = true;

      if(this.auth.role == 'finance'){
        sessionStorage.setItem("readonly" , JSON.stringify(true));
      } else{
        sessionStorage.setItem("readonly" , JSON.stringify(false));
      }
      
      sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Branch Info", formUrl: "branch-info", isSaved: true }, { formNm: "UCs", formUrl: "uc", isSaved: uc, isDisable : false}
        , { formNm: "Portfolios", formUrl: "portfolio", isSaved: portfolio }, { formNm: "Communities", formUrl: "community", isSaved: community }
        , { formNm: "Address Info", formUrl: "port-loc-info", isSaved: true }
        , { formNm: "Products", formUrl: "products", isSaved: product }
        , { formNm: "Bank Info", formUrl: "bank-info", isSaved: true }]));
        
      // if (this.auth.role == "admin") {
      //   sessionStorage.setItem("hasPermission", JSON.stringify(true));
      // }
      //else 
      sessionStorage.setItem("hasPermission", JSON.stringify(true));
      this.goToNextScreen();
    });

  }
  goToNextScreen() {
    this.router.navigate(['setup/branch']);
  }

  deleteBranch(branch) {
    this.spinner.show();
    this.dataService.delBranch(branch.brnchSeq).subscribe((data) => {
      this.spinner.hide();
      this.toaster.success('Branch deleted successfully');
      this.getAllBranches();

    }, (error) => {
      this.spinner.hide();
      this.toaster.warning('err', error);
    });
  }
}
