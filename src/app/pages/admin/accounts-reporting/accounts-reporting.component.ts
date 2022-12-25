import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { interval, merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ProcessTime } from 'src/app/shared/models/process-time.model';
import { AccountsReportingService } from 'src/app/shared/services/accounts-reporting.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import swal from 'sweetalert2';

// Authored by Areeba
// Dated 17-3-2022
// Monthly Accounts Reporting

@Component({
  selector: 'app-accounts-reporting',
  templateUrl: './accounts-reporting.component.html',
  styleUrls: ['./accounts-reporting.component.css']
})
export class AccountsReportingComponent implements OnInit {
  
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  private updateSubscription: Subscription;
  processTime: ProcessTime[];

  constructor(
    private router: Router,
    private accountsReportingService: AccountsReportingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private transfersService: TransfersService,
    private commonService: CommonService,
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  datalength: number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  ngOnInit() {
    this.updateSubscription = interval(300000).subscribe( 
      (val) => { 
        //this.refresh()
        this.processesList();
      });

    this.displayedColumns = ["srNo", "process", "dtTime", "remarks"];
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
    this.processesList();

  }

  loadNextPage() {
    this.isCount = false;

    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();

      this.accountsReportingService.getProcesses(this.paginator.pageIndex, this.paginator.pageSize,
        this.isCount
      ).subscribe(response => {

        this.spinner.hide();
        this.processTime = response.Processes;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(response.Processes);
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

  refresh(): void {
    window.location.reload();
  }

  processesList() {

    this.accountsReportingService.getProcesses(this.paginator.pageIndex, this.paginator.pageSize,
      this.isCount
    ).subscribe(response => {
      console.log('Processes:', response);

      this.spinner.hide();
      this.processTime = response.Processes;
      if (response.Processes.length <= 0) {
        this.toaster.info("No Data Found", "Information");
      }

      this.datalength = 0;
      setTimeout(() => {
        this.datalength = response.count;
        this.dataSource = new MatTableDataSource(this.processTime);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 200);

      this.dataBeforeFilter = response.Processes;
      this.countBeforeFilter = response.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
    });
  }

  callPrcMonProcesses() {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to execute Monthly Accounts Processes?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, execute!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.accountsReportingService.callPrcMonProcesses().subscribe(
          (response) => {
            this.processesList();
            this.spinner.hide();

            if (response.Response == 'SUCCESS') {
              this.toaster.success("Successfully Executed");
            } 
            else if (response.Response == 'ERROR') {
              this.toaster.warning("An error was encountered", "Warning");
            }
            else {
              //this.toastr.info(response.Response);
              swal({
                title: 'Error',
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
}
