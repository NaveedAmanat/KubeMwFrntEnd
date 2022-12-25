import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { BranchRemitService } from 'src/app/shared/services/branch-remit.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.css']
})
export class BankInfoComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private router: Router,
    private toaster: ToastrService,
    private paymentTypesService: PaymentTypesService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private branchService: BranchService,
    private branchRemitService: BranchRemitService) { }

  basicCrumbs: any[] = [];
  formSaved = false;
  remitFormSaved = false;
  brmodel: any;
  banks: any;
  cities: any;
  pymtTyps: any;
  acctSetForm: FormGroup;
  remitForm: FormGroup;
  invalid: boolean = false;
  remitInvalid: boolean = false;
  editBranch: any;
  hasPermission: boolean = false;
  readonly: boolean = false;

  ngOnInit() {

    this.hasPermission = JSON.parse(sessionStorage.getItem('hasPermission'));
    this.readonly = JSON.parse(sessionStorage.getItem('readonly'));
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
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
    this.editBranch = JSON.parse(sessionStorage.getItem('editBranch'));

    this.dataService.getCommonCodeValue(REF_CD_GRP_KEYS.BANKS).subscribe((res) => {
      this.banks = res;
    });

    let typeCategory = 3;
    this.paymentTypesService.getAllTypesByBrnch(typeCategory, this.brmodel.brnchSeq).subscribe((res) => {
      this.pymtTyps = res;
    });

    this.acctSetForm = this.formBuilder.group({
      branchSeq: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranch: ['', Validators.required],
      accTitle: ['', Validators.required],
      accNo: ['', Validators.required],
      ibanNo: ['', Validators.required],
      bankCode: ['', Validators.required],
      ibftBankCode: ['']
    });

    this.remitForm = this.formBuilder.group({
      brnchSeq: ['', Validators.required],
      pymtTypSeq: ['', Validators.required],
      remitBankBrnch: ['', Validators.required],
      remitIban: ['', Validators.required]
    });

  }

  prevScreen(){
    this.router.navigate(['setup/branch/products']);
  }
  onBankAcctSetFormSubmit(bankAcctSetForm) {
    if (bankAcctSetForm.bankNm == null || bankAcctSetForm.bankBrnch == ""
      || bankAcctSetForm.acctNm == "" || bankAcctSetForm.acctNum == ""
      || bankAcctSetForm.iban == "" || bankAcctSetForm.bankCode == ""
      || bankAcctSetForm.bankBrnch == null
      || bankAcctSetForm.acctNm == null || bankAcctSetForm.acctNum == null
      || bankAcctSetForm.iban == null || bankAcctSetForm.bankCode == null) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.acctSetForm.reset();
    this.acctSetForm = this.formBuilder.group({
      branchSeq: [this.brmodel.brnchSeq],
      bankName: [bankAcctSetForm.bankNm],
      bankBranch: [bankAcctSetForm.bankBrnch.trim().toUpperCase()],
      accTitle: [bankAcctSetForm.acctNm.trim().toUpperCase()],
      accNo: [bankAcctSetForm.acctNum],
      ibanNo: [bankAcctSetForm.iban],
      bankCode: [bankAcctSetForm.bankCode],
      ibftBankCode: [bankAcctSetForm.ibftBankCode]
    });


    if (this.brmodel.brnchAcctSetSeq == null || !this.brmodel.brnchAcctSetSeq) {
      this.dataService.AccountSetup(this.acctSetForm.value).subscribe((data) => {
        this.toaster.success('Account has been Set up');
        this.brmodel.brnchAcctSetSeq = data['accSeq'];
        this.formSaved = true;
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.basicCrumbs.forEach(element => {
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          if (element.formUrl == 'bank-info' && this.formSaved == true) {
            element.isSaved = true;
          }
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
      });
    }
    else {
      this.dataService.UpdateAccountSetup(this.acctSetForm.value).subscribe((data) => {
        this.toaster.success('Account setup has been updated');

        this.formSaved = true;
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.basicCrumbs.forEach(element => {
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          if (element.formUrl == 'bank-info' && this.formSaved == true) {
            element.isSaved = true;
          }
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));

      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
      });

    }
  }

  onBankRemitFormSubmit(bankRemitForm) {
    if (bankRemitForm.pymtTypSeq == null
      || bankRemitForm.remitBankBrnch == null || bankRemitForm.remitIban == null
      || bankRemitForm.remitBankBrnch == "" || bankRemitForm.remitIban == "") {
      this.remitInvalid = true;
    }
    else {
      this.remitInvalid = false;
    }
    if (this.remitInvalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.remitForm.reset();
    this.remitForm = this.formBuilder.group({
      brnchSeq: [this.brmodel.brnchSeq],
      pymtTypSeq: [bankRemitForm.pymtTypSeq],
      remitBankBrnch: [bankRemitForm.remitBankBrnch.trim().toUpperCase()],
      remitIban: [bankRemitForm.remitIban]
    });

    if (this.brmodel.brnchRemitSeq == null || !this.brmodel.brnchRemitSeq) {

      this.branchRemitService.addBranchRemit(this.remitForm.value).subscribe((data) => {
        this.toaster.success('Remittance Bank added');
        this.brmodel.brnchRemitSeq = data['mwBrnchRemitRel'].brnchRemitSeq;
        this.remitFormSaved = true;
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.basicCrumbs.forEach(element => {
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          if (element.formUrl == 'bank-info' && this.remitFormSaved == true) {
            element.isSaved = true;
          }
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));

      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
      });

    }
    else {
      this.branchRemitService.updateBranchRemit(this.remitForm.value).subscribe((data) => {
        this.toaster.success('Remittance Bank updated');
        this.remitFormSaved = true;
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.basicCrumbs.forEach(element => {
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          if (element.formUrl == 'bank-info' && this.remitFormSaved == true) {
            element.isSaved = true;
          }
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));

      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
      });
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
  accNumber(event: any) {
    const pattern = /[0-9-]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  ibanNumber(event: any) {
    const pattern = /[A-Z0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

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

  goToPaymentTypes() {
    this.router.navigate([]).then((result) => {
      window.open('#/setup/payment-types', '_blank');
    });
  }
  goToBanks(){
    sessionStorage.setItem('clickCommonCode', REF_CD_GRP_KEYS.BANKS);
    this.router.navigate([]).then((result) => {
      window.open('#/setup/common-code-values/' + REF_CD_GRP_KEYS.BANKS, '_blank');
    });
  }

  doneClicked() {
    if (this.brmodel.ucs.length == 0 || this.brmodel.ucs == null)
      this.toaster.warning('Please add Union Councils');
    else if (this.brmodel.ports.length == 0 || this.brmodel.ports == null)
      this.toaster.warning('Please add Portfolios');
    else if (this.brmodel.communities.length == 0 || this.brmodel.communities == null)
      this.toaster.warning('Please add Communities');
    else if (this.brmodel.products.length == 0 || this.brmodel.products == null)
      this.toaster.warning('Please add Products');
    else if (this.brmodel.citySeq == 0 || this.brmodel.citySeq == null)
      this.toaster.warning('Please add a City');
    else if (this.brmodel.ucSeq == null || this.brmodel.cmntySeq == null)
      this.toaster.warning('Please update Address');
    else {
      this.branchService.addAddressInfo(this.brmodel).subscribe((data) => {
        swal({
          title: 'Setup Completed',
          text: "Branch: " + this.brmodel.brnchSeq + " - " + this.brmodel.brnchNm + " has been set up.",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Redirect to Branches'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['setup/branch-setup']);
          }
        })
      }, (error) => {
        console.log('err', error);
        this.toaster.warning('err', error);
      });
    }
  }

}
