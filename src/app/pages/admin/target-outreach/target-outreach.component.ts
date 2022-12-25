import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatPaginator, MatSort, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Auth } from 'src/app/shared/models/Auth.model';
import { Branch } from 'src/app/shared/models/branch.model';
import { Product } from 'src/app/shared/models/Product.model';
import { Region } from 'src/app/shared/models/region.model';
import { BranchTarget, RegionWiseOutreach } from 'src/app/shared/models/target-outreach.model';
import { TargetOutreachService } from 'src/app/shared/services/target-outreach.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import swal from 'sweetalert2';
import { ProductService } from 'src/app/shared/services/product.service';
const moment = _moment;

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
  selector: 'app-target-outreach',
  templateUrl: './target-outreach.component.html',
  styleUrls: ['./target-outreach.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TargetOutreachComponent implements OnInit {

  auth: Auth = JSON.parse(sessionStorage.getItem("auth"))
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
  ischecked: boolean;

  targetForm: FormGroup;
  outreachForm: FormGroup;
  ngForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  date: FormControl = new FormControl(moment().endOf('month'));
  type: number;
  selectedYear = -1;

  typesArr = [];
  branches: Branch[] = [];
  products: Product[] = [];
  regions: Region[] = [];

  branchTarget: BranchTarget[] = [];
  regionWiseOutreach: RegionWiseOutreach[] = [];

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private targetOutreachService: TargetOutreachService,
    private transfersService: TransfersService,
    private productService: ProductService) {

    this.minDate = new Date(new Date().setMonth(new Date().getMonth() - 11));
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth()));

    this.ngForm = this.fb.group({
      type: [0, Validators.required], // 1 for Target, 2 for Outreach
      date: [new FormControl(moment()), Validators.required]
    });

  }

  ngOnInit() {

    this.targetForm = this.fb.group({
      brnchTargetsSeq: [''],
      trgtYr: [''],
      trgtPerd: [''],
      brnchSeq: [''],
      brnchNm: [''],
      prdSeq: [''],
      prdNm: [''],
      trgtClients: [''],
      trgtAmt: ['']
    });

    this.outreachForm = this.fb.group({
      outreachMonth: [''],
      regionCd: [''],
      regNm: [''],
      opening: [''],
      targets: [''],
      maturingLoans: [''],
      closing: ['']
    });

    this.typesArr = [{ title: "Target", type: 1 }, { title: "Outreach", type: 2 }];

    this.transfersService.getRegions().subscribe(data => {
      this.regions = data;
    });
    this.transfersService.getBranches().subscribe(d => {
      this.branches = d;
    });
    this.productService.getAllProductGroups().subscribe(data => {
      this.products = data;
    });

  }

  onTypeChange() {
    this.displayedColumns = null;
  }

  branchSelected: boolean = true;

  onBranchSelected(event) {
    this.branchSelected = false;
    console.log(event.value);
    // this.transfersService.getAllPrdsByBrnchSeq(event.value).subscribe(data => {
    //   this.products = data;
    // });
  }

  currDt: Date;
  canAdd: boolean = true;

  generateData() {
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'MMM-yyyy').toUpperCase();

    this.currDt = new Date();

    if ((Number(new DatePipe('en-US').transform(this.date.value, 'yyyy')) < this.currDt.getFullYear())
      || (Number(new DatePipe('en-US').transform(this.date.value, 'MM')) < this.currDt.getMonth() + 1)) {
      this.canAdd = false;
    }
    else {
      this.canAdd = true;
    }

    const trgtYr = new DatePipe('en-US').transform(this.date.value, 'yyyy');
    const trgtPerd = new DatePipe('en-US').transform(this.date.value, 'yyyyMM');

    if (this.ngForm.value.type == 1) { //Target
      this.displayedColumns = ["trgtYr", "trgtPerd", "brnchNm",
        "prdNm", "trgtClients", "trgtAmt", "action"];
      this.branchTargetList();
    }
    else if (this.ngForm.value.type == 2) { //Outreach
      this.displayedColumns = ["regNm", "outreachMonth", "opening",
        "targets", "maturingLoans", "closing", "action"];
      this.regionWiseOutreachList();
    }
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

    if (normalizedYear.year() <= this.maxDate.getFullYear()) {
      const ctrlValue = this.date.value;
      ctrlValue.year(normalizedYear.year());
      this.date.setValue(ctrlValue);
      this.selectedYear = normalizedYear.year();
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    if ((normalizedMonth.year() < this.maxDate.getFullYear()) && this.selectedYear != -1) {
      const ctrlValue = this.date.value;
      ctrlValue.month(normalizedMonth.month());
      ctrlValue.year(normalizedMonth.year());
      this.date.setValue(ctrlValue);
      datepicker.close();
    } else if ((normalizedMonth.year() == this.maxDate.getFullYear()) && this.selectedYear != -1) {
      if (normalizedMonth.month() <= this.maxDate.getMonth()) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        ctrlValue.year(normalizedMonth.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
      }
    }
  }

  branchTargetList() {
    this.isCount = true;
    this.spinner.show();
    this.dataSource = new MatTableDataSource(this.branchTarget);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (monthDt != null && monthDt != "") {
      this.targetOutreachService.getBrnchTrgt(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount, monthDt
      ).subscribe(response => {
        this.spinner.hide();
        this.branchTarget = response.BrnchTrgt;
        if (response.BrnchTrgt.length <= 0) {
          this.toaster.info("No Data Found", "Information");
        }

        this.datalength = 0;
        setTimeout(() => {
          this.datalength = response.count;
          this.dataSource = new MatTableDataSource(this.branchTarget);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 200);

        this.dataBeforeFilter = response.BrnchTrgt;
        this.countBeforeFilter = response.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.toaster.info("Please Select a Month");
    }
  }

  regionWiseOutreachList() {
    this.isCount = true;
    this.spinner.show();
    this.dataSource = new MatTableDataSource(this.regionWiseOutreach);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (monthDt != null && monthDt != "") {
      this.targetOutreachService.getRegionWiseOutreach(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount, monthDt
      ).subscribe(response => {
        this.spinner.hide();
        this.regionWiseOutreach = response.Outreach;
        if (response.Outreach.length <= 0) {
          this.toaster.info("No Data Found", "Information");
        }

        this.datalength = 0;
        setTimeout(() => {
          this.datalength = response.count;
          this.dataSource = new MatTableDataSource(this.regionWiseOutreach);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 200);

        this.dataBeforeFilter = response.Outreach;
        this.countBeforeFilter = response.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.toaster.info("Please Select a Month");
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
    if (this.filterValue.length == 0 && this.ngForm.value.type == 1) {
      this.branchTargetList();
      return;
    }
    else if (this.filterValue.length == 0 && this.ngForm.value.type == 2) {
      this.regionWiseOutreachList();
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

  loadNextPage() {
    this.isCount = false;
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (this.paginator.pageIndex < this.lastPageIndex)
      return;
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();

      if (this.ngForm.value.type == 1) {
        this.targetOutreachService.getBrnchTrgt(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, monthDt
        ).subscribe(response => {
          this.spinner.hide();
          this.branchTarget = response.BrnchTrgt;
          this.lastPageIndex = this.lastPageIndex + 1;
          this.dataSource.data = this.dataSource.data.concat(response.BrnchTrgt);
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
      else if (this.ngForm.value.type == 2) {
        this.targetOutreachService.getRegionWiseOutreach(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, monthDt
        ).subscribe(response => {
          this.spinner.hide();
          this.regionWiseOutreach = response.Outreach;
          this.lastPageIndex = this.lastPageIndex + 1;
          this.dataSource.data = this.dataSource.data.concat(response.Outreach);
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
  }

  getFilteredData(filterValue: string) {
    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();
    if (monthDt != null && monthDt != "") {
      this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      if (this.ngForm.value.type == 1) {
        this.targetOutreachService.getBrnchTrgt(this.paginator.pageIndex, this.paginator.pageSize,
          filterValue, this.isCount, monthDt).subscribe(response => {
            this.branchTarget = response.BrnchTrgt;
            this.spinner.hide();
            if (this.branchTarget.length <= 0) {
              this.toaster.info('No Data Found', 'Information')
            };

            this.datalength = 0;
            setTimeout(() => {
              this.datalength = response.count;
              this.dataSource = new MatTableDataSource(this.branchTarget);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }, 200);
          }, error => {
            this.spinner.hide();
          });
      }
      else if (this.ngForm.value.type == 2) {
        this.targetOutreachService.getRegionWiseOutreach(this.paginator.pageIndex, this.paginator.pageSize,
          filterValue, this.isCount, monthDt).subscribe(response => {
            this.regionWiseOutreach = response.Outreach;
            this.spinner.hide();
            if (this.regionWiseOutreach.length <= 0) {
              this.toaster.info('No Data Found', 'Information')
            };

            this.datalength = 0;
            setTimeout(() => {
              this.datalength = response.count;
              this.dataSource = new MatTableDataSource(this.regionWiseOutreach);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }, 200);
          }, error => {
            this.spinner.hide();
          });
      }
    } else {
      this.toaster.info("Please Select a Month.");
    }
  }

  onBrnchTrgtEdit: Boolean;
  onOutreachEdit: Boolean;

  addBranchTarget() {

    this.onBrnchTrgtEdit = false;
    this.targetForm.reset();

    Object.keys(this.targetForm.controls).forEach((key) => {
      const control = this.targetForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    this.branchSelected = true;

    (<any>$('#addBranchTarget')).modal('show');
  }

  editBranchTarget(trgt) {
    this.onBrnchTrgtEdit = true;

    this.branchSelected = false;

    this.targetForm.reset();

    Object.keys(this.targetForm.controls).forEach((key) => {
      const control = this.targetForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    this.targetForm = this.fb.group({
      brnchTargetsSeq: [trgt.brnchTargetsSeq],
      trgtYr: [trgt.trgtYr],
      trgtPerd: [trgt.trgtPerd],
      brnchSeq: [trgt.brnchSeq],
      brnchNm: [trgt.brnchNm],
      prdSeq: [trgt.prdSeq],
      prdNm: [trgt.prdNm],
      trgtClients: [trgt.trgtClients],
      trgtAmt: [trgt.trgtAmt]
    });

    (<any>$('#addBranchTarget')).modal('show');
  }

  invalid: Boolean = false;

  onBranchTargetFormSubmit(trgt) {

    const trgtYr = new DatePipe('en-US').transform(this.date.value, 'yyyy');
    const trgtPerd = new DatePipe('en-US').transform(this.date.value, 'yyyyMM');

    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.targetForm.reset();

    if (this.onBrnchTrgtEdit == true) {
      this.targetForm = this.fb.group({
        brnchTargetsSeq: [trgt.brnchTargetsSeq],
        trgtYr: [Number(trgtYr)],
        trgtPerd: [Number(trgtPerd)],
        brnchSeq: [trgt.brnchSeq],
        brnchNm: [trgt.brnchNm],
        prdSeq: [trgt.prdSeq],
        prdNm: [trgt.prdNm],
        trgtClients: [trgt.trgtClients],
        trgtAmt: [trgt.trgtAmt]
      });
      this.targetOutreachService.updateBrnchTrgt(this.targetForm.value).subscribe((data) => {

        this.toaster.success('Branch Target updated');
        this.branchTargetList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.targetForm = this.fb.group({
        brnchTargetsSeq: [''],
        trgtYr: [Number(trgtYr)],
        trgtPerd: [Number(trgtPerd)],
        brnchSeq: [trgt.brnchSeq],
        brnchNm: [trgt.brnchNm],
        prdSeq: [trgt.prdSeq],
        prdNm: [trgt.prdNm],
        trgtClients: [trgt.trgtClients],
        trgtAmt: [trgt.trgtAmt]
      });
      this.targetOutreachService.addBrnchTrgt(this.targetForm.value).subscribe((data) => {
        this.toaster.success('New Branch Target added');
        this.branchTargetList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    (<any>$('#addBranchTarget')).modal('hide');
    this.targetForm.reset();
  }

  deleteBranchTarget(trgt) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Branch Target?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.targetOutreachService.deleteBrnchTrgt(trgt.brnchTargetsSeq).subscribe((res) => {

          this.spinner.hide();
          swal(
            'Deleted!',
            'Branch Target has been deleted.',
            'success'
          );
          this.branchTargetList();
        }, error => {
          this.spinner.hide();
          swal(
            'Deleted!',
            error.error['error'],
            'error'
          );
          console.log('There was an error: ', error.error['error']);
        });
      }
    });
  }

  addOutreach() {

    this.onOutreachEdit = false;
    this.outreachForm.reset();

    Object.keys(this.outreachForm.controls).forEach((key) => {
      const control = this.outreachForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    (<any>$('#addOutreach')).modal('show');
  }

  editOutreach(outreach) {
    this.onOutreachEdit = true;

    this.outreachForm.reset();

    Object.keys(this.outreachForm.controls).forEach((key) => {
      const control = this.outreachForm.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });

    this.outreachForm = this.fb.group({
      outreachMonth: [outreach.outreachMonth],
      regionCd: [outreach.regionCd],
      regNm: [outreach.regNm],
      opening: [outreach.opening],
      targets: [outreach.targets],
      maturingLoans: [outreach.maturingLoans],
      closing: [outreach.closing]
    });

    (<any>$('#addOutreach')).modal('show');
  }

  onOutreachFormSubmit(outreach) {

    const monthDt = new DatePipe('en-US').transform(this.date.value.endOf('month'), 'dd-MMM-yyyy').toUpperCase();

    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.outreachForm.reset();
    this.outreachForm = this.fb.group({
      outreachMonth: [monthDt],
      regionCd: [outreach.regionCd],
      regNm: [outreach.regNm],
      opening: [outreach.opening],
      targets: [outreach.targets],
      maturingLoans: [outreach.maturingLoans],
      closing: [outreach.closing]
    });
    if (this.onOutreachEdit == true) {
      this.targetOutreachService.updateRegionWiseOutreach(this.outreachForm.value).subscribe((data) => {
        this.toaster.success('Outreach updated');
        this.regionWiseOutreachList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.targetOutreachService.addRegionWiseOutreach(this.outreachForm.value).subscribe((data) => {
        this.toaster.success('New Outreach added');
        this.regionWiseOutreachList();
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    (<any>$('#addOutreach')).modal('hide');
    this.outreachForm.reset();
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}