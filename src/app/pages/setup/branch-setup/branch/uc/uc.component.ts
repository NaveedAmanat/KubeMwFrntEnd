import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { UC } from 'src/app/shared/models/UC.model';
import { Auth } from 'src/app/shared/models/Auth.model';
import { BranchService } from 'src/app/shared/services/branch.service';

@Component({
  selector: 'app-uc',
  templateUrl: './uc.component.html',
  styleUrls: ['./uc.component.css']
})
export class UcComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private branchService: BranchService) { }

  // Variables 
  basicCrumbs: any[] = [];
  formSaved = false;
  brmodel: any;

  thsls: any;
  dists: any;
  sts: any;
  allUcs: any;
  districtForm: FormGroup;
  tehsilForm: FormGroup;
  ucForm: FormGroup;
  invalid: boolean = false;
  status: any;
  isEdit: boolean = false;

  //Add Existing UCs
  existingUcs: any;
  existingDists: any;
  existingThsls: any;
  selectedSt: any;
  selectedDist: any;
  selectedThsl: any;
  selectedUc: any;
  auth: Auth;

  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'uc' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));

    if(this.brmodel.ucSeq == -1){
      this.brmodel.ucSeq = null;
    }

    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe((res) => {
      this.status = res;
    });

    this.dataService.getAllTehsil().subscribe((res) => {
      this.thsls = res;
    })
    this.dataService.getAllDistrict().subscribe((res) => {
      this.dists = res;
    });
    this.dataService.getAllProvince().subscribe((res) => {
      this.sts = res;
    });
    this.dataService.getAllUN().subscribe((res) => {
      this.allUcs = res;
    });

    this.districtForm = this.formBuilder.group({
      districtName: [''],
      districtDescription: [''],
      provinceSeq: [''],
      districtStatus: ['']
    });

    this.tehsilForm = this.formBuilder.group({
      thslName: [''],
      thslDescription: [''],
      districtSeq: [''],
      thslStatus: ['']
    });
    this.ucForm = this.formBuilder.group({
      ucSeq: [''],
      ucName: [''],
      ucDescription: [''],
      thslSeq: [''],
      statusKey: ['']
    });

    this.listing(1);
  }

  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'uc' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
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
  findThslNm(thslSeq) {
    if (this.thsls) {
      for (let i = 0; i < this.thsls.length; i++) {
        if (this.thsls[i].thslSeq == thslSeq) {
          return this.thsls[i].thslNm;
        }
      }
    }
  }
  findThslSeq(thslNm) {
    try{
    if (this.thsls) {
      for (let i = 0; i < this.thsls.length; i++) {
        if (this.thsls[i].thslNm.toUpperCase() == thslNm.toUpperCase()) {
          return this.thsls[i].thslSeq;
        }
      }
    }
  }
    catch(err){
      this.toaster.info("Please select correct file.", "Information!");
    }
  }

  // On Continue
  continueClicked() {
    this.formSaved = true;
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'uc' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
    this.router.navigate(['setup/branch/portfolio']);
  }
  prevScreen(){
    this.router.navigate(['setup/branch/branch-info']);
  }
  goToGeography(){
    this.router.navigate([]).then((result) => {
      window.open('#/setup/geography', '_blank');
    });
  }

  pager: any = {};
  // paged items
  pagedItems: any = [];

  listing(page: number) {
    this.setPage(page);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.dataService.getPager(this.brmodel.ucs.length, page);

    // get current page of items
    this.pagedItems = this.brmodel.ucs.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  ucSeq: number;
  ucNm: string;
  ucCommnets: string;
  thslSeq: number;
  ucStsKey: number;

  // Add Existing UC
  addExUCs() {
    this.ucSeq = null;
    this.selectedSt = null;
    this.selectedDist = null;
    this.selectedThsl = null;
    this.selectedUc = null;

    this.isEdit = false;
    (<any>$('#addExUCs')).modal('show');
  }
  // Add a New UC
  addUCs() {
    this.ucSeq = null;
    this.ucNm = null;
    this.ucCommnets = null;
    this.thslSeq = null;
    this.ucStsKey = null;

    this.isEdit = false;
    (<any>$('#addUCs')).modal('show');
  }
  editUCs(uc) {
    this.ucSeq = uc.ucSeq;
    this.ucNm = uc.ucNm;
    this.ucCommnets = uc.ucCmnt;
    this.thslSeq = uc.thslSeq;
    this.ucStsKey = uc.ucStsKey;

    this.isEdit = true;
    (<any>$('#addUCs')).modal('show');
  }

  addDists() {
    (<any>$('#addDists')).modal('show');
  }
  addThsls() {
    (<any>$('#addThsls')).modal('show');
  }

  onDistFormSubmit(dist) {
    // stop here if form is invalid
    if (dist.distNm == "" || dist.distStsKey == null || dist.stSeq == null || dist.distCmnt == "") {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.districtForm.reset();
    this.districtForm = this.formBuilder.group({
      districtName: [dist.distNm.trim().toUpperCase()],
      districtDescription: [dist.distCmnt.trim().toUpperCase()],
      provinceSeq: [dist.stSeq],
      districtStatus: [dist.distStsKey]
    });
    this.dataService.addDistrict(this.districtForm.value).subscribe((data) => {
      this.toaster.success('District added');
      this.dataService.getAllDistrict().subscribe((res) => {
        this.dists = res;
      });
    }, (error) => {
      console.log('err', error);
      this.toaster.warning('err', error);

    });
    (<any>$('#addDists')).modal('hide');
    dist = null;
  }

  onThslFormSubmit(thsl) {
    // stop here if form is invalid
    if (thsl.thslNm == "" || thsl.thslStsKey == null || thsl.distSeq == null || thsl.thslCmnt == "") {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.tehsilForm.reset();
    this.tehsilForm = this.formBuilder.group({
      thslName: [thsl.thslNm.trim().toUpperCase()],
      thslDescription: [thsl.thslCmnt.trim().toUpperCase()],
      districtSeq: [thsl.distSeq],
      thslStatus: [thsl.thslStsKey]
    });
    this.dataService.addTehsil(this.tehsilForm.value).subscribe((data) => {
      this.toaster.success('Tehsil added');
      this.dataService.getAllTehsil().subscribe((res) => {
        this.thsls = res;
      });
    }, (error) => {
      console.log('err', error);
      this.toaster.warning('err', error);

    });
    (<any>$('#addThsls')).modal('hide');
    thsl = null;
  }

  onUCFormSubmit(uc) {
    // stop here if form is invalid
    if (uc.ucNm == "" || uc.ucStsKey == null || (uc.thslSeq == null && this.thslSeq == null) || uc.ucCommnets == "") {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.ucForm.reset();
    if (!this.isEdit) {
      this.ucForm = this.formBuilder.group({
        ucSeq: [this.ucSeq],
        ucName: [uc.ucNm.trim().toUpperCase()],
        ucDescription: [uc.ucCommnets.trim().toUpperCase()],
        thslSeq: [uc.thslSeq],
        statusKey: [uc.ucStsKey]
      });
      this.spinner.show();
      this.dataService.addUN(this.ucForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('UC added');
        this.brmodel.ucs.unshift(data.uc);
        //this.brmodel.ucs.push(data.uc);
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.listing(1);
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.ucForm = this.formBuilder.group({
        ucSeq: [this.ucSeq],
        ucName: [uc.ucNm.trim().toUpperCase()],
        ucDescription: [uc.ucCommnets.trim().toUpperCase()],
        thslSeq: [this.thslSeq],
        statusKey: [uc.ucStsKey]
      });
      this.spinner.show();
      this.dataService.updateUN(this.ucForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('UC updated');

        for (let i = 0; i < this.brmodel.ucs.length; i++) {
          if (this.brmodel.ucs[i].ucSeq == data.uc.ucSeq) {
            this.brmodel.ucs[i].ucNm = data.uc.ucNm;
            this.brmodel.ucs[i].ucCmnt = data.uc.ucCmnt;
            this.brmodel.ucs[i].thslSeq = data.uc.thslSeq;
            this.brmodel.ucs[i].ucStsKey = data.uc.ucStsKey;
            break;
          }
        }

        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.listing(1);
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    (<any>$('#addUCs')).modal('hide');
    uc = null;
  }

  onExStChange(){
    this.existingDists = [];
    if (this.dists) {
      for (let i = 0; i < this.dists.length; i++) {
        if (this.dists[i].stSeq == this.selectedSt) {
          this.existingDists.push(this.dists[i]);
        }
      }
    }
  }
  onExDistChange(){
    this.existingThsls = [];
    if (this.thsls) {
      for (let i = 0; i < this.thsls.length; i++) {
        if (this.thsls[i].distSeq == this.selectedDist) {
          this.existingThsls.push(this.thsls[i]);
        }
      }
    }
  }
  onExThslChange(){
    this.existingUcs = [];
    if (this.allUcs) {
      for (let i = 0; i < this.allUcs.length; i++) {
        if (this.allUcs[i].thslSeq == this.selectedThsl) {
          this.existingUcs.push(this.allUcs[i]);
        }
      }
    }
  }

  onExUCFormSubmit(exUC){
    if (exUC.exUcSeq == null) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }
        this.toaster.success('UC added');
        this.brmodel.ucs.unshift(exUC.exUcSeq);
        //this.brmodel.ucs.push(data.uc);
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.listing(1);    
    
    (<any>$('#addExUCs')).modal('hide');
    exUC = null;
  }

  // Delete UC
  deleteUCs(uc) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this UC permanently?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
    this.dataService.delUN(uc.ucSeq).subscribe((data) => {
      this.toaster.success('UC deleted');
      if(this.brmodel.ucSeq == uc.ucSeq){
        this.brmodel.ucSeq = null;
        this.basicCrumbs.forEach(element => {
          if (element.formUrl == 'port-loc-info') {
            element.isSaved = false;
          }
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
      }
      for (let i = 0; i < this.brmodel.ucs.length; i++) {
        if (this.brmodel.ucs[i].ucSeq == uc.ucSeq) {
          this.brmodel.ucs.splice(i, 1);
          break;
        }
      }
      this.spinner.hide();
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
      this.listing(1);
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
      }
    })
  }

  //Add UC to Branch
  addUcsToBrnch(){
    if (this.brmodel.ucs.length == 0 || this.brmodel.ucs == null)
      this.toaster.warning('Please add Union Councils');
    else if (this.brmodel.citySeq == 0 || this.brmodel.citySeq == null)
      this.toaster.warning('Please add a City');
    else{
    this.spinner.show();
    this.branchService.addUcsToBrnch(this.brmodel).subscribe((data) => {
      this.spinner.hide();
      this.toaster.success("Ucs Added to Branch Successfully");
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
  }
  }

  //Remove UC from Branch
  removeUCs(uc){
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to remove this UC from this Branch? It will unassign this UC from all the corresponding Portfolios.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!'
    }).then((result) => {
      if (result.value) {
    this.spinner.show();
    this.dataService.removeUN(uc.ucSeq, this.brmodel.citySeq, this.brmodel.brnchSeq).subscribe((data) => {
      this.toaster.success('UC Removed');
      if(this.brmodel.ucSeq == uc.ucSeq){
        this.brmodel.ucSeq = null;
        this.basicCrumbs.forEach(element => {
          if (element.formUrl == 'port-loc-info') {
            element.isSaved = false;
          }
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
      }
      for (let i = 0; i < this.brmodel.ucs.length; i++) {
        if (this.brmodel.ucs[i].ucSeq == uc.ucSeq) {
          this.brmodel.ucs.splice(i, 1);
          break;
        }
      }
      this.spinner.hide();
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
      this.listing(1);
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
  }
})
  }

  // Upload UC
  uploadLists: UC[] = [];
  data: any;
  uploadUcList: UC = new UC();

  openFile(event) {
    this.toaster.info("Uploading Data.");
    event.click();
  }

  inputClear(event) {
    event.target.value = null;
  }
  handle(event) {
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
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let withoutHeaderLists = this.data.slice(1);

      let incorrectFile: boolean = false;
      for( let i = 0; i < withoutHeaderLists.length; i++){
        if (withoutHeaderLists[i].length > 3){
          incorrectFile = true;
        }
      }
      let counter = 0;
      withoutHeaderLists.forEach((r: any[]) => {
        this.uploadUcList = new UC();
        if (r.length > 0 && r.length < 4 && r !== undefined) {
          let dataRecognized = false;
          if (r[0] != undefined && this.findThslSeq(r[0].trim()) > 0 && r[1] !== undefined && r[2] !== undefined && !incorrectFile) {
            dataRecognized = true;
          }
          if(r.length > 3){
            dataRecognized = false;
          }
          if (dataRecognized == true) {
            if(this.checkUploadNumber(r[1])){
              this.toaster.info("Please enter a valid UC No. " + r[1], "Incorrect UC Number!");
            }
            else if(this.checkUploadName(r[2])){
              this.toaster.info("Please remove special characters from Name: " + r[2], "Incorrect UC Name!");
            }
            else{
            try {
            this.uploadUcList.thslSeq = this.findThslSeq(r[0].trim());
            this.uploadUcList.ucName = r[1];
            this.uploadUcList.ucDescription = r[2];

            this.uploadLists.unshift(this.uploadUcList);
            }
            catch(err){
              this.toaster.info("Please select correct file.", "Information!");
            }
          }
            //this.uploadLists.push(this.uploadUcList);
          } else {
            this.toaster.info("Please select correct file.", "Information!");
          }
          this.uploadUcList = null;
        }
        else{
          counter++;
        }
      });

      console.log('Uploading Data:', this.uploadLists);

      if (this.uploadLists.length > 0 && this.uploadLists.length + counter == withoutHeaderLists.length) {
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
            this.dataService.uploadUN(this.uploadLists).subscribe(result => {
              console.log("FileUploaded:", result);

              result.ucs.forEach(u => {
                //this.brmodel.ucs.push(u);
                this.brmodel.ucs.unshift(u);
                sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
              });
              this.listing(1);
              this.spinner.hide();
              swal(
                'Upload File!',
                result.success,
                'success'
              )
            }, error => {
              this.spinner.hide();
              this.toaster.error("Something went wrong", "Error")
            });
          }
        })
      }
    };
    reader.readAsBinaryString(target.files[0]);
    reader.abort;
    this.spinner.hide();
  }

  keyPress(event: any) {
    const pattern = /[a-zA-Z0-9\+\-\/\ ]/;

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
  onlyDecimals(event: any) {
    const pattern = /[0-9\+\.]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  checkUploadNumber(string){
    const pattern = /[a-zA-Z!@#$%^&*()_+=\[\]{};':"\\|,.<>?]/;
    return pattern.test(string);
  }
  checkUploadName(string){
    const pattern = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?]/;
    return pattern.test(string);
  }

}
