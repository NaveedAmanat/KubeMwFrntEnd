import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { merge } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ClientTagList } from 'src/app/shared/models/client-tag-list.model';
import { ClientTagListService } from 'src/app/shared/services/client-tag-list.service';
import swal from 'sweetalert2';

// Added by Areeba - Dated 1-2-2022 - Client Tag List
@Component({
  selector: 'app-client-tag-list',
  templateUrl: './client-tag-list.component.html',
  styleUrls: ['./client-tag-list.component.css']
})
export class ClientTagListComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  iaRights: boolean;
  
  constructor(
    private router: Router,
    private clientTagListService: ClientTagListService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private datePipe: DatePipe
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  tagTypes: any;
  tagTypeSelected: any;
  clientTagList: ClientTagList[] = [];
  now: any; date: any;

  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;
  submitted = false;

  ngOnInit() {

    // "clntTagListSeq",
    this.displayedColumns = ["cnicNum", "loanAppSeq", "effStartDt",  
    "tagFromDt", "tagToDt", "rmks", "lastUpdBy", "lastUpdDt", "action" ];

    this.tagTypes = [{ id: 1, value: "Tagged Clients" }, { id: 2, value: "Untagged Clients" }];
    //this.btnSancDisable = true;
    this.tagTypeSelected = 0;
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }

  getFilteredData(filterValue: string) {
    if (this.tagTypeSelected > 0) {
      this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      this.clientTagListService.getTaggedClntList(this.paginator.pageIndex, this.paginator.pageSize,
        filterValue, this.isCount, this.tagTypeSelected == 1 ? "TAG" : "UNTAG").subscribe(response => {
          this.clientTagList = response.TaggedClnts;
          this.spinner.hide();
          if (this.clientTagList.length <= 0) {
            this.toaster.info('No Data Found', 'Information')
          };
 
          this.datalength = 0;
          setTimeout(() => {
            this.datalength = response.count;
            this.dataSource = new MatTableDataSource(this.clientTagList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);
        }, error => {
          this.spinner.hide();
        });
    } else {
      this.toaster.info("Please Select Tag Type.");
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
      this.taggedClntList();
      //this.applyFilter(this.filterValue);
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

  tagTypeChange(val) {
    if (val == 1) {
      // Used in DataTable
      //this.inValidEntries = false;
      this.tagTypeSelected = val;
      this.taggedClntList();
    }
    // Sanction List
    else if (val == 2) {
      // Used in DataTable
      //this.inValidEntries = false;
      this.tagTypeSelected = val;
      this.taggedClntList();
    }
  }

  loadNextPage() {
    this.isCount = false;

    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();

      //if (this.inValidEntries == false) {
        this.clientTagListService.getTaggedClntList(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, this.tagTypeSelected == 1 ? "TAG" : "UNTAG"
        ).subscribe(response => {

          this.spinner.hide();
          this.clientTagList = response.TaggedClnts;
          this.lastPageIndex = this.lastPageIndex + 1;
          this.dataSource.data = this.dataSource.data.concat(response.TaggedClnts);
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

  changeClntTag(parmVal, tagVal) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to Tag/UnTag Client?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Tag/UnTag Client!'
    }).then((result) => {
      console.log(parmVal);
      console.log(tagVal);
      console.log(result);
      if (result.value) {
        this.spinner.show();
        
        this.clientTagListService.changeClntTag(tagVal, parmVal.clntTagListSeq).subscribe(
          (response) => {
            this.taggedClntList();
            this.spinner.hide();

            if (response.Response == 'SUCCESS') {
              this.toaster.success("Successfully Marked");
            } else {
              this.toastr.warning("No Data Found", "Warning")
            }
          },
          (error) => {
            this.spinner.hide();
            this.toastr.error("Something went wrong", "Error")
          });
      }
    });
  }

  taggedClntList() {
    if (this.tagTypeSelected > 0) {
      this.clientTagListService.getTaggedClntList(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount, this.tagTypeSelected == 1 ? "TAG" : "UNTAG"
      ).subscribe(response => {

        console.log('Tagged Client:', response);

        this.spinner.hide();
          this.clientTagList = response.TaggedClnts;
          if (response.TaggedClnts.length <= 0){
            this.toaster.info("No Data Found", "Information");
          }
          
          this.datalength = 0;
          setTimeout(() => { this.datalength = response.count; 
            this.dataSource = new MatTableDataSource(this.clientTagList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);

          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.toaster.info("Please Select Tag Type");
    }
  }

  // Added by Zohaib Asim - Dated 16-02-2022
  exportClntList(){
    if (this.tagTypeSelected > 0) {
      this.spinner.show();

      this.clientTagListService.exportClientList( this.tagTypeSelected == 1 ? "TAG" : "UNTAG" ).
        subscribe((response) => {
          this.spinner.hide();
          var binaryData = [];
          binaryData.push(response);
          let fileURL = ""
          fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.ms-excel" }));
          window.open(fileURL, '_blank');
        }, (error) => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
    } else {
      this.toaster.info("Please Select Tag Type");
    }
  }
  // End

}
// Ended by Areeba
