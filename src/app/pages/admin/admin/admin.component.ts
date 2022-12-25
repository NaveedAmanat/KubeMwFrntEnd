import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfersService } from '../../../shared/services/transfers.service';
import { AppDto } from '../../../shared/models/app-dto.model';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { DataService } from '../../../shared/services/data.service';
import { Region } from '../../../shared/models/region.model';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { Branch } from 'src/app/shared/models/branch.model';
import { CommonService } from 'src/app/shared/services/common.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { PortfolioTransfer } from 'src/app/shared/models/PortfolioTransfer.model';
import { t } from '@angular/core/src/render3';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

/*
  Added By Naveed- Date - 23-01-2022
  SCR - Portfolio Transfer 
  i - exclude 'Action' column on portfolio transfer screen
  ii - transfer single, multiple, complete portfolio and branch at once
  iii - display pupup message when transfer complete portfolio and branch 
  iv  - add validation on 'Transfer Client' popup 
*/

export class AdminComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      // this.dataSource.sort = this.sort;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      // this.lastPageIndex = 0;
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

  dataSource: any;
  auth: Auth;
  isAdmin: boolean = false;
  greaterLengthFlag: boolean = false;
  tranferButtonFlag: boolean = true;
  allTransfers: AppDto[];
  filterAllTransfers: AppDto[];
  allPortfolios;
  allRegions: Region[];
  allAreas;
  allBranches;
  allTransfersToUpdate: AppDto[] = [];
  regSeq;
  isEdit: boolean;
  public transferForm: FormGroup;
  submitted = false;
  transfer: AppDto = new AppDto();


  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;
  branchs: Branch[];
  branchForm: FormGroup;
  portfolioForm: FormGroup;
  onBranchSelection: boolean = false;
  brnchPortfolio;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  constructor(
    private transfersService: TransfersService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private commonService: CommonService
  ) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.isAdmin = ((this.auth.role == "admin") ? true : false);
  }

  ngOnInit() {
    // exculde 'Action' coulmn - Date - 23-01-2022
    this.displayedColumns = ['firstName', 'house_num', 'branch', 'portfolio'];

    this.transferForm = this.formBuilder.group({
      isChecked: [''],
      clntSeq: [''],
      loanAppSeq: [''],
      region: [''],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      portfolio: ['', Validators.required],
      regSeq: ['', Validators.required],
    });

    this.branchForm = this.formBuilder.group({
      branch: [this.auth.emp_branch],
    });

    // added Naveed - Date - 23-01-2022
    // portfolio form
    this.portfolioForm = this.formBuilder.group({
      portfolio: [-1],
    });
    // ended by naveed 

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        this.toaster.info('Please Select Branch', 'Information')
      })
    } else{
      this.getAllTransferRecord();
      
      // call get branch against portfolio - Date - 23-01-2022
      this.getBrnchPort(this.auth.emp_branch);
      // Ended by Naveed - Date - 23-01-2022
    }
  }

  getArea() {
    // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
    this.allPortfolios = [];
    this.allBranches = [];
    this.allAreas = [];
    if(this.transferForm.controls["regSeq"].value === 'Select'){
      this.transferForm.controls["portfolio"].reset();
      this.transferForm.controls["branch"].reset();
      this.transferForm.controls["area"].reset();
      this.transferForm.controls["regSeq"].reset();
      return;
    }
    // End By Naveed
    this.dataService.getArea(this.transferForm.controls["regSeq"].value).subscribe(d => {
      this.allAreas = d;
    });
  }
  getBranch() {
    // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
    this.allPortfolios = [];
    this.allBranches = [];
    if(this.transferForm.controls["area"].value === 'Select'){
      this.transferForm.controls["portfolio"].reset();
      this.transferForm.controls["branch"].reset();
      this.transferForm.controls["area"].reset();
      return;
    }
    // End  By Naveed
    this.dataService.getBranch(this.transferForm.controls["area"].value).subscribe(d => {
      this.allBranches = d;
    });
  }
  getPortfolio() {
    // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
    if(this.transferForm.controls["branch"].value === 'Select'){
      this.transferForm.controls["portfolio"].reset();
      this.transferForm.controls["branch"].reset();
      this.allPortfolios = [];
      return;
    }
    // End By Naveed
    this.allPortfolios = [];
    this.dataService.getPortfolio(this.transferForm.controls["branch"].value).subscribe(d => {
      this.allPortfolios = d;
    });
  }

  // added Naveed - Date - 23-01-2022
  // get branch against portfolio 
  getBrnchPort(brnch){
    this.dataService.getPortfolio(brnch).subscribe(d => {
      this.brnchPortfolio = d;
    });
  }
  // Ended by Naveed - Date - 23-01-2022

  get form() {
    return this.transferForm.controls;
  }

  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }

  // filtered by portfolio - Date - 23-01-2022
  filterByPortfolio(event){
    this.getFilteredData(this.filterValue)
  }
  // Ended by Naveed - Date - 23-01-2022


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadData())
      )
      .subscribe();
  }

  getAllTransferRecord(){
    let brnch  = this.branchForm.controls['branch'].value;
    this.brnchPortfolio = [];
    this.portfolioForm.setValue({'portfolio': ''});
    this.isCount = true;
    this.allTransfers = [];
    this.dataSource = new MatTableDataSource(this.allTransfers);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;

    if (brnch == null || brnch == 0) {
      this.onBranchSelection = false;
      this.allTransfers = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      return;
    }

    this.spinner.show();
    // modified by Naveed - Date - 23-01-2022
    // added portSeq as paremeter
    this.transfersService.getTransfers(brnch,this.getPortFolioSeq(), this.paginator.pageIndex, 10, "",this.isCount).subscribe(data => {
    // Ended by Naveed - Date - 23-01-2022
      this.spinner.hide();
      this.getBrnchPort(brnch);

      this.allTransfers = data.apps;

      if (this.allTransfers.length <= 0 && this.auth.role != 'bm') {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.allTransfers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

      this.transfersService.getRegions().subscribe(data => {
      this.allRegions = data;
      let index = this.allRegions.indexOf(this.allRegions.find( reg => reg.regSeq == -1));
      this.allRegions.splice(index, 1);


        // console.log(this.allRegions)
        // this.dataSource = new MatTableDataSource(this.allRegions);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
      // this.transfersService.getAreas().subscribe(data => this.allAreas = data);
      // this.transfersService.getBranches().subscribe(data => this.allBranches = data);
    },error=>{
      this.spinner.hide();
      this.toaster.error("Something Went Wrong");
      console.log(error)
    });
  }

  getPortFolioSeq(){
    let portSeq = this.portfolioForm.controls['portfolio'].value;
    if(portSeq == undefined || portSeq == null || portSeq == -1 || portSeq.length ==0){
      portSeq = -1
    }
    return portSeq;
  }

  loadData(){
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      // modified by Naveed - Date - 23-01-2022
      // added portSeq as paremeter
      this.transfersService.getTransfers(this.branchForm.controls['branch'].value, this.getPortFolioSeq(), this.paginator.pageIndex, this.paginator.pageSize, this.filterValue,this.isCount).subscribe(data => {
        // Ended by Naveed - Date - 23-01-2022
        this.spinner.hide();
        this.allTransfers = data.apps;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.apps);
       
        data.count = this.datalength;
       this.datalength = 0;
       setTimeout(() => { this.datalength = data.count; }, 50);

        if (this.allTransfers.length <= 0 && this.auth.role != 'bm') {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        }
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
          this.spinner.hide();
          console.log('err All Expense Service');
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue:string){
    this.isCount = true;
      this.paginator.pageIndex = 0;
      this.lastPageIndex= 0;
      this.spinner.show();
       // modified by Naveed - Date - 23-01-2022
      // added portSeq as paremeter
      this.transfersService.getTransfers(this.branchForm.controls['branch'].value,this.getPortFolioSeq(), this.paginator.pageIndex, this.paginator.pageSize, filterValue,this.isCount).subscribe(data => {
        // Ended by Naveed - Date - 23-01-2022
        this.allTransfers = data.apps;
        this.spinner.hide();
        if (this.allTransfers.length <= 0 ) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
  
        this.dataSource = new MatTableDataSource(this.allTransfers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
      }, error =>{
        this.spinner.hide();
        console.log('err All Expense Service');
        console.log('err', error);
        });
  }


  onCancelClick() {
    this.isCount = true;
    this.spinner.show();
    this.allTransfers = [];
    this.dataSource = new MatTableDataSource(this.allTransfers);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    // modified by Naveed - Date - 23-01-2022
    // added portSeq as paremeter
    this.transfersService.getTransfers(this.branchForm.controls['branch'].value,this.getPortFolioSeq(), this.paginator.pageIndex, 10, "",this.isCount).subscribe(data => {
    // Ended by Naveed - Date - 23-01-2022
      this.allTransfers = data.apps;
      
      this.dataSource = new MatTableDataSource(this.allTransfers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      data.count = this.datalength;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 50);

      this.spinner.hide();

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

      this.allTransfersToUpdate = [];
    });
    this.allTransfersToUpdate.forEach(element => {
      this.allTransfersToUpdate.pop();
    });
    this.tranferButtonFlag = true;
    this.checkBoxFlag = false;
    this.greaterLengthFlag = true;

    this.allTransfers.forEach(element => {
      element.isChecked = false;
    });
    this.transferForm.reset

  }
  onEditClick(transferObj: any[], check: string, transfer: AppDto) {
     // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer

    this.transferForm = this.formBuilder.group({
      isChecked: [transferObj[0].isChecked],
      clntSeq: [transferObj[0].clntSeq],
      loanAppSeq: [transferObj[0].loanAppSeq],
      region: [transferObj[0].regSeq],
      area: [transferObj[0].area, Validators.required],
      branch: [transferObj[0].branch, Validators.required],
      portfolio: [transferObj[0].portSeq, Validators.required],
      regSeq: [transferObj[0].regSeq, Validators.required],
    });
  // End By Naveed 

    if (!this.isAdmin) {
      this.transferForm.get('regSeq').disable();
      this.transferForm.get('area').disable();
      this.transferForm.get('branch').disable();

      this.transferForm.get('regSeq').clearValidators();
      this.transferForm.get('regSeq').updateValueAndValidity();

      this.transfersService.getPortfoliosByBranch(transfer.branchSeq).subscribe(data => {
        this.allPortfolios = data;
        // this.dataSource = new MatTableDataSource(this.allPortfolios);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
    }
    this.tranferButtonFlag = false;
    this.isEdit = true;
    if (check == "empty") {
      // this.allTransfersToUpdate.forEach(element => {
      //   if (element.loanAppId == transfer.loanAppId) {
      //     console.log(element.clntSeq + "               " + transfer.clntSeq);
      //     this.flag = true;
      //   }
      // });

      if (this.flag == false) {
        transferObj.push(transfer);
        this.flag = false;
      }
    }
    console.log(transferObj[0]);
    // this.transferForm = transferObj[0];

    if (transferObj.length > 1) {
      this.greaterLengthFlag = true;
    }
    else {
      this.greaterLengthFlag = false;
    }

    (<any>$('#cmmoncodes')).modal({
      keyboard: false,
      backdrop: 'static'
    });
    (<any>$('#cmmoncodes')).modal('show');
  }

  onBranchIndexChanged(selectedValue) {
    this.allTransfersToUpdate.forEach(element => {
      element.branchSeq = selectedValue;
      this.transfersService.getPortfoliosByBranch(element.branchSeq).subscribe(data => {
        this.allPortfolios = data;
        // this.dataSource = new MatTableDataSource(this.allPortfolios);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
    });
  }


  onSelectedIndexChanged() {
     // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
    if(this.transferForm.controls["portfolio"].value === 'Select'){
      this.transferForm.controls["portfolio"].reset();
      return;
    }
    // End By Naveed

    this.allTransfersToUpdate.forEach(element => {
      element.portSeq = this.transferForm.controls["portfolio"].value;
    });
    console.log(this.allTransfersToUpdate);
  }

  // modified by Naveed - Date - 23-01-2022
 // portfolio transfer
  updatePortfolio(allTransfersToUpdate) {    
    if(!this.checkBoxFlag){
      this.updateAllPort(); // for transfer complete portfolio or branch 
    }else{
      // for single or multiple clients transfer
      this.spinner.show();
      this.transfersService.updatePort(allTransfersToUpdate).subscribe(d => {
        (<any>$('#cmmoncodes')).modal('hide');
        this.spinner.hide();
        if(d['failed']){
          this.toaster.warning(d['failed']);
        }else if(d['success']){
          this.toaster.success(d['success']);
        }else{
          this.toaster.error('Somthing went wrong');
        }
        
        this.clientGetAfterUpdate();
      },error=>{
        (<any>$('#cmmoncodes')).modal('hide');
        this.spinner.hide();
        this.toaster.error(error);
        console.log('error', error)
      });
    }
    this.spinner.hide();
  }

  // Added by Naveed - Date - 23-01-2022
 // for complete portfolio or branch portfolio transfer
  updateAllPort(){
   let fromPort =  this.getPortFolioSeq();
   let fromBrnch = this.branchForm.controls['branch'].value;
   let toPort = this.transferForm.controls["portfolio"].value;
    // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
   let toBrnch =  this.isAdmin  ? this.transferForm.controls["branch"].value : this.branchForm.controls['branch'].value;
   // End By Naveed
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to Transfer Portfolio?",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Transfer!",
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.transfersService.updateAllPort(fromPort, fromBrnch, toPort, toBrnch).subscribe(d => {
          (<any>$('#cmmoncodes')).modal('hide');
          this.spinner.hide();
          if(d['failed']){
            this.toaster.warning(d['failed']);
          }else if(d['success']){
            swal('Transfer','All Portfolio Transfered Successfully!','success')
            this.clientGetAfterUpdate();
          }else{
            this.toaster.error('Somthing went wrong');
          }
        },error=>{
          (<any>$('#cmmoncodes')).modal('hide');
          this.spinner.hide();
          this.toaster.error("Something Went Wrong");
          console.log(error)
        });
      }
    });
  }
// Ended by Naveed - Date - 23-01-2022

  clientGetAfterUpdate(){
    this.isCount = true;
    this.allTransfersToUpdate = [];
    this.checkBoxFlag = false;
    this.allTransfers = [];
    this.dataSource = new MatTableDataSource(this.allTransfers);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    // modified by Naveed - Date - 23-01-2022
    // added portSeq as paremeter
    this.transfersService.getTransfers(this.branchForm.controls['branch'].value,this.getPortFolioSeq(), this.paginator.pageIndex, 10, "",this.isCount).subscribe(data => {
    // Ended by Naveed - Date - 23-01-2022
      this.allTransfers = data.apps;
      
      this.dataSource = new MatTableDataSource(this.allTransfers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      data.count = this.datalength;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 50);

      this.spinner.hide();

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

      this.allTransfersToUpdate = [];
    });
    this.spinner.hide();
  }

  checkBoxFlag: boolean = false;
  checkMethodFlag: boolean = false;
  flag: boolean = false;

  addTransfer(transfer, event) {
    this.checkMethodFlag = false;

    if (transfer.ischecked) {
      this.checkBoxFlag = true;
      this.tranferButtonFlag = false;

      // this.allTransfersToUpdate.forEach(element => {
      //   if (element.loanAppId == transfer.loanAppId) {
      //     console.log("check      " + element.clntSeq + "               " + transfer.clntSeq);
      //     this.flag = true;
      //   }
      // });
      if (this.flag == false) {
        this.allTransfersToUpdate.push(transfer);
        this.flag = false;
      }
    }
    else if (!transfer.ischecked) {
      this.allTransfersToUpdate.splice(this.allTransfersToUpdate.indexOf(transfer), 1);
      if (this.allTransfersToUpdate.length < 1) {
        this.tranferButtonFlag = true;
        this.checkMethodFlag = true;
        this.checkBoxFlag = false;
      }
      console.log(this.allTransfersToUpdate);
    }
  }
  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  transferAllPort(){    
    // Update By Naveed - Date - 07-02-2022
    // Prod Issue Portfolio Transfer
    if(!this.isAdmin){
      this.transfersService.getPortfoliosByBranch(this.auth.emp_branch).subscribe(data => {
        this.allPortfolios = data;
      });
    }
    // End By Naveed

    (<any>$('#cmmoncodes')).modal({
      keyboard: false,
      backdrop: 'static'
    });
    (<any>$('#cmmoncodes')).modal('show');
  }


  /**
   * Added By Naveed - Date -  06-05-2022
   * SCR Portfolio transfer uploader
   */
   uploadLists: AppDto[] = [];
   data: any;

   inputClear(event) {
    event.target.value = null;
  }

  openFile(event) {
    event.click();
  }

  validateFlg = false;
  handle(event) {
    this.validateFlg = false;
    console.log('event', event, event.target.value.endsWith(".xlsx"))

    if (!(event.target.value.endsWith(".xlsx") || event.target.value.endsWith(".xls"))) {
      this.toaster.info('Please Choose Specific Format of Excel File ', 'Information');
      return;
    }

    this.uploadLists = [];

    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      this.toaster.info("You Can't Select More then One File", 'Information');
      return;
    }

    const reader: FileReader = new FileReader();
    this.spinner.show();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let withoutHeaderLists = this.data.slice(1);
      let isFileValid = true;

      withoutHeaderLists.forEach((r: any[], index) => {
        let uploadTransfer = new AppDto();

        if ((r.length > 0 && r.length <= 3 && r !== undefined) && isFileValid) {
            if( 
              (r[0] === undefined || r[0] === null) ||
                 (r[1] === undefined || r[1] === null) ||
                 (r[2] === undefined || r[2] === null)){
                                 
                  isFileValid = false;
                  this.toaster.warning('Record Invalid Line No. ' + (index + 2));
                  return;
              }else{
                uploadTransfer.clientId = r[0];
                uploadTransfer.branchSeq = r[1];
                uploadTransfer.portSeq = r[2];
  
                this.uploadLists.push(uploadTransfer);
              }
          uploadTransfer = null;
        }
      });
      this.spinner.hide();
      console.log('Uploading Data:', this.uploadLists);
      if (isFileValid) {
        swal({
          title: 'Are you sure?',
          text: "Are you sure you want to upload File?",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Upload it!'
        }).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.transfersService.updatePort(this.uploadLists).subscribe(d => {
              (<any>$('#cmmoncodes')).modal('hide');
              this.spinner.hide();
              if(d['failed']){
                this.toaster.warning(d['failed']);
              }else if(d['success']){
                this.toaster.success(d['success']);
              }else{
                this.toaster.error('Something went wrong');
              }
              // this.clientGetAfterUpdate();
            },error=>{
              (<any>$('#cmmoncodes')).modal('hide');
              this.spinner.hide();
              this.toaster.error(error);
              console.log('error', error)
            });
          }
        })
      }
    };
    reader.readAsBinaryString(target.files[0]);
    reader.abort;
    this.spinner.hide();
  }
}