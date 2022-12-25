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
import { VehicleLoansService } from 'src/app/shared/services/vehicle-loans.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { DatePipe } from '@angular/common';

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


/**
* @Added, Navee
* @Date, 14-09-2022
* @Description, SCR - Vehicle Loans
*/
@Component({
  selector: 'app-vechile-loans',
  templateUrl: './vechile-loans.component.html',
  styleUrls: ['./vechile-loans.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VechileLoansComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  
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
      return;
    }
  }


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

  brnchExpenseFundsLists: any[];
  brnchExpenseFundsDetailLists: any[];
  isEdit: Boolean = false;

  vehicleInsrForm: FormGroup;
  submitted = false;
  modelYrMaxLength = 5;
  modelYrMinLength = 4;
  rgstrNumLength = 25;
  engnNumLength = 25;
  engnPwrLength = 3;
  chasisNumLength = 25;
  currentYear = 0;
  
  maxDate: Date;
  minDate: Date;
  formControlFilter: FormGroup;
  imageDocuments = [];
  vehicleMakers = [];
  vehicleColor = [];
  vehiclePower = [];
  
  showFields = false;
  showField() {
    this.showFields = true;
  }


  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private fb: FormBuilder, private transfersService: TransfersService,
    private vehicleLoansService: VehicleLoansService,
    private dataService: DataService,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.maxDate = new Date();
    this.minDate = new Date();
    this.currentYear = parseInt(new DatePipe('en-US').transform(this.maxDate, 'yyyy'));
  }

  ngOnInit() {

    this.displayedColumns = ['clntId','loanAppSeq', 'clntName', 'insurdAmt', 'ownerNm', 'vhcleRegtrnNo', 'action'];

    this.vehicleInsrForm = this.formBuilder.group({
      // insurdAmt: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$'), Validators.min(25000)]],
      insurdAmt: ['', Validators.required],
      ownerNm: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(3)]],
      vhcleRegtrnNo: ['', Validators.required],
      refCdVhclMakerSeq: ['', Validators.required],
      vhcleModelYr: ['', [Validators.required, Validators.pattern('^20[0-9]{2}([A-Za-z]{1})?'), Validators.max(this.currentYear)]],
      engnePwrCc: ['', Validators.required],
      vhcleColor: ['',Validators.required],
      engneNo: ['',Validators.required],
      chassisNO: ['',Validators.required],
      prchseDt: ['',Validators.required],
      loanAppSeq: [''],
    });


    this.branchForm = this.fb.group({
      branch: [''],
    });

    if (this.auth.role == "admin" || this.auth.role == "ia" || this.auth.role == 'ops' || this.auth.role == 'finance') {
  
      this.disabledRegion = true;
      this.disabledArea = false;
      this.disabledBranch = false;
  
      this.formControlFilter = this.fb.group({
        regSeq: ['', Validators.required],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required]
      });
    } else if (this.auth.role == "rm" || this.auth.role == "ra" || this.auth.role == "ito") {
  
      this.disabledRegion = false;
      this.disabledArea = true;
      this.disabledBranch = true;
  
      this.formControlFilter = this.fb.group({
        regSeq: [this.auth.emp_reg],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required]
      });
      this.getArea();
    } else if (this.auth.role == "am") {
  
      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = true;
  
      this.formControlFilter = this.fb.group({
        regSeq: [-1],
        areaSeq: [this.auth.emp_area],
        brnchSeq: ['', Validators.required]
      });
      this.getBranch();
  
    } else if (this.auth.role == "bm" || this.auth.role == "bdo") {
  
      this.disabledRegion = false;
      this.disabledArea = false;
      this.disabledBranch = false;
  
      this.formControlFilter = this.fb.group({
        regSeq: [-1],
        areaSeq: [-1],
        brnchSeq: [this.auth.emp_branch]
      });
      this.fetchDetail();
    } else {
      this.transfersService.getBranches().subscribe(d => {
        this.branchs = d;
      });
  
      this.formControlFilter = this.fb.group({
        regSeq: ['', Validators.required],
        areaSeq: ['', Validators.required],
        brnchSeq: ['', Validators.required]
      });
    }
  
    this.transfersService.getRegions().subscribe(data => {
      this.allRegions = data;
      let index = this.allRegions.indexOf(this.allRegions.find( reg => reg.regSeq == -1));
      this.allRegions.splice(index, 1);
    });


    this.commonService.getValues(REF_CD_GRP_KEYS.VEHICLE_MAKER).subscribe((res) => {
      this.vehicleMakers = res.sort(function(a, b) {
        return a.codeValue.localeCompare(b.codeValue);
        });
        this.vehicleMakers.unshift({'codeKey': -1, 'codeValue': 'Select'});
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.VEHICLE_COLOR).subscribe((res) => {
      this.vehicleColor = res.sort(function(a, b) {
        return a.codeValue.localeCompare(b.codeValue);
        });
        this.vehicleColor.unshift({'codeKey': -1, 'codeValue': 'Select'});
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.VEHICLE_POWER).subscribe((res) => {
      this.vehiclePower =  res.sort(function(a, b) {
        return a.codeValue - b.codeValue;
        });
      this.vehiclePower.unshift({'codeKey': -1, 'codeValue': 'Select'});
    }, (error) => {
      console.log('err', error);
    });
    this.inilizedImageViwer();
  }

  onRegionSelection(event) {
    this.spinner.show();
    this.allBranches = [];
    this.disabledBranch = false;
    this.formControlFilter.get('brnchNm').setValue('');

   if(event && event.regSeq){
    this.transfersService.getAllBranchByRegion(event.regSeq).subscribe(d => {
      this.allBranches = d;
      this.disabledBranch = true;
    });
   }else{
    this.allBranches = this.branchs;
    this.searchValue()
   }
   this.spinner.hide();
  }

  onBranchSelection(event){
    this.spinner.show();
    if(event && event.brnchSeq){
      this.applyFilter(event.brnchNm);
    }else{
      this.applyFilter(this.formControlFilter.get('regNm').value);
    }
    this.spinner.hide();
  }

  get form() {
    return this.vehicleInsrForm.controls;
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }


  fetchDetail() {

    let brnchSeq = this.formControlFilter.get('brnchSeq').value;
    this.isCount = true;
    this.brnchExpenseFundsLists = [];
    this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.lastPageIndex = 0;
    this.spinner.show()
      this.vehicleLoansService.getAllLists(brnchSeq, this.paginator.pageIndex, 10, this.filterValue, this.isCount).subscribe(data => {
      this.brnchExpenseFundsLists = data.lists;
      this.spinner.hide();

      if (this.brnchExpenseFundsLists.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };
      
    
      this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
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

  loadNextPage() {
    this.isCount = false;

    let brnchSeq = this.formControlFilter.get('brnchSeq').value;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.vehicleLoansService.getAllLists(brnchSeq, this.paginator.pageIndex, 10, this.filterValue, this.isCount).subscribe(data => {
        this.brnchExpenseFundsLists = data.lists;

        this.spinner.hide();
        this.brnchExpenseFundsLists = data.lists;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.brnchExpenseFundsLists);

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 10);

        if (this.brnchExpenseFundsLists.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err', error);
      });

    }
  }

  getFilteredData(filterValue: string) {
    let brnchSeq = this.formControlFilter.get('brnchSeq').value;
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.spinner.show();
    this.vehicleLoansService.getAllLists(brnchSeq, this.paginator.pageIndex, 10, filterValue, this.isCount).subscribe(data => {
      this.brnchExpenseFundsLists = data.lists;
      this.spinner.hide();

      if (this.brnchExpenseFundsLists.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.brnchExpenseFundsLists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;
    }, error => {
      this.spinner.hide();
      console.log('err', error);
    });
  }
  onVehicleClick(vehicle, flag) {
    this.isEdit = flag;
    this.vehicleInsrForm.reset();
    this.minDate = new Date(vehicle.dsbmtDt);
    if(this.isEdit){
      this.vehicleInsrForm.patchValue(vehicle)
    }else{
      this.vehicleInsrForm.patchValue({
        'loanAppSeq': vehicle.loanAppSeq,
      });
    }
    this.vehicleInsrForm.patchValue(vehicle);
    (<any>$('#ApplyPayment')).modal('show');
  }

  onVehicleFormSubmit(){
    let prchseDt = new DatePipe('en-US').transform(this.vehicleInsrForm.controls['prchseDt'].value, 'dd-MM-yyyy')

    if(this.vehicleInsrForm.controls['refCdVhclMakerSeq'].value == -1){
      this.toastr.info('Please select vehicle makers ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['vhcleColor'].value == -1){
      this.toastr.info('Please select vehicle color ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['engnePwrCc'].value == -1){
      this.toastr.info('Please select vehicle engine power ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['vhcleModelYr'].value.trim().toUpperCase() == 'NA'){
      this.toastr.info('Please insert valid model year ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['prchseDt'].value == '01-01-2020'){
      this.toastr.info('Please select vehicle purchase date ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['chassisNO'].value.trim().toUpperCase() == 'NA'){
      this.toastr.info('Please insert valid chassis No. ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['engneNo'].value.trim().toUpperCase() == 'NA'){
      this.toastr.info('Please insert valid engine No. ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['vhcleRegtrnNo'].value.trim().toUpperCase() == 'NA'){
      this.toastr.info('Please insert valid registration No. ', 'Information');
      return;
    }
    if(this.vehicleInsrForm.controls['insurdAmt'].value <= 0){
      this.toastr.info('Please insert valid insured amount ', 'Information');
      return;
    }
  
    this.vehicleInsrForm.controls['prchseDt'].setValue( prchseDt );
    this.spinner.show();
    if(this.isEdit){
      this.vehicleLoansService.updateVehicleInsrForm(this.vehicleInsrForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#ApplyPayment')).modal('hide');
        if(respose['success']){
          this.toaster.success(respose['success'], 'Success');
          this.getFilteredData(this.filterValue);
        }else if(respose['error']){
          this.toaster.warning(respose['error'], 'Warning');
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }else{
      this.vehicleLoansService.addVehicleInsrForm(this.vehicleInsrForm.value).subscribe(respose =>{
        this.spinner.hide();
        (<any>$('#ApplyPayment')).modal('hide');
        if(respose['success']){
          this.toaster.success(respose['success'], 'Success');
          this.getFilteredData(this.filterValue);
        }else if(respose['error']){
          this.toaster.warning(respose['error'], 'Warning');
        }
      }, error=>{
        this.spinner.hide();
        this.toaster.error('Something went wrong', 'Error') 
      })
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  alphaNumeric(event: any) {
    const pattern = /[0-9a-zA-Z/ -]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  alpha(event: any) {
    const pattern = /[a-zA-Z/ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  loaAppSeqImage = 0;
  onImageViewer(element, flag){
    this.inilizedImageViwer();
    this.vehicleLoansService.downloadImageByLoan(element.loanAppSeq).subscribe(response =>{
      if(response['success']){
        let res = response['success'];
        this.imageDocuments.forEach(image =>{
            let doc = res.find(r => image.id == r.docSeq)
            if(doc){
              image.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + doc.docImg);
            }
        });
      }
      this.spinner.hide();
    }, error =>{
      this.spinner.hide();
    });

    this.loaAppSeqImage = element.loanAppSeq;
    (<any>$('#imageModel')).modal('show');
  }

  getArea() {
    this.allAreas = [];
    this.disabledArea = false;
    this.disabledBranch = false;
    if(this.formControlFilter.controls["regSeq"] && this.formControlFilter.controls["regSeq"].value){
      this.dataService.getArea(this.formControlFilter.controls["regSeq"].value).subscribe(d => {
        this.allAreas = d;
        this.disabledArea = true;
      });
    }
  }
  
  getBranch() {
    this.allBranches = [];
    this.disabledBranch = false;
    if(this.formControlFilter.controls["areaSeq"].value != -1 && this.formControlFilter.controls["areaSeq"].value != null){
      this.dataService.getBranch(this.formControlFilter.controls["areaSeq"].value).subscribe(d => {
        this.allBranches = d;
        this.disabledBranch = true;
      });
    }
  }

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

  fileTypeSelected: any;
  file: File;

  modelSrc; modalCaption;
  imageSrc;

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
   const uploadImageData = new FormData();
   uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

  }

  openFile(event) {
    event.click();
  }

  inputClear(event) {
    event.target.value = null;
  }
  handle(event, docSeq) {

    if (!(event.target.value.endsWith(".jpg") || event.target.value.endsWith(".jpeg") || event.target.value.endsWith(".png"))) {
      this.toastr.info('Please Choose Specific Format of Image like jpg, jpeg, png ', 'Information');
      return;
    }
    this.spinner.show();

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;     
        let id = this.imageDocuments.find(img => img.id == docSeq);
        id.imageSrc = reader.result as string
      };
    }
    this.file = event.target.files[0];
    const uploadImageData = new FormData();
    if(!(event.target.files && event.target.files.length > 0)) {
      return;
    }
    this.file = event.target.files[0];
    uploadImageData.append('imageFile', this.file, this.loaAppSeqImage + '_' + docSeq);
      swal({
        title: 'Are you sure?',
        text: "Are you sure you want to upload Image?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Upload it!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.vehicleLoansService.uploadImage(uploadImageData).subscribe(result => {
            this.spinner.hide();
            swal(
              'Upload Image!',
              result['success'] ? result['success'] : result['error'],
              result['success'] ? 'success' : 'error'
            )
          }, error => {
            this.spinner.hide();
            this.toastr.error("Something went wrong", "Error")
          });
        }
      });

      this.spinner.hide();
  }

  downloadImage(loanAppSeq, docSeq){
    setTimeout(() => {
      this.spinner.show();
    }, 5);
    this.vehicleLoansService.downloadImage(loanAppSeq, docSeq).subscribe(response =>{
      this.spinner.hide();
      if(response['success']){
        this.loadModal(response['success'])
      }else{}
      this.toastr.info("Unable to find Image against Credit ID " + loanAppSeq, "Information")
    }, error =>{
        this.spinner.hide();
        this.toastr.error("Something went wrong", "Error")
    })

    this.spinner.show();
  }

  loadModal(doc) {
    document.getElementById('imageViewModel').style.display = "block";
    this.modelSrc = doc.imageSrc;
    this.modalCaption = doc.desc;
  }
  closeModal() {
    document.getElementById('imageViewModel').style.display = "none";
  }

  get insurdAmt() {
    return this.vehicleInsrForm.get('insurdAmt');
  }
  get vhcleModelYr() {
    return this.vehicleInsrForm.get('vhcleModelYr');
  }
  get ownerNm() {
    return this.vehicleInsrForm.get('ownerNm');
  }
  get vhcleRegtrnNo() {
    return this.vehicleInsrForm.get('vhcleRegtrnNo');
  }
  get engneNo() {
    return this.vehicleInsrForm.get('engneNo');
  }
  get chassisNO() {
    return this.vehicleInsrForm.get('chassisNO');
  }

  setValue(field, value) {
    return this.vehicleInsrForm.get(field).setValue(value == 'NA' || value == undefined ? null : value);
  }

  inilizedImageViwer(){
    this.imageDocuments = [
      {"id": '11', 'desc': 'VEHICLE FRONT PICTURE', 'imageSrc': ''},
      {"id": '12', 'desc': 'VEHICLE BACK PICTURE', 'imageSrc': ''},
      {"id": '13', 'desc': 'VEHICLE LEFT PICTURE', 'imageSrc': ''},
      {"id": '14', 'desc': 'VEHICLE RIGHT PICTURE', 'imageSrc': ''},
      {"id": '15', 'desc': 'VEHICLE ENGINE NUMBER PICTURE', 'imageSrc': ''},
      {"id": '16', 'desc': 'VEHICLE CHASSIS PICTURE', 'imageSrc': ''},
      {"id": '17', 'desc': 'VEHICLE PURCHASE INVOICE PICTURE', 'imageSrc': ''},
      {"id": '18', 'desc': 'VEHICLE SALE CERTIFICATE PICTURE', 'imageSrc': ''},
      {"id": '19', 'desc': 'VEHICLE REGISTRATION BOOK PICTURE', 'imageSrc': ''}
    ];
  }

  isVechicleYrValid(value: any) {
    const inputYear = (value.target.value.match(/\d+/g) || []).map(n => parseInt(n))[0];
  if(inputYear <= this.currentYear){
      if(inputYear >= (this.currentYear - 5)){
        this.vhcleModelYr.setValidators([Validators.required, Validators.pattern('^20[0-9]{2}([A-Za-z]{1})?'), Validators.max(this.currentYear)]);
      }else{
        this.vhcleModelYr.setValidators([Validators.required, Validators.pattern('^20[0-9]{2}([A-Za-z]{1})?'), Validators.min(this.currentYear - 5)]);
      }
    }
    if(inputYear > this.currentYear){
      this.vhcleModelYr.setValidators([Validators.required, Validators.pattern('^20[0-9]{2}([A-Za-z]{1})?'), Validators.max(this.currentYear)]);
    }
      this.vhcleModelYr.updateValueAndValidity();
  }
}