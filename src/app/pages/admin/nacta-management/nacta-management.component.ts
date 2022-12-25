import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, ViewChild } from "@angular/core";
import swal from "sweetalert2";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
//import { NactaManagemnt } from "src/app/shared/models/Nacta-Management.model";
import { NactaManagemntService } from "src/app/shared/services/Nacta-Management.service";
import { SanctionList } from 'src/app/shared/models/sanction-list.model';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { Auth } from 'src/app/shared/models/Auth.model';

@Component({
  selector: "app-nacta-management",
  templateUrl: "./nacta-management.component.html",
  styleUrls: ["./nacta-management.component.css"],
})
export class NactaManagementComponent implements OnInit {
  //nactaLists: NactaManagemnt[] = [];
  //nactaList: NactaManagemnt = new NactaManagemnt();

  // Added by Areeba - Dated 27-1-2022 - IA access
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  iaRights: boolean;
  // End by Areeba

  NactaListForm: FormGroup;
  fields = [];

  constructor(
    private router: Router,
    private nactaListService: NactaManagemntService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private datePipe: DatePipe
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  // Added by Zohaib Asim - Dated 19-07-2021 - CR: Sanction List
  fileTypes: any;
  btnSancDisable: boolean;
  fileTypeSelected: any;
  sancList: SanctionList[] = [];
  inValidEntries: boolean = false;
  fiveYearsBeforeDt: any;
  now: any; date: any;
  sancListTypes: any[];
  // End by Zohaib Asim

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
      this.getNactaLists();
      return;
    }
  }

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

  ngOnInit(): void {
    // Added by Areeba - Dated 27-1-2022 - IA access
    if (this.auth.role == "ia") {
      this.iaRights = false;
    }
    else {
      this.iaRights = true;
    }
    // Ended by Areeba

    //this.displayedColumns = ["nactaListSeq", "cnicNum", "clntNm", "fthrNm", "dist", "prvnc", "action"];
    this.displayedColumns = ["sancSeq", "cnicNum", "clntNm", "fatherNm", "dstrct", "prvnce",
      "cntry", "dob", "sancType", "action"];

    // Added by Zohaib Asim - Dated 19-07-2021 CR: Sanction List
    this.fileTypes = [{ id: 1, value: "Nacta List" }, { id: 2, value: "Sanction List" }];
    this.btnSancDisable = true;
    this.fileTypeSelected = 0;

    // this.now = new Date();
    // this.now.setDate((this.now.getDate() + 1));
    // let month: any;
    // if ((this.now.getMonth() + 1) < 10) {
    //   month = '0' + (this.now.getMonth());
    // } else {
    //   month = '' + (this.now.getMonth());
    // }
    // let day: any;
    // if ((this.now.getDate() + 1) < 10) {
    //   day = '0' + (this.now.getDate());
    // } else {
    //   day = '' + (this.now.getDate());
    // }
    // const year: any = this.now.getFullYear();
    // this.fiveYearsBeforeDt = new Date((year - 5), month, (+day-1));
    // End by Zohaib Asim

    this.NactaListForm = this.formBuilder.group({
      sancSeq: [''],
      cnicNum: ['', [Validators.minLength(13), Validators.maxLength(13)]],
      frstNm: [''],
      lastNm: [''],
      fatherNm: [''],
      dstrct: [''],
      prvnce: [''],
      cntry: [''],
      sancType: [''],
      dob: [''],
      procesdRecFlg: [''],
      tagClntFlg: ['']
    });
  }

  onSubmit() {
    // Commented by Zohaib Asim - Dated 04-08-2021 - CR: Sanction List
    // No field should be mandatory, all fields should be optional
    if (this.form.cnicNum.value == null || this.form.cnicNum.value == '') {
      this.form.cnicNum.clearValidators();

      this.form.frstNm.setValidators([Validators.required])
      this.form.lastNm.setValidators([Validators.required])
      /*this.form.fatherNm.setValidators([Validators.required])
      this.form.dstrct.setValidators([Validators.required])
      this.form.prvnce.setValidators([Validators.required])*/
      this.form.cntry.setValidators([Validators.required])
      // this.form.dob.setValidators([Validators.required]);
      this.form.sancType.setValidators([Validators.required]);

      this.form.frstNm.updateValueAndValidity();
      this.form.lastNm.updateValueAndValidity();
      /*this.form.fatherNm.updateValueAndValidity();
      this.form.dstrct.updateValueAndValidity();
      this.form.prvnce.updateValueAndValidity();*/
      this.form.cntry.updateValueAndValidity();
      // this.form.dob.updateValueAndValidity();
      this.form.sancType.updateValueAndValidity();
    } else {
      this.form.frstNm.clearValidators();
      this.form.lastNm.clearValidators();
      this.form.fatherNm.clearValidators();
      this.form.dstrct.clearValidators();
      this.form.prvnce.clearValidators();

      this.form.cnicNum.setValidators([Validators.minLength(13), Validators.maxLength(13)]);
      this.form.cntry.setValidators([Validators.required]);
      this.form.sancType.setValidators([Validators.required]);

      this.form.cnicNum.updateValueAndValidity();
      this.form.frstNm.updateValueAndValidity();
      this.form.lastNm.updateValueAndValidity();
      this.form.fatherNm.updateValueAndValidity();
      this.form.dstrct.updateValueAndValidity();
      this.form.prvnce.updateValueAndValidity();
      this.form.cntry.updateValueAndValidity();
      this.form.sancType.updateValueAndValidity();
    }

    this.submitted = true;
    if (this.NactaListForm.invalid) {
      return;
    }
    // if(this.form.cnicNum.value == null|| this.form.cnicNum.value == '' ){

    //   if((this.form.clntNm.value == null || this.form.clntNm.value == '') 
    //   || (this.form.fthrNm.value == null || this.form.fthrNm.value == '') ){
    //     this.toastr.warning('Nacta client Cnic or Client Name and Father Name Required', 'Warning');
    //     return;
    //   }
    // }


    this.spinner.show();

    if (!this.isEdit) {
      //  this.NactaListForm.patchValue({ "sancType": this.fileTypeSelected });
      this.nactaListService.addNacta(this.NactaListForm.value).subscribe(res => {
        (<any>$('#AdvanceRules')).modal('hide');
        this.spinner.hide();

        if (res.saved != undefined) {
          this.toastr.success('Nacta/Sanction Client Added Successfully', 'Success');
          this.getNactaLists();
        } else {
          this.toastr.info('Nacta/Sanction client Already Exists against Provided Cnic', 'Information');
        }
      }, error => {
        this.toastr.error("Invalid Nacta/Sanction record", "Error")
        this.spinner.hide();
      })
    } else {
      this.nactaListService.updateNacta(this.NactaListForm.value).subscribe(res => {
        (<any>$('#AdvanceRules')).modal('hide');
        this.spinner.hide();

        if (res.update != undefined) {
          this.toastr.success('Nacta/Sanction Client Updated Successfully', 'Success');
          this.getNactaLists();
        } else if (res.exits != undefined) {
          this.toastr.info('Nacta/Sanction client Already Exists against Provided Cnic', 'Information');
        } else {
          this.toastr.error('Nacta/Sanction Client Not Found', 'Error');
        }

        this.getNactaLists();
      }, error => {
        this.toastr.error("Invalid nacta record", "Error")
        this.spinner.hide();
      })
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

  addNewNacta() {
    if (this.fileTypeSelected > 0) {
      this.isEdit = false;
      this.NactaListForm.reset();
      (<any>$('#AdvanceRules')).modal('show');
    } else {
      this.toaster.info("Please Select File Type.");
    }
  }
  isEdit = false;
  onEditNacta(sancListObj: SanctionList) {
    this.isEdit = true;
    this.NactaListForm.reset();
    this.NactaListForm = this.formBuilder.group({
      sancSeq: [sancListObj.sancSeq],
      cnicNum: [sancListObj.cnicNum, [Validators.minLength(13), Validators.maxLength(13)]],
      frstNm: [sancListObj.frstNm],
      lastNm: [sancListObj.lastNm],
      fatherNm: [sancListObj.fatherNm],
      dstrct: [sancListObj.dstrct],
      prvnce: [sancListObj.prvnce],
      cntry: [sancListObj.cntry],
      dob: [sancListObj.dob],
      procesdRecFlg: [sancListObj.procesdRecFlg],
      tagClntFlg: [sancListObj.tagClntFlg],
      sancType: [sancListObj.sancType.replace('S-', '')],
    });
    (<any>$('#AdvanceRules')).modal('show');
  }

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  private getNactaLists() {
    this.isCount = true;
    this.spinner.show();
    this.sancList = [];
    this.dataSource = new MatTableDataSource(this.sancList);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = "";
    this.filterValue = "";

    this.nactaListService
      .getNactaList(this.paginator.pageIndex, 10, "", this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction")
      .subscribe(
        (response) => {
          console.log("Nacta List Data: ", response);

          this.spinner.hide();
          this.sancList = response.SancList;
          this.dataSource = new MatTableDataSource(this.sancList);
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

      if (this.inValidEntries == false) {
        this.nactaListService.getNactaList(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction"
        ).subscribe(response => {

          this.spinner.hide();
          this.sancList = response.SancList;
          this.lastPageIndex = this.lastPageIndex + 1;
          this.dataSource.data = this.dataSource.data.concat(response.SancList);
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
      } else {
        this.nactaListService.getInValidList(this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValue, this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction"
        ).subscribe(response => {

          this.spinner.hide();
          this.sancList = response.InValidData;
          this.lastPageIndex = this.lastPageIndex + 1;
          this.dataSource.data = this.dataSource.data.concat(response.InValidData);
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

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  // File Type condition added
  getFilteredData(filterValue: string) {
    if (this.fileTypeSelected > 0) {
      this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      this.nactaListService.getNactaList(this.paginator.pageIndex, this.paginator.pageSize,
        filterValue, this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction").subscribe(response => {
          this.sancList = response.SancList;
          this.spinner.hide();
          if (this.sancList.length <= 0) {
            this.toaster.info('No Data Found Against This Search', 'Information')
          };

          this.datalength = 0;
          setTimeout(() => {
            this.datalength = response.count;
            this.dataSource = new MatTableDataSource(this.sancList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 200);
        }, error => {
          this.spinner.hide();
        });
    } else {
      this.toaster.info("Please Select File Type.");
    }
  }


  onDeleteNacta(passedId) {
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
        this.nactaListService.deleteNacta(passedId).subscribe(result => {
          swal(
            'Deleted!',
            'Nacta/Sanction Record has been deleted.',
            'success'
          )
          this.getNactaLists();
        }, error => console.log('There was an error: ', error));
      }
    })
  }

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  updateRepository() {
    if (this.fileTypeSelected > 0) {
      this.spinner.show();
      this.nactaListService.updateRepository().subscribe(res => {
        this.spinner.hide();
        console.log(res);
        if (res.update != undefined) {
          this.toastr.success('Nacta Client Updated Successfully', 'Success');
          this.getNactaLists();
        } else {
          this.toastr.error('Could Not Update Nacta Repository', 'Error');
        }
      }, error => {
        console.log('error', error);
        this.spinner.hide();
        this.toastr.error("Something went wrong", "Error")
      })
    } else {
      this.toaster.info("Please Select File Type");
    }
  }

  // Rewrote by Zohaib Asim - Dated 28-07-2021 - CR: Sanction List
  exportInValidReport() {
    if (this.fileTypeSelected > 0) {
      this.spinner.show();

      this.nactaListService.exportInValidList(this.fileTypeSelected == 1 ? "Nacta" : "Sanction").
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
      this.toaster.info("Please Select File Type");
    }
  }

  // Added by Zohaib Asim - Dated 28-07-2021 - CR: Sanction List
  exportMtchngClntReport() {
    if (this.fileTypeSelected > 0) {
      this.spinner.show();

      this.nactaListService.exportMatchingClients(this.fileTypeSelected == 1 ? "Nacta" : "Sanction").
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
      this.toaster.info("Please Select File Type");
    }
  }

  findMatchingClients() {
    if (this.fileTypeSelected > 0) {
      this.spinner.show();

      this.nactaListService.findMatchingClients(this.fileTypeSelected == 1 ? "Nacta" : "Sanction").subscribe((response) => {
        console.log("Matched Clients: ", response);
        this.spinner.hide();
        if (response.MatchedClients.length > 0) {
          // this.sancList = response.MatchedClients;
          // this.dataSource = new MatTableDataSource(this.sancList);
          this.getNactaLists();
          this.toaster.success("Match Found against " + response.MatchedClients.length + " records.");
        } else {
          this.toaster.info("No Data Found", "Information!");
        }



      }, (error) => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong", "Error");
        // if (error.status == 500) {

        // } else if (error) {
        //   this.toaster.error("Something Went Wrong", "Error")
        // }
      });
    } else {
      this.toaster.info("Please Select File Type");
    }
  }

  get form() {
    return this.NactaListForm.controls;
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
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

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  // Condition added
  openFile(event) {
    if (this.fileTypeSelected > 0) {
      event.click();
    } else {
      this.toaster.info("Please Select File Type.");
    }
  }

  inputClear(event) {
    event.target.value = null;
  }
  //uploadLists: NactaManagemnt[] = [];
  uploadLists: SanctionList[] = [];
  data: any;
  //uploadNacta: NactaManagemnt = new NactaManagemnt();
  uploadSancList: SanctionList = new SanctionList();

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
    // this.spinner.show();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let withoutHeaderLists = this.data.slice(1);

      withoutHeaderLists.forEach((r: any[]) => {
        //this.uploadNacta = new NactaManagemnt();
        this.uploadSancList = new SanctionList();

        if (r.length > 0 && r.length < 12 && r !== undefined) {
          // if (r[0] === undefined) {
          //   if (
          //     (r[1] === undefined) || (r[2] === undefined) ||
          //     (r[3] === undefined) || (r[4] === undefined)) {
          //     this.toastr.warning('Nacta client Cnic or Other Detail Required', 'Warning');
          //     this.validateFlg = true;
          //     return;
          //   }
          // }
          // if (r[0] !== undefined) {
          //   if (!(r[0].toString().length === 13)) {
          //     this.toastr.warning("Please Provide Valid Cnic of '" + r[0] + "'", 'Warning');
          //     this.validateFlg = true;
          //     return;
          //   }
          // }

          let dataRecognized = false;
          if (this.fileTypeSelected == 1 && r[10] !== undefined && r[10] == 'Nacta') {
            dataRecognized = true;
          } else if (this.fileTypeSelected == 2 && r[10] !== undefined && r[10] != 'Nacta') {
            // (r[10] == 'UK' || r[10] == 'US' || r[10] == 'EU' || r[10] == 'UN' || r[10] == 'FR')
            dataRecognized = true;
          }

          // Data should be from mentioned files
          if (dataRecognized == true) {
            this.uploadSancList.nationalId = r[0];
            this.uploadSancList.cnicNum = r[1];
            this.uploadSancList.frstNm = r[2];
            this.uploadSancList.lastNm = r[3];
            this.uploadSancList.fatherNm = r[4];
            this.uploadSancList.cntry = r[5];
            this.uploadSancList.prvnce = r[6];
            this.uploadSancList.dstrct = r[7];

            if (r[8] !== undefined) {
              //console.log('r[8]:', r[8]);
              let ldob = r[8];
              //console.log('ldob: ', ldob);
              let splittedDate = r[8] + ''.split('/');
              //console.log('splittedDate: ', splittedDate);

              if (splittedDate.length == 4) {
                ldob = '01/01/' + r[8] + '';
                this.uploadSancList.dobFrmt = 'Y';
                //console.log("4: ", ldob);
              } else if (splittedDate.length == 7) {
                ldob = '01/' + r[8] + '';
                this.uploadSancList.dobFrmt = 'MY';
                //console.log("7: ", ldob);
              } else {
                ldob = r[8] + '';
                this.uploadSancList.dobFrmt = 'DMY';
              }
              //
              this.uploadSancList.dob = this.datePipe.transform(ldob, "yyyy-MM-dd");
            } else {
              this.uploadSancList.dob = null;
              this.uploadSancList.dobFrmt = null;
            }
            this.uploadSancList.refNo = r[9];
            this.uploadSancList.sancType = r[10];
            this.uploadLists.push(this.uploadSancList);
          } else {
            this.toaster.info("Please select correct file.", "Information!");
          }
          this.uploadSancList = null;
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
            this.nactaListService.uploadNacta(this.uploadLists).subscribe(result => {
              console.log("FileUploaded:", result);

              this.spinner.hide();
              swal(
                'Upload File!',
                result.ListUpload,
                'success'
              )
              this.getNactaLists();
            }, error => {
              this.spinner.hide();
              this.toastr.error("Something went wrong", "Error")
              console.log('There was an error: ', error)
            });
          }
        })
      }
    };
    reader.readAsBinaryString(target.files[0]);
    reader.abort;
    this.spinner.hide();
  }

  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  // Added by Zohaib Asim - Dated 19-07-2021 - CR: Sanction List
  fileTypeChange(val) {
    // Nacta List
    if (val == 1) {
      //this.btnNactaDisable = true;
      this.btnSancDisable = false;
      this.sancListTypes = [{id: "Nacta", value:"Nacta"}];
      // Used in DataTable
      this.inValidEntries = false;
      this.fileTypeSelected = val;
      this.NactaListForm.patchValue({ "sancType": val });
      this.getNactaLists();
    }
    // Sanction List
    else if (val == 2) {
      //this.btnNactaDisable = false;
      this.btnSancDisable = true;

      // Added by Zohaib Asim - Dated 22-02-22 - Dropdown List Values for Sanction List Type
      this.nactaListService.getSancCountriesList().subscribe((cntryList) =>{
        this.sancListTypes = cntryList;
      });
      
      // Used in DataTable
      this.inValidEntries = false;
      this.fileTypeSelected = val;
      this.NactaListForm.patchValue({ "sancType": val });
      this.getNactaLists();
    }
  }

  // In Valid Data
  // Sanction List: Pakistan and CNIC is not equal to 13
  // Nacta List: CNIC is not equal to 13
  inValidData() {
    if (this.fileTypeSelected > 0) {
      this.isCount = true;
      this.spinner.show();
      this.sancList = [];
      this.dataSource = new MatTableDataSource(this.sancList);
      this.paginator.pageIndex = 0;
      this.lastPageIndex = 0;
      this.dataSource.paginator = this.paginator;
      this.searchVal = "";
      this.filterValue = "";
      this.inValidEntries = true;

      this.nactaListService
        .getInValidList(this.paginator.pageIndex, 10, "", this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction")
        .subscribe(
          (response) => {
            console.log("InValid Data: ", response);

            this.spinner.hide();
            if (response.InValidData.length > 0) {
              this.sancList = response.InValidData;
              this.dataSource = new MatTableDataSource(this.sancList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.datalength = 0;
              setTimeout(() => { this.datalength = response.count; }, 200);

              this.dataBeforeFilter = this.dataSource.data;
              this.countBeforeFilter = response.count;
              this.lastPageIndexBeforeFilter = this.lastPageIndex;
            } else {
              this.toaster.info("No Data Found", "Information!");
            }
          },
          (error) => {
            this.spinner.hide();
            this.toastr.error("Something went wrong", "Error")
          }
        );
    } else {
      this.toaster.info("Please Select File Type.");
    }
  }

  // Function will delete all in-valid data of selected type
  deleteInValidData() {
    if (this.fileTypeSelected > 0) {
      swal({
        title: 'Are you sure?',
        text: "Are you sure you want to delete all In-Valid Records?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();

          this.nactaListService
            .deleteAllInValidList(this.fileTypeSelected == 1 ? "Nacta" : "Sanction")
            .subscribe(
              (response) => {
                this.spinner.hide();
                this.getNactaLists();
                this.toaster.success(response.DeleteData);
              },
              (error) => {
                this.spinner.hide();
                this.toastr.error("Something went wrong", "Error")
              }
            );
        }
      });
    } else {
      this.toaster.info("Please Select File Type.");
    }
  }

  markClntTag(parmVal, tagVal) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to Tag/UnTag Client?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Tag/UnTag Client!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.nactaListService.markClntTag(tagVal, parmVal.cnicNum).subscribe(
          (response) => {
            this.getNactaLists();
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
    if (this.fileTypeSelected > 0) {
      this.nactaListService.getTaggedClntList(this.paginator.pageIndex, this.paginator.pageSize,
        this.filterValue, this.isCount, this.fileTypeSelected == 1 ? "Nacta" : "Sanction"
      ).subscribe(response => {

        console.log('Tagged Client:', response);

        this.spinner.hide();
        if (response.TaggedClnts.length > 0) {
          this.sancList = response.TaggedClnts;
          this.dataSource = new MatTableDataSource(this.sancList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.datalength = 0;
          setTimeout(() => { this.datalength = response.count; }, 200);

          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = response.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        } else {
          this.toaster.info("No Data Found", "Information!");
        }
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.toaster.info("Please Select File Type");
    }
  }
  // End by Zohaib Asim
}
