import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatPaginator, MatSort, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Auth } from 'src/app/shared/models/Auth.model';
import { HrTrvlngExpense } from 'src/app/shared/models/hr-trvlng-expense.model';
import { HrTrvlngExpenseService } from 'src/app/shared/services/hr-trvlng-expense.service';
import swal from 'sweetalert2';
const moment = _moment;
import { Moment } from 'moment';
import { saveAs } from 'file-saver';

// Authored by Areeba
// Dated 23-6-2022
// HR Travelling Calculation

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },   
};

@Component({
  selector: 'app-hr-trvlng-expense',
  templateUrl: './hr-trvlng-expense.component.html',
  styleUrls: ['./hr-trvlng-expense.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class HrTrvlngExpenseComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  iaRights: boolean;
  
  constructor(private router: Router,
    private hrTrvlngExpenseService: HrTrvlngExpenseService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder) { 

    this.minDate = new Date(new Date().setMonth(new Date().getMonth() - 11));
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth()));
    
    this.ngForm = this.fb.group({
      date: [new FormControl(moment()), Validators.required]
      });
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  displayedColumns: any;

  hrTrvlngExpense: HrTrvlngExpense[] = [];

  dataSource: any;
  datalength: number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  disablePrc: boolean = true;
  disableExport: boolean = true;

  date: FormControl = new FormControl(moment().subtract(1, 'months').endOf('month'));
  selectedYear = -1;

  ngOnInit() {
    this.displayedColumns = ["regNm", "areaNm", "brnchNm",  
    "portNm", "hrid", "disbClnts", "disbAmt", "trvlngRol", "fieldTyp", "incntve" ];
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }
    
  chosenYearHandler(normalizedYear: Moment) {

    if(normalizedYear.year() <= this.maxDate.getFullYear()){
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.selectedYear =  normalizedYear.year();
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    if((normalizedMonth.year() < this.maxDate.getFullYear()) && this.selectedYear != -1){
            const ctrlValue = this.date.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.date.setValue(ctrlValue);
            datepicker.close();
    }else if((normalizedMonth.year() == this.maxDate.getFullYear()) && this.selectedYear != -1){
        if(normalizedMonth.month() <= this.maxDate.getMonth()){
            const ctrlValue = this.date.value;
            ctrlValue.month(normalizedMonth.month());
            ctrlValue.year(normalizedMonth.year());
            this.date.setValue(ctrlValue);
            datepicker.close();
        }
    }
    this.disableExport = false;
    this.trvlngDtlList();
  }
  
  loadNextPage() {
    this.isCount = false;
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();

    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();

        this.hrTrvlngExpenseService.getTravellingDtlList(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, monthDt
        ).subscribe(response => {
        this.spinner.hide();
        this.hrTrvlngExpense = response.TrvlngDtl;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(response.TrvlngDtl);
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

  getFilteredData(filterValue: string) {
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (monthDt != null && monthDt != "") {
      this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      this.hrTrvlngExpenseService.getTravellingDtlList(this.paginator.pageIndex, this.paginator.pageSize,
        filterValue, this.isCount, monthDt).subscribe(response => {
          this.hrTrvlngExpense = response.TrvlngDtl;
          this.spinner.hide();
          if (this.hrTrvlngExpense.length <= 0) {
            this.toaster.info('No Data Found', 'Information')
          };
 
          this.datalength = 0;
          setTimeout(() => {
            this.datalength = response.count;
            this.dataSource = new MatTableDataSource(this.hrTrvlngExpense);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);
        }, error => {
          this.spinner.hide();
        });
    } else {
      this.toaster.info("Please Select a Month.");
    }
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
      this.trvlngDtlList();
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

  onDateChange(event) {
    this.trvlngDtlList();
  }

  currDt: Date;

  trvlngDtlList() {
    this.isCount = true;
    this.spinner.show();
    //this.hrTrvlngExpense = [];
     this.dataSource = new MatTableDataSource(this.hrTrvlngExpense);
     this.paginator.pageIndex = 0;
     this.lastPageIndex = 0;
     this.dataSource.paginator = this.paginator;
     this.searchVal = '';
     this.filterValue = '';

    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (monthDt != null && monthDt != "") {
      this.hrTrvlngExpenseService.getTravellingDtlList(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount, monthDt
      ).subscribe(response => {
        this.spinner.hide();
          this.hrTrvlngExpense = response.TrvlngDtl;

          this.currDt = new Date();
          if ((Number(new DatePipe('en-US').transform(this.date.value, 'yyyy')) < this.currDt.getFullYear())
            || (Number(new DatePipe('en-US').transform(this.date.value, 'MM')) < this.currDt.getMonth() + 1)){
            this.disablePrc = true;
          }
          else{
            this.disablePrc = false;
          }

          if (response.TrvlngDtl.length <= 0){
            this.toaster.info("No Data Found", "Information");
          }
          
          this.datalength = 0;
          setTimeout(() => {
          this.datalength = response.count; 
            this.dataSource = new MatTableDataSource(this.hrTrvlngExpense);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);

          this.dataBeforeFilter = response.TrvlngDtl;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.toaster.info("Please Select a Month");
    }
  } 

  callPrcTrvlngCalc() {
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MM-yyyy').toUpperCase();
    const month = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'MMMM-yyyy').toUpperCase();
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to generate Travelling Calculation for " + month + "?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, execute!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.hrTrvlngExpenseService.callPrcTrvlngCalc(monthDt).subscribe(
          (response) => {
            this.trvlngDtlList();
            this.spinner.hide();

             if (response.Response == 'SUCCESS') {
              swal({
                title: 'Execution Completed',
                text: response.Response,
                type: 'success',
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false
              });
             } 
             else{
            swal({
                  title: 'Execution Error',
                  text: response.Response,
                  type: 'error',
                  showCloseButton: true,
                  showCancelButton: false,
                  showConfirmButton: false
                });
              }
          },
          (error) => {
            this.spinner.hide();
            this.toastr.error("Something went wrong", "Error")
          });
      }
    });
  }

  exportTrvlngDtls(){

    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy');

    this.spinner.show();
    this.hrTrvlngExpenseService.printExportTrvlngDtls(monthDt).subscribe((response) => {
      this.spinner.hide();
      
      let fileName = 'HR_Travelling_Details_' + monthDt;
  
        this.downloadFile(response, fileName);
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
   }

   exportHarmony(){
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy');

    this.spinner.show();
    this.hrTrvlngExpenseService.printExportTrvlngHarmony(monthDt).subscribe((response) => {
      this.spinner.hide();
      
      let fileName = 'HR_Travelling_Harmony_' + monthDt;
  
        this.downloadFile(response, fileName);
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
   }

   async downloadFile(data: any, fileName) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);
    window.URL.revokeObjectURL(url);

    saveAs(blob, fileName + ".csv");

    swal({
      title: 'File: ' + fileName,
      text: 'Check your download folder',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    })
    .then((result) => {
      if (result.value) {
      }
    });
  }
  // End

}
