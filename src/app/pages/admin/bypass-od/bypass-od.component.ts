import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { BypassOdService } from 'src/app/shared/services/bypass-od.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-od-check',
  templateUrl: './bypass-od.component.html',
  styleUrls: ['./bypass-od.component.css']
})
export class BypassOdComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private bypassODService: BypassOdService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private toaster: ToastrService) { }

    public bypassForm: FormGroup;
    
  ngOnInit() {
    this.displayedColumns = ['clntId', 'frstNm', 'odDays' ];
    
    this.bypassForm = this.fb.group({
      ischecked: ['']
    });

    this.branchForm = this.fb.group({
      branch: this.auth.emp_branch,
    });
    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')
      
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.brnchs = res;
        console.log(res)
      })
    } else {
      this.loadData();
      //this.getBypassOD();
    }
  }

  onSelectBranch() {   
    this.loadData();
    //this.getBypassOD();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSelectBranch())
      )
      .subscribe();
  }

  auth = JSON.parse(sessionStorage.getItem("auth"))
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any; 
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  ischecked : boolean;

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
      console.log(this.datalength, this.countBeforeFilter);
      return;
    }
  }

  allClnt: any[];
  brnchs = [];
  branchForm: FormGroup;

  getFilteredData(filterValue:string){
    this.isCount = true;
      this.paginator.pageIndex = 0;
      this.lastPageIndex = 0;
      setTimeout( () =>{this.spinner.show()}, 10);
      this.bypassODService.getAllClientsLoanAppOD(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue,this.isCount).subscribe((response) => {
        this.allClnt = response.clnts;
        this.spinner.hide();
        
        if (this.allClnt.length <= 0  && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
  
        this.dataSource = new MatTableDataSource(this.allClnt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = response.count;
        this.getBypassOD();
      }, error =>{
        this.spinner.hide();
        console.log('err All Clnts Service');
        console.log('err', error);
        });
  }

  loadSelectBranch(){
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      setTimeout( () =>{this.spinner.show()}, 10);
      this.bypassODService.getAllClientsLoanAppOD(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue,this.isCount).subscribe((response) => {
        
        this.allClnt = response.clnts;
        this.spinner.hide();

        if (this.allClnt.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.allClnt);
       
       response.count = this.datalength;
       this.datalength = 0;
       setTimeout(() => { this.datalength = response.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
        this.getBypassOD();
      }, error =>{
          this.spinner.hide();
          console.log('err All Expense Service');
          console.log('err', error);
      });
    }
    
  }

  loadData(){
    this.isCount = true;
    this.allClnt = [];
    this.dataSource = new MatTableDataSource(this.allClnt);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.lastPageIndex = 0;
    this.filterValue = '';
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.allClnt = [];
      this.dataSource = null;
      this.datalength = 0;
      return;
    }
    setTimeout( () =>{this.spinner.show()}, 10);
    this.bypassODService.getAllClientsLoanAppOD(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "",this.isCount).subscribe((response) => {
      this.allClnt = response.clnts;
      this.allClnt.forEach(element => {
        element.checked = false;
      });
      this.spinner.hide()
      if (this.allClnt.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allClnt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = response.count;

        response.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = response.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
        this.getBypassOD();
      }, error =>{
        this.spinner.hide();
        console.log('err All Clnts Service');
        console.log('err', error);
        });
        //this.getBypassOD();
  }

  odLoans : any[] = [];

  getBypassOD(){

    this.bypassODService.getBypassClientsLoanAppOD(this.branchForm.controls['branch'].value).subscribe(res => {
      this.spinner.hide();
      this.odLoans = res.clnts;
      console.log(this.odLoans);
      this.odLoans.forEach(odLoan=>{
        this.allClnt.forEach(element => {
          if(odLoan.clntSeq == element.clntSeq){
            console.log(element.checked);
            element.checked = true;
            //element.cityUcRelSeq = odLoan.cityUcRelSeq;
          }
        });
      })
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }

   
  addBypass(event, bypass){
    this.spinner.show();

    if(event.target.checked == true){

      this.bypassODService.bypassOverdue(bypass.clntSeq, true).subscribe(res => {
        bypass = res;
        this.toaster.success('OD Check Updated. This Client is bypassed.');
        this.spinner.hide();
        this.getBypassOD();

      },

      error =>{
        this.spinner.hide();
        this.toaster.warning('err.', error);
        });

    }else{

      this.bypassODService.bypassOverdue(bypass.clntSeq, false).subscribe(res => {

        bypass = res;

        this.toaster.success('OD Check Updated. This Client is not bypassed.');

        this.spinner.hide();

        this.getBypassOD();

      },

      error =>{

        this.spinner.hide();
        this.toaster.warning('err.', error);
        });

    }
  }
}
