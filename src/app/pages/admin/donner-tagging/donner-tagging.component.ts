import { DataService } from 'src/app/shared/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService } from 'src/app/shared/services/common.service';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { DonorTaggingService } from 'src/app/shared/services/donor-tagging.service';
import { DatePipe } from '@angular/common';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/services/product.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { DonerTag } from 'src/app/shared/models/doner-tag.model';

export interface DonnorTagging {
  clntName: string;
  clntId: string;
  disbDt: Date;
  amt: number;
  branch: string;
  dist: string;
  activity: string;
  sector: string;
  loan_cycl_num: number;
  loanAppSeq: number;
  count: number;
}

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
  selector: 'app-donner-tagging',
  templateUrl: './donner-tagging.component.html',
  styleUrls: ['./donner-tagging.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DonnerTaggingComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['select', 'clntId', 'clntName', 'disbDt', 'prd_nm', 'amt', 'branch', 'dist', 'activity', 'sector', 'loan_cycl_num'];


  arr: any[] = [];


  funderData: any;
  branchData: any;
  activityData: any;
  sectorData: any;
  totalClients: any = "0";
  totalAmont = "0";
  fundsAmt = "0";
  clients = "0";
  productGroups: any;
  products: any[] = [];
  filterProducts: any[] = [];
  filterActy: any[] = [];
  distBrnch: any[] = [];
  filterBrnch: any[] = [];

  uploadLists: any;

  districtListings: any;
  taggingButton: boolean = false;



  filterForm: FormGroup;
  filterData: any;
  filterDonnorData: any;
  dataSource: any;
  totalTagging = [];

  // multiselection
  selection = new SelectionModel<DonnorTagging>(true, []);

  uploader: any[] = [];
  invalidLists: any[] = [];
  uploaderData: any;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private toaster: ToastrService, 
    private commonService: CommonService, private donorTaggingService: DonorTaggingService, 
    private transfersService: TransfersService, private productService: ProductService,
    private dataService: DataService) { }

  ngOnInit() {
    
    this.filterForm = this.fb.group({
      funder: ['', Validators.required],
      fundAmt: ['', Validators.required],
      frmAmt: [''],
      toAmt: [''],
      branchs: [[]],
      frmDt: [''],
      toDt: [''],
      districts: [[]],
      sectors: [[]],
      activities: [[]],
      prds: [[]],
      prd_grps: [[]],
      cycle: [''],
      loanAppSeq: [''],
      clntSeq: ['']
    });


    this.transfersService.getBranches().subscribe(d => {
      this.branchData = d;
      let index = this.branchData.indexOf(this.branchData.find( br => br.brnchSeq == -1));
      this.branchData.splice(index, 1);
    });

    //All Products Group
    this.productService.getAllProductGroups().subscribe(data => {
      this.productGroups = data;
      let index = this.productGroups.indexOf(this.productGroups.find( grp => grp.prdGrpSeq == -1));
      this.productGroups.splice(index, 1);
    });

    //All Products by Group Sequence
    this.transfersService.getAllProducts().subscribe(data => {
      this.products = data;
      let index = this.products.indexOf(this.products.find( prd => prd.prdSeq == -1));
      this.products.splice(index, 1);
    });

    //Sector Data
    this.transfersService.getAllSectorsForDonnorTagging().subscribe((res) => {
      this.sectorData = res;
      let index = this.sectorData.indexOf(this.sectorData.find( sctr => sctr.bizSectSeq == -1));
      this.sectorData.splice(index, 1);
    }, (error) => {
      console.log('err', error);
    })

    //Activity Data
    this.transfersService.getAllActivitiesForDonnorTagging().subscribe((res) => {
      this.activityData = res;
      let index = this.activityData.indexOf(this.activityData.find( acty => acty.bizActySeq == -1));
      this.activityData.splice(index, 1);
    }, (error) => {
      console.log('err', error);
    })

    //BRANCH Data
    // this.donorTaggingService.getBranch(4).subscribe((res) => {
    //   this.branchData = res;
    // }, (error) => {
    //   console.log('err', error);
    // })

    //funder Data
    this.commonService.getValues(REF_CD_GRP_KEYS.FUNDED_BY).subscribe((res) => {
      this.funderData = res;
    }, (error) => {
      console.log('err', error);
    })

    //funder Data
    this.dataService.getAllDistrict().subscribe((res) => {
      this.districtListings = res;
    }, (error) => {
      console.log('err', error);
    });

  this.commonService.getDistBrnch().subscribe((res) => {
      this.distBrnch = res;
    }, (error) => {
      console.log('err', error);
    });

  }

  
  // CR-Donor Tagging
  // filter based on parent dropdown
  // Added By Naveed - 20-12-2021
  onSelectionChangeProducts(event) {
    let grpArray =  event.map(grp => grp.prdGrpSeq);
    if(event.length > 0){
      this.filterProducts = this.products.filter(prd => grpArray.includes(prd.prdGrpSeq))
    }else{
      this.filterProducts = []
      this.filterForm.controls["prds"].reset();
    }
  }

  onSelectionChangeSector(event) {
    let sectorArray =  event.map(sctr => sctr.bizSectSeq);
    if(event.length > 0){
      this.filterActy = this.activityData.filter(acty => sectorArray.includes(acty.bizSectSeq))
    }else{
      this.filterActy = []
      this.filterForm.controls["activities"].reset();
    }
  }

  onSelectionChangeDistrict(event) {
    let distArray =  event.map(dist => dist.distSeq);
    if(event.length > 0){
      this.filterBrnch = this.distBrnch.filter(br => distArray.includes(br.distSeq))
    }else{
      this.filterBrnch = []
      this.filterForm.controls["branchs"].reset();
    }
  }
  // Ended By Naveed - 20-12-2021

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get filterFormsControl() {
    return this.filterForm.controls;
  }

  onSubmitFilters() {
    // this.selection.clear();
    this.arr = [];
    if (this.filterForm.invalid) {
      this.filterForm.controls['funder'].markAsTouched();
      this.filterForm.controls['fundAmt'].markAsTouched();
      // this.filterForm.controls['branchs'].markAsTouched();
      this.toaster.error("Please Fill Missing Fields  ", "Error ");
      return;
    } else {
      this.spinner.show();
      this.arr = [];
      let d = this.filterForm.value;
      d.frmDt = new DatePipe('en-US').transform(this.filterForm.get('frmDt').value, 'dd-MM-yyyy');
      d.toDt = new DatePipe('en-US').transform(this.filterForm.get('toDt').value, 'dd-MM-yyyy')
      d.uploader = false;

      console.log(d)
      this.donorTaggingService.postFiltersDonorTagging(d).subscribe(res => {
        this.totalAmont = res.approvedAmt;
        this.fundsAmt = res.fundsAmt;
        this.clients = res.clients;
        this.taggingButton = true;
        this.spinner.hide();
        // if (res.length == 0) {
        //   this.spinner.hide();
        //   this.taggingButton = false;
        //   this.toaster.info("No Data Found", "Information");
        //   return;
        // } else {
        //   this.spinner.hide();
        //   for (let i = 0; i < res.length; i++) {
        //     let item = res[i];
        //     Object.assign(item, { count: i });
        //   }
        //   this.filterDonnorData = res;
        //   this.filterData = this.filterDonnorData;

        //   // Sorting Data in Ascending Order
        //   this.filterData.sort((a, b) => parseFloat(b.amt) - parseFloat(a.amt));

        //   // Comparing Value of amount 
        //   let total = 0;
        //   this.totalTagging = [];
        //   for (let i = 0; i < this.filterData.length; i++) {

        //     if (this.filterForm.controls['fundAmt'].value < this.filterData[i].amt) {
        //       this.toaster.error('The Funder Amount is less than Client Amount', 'Error')

        //       // DataSource of Table
        //       this.dataSource = new MatTableDataSource<DonnorTagging>(this.totalTagging);
        //       setTimeout(() => this.dataSource.paginator = this.paginator);
        //       // this.dataSource.paginator = this.paginator;
        //       this.dataSource.sort = this.sort;


        //       this.totalClients = "0";
        //       this.totalAmont = "0";
        //       this.totalAmountForTagging = 0;

        //       this.taggingButton = false;

        //       return;
        //     }

        //     if ((total + this.filterData[i].amt) <= this.filterForm.controls['fundAmt'].value) {
        //       total = total + this.filterData[i].amt;
        //       let totalTaggingFromData = this.filterData[i];
        //       this.totalTagging.push(totalTaggingFromData)
        //     } else {
        //       break;
        //     }
        //   }

        //   // Total Total Amount
        //   this.totalAmont = '' + total;

        //   // Total Number Of Clients
        //   this.totalClients = this.totalTagging.length;

        //   // DataSource of Table
        //   this.dataSource = new MatTableDataSource<DonnorTagging>(this.totalTagging);
        //   // this.dataSource.paginator = this.paginator;
        //   setTimeout(() => this.dataSource.paginator = this.paginator);
        //   this.dataSource.sort = this.sort;

        //   this.taggingButton = true;

        // }
        // this.arr = [];
      }, (error) => {
        if (error.status == 500) {
          this.spinner.hide();
          this.toaster.error(error.error.title, "Error");
        } else if (error) {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
  }

  clientsTagged = 0;
  totalAmountForTagging = 0;
  totalAvailableAmountForTagging = 0;
  onClickTagging() {

    if (this.filterForm.invalid) {
      this.filterForm.controls['funder'].markAsTouched();
      this.filterForm.controls['fundAmt'].markAsTouched();
      // this.filterForm.controls['branchs'].markAsTouched();
      this.toaster.error("Please Fill Missing Fields  ", "Error ");
      return;
    } else {
      this.spinner.show();
      this.arr = [];
      let d = this.filterForm.value;
      d.frmDt = new DatePipe('en-US').transform(this.filterForm.get('frmDt').value, 'dd-MM-yyyy');
      d.toDt = new DatePipe('en-US').transform(this.filterForm.get('toDt').value, 'dd-MM-yyyy')
      d.uploader = true;
    
      this.donorTaggingService.postFiltersDonorTagging(d).subscribe(res => {
        this.spinner.hide();
        this.toaster.success(res.sucess, "Success");
        (<any>$('#taggingModel')).modal('show');
        this.taggingButton = false;
        this.filterForm.reset();
      }, error =>{
        if (error.status == 400) {
          this.spinner.hide();
          this.toaster.error("Bad Request", "Error");
        } else if (error.status == 500) {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
   

    // this.arr = [];
    // this.totalAmountForTagging = 0;
    // console.log(this.selection.selected);
    // this.selection.selected.forEach(s => {
    //   this.arr.push(s.loanAppSeq);
    //   this.totalAmountForTagging += s.amt;
    // });
    // this.totalAvailableAmountForTagging = this.filterForm.controls['fundAmt'].value;
    // console.log(this.arr);

    // if (this.arr.length == 0) {
    //   this.toaster.warning("Please Select Clients To Tag", "Warning")
    // } else {
    //   let obj = {
    //     loanAppSeq: this.arr,
    //     fundAmt: this.filterForm.controls['fundAmt'].value,
    //     dnrSeq: this.filterForm.controls['funder'].value,
    //   };

    //   this.spinner.show();
    //   this.donorTaggingService.taggingClients(obj).subscribe(data => {
        // this.spinner.hide();
        // this.clientsTagged = this.arr.length;
        // this.toaster.success(data.sucess, "Success");
        // (<any>$('#taggingModel')).modal('show');
        // this.taggingButton = false;
        // this.filterForm.reset();
    //     console.log(data);
    //     this.arr = [];
    //   }, (error) => {
    //     console.log(error)
        // if (error.status == 400) {
        //   this.spinner.hide();
        //   this.toaster.error("Bad Request", "Error");
        // } else if (error.status == 500) {
        //   this.spinner.hide();
        //   this.toaster.error("Something Went Wrong", "Error")
        // }
    //   });
    // }
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DonnorTagging): string {
    this.totalAmountForTagging = 0;
    // setTimeout(() => {
    for (let i = 0; i < this.selection.selected.length; i++) {
      this.totalAmountForTagging += this.selection.selected[i].amt;
    }
    // }, 0)
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.count + 1}`;
  }

  // CR-Donor Tagging
  // tagged client uploader
  // Added By Naveed - 20-12-2021
  openFile(event) {
    event.click();
  }

  inputClear(event) {
    event.target.value = null;
  }
  
  handle(event) {
    const target: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();    
    let donner = this.funderData.map(m => m.codeKey);
    console.log('donner list ', donner);

    if (!(
        event.target.value.endsWith(".xlsx") ||
        event.target.value.endsWith(".xls"))) {
      this.toaster.info("Please Choose Specific Format of Excel File ","Information");
      return;
    }

    if (target.files.length !== 1) {
      this.toaster.info("You Can't Select More then One File", "Information");
      return;
    }

    this.spinner.show();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.uploaderData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let withoutHeaderLists = this.uploaderData.slice(1);
      this.uploader = [];
      let validateFlag = true;

     for(let i = 0; i <  withoutHeaderLists.length ; i++){
       let r = withoutHeaderLists[i];
      if (r.length > 0 && r !== undefined) {

        if (r[0] === undefined || r[0] == null) {
          this.toaster.warning("please provide valid Loan Application Sequence","Warning");
          validateFlag =  false;
          return;
        }

        if (r[1] === undefined || r[1] == null || !donner.includes(r[1])) {
          this.toaster.warning("please provide valid Donor Sequence Against this Loan ID " + r[0], "Warning");
          validateFlag = false;
          return;
        }
        this.uploader.push({'loanAppSeq': +r[0], 'dnrSeq': r[1]})
      }
     }
      this.spinner.hide();
      console.log('uploader', this.uploader)
      if (validateFlag && this.uploader.length > 0) {
        swal({
          title: "Are you sure?",
          text: "Are you sure you want to upload FIle?",
          type: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Upload it!",
        }).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.donorTaggingService.tagClientUploader(this.uploader).subscribe(result => {
              console.log('result ', result)
              this.spinner.hide();
              if(result.invalid.length > 0){
                (<any>$('#invalidLoans')).modal('show');
                this.invalidLists =  result.invalid;
             //   this.toaster.warning("Invalid Loan ID / Loan Donor List Already Updated " + result.invalid.toString(), "Warning");
              }else{
                swal('Upload File!','File Uploaded Successfully!','success')
              }
            }, error => {this.spinner.hide();  console.log('There was an error: ', error)});
          }
        });
      }
    };
    reader.readAsBinaryString(target.files[0]);
    this.spinner.hide();
  }
// Ended By Naveed - 20-12-2021
}
