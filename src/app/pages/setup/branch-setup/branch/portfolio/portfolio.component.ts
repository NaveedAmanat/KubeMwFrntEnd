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

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  // Variables 
  basicCrumbs: any[] = [];
  formSaved = false;
  brmodel: any;

  status: any;
  porttyps: any;
  portfolioForm: FormGroup;
  ports: any;
  invalid: boolean = false;
  isEdit: boolean = false;

  ngOnInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'portfolio' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));

    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe((res) => {
      this.status = res;
    });

    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.PORTFOLIO_CATEGORY_TYPE).subscribe((res) => {
      this.porttyps = res;
    });

    this.portfolioForm = this.formBuilder.group({
      portfolioSeq: [''],
      branchSeq: [''],
      portfolioName: [''],
      portfolioStatus: [''],
      portfolioType: [''],
      portfolioComment: ['']
    });

    this.showPortfolios();
  }

  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'portfolio' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    this.showPortfolios();
  }

  // Find value from code
  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == key) {
          return array[i].codeValue;
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
  continueClicked() {
    this.formSaved = true;
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'portfolio' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
    this.router.navigate(['setup/branch/community']);
  }
  prevScreen(){
    this.router.navigate(['setup/branch/uc']);
  }

  portfolioSeq: number;
  portNm: string;
  portStsKey: number;
  portTyp: number;
  portDscr: string;

  // Add a New Port
  addPorts() {

    this.isEdit = false;
    this.portfolioSeq = null;
    this.portNm = null;
    this.portStsKey = null;
    this.portTyp = null;
    this.portDscr = null;

    this.portfolioForm.reset();
    (<any>$('#addPorts')).modal('show');
  }
  editPortfolio(port) {
    this.portfolioSeq = port.portSeq;
    this.portNm = port.portNm;
    this.portStsKey = port.portStsKey;
    this.portTyp = port.portTyp;
    this.portDscr = port.portDscr;

    this.isEdit = true;
    (<any>$('#addPorts')).modal('show');
  }

  onPortFormSubmit(port) {
    // stop here if form is invalid
    if (port.portNm == "" || port.portStsKey == null) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.portfolioForm.reset();

    this.portfolioForm = this.formBuilder.group({
      portfolioSeq: [this.portfolioSeq],
      branchSeq: [this.brmodel.brnchSeq],
      portfolioName: [port.portNm.trim().toUpperCase()],
      portfolioStatus: [port.portStsKey],
      portfolioType: [port.portTyp],
      portfolioComment: [port.portDscr ? port.portDscr.trim().toUpperCase() : port.portDscr]
    });
    if (!this.isEdit) {
      this.spinner.show();
      this.dataService.addPortfolio(this.portfolioForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('Portfolio added to this branch');
        //this.brmodel.ports.push(data.port);
        this.brmodel.ports.unshift(data.port);
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.showPortfolios();
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.spinner.show();
      this.dataService.updatePortfolio(this.portfolioForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('Portfolio updated');
        for (let i = 0; i < this.brmodel.ports.length; i++) {
          if (this.brmodel.ports[i].portSeq == this.portfolioForm.value.portfolioSeq) {
            this.brmodel.ports[i].portNm = this.portfolioForm.value.portfolioName;
            this.brmodel.ports[i].portDscr = this.portfolioForm.value.portfolioComment;
            this.brmodel.ports[i].portStsKey = this.portfolioForm.value.portfolioStatus;
            this.brmodel.ports[i].portTyp = this.portfolioForm.value.portfolioType;
            break;
          }
        }
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.showPortfolios();
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });

    }
    (<any>$('#addPorts')).modal('hide');
    port = null;
    //this.portForm.reset();

  }

  deletePortfolio(port) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this Portfolio permanently?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
    this.spinner.show();
    this.dataService.delPortfolio(port.portSeq).subscribe((data) => {
      this.toaster.success('Portfolio deleted');
      for (let i = 0; i < this.brmodel.ports.length; i++) {
        if (this.brmodel.ports[i].portSeq == port.portSeq) {
          this.brmodel.ports.splice(i, 1);
          break;
        }
      }
      this.spinner.hide();
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
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
