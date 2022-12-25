import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { merge } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { Auth } from 'src/app/shared/models/Auth.model';
import * as XLSX from 'xlsx'

import swal from 'sweetalert2';
import { PanelHospitalService } from 'src/app/shared/services/panel-hospital.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { Branch } from 'src/app/shared/models/branch.model';
import { PanelHospital } from 'src/app/shared/models/panel-hospital.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExitStatus } from 'typescript';
import { Hospitals } from 'src/app/shared/models/hospitals.model';
import { CommonCode } from 'src/app/shared/models/commonCode.model';
import { CommonService } from 'src/app/shared/services/common.service';

/*
Authored by Areeba
Dated 24-2-2022 
Jubliee Panel Hospital List for KSZB clients
*/
@Component({
  selector: 'app-panel-hospital',
  templateUrl: './panel-hospital.component.html',
  styleUrls: ['./panel-hospital.component.css']
})
export class PanelHospitalComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  iaRights: boolean;
  branchs: Branch[] = [];
  hospitals: Hospitals[];
  nbhospitals: Hospitals[];
  hospitalTypes: CommonCode[];
  hospitalStatuses: CommonCode[];

  PnlHsptlForm: FormGroup;

  constructor(
    private router: Router,
    private panelHospitalService: PanelHospitalService, 
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private transfersService: TransfersService,
    private commonService: CommonService,
  ) {

    if (this.auth.role == "admin") {
      this.transfersService.getBranches().subscribe(d => { this.branchs = d; }
      );
    }
    this.panelHospitalService.getHospitals().subscribe(h => { this.hospitals = h; }
    );

    this.panelHospitalService.getNBlacklistHospitals().subscribe(h => { this.nbhospitals = h; }
    );
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  panelHospitals: PanelHospital[] = [];
  now: any; date: any;

  dataSource: any;
  datalength: number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  isEdit: boolean = false;
  disableonEdit: boolean = false;
  submitted = false;
  srNo: number = 1;

  //controls
  vbrnchs: boolean = false;
  vhsptls: boolean = false;
  vadd: boolean = false;
  vhsptlform: boolean = false;
  vclose: boolean = false;
  vrel: boolean = false;
  badd: boolean = false;
  bupd: boolean = false;
  bdel: boolean = false;
  disableb: boolean = false;
  disableh: boolean = false;
  //controls end

  checked: boolean = false;

  ngOnInit() {
    //console.log(this.auth.emp_branch);

    this.transfersService.getBranches().subscribe(d => {
      this.branchs = d;
    });

    this.refreshData();

    this.commonService.getValues('2828').subscribe(d => {
      this.hospitalTypes = d;
      //console.log(this.hospitalTypes)
    }
    );
    this.commonService.getValues('2829').subscribe(d => {
      this.hospitalStatuses = d;
      //console.log(this.hospitalStatuses)
    }
    );

    this.displayedColumns = ["relId", "brnchNm", "hsptlsNm", "hsptlsAddr",
      "hsptlsPh", "distance", "hsptlsSts", "action"];

    console.log("hospitals: " + this.hospitals);

    this.PnlHsptlForm = this.formBuilder.group({
      hsptlsId: [''],
      hsptlsNm: [''],
      hsptlsAddr: [''],
      hsptlsPh: [''],
      hsptlsTypSeq: [''],
      hsptlsStsSeq: [''],
      brnchSeq: [''],
      brnchNm: [''],
      distance: [''],
      remarks: ['']
    });
  }

  refreshData() {
    this.panelHospitalService.getHospitals().subscribe(h => { this.hospitals = h; }
    );

    this.panelHospitalService.getNBlacklistHospitals().subscribe(h => { this.nbhospitals = h; }
    );
  }

  get form() {
    return this.PnlHsptlForm.controls;
  }

  changeChecked(event) {
    this.checked = event.target.checked;
    if (this.checked) {
      this.PnlHsptlForm.reset();
      this.vhsptls = false;
    }
    else
      this.vhsptls = true;
    //console.log(this.checked);
  }
  changeChecked2() {
    if (this.checked) {
      this.PnlHsptlForm.reset();
      this.vhsptls = false;
    }
    else
      this.vhsptls = true;
    //console.log(this.checked);
  }

  CreateNew() {
    this.vhsptls = false;
    this.vhsptlform = true;
    this.vadd = false;
    this.vclose = true;
  }

  CancelNew() {
    this.vhsptls = true;
    this.disableh = false;
    this.vhsptlform = false;
    this.vadd = true;
    this.vclose = false;
  }
  clrValidators() {
    this.form.hsptlsId.clearValidators();
    this.form.hsptlsNm.clearValidators();
    this.form.hsptlsAddr.clearValidators();
    this.form.hsptlsPh.clearValidators();
    this.form.hsptlsTypSeq.clearValidators();
    this.form.hsptlsStsSeq.clearValidators();
    this.form.brnchSeq.clearValidators();
    this.form.brnchNm.clearValidators();
    this.form.distance.clearValidators();
    this.form.remarks.clearValidators();

    this.form.hsptlsId.updateValueAndValidity();
    this.form.hsptlsNm.updateValueAndValidity();
    this.form.hsptlsAddr.updateValueAndValidity();
    this.form.hsptlsPh.updateValueAndValidity();
    this.form.hsptlsTypSeq.updateValueAndValidity();
    this.form.hsptlsStsSeq.updateValueAndValidity();
    this.form.brnchSeq.updateValueAndValidity();
    this.form.brnchNm.updateValueAndValidity();
    this.form.distance.updateValueAndValidity();
    this.form.remarks.updateValueAndValidity();

  }

  refresh(): void {
    window.location.reload();
  }

  onSubmit() {
    let checkdis = false;
    // hsptl nm, addr, brnch, distance is mandatory, others are optional
    this.clrValidators();
    console.log(this.PnlHsptlForm)

    if (!this.vrel && this.vhsptlform && !this.vbrnchs) {
      //only hospital = add/ update
      if (this.checked) {
        //console.log("only hospital = add");
        this.isEdit = false;
        this.form.hsptlsNm.setValidators([Validators.required]);
        this.form.hsptlsAddr.setValidators([Validators.required]);
        this.form.hsptlsTypSeq.setValidators([Validators.required]);
        this.form.hsptlsStsSeq.setValidators([Validators.required]);

        this.form.hsptlsNm.updateValueAndValidity();
        this.form.hsptlsAddr.updateValueAndValidity();
        this.form.hsptlsTypSeq.updateValueAndValidity();
        this.form.hsptlsStsSeq.updateValueAndValidity();
      }
      else {
        //console.log("only hospital = update");
        this.isEdit = true;
        this.form.hsptlsId.setValidators([Validators.required]);
        this.form.hsptlsNm.setValidators([Validators.required]);
        this.form.hsptlsAddr.setValidators([Validators.required]);
        this.form.hsptlsTypSeq.setValidators([Validators.required]);
        this.form.hsptlsStsSeq.setValidators([Validators.required]);

        this.form.hsptlsId.updateValueAndValidity();
        this.form.hsptlsNm.updateValueAndValidity();
        this.form.hsptlsAddr.updateValueAndValidity();
        this.form.hsptlsTypSeq.updateValueAndValidity();
        this.form.hsptlsStsSeq.updateValueAndValidity();
      }
    }

    else if (this.vbrnchs && this.vhsptlform && this.vrel) {
      //console.log("brnch + new hospital");
      //brnch + new hospital

      this.form.brnchSeq.setValidators([Validators.required]);
      this.form.hsptlsNm.setValidators([Validators.required]);
      this.form.hsptlsAddr.setValidators([Validators.required]);
      this.form.hsptlsTypSeq.setValidators([Validators.required]);
      this.form.hsptlsStsSeq.setValidators([Validators.required]);
      this.form.distance.setValidators([Validators.required, Validators.pattern(/^(\d{1,4})?(\.\d{1,2})?$/)]);

      this.form.brnchSeq.updateValueAndValidity();
      this.form.hsptlsNm.updateValueAndValidity();
      this.form.hsptlsAddr.updateValueAndValidity();
      this.form.hsptlsTypSeq.updateValueAndValidity();
      this.form.hsptlsStsSeq.updateValueAndValidity();
      this.form.distance.updateValueAndValidity();
    }
    else {
      //brnch + existing hospital = add/ update
      if (this.isEdit) {
        console.log("brnch + existing hospital = update");
        this.form.distance.setValidators([Validators.required, Validators.pattern(/^(\d{1,4})?(\.\d{1,2})?$/)]);

        this.form.distance.updateValueAndValidity();
      }
      else {
        console.log("brnch + existing hospital = add");
        this.form.brnchSeq.setValidators([Validators.required])
        this.form.hsptlsId.setValidators([Validators.required])
        this.form.distance.setValidators([Validators.required, Validators.pattern(/^(\d{1,4})?(\.\d{1,2})?$/)]);
        //^(\d*\.)?\d+$ digits + one decimal
        //^\d{4}\.\d{2}$ 4 digits + decimal places
        //^\d{4}(\.\d{2})?$ optional decimal
        //^(\d{4})?(\.\d{2})?$ both optional
        //^(\d{1-4})?(\.\d{2})?$ both optional

        this.form.brnchSeq.updateValueAndValidity();
        this.form.hsptlsId.updateValueAndValidity();
        this.form.distance.updateValueAndValidity();
        //}
        //this.form.hsptlsAddr.clearValidators
      }

    }

    this.submitted = true;

    if (this.PnlHsptlForm.invalid) {
      console.log("invalid");
      return;
    }

    this.spinner.show();

    if (!this.isEdit) {
      //console.log("adding");
      if (this.checked && !this.vbrnchs) {
        this.panelHospitalService.addHospital(this.PnlHsptlForm.value).subscribe(res => {
          (<any>$('#AdvanceRules')).modal('hide');
          this.spinner.hide();

          if (res.saved != undefined) {
            this.toastr.success('Hospital Added Successfully', 'Success');
            this.getPnlHsptlLists();
            //this.panelHospitalList();
          }
          else {
            this.toastr.info('Hospital Already Exists', 'Information');
          }
        }, error => {
          this.toastr.error("Invalid Hospital record", "Error")
          this.spinner.hide();
        })
      }
      else {
        this.panelHospitalService.addPanelHospital(this.PnlHsptlForm.value).subscribe(res => {
          (<any>$('#AdvanceRules')).modal('hide');
          this.spinner.hide();

          if (res.saved != undefined) {
            this.toastr.success('Panel Hospital Added Successfully', 'Success');
            this.getPnlHsptlLists();
            //this.panelHospitalList();
          }
          else if (res.blacklist != undefined) {
            this.toastr.warning('Blacklisted Hospital added. Could not add to the panel', 'Information');
            this.getPnlHsptlLists();
            //this.panelHospitalList();
          }
          else {
            this.toastr.info('Panel Hospital Already Exists', 'Information');
          }
        }, error => {
          this.toastr.error("Invalid Panel Hospital record", "Error")
          this.spinner.hide();
        })
      }
    }

    else {
      //console.log("updating");
      this.panelHospitalService.updatePanelHospital(this.PnlHsptlForm.value).subscribe(res => {
        (<any>$('#AdvanceRules')).modal('hide');
        this.spinner.hide();

        if (res.update != undefined) {
          this.toastr.success('Panel Hospital Updated Successfully', 'Success');
          this.getPnlHsptlLists();
          //this.panelHospitalList();
        } else if (res.exists != undefined) {
          this.toastr.info('Panel Hospital Already Exists.', 'Information');
        } else {
          this.toastr.error('Panel Hospital Not Found', 'Error');
        }
        this.panelHospitalList();
      }, error => {
        this.toastr.error("Invalid Panel Hospital record", "Error")
        this.spinner.hide();
      })
    }

    this.refreshData();
    
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
    this.panelHospitalList();

    //this.refreshData();
  }

  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.spinner.show();
    this.panelHospitalService.getPanelHospitalList(this.paginator.pageIndex, this.paginator.pageSize,
      filterValue, this.isCount).subscribe(response => {
        this.panelHospitals = response.Hospitals;
        this.spinner.hide();
        if (this.panelHospitals.length <= 0) {
          this.toaster.info('No Data Found', 'Information')
        };

        this.datalength = 0;
        setTimeout(() => {
          this.datalength = response.count;
          this.dataSource = new MatTableDataSource(this.panelHospitals);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 200);
      }, error => {
        this.spinner.hide();
      });
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
      this.panelHospitalList();
      this.applyFilter(this.filterValue);
      return;
    }
  }

  showFields = false;

  showField() {
    this.showFields = true;
  }

  closeField() {
    this.showFields = false;
  }

  private getPnlHsptlLists() {
    this.isCount = true;
    this.spinner.show();
    this.panelHospitals = [];
    this.dataSource = new MatTableDataSource(this.panelHospitals);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = "";
    this.filterValue = "";

    this.panelHospitalService
      .getPanelHospitalList(this.paginator.pageIndex, 10, "", this.isCount)
      .subscribe(
        (response) => {
          console.log("Panel Hospital Data: ", response);

          this.spinner.hide();
          this.panelHospitals = response.Hospitals;
          this.dataSource = new MatTableDataSource(this.panelHospitals);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.datalength = 0;
          setTimeout(() => { this.datalength = response.count; }, 200);

          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  loadNextPage() {
    this.isCount = false;

    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.panelHospitalService.getPanelHospitalList(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount
      ).subscribe(response => {
        this.spinner.hide();
        this.panelHospitals = response.Hospitals;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(response.Hospitals);

        this.dataSource.data = this.dataSource.data.sort((a, b) =>{
          if(a.hsptlsSts.toLowerCase()  <  b.hsptlsSts.toLowerCase()){
              return - 1;
          }
          else if(a.hsptlsSts.toLowerCase()  >  b.hsptlsSts.toLowerCase()){
            return 1;
          }
          return 0;
      })

        response.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = response.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
      });
    }
  }

  onlyNumbers(event: any) {
    const pattern = /^\d*\,?\-?\d*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyDecimalNumbers(event: any) {
    const pattern = /^\d*\.?\d*$/;
    //const pattern = /^(\d{1,4})?(\.\d{2})?$/;
    //const pattern = /[0-9]*.?[0-9]*/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyAlpha(event: any) {
    const pattern = /[a-zA-Z, ]/i;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyAlphaNumeric(event: any) {
    const pattern = /[a-zA-Z, ,0-9]/i;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  panelHospitalList() {

    //this.refreshData();
    this.panelHospitalService.getPanelHospitalList(this.paginator.pageIndex, this.paginator.pageSize,
      this.filterValue, this.isCount
    ).subscribe(response => {
      //this.srNo++;
      console.log('Panel Hospitals:', response);

      this.spinner.hide();
      this.panelHospitals = response.Hospitals;
      if (response.Hospitals.length <= 0) {
        this.toaster.info("No Data Found", "Information");
      }

      this.datalength = 0;
      setTimeout(() => {
        this.datalength = response.count;
        this.dataSource = new MatTableDataSource(this.panelHospitals);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 200);

      this.dataBeforeFilter = response.Hospitals;
      this.countBeforeFilter = response.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
    });

  }

  branchName: string;
  hsptlName: string;
  hsptlTypName: number;
  hsptlStsName: number;
  hsptlObj: any;

  getBrnchNm(brnchSeq) {
    this.branchName = this.branchs.find(branch => branch.brnchSeq == brnchSeq).brnchNm;
    return this.branchName;
  }

  getHsptlNm(hsptlsId) {
    this.hsptlName = this.hospitals.find(hsptl => hsptl.id == hsptlsId).hsptlsNm;
    return this.hsptlName;
  }

  getHsptlInfo(hsptlsId) {
    this.hsptlObj = this.hospitals.find(hsptl => hsptl.id == hsptlsId);
    return this.hsptlObj;
  }

  getHsptlTypSeq(hsptlsTypNm) {
    this.hsptlTypName = this.hospitalTypes.find(hsptl => hsptl.codeValue.toLowerCase() == hsptlsTypNm.toLowerCase()).codeKey;
    return this.hsptlTypName;
  }

  getHsptlStsSeq(hsptlsStsNm) {
    this.hsptlStsName = this.hospitalStatuses.find(hsptl => hsptl.codeValue.toLowerCase() == hsptlsStsNm.toLowerCase()).codeKey;
    return this.hsptlStsName;
  }

  checkHsptlTyp(hsptlsTypNm) {
    if (this.hospitalTypes.find(hsptl => hsptl.codeValue.toLowerCase() == hsptlsTypNm.toLowerCase()) != null)
      return true;
    else
      return false;
  }
  checkHsptlSts(hsptlsStsNm) {
    if (this.hospitalStatuses.find(hsptl => hsptl.codeValue.toLowerCase() == hsptlsStsNm.toLowerCase()) != null)
      return true;
    else
      return false;
  }

  //Add Rel model
  addNewPanelHospital() {
    //controls
    this.vbrnchs = true;
    this.vhsptls = true;
    this.vadd = true;
    this.vhsptlform = false;
    this.vclose = false;
    this.vrel = true;
    this.badd = true;
    this.bupd = false;
    this.bdel = false;
    this.disableb = false;
    this.disableh = false;

    this.isEdit = false;
    this.refreshData();

    this.PnlHsptlForm.reset();
    this.clrValidators();
    (<any>$('#AdvanceRules')).modal('show');
    this.toaster.info("You're adding a new panel hospital.");
  }

  //Update Rel Model
  onEditPanelHospital(panelHospitalObj: PanelHospital) {
    //controls
    this.vbrnchs = false;
    this.vhsptls = false;
    this.vadd = false;
    this.vhsptlform = false;
    this.vclose = false;
    this.vrel = true;
    this.badd = false;
    this.bupd = true;
    this.bdel = false;
    this.disableb = true;
    this.disableh = true;

    //this.checked = false;
    this.isEdit = true;

    this.refreshData();

    this.PnlHsptlForm.reset();
    this.PnlHsptlForm = this.formBuilder.group({
      hsptlsId: [panelHospitalObj.hsptlsId],
      hsptlsNm: [panelHospitalObj.hsptlsNm],
      hsptlsAddr: [panelHospitalObj.hsptlsAddr],
      hsptlsPh: [panelHospitalObj.hsptlsPh],
      hsptlsTypSeq: [panelHospitalObj.hsptlsTypSeq],
      hsptlsStsSeq: [panelHospitalObj.hsptlsStsSeq],
      brnchSeq: [panelHospitalObj.brnchSeq],
      brnchNm: [panelHospitalObj.brnchNm],
      distance: [panelHospitalObj.distance],
      remarks: [panelHospitalObj.remarks]
    });
    this.clrValidators();
    (<any>$('#AdvanceRules')).modal('show');
  }

  openFile(event) {
    this.toaster.info("Uploading Data.");
    event.click();
  }

  inputClear(event) {
    event.target.value = null;
  }

  uploadLists: PanelHospital[] = [];
  data: any;
  uploadPnlHsptlList: PanelHospital = new PanelHospital();
  validateFlg = false;


  handle(event) {
    this.validateFlg = false;
    console.log('event', event, event.target.value.endsWith(".xlsx"))

    if (!(event.target.value.endsWith(".xlsx") || event.target.value.endsWith(".xls"))) {
      this.toastr.info('Please Choose Specific Format of Excel File ', 'Information');
      return;
    }

    this.uploadLists = [];

    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      this.toastr.info("You Can't Select More then One File", 'Information');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let withoutHeaderLists = this.data.slice(1);

      withoutHeaderLists.forEach((r: any[]) => {
        this.uploadPnlHsptlList = new PanelHospital();

        if (r.length > 0 && r.length < 12 && r !== undefined) {
          let dataRecognized = false;
          if (r[5] !== undefined && r[6] !== undefined && this.checkHsptlTyp(r[5]) && this.checkHsptlSts(r[6])) {
            dataRecognized = true;
          }
          if (dataRecognized == true) {
            this.uploadPnlHsptlList.brnchSeq = r[0];
            if (r[1] == undefined)
              this.uploadPnlHsptlList.hsptlsId = null;
            else
              this.uploadPnlHsptlList.hsptlsId = r[1];
            this.uploadPnlHsptlList.hsptlsNm = r[2];
            this.uploadPnlHsptlList.hsptlsAddr = r[3];
            this.uploadPnlHsptlList.hsptlsPh = r[4];
            this.uploadPnlHsptlList.hsptlsTypSeq = this.getHsptlTypSeq(r[5]);
            this.uploadPnlHsptlList.hsptlsStsSeq = this.getHsptlStsSeq(r[6]);
            this.uploadPnlHsptlList.distance = r[7];
            this.uploadLists.push(this.uploadPnlHsptlList);
          } else {
            this.toaster.info("Please select correct file.", "Information!");
          }
          this.uploadPnlHsptlList = null;
        }
      });

      console.log('Uploading Data:', this.uploadLists);

      if (this.uploadLists.length > 0) {
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
            this.panelHospitalService.uploadPanelHospital(this.uploadLists).subscribe(result => {
              console.log("FileUploaded:", result);

              this.spinner.hide();
              swal(
                'Upload File!',
                result.ListUpload,
                'success'
              )
              this.panelHospitalList();
            }, error => {
              this.spinner.hide();
              this.toastr.error("Something went wrong", "Error")
            });
          }
        })
      }
    };
    reader.readAsBinaryString(target.files[0]);
    reader.abort;
    this.spinner.hide();
  }

  onDeleteRel(relId) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this Record?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.panelHospitalService.deletePanelHospital(relId).subscribe(result => {
          swal(
            'Deleted!',
            'This hospital has been removed from the panel of this branch.',
            'success'
          )
          if (result.error != undefined) {
            this.toastr.info('Hospital not found.', 'Error');
          }
          this.getPnlHsptlLists();
        }, error => {
          this.toastr.error("Something went wrong", "Error");
          console.log('There was an error: ', error);
        });
      }
    })
  }

  deleteAllPanelHospitals() {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete all Records?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.panelHospitalService.deleteAllPanelHospitals().subscribe((result) => {
          this.spinner.hide();
          swal(
            'Deleted!',
            result.data,
            'success'
          )
          if (result.error != undefined) {
            this.toastr.info('Hospital not found.', 'Error');
          }
          this.getPnlHsptlLists();
        }, (error) => {
          this.spinner.hide();
          this.toastr.error("Something went wrong", "Error");
        }
        );
      }
    })
  }

  manageHospitalInfo() {

    if(this.vbrnchs || this.disableb)
    {this.checked = false;
    }
    //controls
    this.vbrnchs = false;
    this.vhsptls = true;
    this.vadd = false;
    this.vhsptlform = true;
    this.vclose = false;
    this.vrel = false;
    this.badd = false;
    this.bupd = true;
    this.bdel = true;
    this.disableb = false;
    this.disableh = false;

    //this.checked = false;
    this.isEdit = true;

    
    this.changeChecked2();
    this.refreshData();

    this.clrValidators();
    this.PnlHsptlForm.reset();
    (<any>$('#AdvanceRules')).modal('show');
  }

  //Done
  onChange() { //dropdown change
    //this.changeChecked2();
    if (this.isEdit) {
      this.changeChecked2();
      this.hsptlObj = this.getHsptlInfo(this.form.hsptlsId.value);
      if (this.hsptlObj != undefined || this.hsptlObj != null) {

        this.PnlHsptlForm = this.formBuilder.group({
          hsptlsId: [this.hsptlObj.id],
          hsptlsNm: [this.hsptlObj.hsptlsNm],
          hsptlsAddr: [this.hsptlObj.hsptlsAddr],
          hsptlsPh: [this.hsptlObj.hsptlsPh],
          hsptlsTypSeq: [this.hsptlObj.hsptlsTypSeq],
          hsptlsStsSeq: [this.hsptlObj.hsptlsStsSeq],
          brnchSeq: [''],
          brnchNm: [''],
          distance: [''],
          remarks: ['']
        });
      } else {
        this.PnlHsptlForm.reset();
        // this.PnlHsptlForm = this.formBuilder.group({
        //   hsptlsId: [''],
        //   hsptlsNm: [''],
        //   hsptlsAddr: [''],
        //   hsptlsPh: [''],
        //   hsptlsTypSeq: [''],
        //   hsptlsStsSeq: [''],
        //   brnchSeq: [''],
        //   brnchNm: [''],
        //   distance: [''],
        //   remarks: ['']
        // });
      }
    }
  }

  deleteHospital() {
    if (this.checked || this.form.hsptlsId.value == null) {
      this.toastr.error("Choose a valid hospital first.", "Error");
    }
    else {
      swal({
        title: 'Are you sure?',
        text: "Are you sure you want to delete this Hospital? It will delete all corresponding records.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.panelHospitalService.deleteHospital(this.form.hsptlsId.value).subscribe(result => {
            (<any>$('#AdvanceRules')).modal('hide');
            swal(
              'Deleted!',
              'This hospital has been removed.',
              'success'
            )
            this.getPnlHsptlLists();
          }, error => {
            this.toastr.error("Not a valid Hospital.", "Error");
            console.log('There was an error: ', error)
          });
        }
      })
    }
  }
}