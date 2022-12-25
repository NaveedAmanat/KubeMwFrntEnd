import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/shared/models/area.model';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { City } from 'src/app/shared/models/city.model';
import { CityService } from 'src/app/shared/services/city.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-branch-info',
  templateUrl: './branch-info.component.html',
  styleUrls: ['./branch-info.component.css']
})
export class BranchInfoComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private transfersService: TransfersService,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private cityService: CityService) { }

  basicCrumbs: any[] = [];
  editBranch: any;
  areas: Area[];
  formSaved = false;
  cities: City[];
  brmodel: any;
  brtype: any;
  brstatus: any;
  mfcibcomp: any;
  addrtyps: any;
  disabled: boolean = false;
  invalid: boolean = false;
  branchInfoForm: FormGroup;
  brnchSeq: number;
  hasPermission: boolean = false;
  readonly : boolean = false;

  ngOnInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.editBranch = JSON.parse(sessionStorage.getItem('editBranch'));
    this.hasPermission = JSON.parse(sessionStorage.getItem('hasPermission'));
    this.readonly = JSON.parse(sessionStorage.getItem('readonly'));

    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'branch-info' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    if( this.readonly == true){
      this.basicCrumbs.forEach(element => {
        if (element.formUrl == 'uc' || element.formUrl == 'portfolio' || element.formUrl == 'community' 
        || element.formUrl == 'port-loc-info' || element.formUrl == 'products') {
          this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved, true);
        }
      });
    }
    
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));
    this.mobStrtDt = this.brmodel.mobStrtDt;
    this.mobEndDt = this.brmodel.mobEndDt;

    if(this.brmodel.cmntySeq == -1){
      this.brmodel.cmntySeq = null;
    }
    else if(this.brmodel.ucSeq == -1){
      this.brmodel.ucSeq = null;
    }

    if (this.editBranch && this.brmodel.citySeq > 0) {
      this.disableCity = true;
    }

    this.transfersService.getAreas().subscribe(d => {
      this.areas = d;
    });
    this.cityService.getAllCities().subscribe((res) => {
      this.cities = res;
    })
    this.commonService.getValues(REF_CD_GRP_KEYS.BRANCH_TYPE).subscribe((res) => {
      this.brtype = res;
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe((res) => {
      this.brstatus = res;
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.MFCIB_COMPANIES).subscribe((res) => {
      this.mfcibcomp = res;
    });

    this.branchInfoForm = this.formBuilder.group({
      brnchSeq: [''],
      areaSeq: ['', Validators.required],
      brnchNm: ['', Validators.required],
      brnchDscr: [''],
      brnchStsKey: ['', Validators.required],
      brnchTypKey: ['', Validators.required],
      brnchPhNum: ['', Validators.required],
      email: [''],
      mfcibCmpnySeq: [''],
      hrLocCd: [''],
      mobStrtDt: [''],
      mobEndDt: ['']
    });
  }
  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'branch-info' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    if( this.readonly == true){
      this.basicCrumbs.forEach(element => {
        if (element.formUrl == 'uc' || element.formUrl == 'portfolio' || element.formUrl == 'community' 
        || element.formUrl == 'port-loc-info' || element.formUrl == 'products') {
          this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved, true);
        }
      });
    }
  }

  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == key) {
          return array[i].codeValue;
        }
      }
    }
  }

  mobStrtDt: Date;
  mobEndDt: Date;

  onStartDateChange(event) {
    this.mobStrtDt = event.value;
  }
  onEndDateChange(event) {
    this.mobEndDt = event.value;
  }

  continueClicked() {
    this.router.navigate(['setup/branch/uc']);
  }

  disableCity: boolean = false;
  onBranchInfoFormSubmit(branchInfoForm) {
    const mobStrtDt = new DatePipe('en-US').transform(this.mobStrtDt, 'yyyy-MM-dd');
    const mobEndDt = new DatePipe('en-US').transform(this.mobEndDt, 'yyyy-MM-dd');
    if (this.editBranch && this.brmodel.citySeq > 0) {
      branchInfoForm.citySeq = this.brmodel.citySeq;
    }
    // stop here if form is invalid
    if (branchInfoForm.brnchNm == "" || branchInfoForm.brnchNm == null || branchInfoForm.areaSeq == null || branchInfoForm.brnchPhNum == "" ||
      branchInfoForm.brnchPhNum == null || branchInfoForm.brnchTypKey == null
      || branchInfoForm.brnchStsKey == null || branchInfoForm.citySeq == null) {
      this.invalid = true;
    }
    if(!this.emailInputCheck(branchInfoForm.email)){
      this.toaster.info('Invalid Email Address');
      return;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }
    this.branchInfoForm = this.formBuilder.group({
      brnchSeq: [this.brmodel.brnchSeq],
      areaSeq: [branchInfoForm.areaSeq],
      brnchNm: [branchInfoForm.brnchNm.trim().toUpperCase()],
      brnchDscr: [branchInfoForm.brnchDscr ? branchInfoForm.brnchDscr.trim().toUpperCase() : branchInfoForm.brnchDscr],
      brnchStsKey: [branchInfoForm.brnchStsKey],
      brnchTypKey: [branchInfoForm.brnchTypKey],
      brnchPhNum: [branchInfoForm.brnchPhNum],
      email: [branchInfoForm.email],
      mfcibCmpnySeq: [branchInfoForm.mfcibCmpnySeq],
      hrLocCd: [branchInfoForm.hrLocCd ? branchInfoForm.hrLocCd.trim().toUpperCase() : branchInfoForm.hrLocCd],
      mobStrtDt: [mobStrtDt],
      mobEndDt: [mobEndDt]
    });
    console.log(this.branchInfoForm.value);
    this.brmodel.citySeq = branchInfoForm.citySeq;
    this.dataService.addNewBranch(this.branchInfoForm.value).subscribe((data) => {
      this.toaster.success('Branch-Info Saved');
      this.brmodel.brnchSeq = data.branch.brnchSeq;
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
      this.formSaved = true;

      sessionStorage.setItem("basicCrumbs", JSON.stringify([{ formNm: "Branch Info", formUrl: "branch-info", isSaved: false }, { formNm: "UCs", formUrl: "uc", isSaved: false }
        , { formNm: "Portfolios", formUrl: "portfolio", isSaved: false }, { formNm: "Communities", formUrl: "community", isSaved: false }
        , { formNm: "Address Info", formUrl: "port-loc-info", isSaved: false }
        , { formNm: "Products", formUrl: "products", isSaved: false }
        , { formNm: "Bank Info", formUrl: "bank-info", isSaved: false }]));
      this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
      this.basicCrumbs.forEach(element => {
        this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
        if (element.formUrl == 'branch-info') {
          element.isSaved = true;
        }

      });
      sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));

    }, (error) => {
      console.log('err', error);
      this.toaster.warning('err', error);

    });

  }

  emailValidate(event: any) {
    const pattern = /[A-Za-z0-9._%-@]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  emailInputCheck(email){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  phNumValidate(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPress(event: any) {
    const pattern = /[a-zA-Z0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressText(event: any) {
    const pattern = /[a-zA-Z\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9-]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  hrLocValidate(event: any) {
    const pattern = /[A-Za-z0-9-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
