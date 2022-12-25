import { HolidaysExcemptionService } from './../../../shared/services/holidays-exemption.service';
import { error } from '@angular/compiler/src/util';
import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { merge } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { Toast, ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { holidaysExemption } from 'src/app/shared/models/holidaysExcemption.model';

const moment = _moment;

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
  selector: 'app-holidays-exemption',
  templateUrl: './holidays-exemption.component.html',
  styleUrls: ['./holidays-exemption.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HolidaysExemptionComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  
  auth;
  branchs: Branch[];
  branchForm: FormGroup;

  allRegions: any[];
  allAreas: any;
  allBranches: any;
  disabledRegion: boolean = false;
  disabledArea: boolean = false;
  disabledBranch: boolean = false;

  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;

  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  showFields = false;
  isEdit: Boolean = false;
  maxDate: Date;
  minDate: Date;


  holidayForm: FormGroup;
  holidayCtgryList = [];
  holidayTypList = [];
  holidaysRecordsLists: any[];
  invalidLists: any[];

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
   // this.getFilteredData(filterValue.trim().toLowerCase())
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

  showField() {
    this.showFields = true;
  }

  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private dataService: DataService,
    private holidaysExcemptionService: HolidaysExcemptionService) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit() {
    this.displayedColumns = ['refCdHolidayCtgrySeq','refCdHolidayTypSeq', 'holidayFrom', 'holidayTo','aprvdFlg', 'remarks', 'action'];

    this.resetForm();

    this.commonService.getValues(REF_CD_GRP_KEYS.HOLIDAYS_CATEGORY).subscribe((res) => {
      this.holidayCtgryList = res.sort(function(a, b) {
        return a.codeValue.localeCompare(b.codeValue);
        });
        this.holidayCtgryList.unshift({'codeKey': -1, 'codeValue': 'Select'});
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.HOLIDAYS_TYPE).subscribe((res) => {
      this.holidayTypList = res.sort(function(a, b) {
        return a.codeValue.localeCompare(b.codeValue);
        });
        this.holidayTypList.unshift({'codeKey': -1, 'codeValue': 'Select'});
    }, (error) => {
      console.log('err', error);
    });

    this.fetchDetail();
  }

  resetForm(){
    this.holidayForm = this.formBuilder.group({
      refCdHolidayCtgrySeq: ['', Validators.required],
      refCdHolidayTypSeq: ['', Validators.required],
      holidayFrom: ['', Validators.required],
      holidayTo: ['', Validators.required],
      mndtryFlg: [false, Validators.required],
      calcPpalFlg: [false, Validators.required],
      calcScFlg: [false, Validators.required],
      calcPrmiumFlg: [false, Validators.required],
      aprvdFlg: [false],
      remarks: ['']
    });
  }

  onHolidaysFormSubmit(){
    let holidayFrom = new DatePipe('en-US').transform(this.holidayForm.controls['holidayFrom'].value, 'dd-MM-yyyy')
    let holidayTo = new DatePipe('en-US').transform(this.holidayForm.controls['holidayTo'].value, 'dd-MM-yyyy')

    if(this.holidayForm.controls['refCdHolidayCtgrySeq'].value == -1){
      this.toaster.info('Please select vehicle makers ', 'Information');
      return;
    }
    if(this.holidayForm.controls['refCdHolidayTypSeq'].value == -1){
      this.toaster.info('Please select vehicle color ', 'Information');
      return;
    }
    
    this.holidayForm.controls['holidayFrom'].setValue( holidayFrom );
    this.holidayForm.controls['holidayTo'].setValue( holidayTo );
    this.holidayForm.controls['aprvdFlg'].setValue( false );
    this.spinner.show();
    if(this.isEdit){
      this.holidaysExcemptionService.updateHolidaysExemptionForm(this.holidayForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#holidayModel')).modal('hide');
        if(respose['success']){
          this.toaster.success(respose['success'], 'Success');
       //   this.getFilteredData(this.filterValue);
        }else if(respose['error']){
          this.toaster.warning(respose['error'], 'Warning');
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }else{
      this.holidaysExcemptionService.addHolidaysExemptionForm(this.holidayForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#holidayModel')).modal('hide');
        if(respose['success']){
          this.toaster.success(respose['success'], 'Success');
       //   this.getFilteredData(this.filterValue);
        }else if(respose['error']){
          this.toaster.warning(respose['error'], 'Warning');
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }
  }

  addNewRecord() {
   this.resetForm();
    this.isEdit = false;
    (<any>$('#holidayModel')).modal('show');
  }

  fetchDetail() {

    this.isCount = true;
    this.holidaysRecordsLists = [];
    this.dataSource = new MatTableDataSource(this.holidaysRecordsLists);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;
    this.spinner.show()
      this.holidaysExcemptionService.getAllLists(this.paginator.pageIndex, 10, this.filterValue, this.isCount).subscribe(data => {
      this.holidaysRecordsLists = data.lists;
      this.spinner.hide();

      if (this.holidaysRecordsLists.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };
      
    
      this.dataSource = new MatTableDataSource(this.holidaysRecordsLists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = 0;
      setTimeout(() => { this.datalength = data.count; }, 10);
   
      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log('err', error);
    });
  }

  findValueByKeyHolidayCtgry(key) {
    let status = '';
    if (this.holidayCtgryList) {
      this.holidayCtgryList.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  findValueByKeyHolidayTyp(key) {
    let status = '';
    if (this.holidayTypList) {
      this.holidayTypList.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }
  uploadLists: holidaysExemption[] = [];
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
        let holiday = new holidaysExemption();
        
        console.log('list',r)

        if ((r.length > 0 && r.length == 9 && r !== undefined) && isFileValid) {

          for(let i = 0; i < r.length; i++){
              if(r[i] === undefined || r[i] === null){
                isFileValid = false;
                this.toaster.warning('Invalid Record at Line No. ' + (index + 2));
                return;
              }
          }

          console.log('list after', index);

          if(!this.findValueByKeyHolidayCtgry(r[0])){
              isFileValid = false;
              this.toaster.warning('Invalid Holidays Category Line No. ' + (index + 2));
              return;
          }
          
          if(!this.findValueByKeyHolidayTyp(r[1])){
              isFileValid = false;
              this.toaster.warning('Invalid Holidays Type at Line No. ' + (index + 2));
              return;
          }

          holiday.holidaySeq = index + 2;
          holiday.refCdHolidayCtgrySeq = r[0];
          holiday.refCdHolidayTypSeq = r[1];
          holiday.holidayFrom = new DatePipe('en-US').transform(new Date(r[2]), 'dd-MM-yyyy');
          holiday.holidayTo = new DatePipe('en-US').transform(new Date(r[3]), 'dd-MM-yyyy');
          holiday.mndtryFlg = r[4];
          holiday.calcPpalFlg = r[5];
          holiday.calcScFlg = r[6];
          holiday.calcPrmiumFlg = r[7];
          holiday.aprvdFlg = r[8];

          this.uploadLists.push(holiday);
          
          holiday = null;
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
            this.holidaysExcemptionService.uploadHolidays(this.uploadLists).subscribe(d => {
             
              console.log('response', d[0]['warning']);

              this.spinner.hide();
              if( d[0]['warning']){
                this.invalidLists =  d;
                (<any>$('#invalidRecords')).modal('show');
              }else if(d[0]['success']){
                this.toaster.success('Records Saved Successfully');
              }else{
                this.toaster.error('Something went wrong');
              }
            },error=>{
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
