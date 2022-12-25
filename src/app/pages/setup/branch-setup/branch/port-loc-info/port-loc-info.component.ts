import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-port-loc-info',
  templateUrl: './port-loc-info.component.html',
  styleUrls: ['./port-loc-info.component.css']
})
export class PortLocInfoComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService,
    private dataService: DataService) { }

  // Variables 
  basicCrumbs: any[] = [];
  formSaved = false;
  brmodel: any;
  addrtyps: any;
  disabled: boolean = false;
  invalid: boolean = false;
  thsls: any;
  ports: any;
  editBranch: boolean = false;
  hasPermission: boolean = false;

  ngOnInit() {
    this.hasPermission = JSON.parse(sessionStorage.getItem('hasPermission'));

    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'port-loc-info' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));
    this.editBranch = JSON.parse(sessionStorage.getItem('editBranch'));
    this.commonService.getValues(REF_CD_GRP_KEYS.ADDRESS_TYPE).subscribe((res) => {
      this.addrtyps = res;
      this.branchAddress(this.addrtyps);
    });

    this.dataService.getAllTehsil().subscribe((res) => {
      this.thsls = res;
    })

    this.showPortfolios();
  }

  branchAddress(addrtyps) {
    if (this.addrtyps) {
      for (let i = 0; i < this.addrtyps.length; i++) {
        if (this.addrtyps[i].codeValue == "CURRENT") {
          this.addrtyps = this.addrtyps.slice(i,1);
        }
      }
    }
  }

  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'port-loc-info' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
  }

  showPortfolios() {
    this.dataService.getPortfolio(this.brmodel.brnchSeq).subscribe((data) => {
      this.ports = data;
      // initialize to page 1
    }, (error) => {
      this.toaster.warning('Ports not found.', error);
    });
  }

  scrollTop(): void {
    window.scrollTo(0, 0)
  }

  // Get location info
  getLocation() {
    var x = document.getElementById("location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
      this.disabled = true;
    } else {
      x.innerHTML = "Geolocation is not supported by this browser. Please enter manually.";
      this.disabled = false;
    }
  }
  showPosition(position) {
    var x = <HTMLInputElement>document.querySelector('input[name="lati"]');
    var y = <HTMLInputElement>document.querySelector('input[name="longi"]');

    x.value = position.coords.latitude;
    y.value = position.coords.longitude;
    const change = new Event('change');
    x.dispatchEvent(change);
    y.dispatchEvent(change);
  }
  setLatitude(e) {
    this.brmodel.lati = e.target.value;
  }
  setLongitude(e) {
    this.brmodel.longi = e.target.value;
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

  findPortNm(portSeq) {
    if (this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].portSeq == portSeq) {
          return this.ports[i].portNm;
        }
      }
    }
  }

  // On Continue
  continueClicked() {
    this.router.navigate(['setup/branch/products']);
  }
  prevScreen(){
    this.router.navigate(['setup/branch/community']);
  }

  // On Save
  onPortLocInfoFormSubmit(portLocInfoForm) {
    if (this.brmodel.lati == undefined || this.brmodel.longi == undefined ||
      this.brmodel.lati == null || this.brmodel.longi == null) {
      portLocInfoForm.lati = null;
      portLocInfoForm.longi = null;
    }
    
    else {
      portLocInfoForm.lati = this.brmodel.lati;
      portLocInfoForm.longi = this.brmodel.longi;
    }
    if (portLocInfoForm.hseNum == "" || portLocInfoForm.strt == "" || portLocInfoForm.vlg == "" ||
      portLocInfoForm.hseNum == null || portLocInfoForm.strt == null || portLocInfoForm.vlg == null ||
      portLocInfoForm.othdtl == null || portLocInfoForm.addrTypKey == null || portLocInfoForm.othdtl == "" ||
      portLocInfoForm.ucSeq == null || portLocInfoForm.cmntySeq == null) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }
    this.brmodel.hseNum = portLocInfoForm.hseNum.trim().toUpperCase();
    this.brmodel.strt = portLocInfoForm.strt.trim().toUpperCase();
    this.brmodel.vlg = portLocInfoForm.vlg.trim().toUpperCase();
    this.brmodel.addrTypKey = portLocInfoForm.addrTypKey;
    this.brmodel.othdtl = portLocInfoForm.othdtl.trim().toUpperCase();
    this.brmodel.ucSeq = portLocInfoForm.ucSeq;
    this.brmodel.cmntySeq = portLocInfoForm.cmntySeq;

    sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
    this.toaster.success('Address Information added to this branch');
    this.formSaved = true;
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'port-loc-info' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));


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
  onlyDecimals(event: any) {
    const pattern = /[0-9\+\.]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
