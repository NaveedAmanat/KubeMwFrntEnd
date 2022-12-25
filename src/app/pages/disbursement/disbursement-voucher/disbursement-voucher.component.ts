import { filter } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DisbursementService } from '../../../shared/services/disbursement.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AgencyVoucher, DisbursementVoucherListItem } from '../../../shared/models/disbursementVoucherListItem.model';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ErrorStateMatcher } from '@angular/material';
import { MyErrorStateMatcher } from '../../../shared/helpers/MyErrorStateMatcher.helper';
import { DISB_VOUCHER } from '../../../shared/mocks/mock_common_codes';
import { PaymentMode } from '../../../shared/models/disbursement';
import { ApplyPayment } from '../../../shared/models/recovery.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-disbursement-voucher',
  templateUrl: './disbursement-voucher.component.html',
  styleUrls: ['./disbursement-voucher.component.css']
})
/*
    Added By Naveed - Dated 23-01-2022
    SCR - Mobile Wallet control  
*/
export class DisbursementVoucherComponent implements OnInit {

  allItems: DisbursementVoucherListItem[] = [];
  totalAmount: number = 0;
  agencyForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  submitted = false;
  model: AgencyVoucher = new AgencyVoucher();
  paymentModes: any[] = [];
  private edit = false;
  disbursementAmt: number;
  editPrivousAmt: number;
  isCheck: boolean = false;
  isPaymentReq: boolean = false;
  prdSeq: string;
  appSts: string;
  disableButton: boolean = false;
  editDisableButton: boolean = false;
  thingsForKm: any;
  
  // Added By Naveed - Dated 23-01-2022
  paymentModesWallet: any[] = [];
  pymtModeChange: boolean = false;
  prevWalletNo: any[] = [];
  isWallet: boolean = false;
  mobWalChnlNgModel: string;
  mobWalNumNgModel: string;
  // Ended By Naveed - Dated 23-01-2022

  // Added by Zohaib Asim - Dated 25/01/2021
  instrNumPlaceHolder: string;
  instrNumFormat: string;
  // End by 

  constructor(private router: Router,
    private disbursementService: DisbursementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService) {
    
    // modified By Naveed - Dated 23-01-2022
    // add 'mobWalChnl' and 'mobWalNum' form fields
    this.agencyForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      instrNum: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      amt: ['', Validators.required],
      loanAppSeq: [''],
      dsbmtDtlKey: [''],
      mobWalChnl: [''],
      mobWalNum: ['', Validators.compose([Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[92][0-9]+$')])]
    });
     // Ended By Naveed - Dated 23-01-2022
  }
  

  ngOnInit() {
    this.spinner.show();
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    this.disbursementService.getDisbursementVoucher().subscribe((data) => {
      this.thingsForKm = data;
      console.log(this.thingsForKm);
      if (this.thingsForKm.prdSeq === '0010' && this.thingsForKm.loanAppStatus == "1305") {
        this.editDisableButton = false;
      } else {
        this.editDisableButton = true;
      }
    });

    this.disbursementService.getAllAgencies().subscribe((data) => {
      this.model = data;
      console.log(this.model)
      this.allItems = this.model.disbursementVoucherDetailDTOs;
      this.allItems.forEach((d: DisbursementVoucherListItem) => this.totalAmount += + d.amt);
      console.table(this.allItems)
    });
    this.loadPaymentModes();
    sessionStorage.setItem("frstInstDt", new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy'));
    sessionStorage.setItem("lsatInstDt", new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy'));

    this.loadPrevWalletNo();
    this.spinner.hide();
  }

  getCashModes(pymtTypSeq) {

    let str = "";
    for (let a = 0; a < this.paymentModes.length; a++) {
      if (this.paymentModes[a].typSeq == pymtTypSeq || this.paymentModes[a].typSeq == pymtTypSeq.typSeq) {
        str = this.paymentModes[a].typStr;
      }
    };

    if (str.length == 0) {
      str = 'Advanced To Agent'
    };

    return str;
  }

  // modified By Naveed - Dated 23-01-2022
  /* manage 'mobWalChnl' and 'mobWalNum' incase   
     when select payment mode as cash, mobile wallet and other modes*/   
  onRecoveryChange(flag) {
    const instrNum = this.agencyForm.get('instrNum');
    const mobWalChnl = this.agencyForm.get('mobWalChnl');
    const mobWalNum = this.agencyForm.get('mobWalNum');
    const amount = this.agencyForm.get('amt');
    this.agencyForm.controls['amt'].setErrors(null);
    this.isWallet = this.agencyForm.get('pymtTypSeq').value.typStr.match(/MOBILE WALLET/i); 
    /*
      Modified By Naveed - Date 02-02-2022
      hide Instruments number field incase MCB Remmitance
    */
    let cashAndRemi = ['0001', '0007'];
    let cashAndRemiFlag =  cashAndRemi.includes(this.agencyForm.get('pymtTypSeq').value.typId)
    if (!cashAndRemiFlag && !this.isWallet) {
      this.isCheck = true;
      instrNum.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
      // Added by Zohaib Asim - Dated 25/01/2021
      this.instrNumPlaceHolder = 'Instrument No:';
      this.instrNumFormat = '';
      mobWalChnl.enable();
      mobWalNum.enable();
      instrNum.setValue(this.edit ? instrNum.value: '');
      mobWalChnl.setValue(this.edit && flag ? '': this.agencyForm.get('mobWalChnl').value);
      mobWalNum.setValue(this.edit && flag ? '': this.agencyForm.get('mobWalNum').value);
      mobWalChnl.clearValidators();
      mobWalNum.clearValidators();
      this.mobWalChnlNgModel = '' // update by Naveed - Date - 02-02-2022
      // End by Zohaib
    }
    // modified by Zohaib Asim - Dated 25/01/2021
    // CR: Added EasyPaisa/JazzCash in payment modes and system will store mobile# for transaction 
    else if (this.isWallet) {
      this.isCheck = true;
      this.instrNumPlaceHolder = 'Mobile Wallet No:';
      this.instrNumFormat = 'e.g. 923001234567';
      mobWalChnl.disable();
      mobWalNum.disable();
      instrNum.setValidators(Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[92][0-9]+$')]));
      // instrNum.setValue('92');
      let prevWallet = "92";
      let wallets = this.prevWalletNo.filter(pytm => pytm.mobWalChnl == this.agencyForm.get('pymtTypSeq').value.typId)
      if(wallets.length > 0){
        prevWallet =  wallets[0].mobWalNum
      }
      mobWalNum.setValue(prevWallet);
      instrNum.setValue(this.edit ? mobWalNum.value : prevWallet);
      this.mobWalChnlNgModel = this.agencyForm.get('pymtTypSeq').value.typId // update by Naveed - Date - 02-02-2022
     
      // Added BY Naveed Date - 22-07-2022
      // SCR - Mobile Wallet Disbursement Limit
      if(amount.value > 45000 ){
        this.agencyForm.controls['amt'].setErrors({'incorrect': true, 'message': 'The amount should not be greater than 45,000'});
      }
    }
    // End by Zohaib Asim
    else {
      this.isCheck = false;
      instrNum.clearValidators();
      mobWalChnl.clearValidators();
      mobWalNum.clearValidators();
      mobWalChnl.enable();
      mobWalNum.enable();
      mobWalChnl.setValue(this.edit && flag ? '': this.agencyForm.get('mobWalChnl').value);
      mobWalNum.setValue(this.edit && flag ? '': this.agencyForm.get('mobWalNum').value);
      this.mobWalChnlNgModel = ''
    }
    instrNum.updateValueAndValidity();
    mobWalChnl.updateValueAndValidity();
    mobWalNum.updateValueAndValidity();

    // Added BY Naveed Date - 22-07-2022
    // SCR - Mobile Wallet Disbursement Limit
    if(this.isWallet){
      if(this.agencyForm.value.amt > 45000){
      this.toastr.warning('in Mobile Wallet Mode, The amount should not be greater than 45,000', 'Warning');
      return;
      }
    }
  }
  // Ended by Naveed - Dated - 23-01-2022

  // Added By Naveed - Dated 23-01-2022
 // find previous number when select wallet number
  onMobileWalletChange(){
    let prevWallet = "92";
    let wallets = this.prevWalletNo.filter(pytm => pytm.mobWalChnl == this.agencyForm.get('mobWalChnl').value)
    if(wallets.length > 0){
      prevWallet =  wallets[0].mobWalNum
    }
    const mobWalNum = this.agencyForm.get('mobWalNum');
    mobWalNum.setValue(prevWallet);
    mobWalNum.setValidators(Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[92][0-9]+$')]));
    mobWalNum.updateValueAndValidity();
  }
  // Ended by Naveed - Dated - 23-01-2022

  // modified By Naveed - Dated 23-01-2022
 // save mobile wallet number 
  onSubmit() {
    this.disableButton = true;
    const result: any = Object.assign({}, this.agencyForm.value);  
    result.mobWalChnl = this.agencyForm.get('mobWalChnl').value ;
    result.mobWalNum = this.agencyForm.get('mobWalNum').value ;
    result.pymtTypSeq = result.pymtTypSeq.typSeq;
    (<any>$('#addVoucher')).modal('hide');
    this.disableButton = false;
    const validAmt: number = this.totalAmount + Number(result.amt);
    const editValidAmt = this.totalAmount + Number(result.amt) - this.editPrivousAmt;
    result.loanAppSeq = this.disbursementService.loanAppSeq;

    if(result.pymtTypSeq == 124){
      if(result.amt > 50000){
      this.toastr.warning('in Cash Mode, The amount should not be greater than 50,000', 'Error!');
      return;
      }
    }
    // Added BY Naveed Date - 22-07-2022
    // SCR - Mobile Wallet Disbursement Limit
    this.isWallet = this.agencyForm.get('pymtTypSeq').value.typStr.match(/MOBILE WALLET/i);
    if(this.isWallet){
      if(result.amt > 45000){
      this.toastr.warning('in Mobile Wallet Mode, The amount should not be greater than 45,000', 'Warning');
      return;
      }
    }
    this.spinner.show();
    if (!this.edit && validAmt <= this.disbursementAmt) {
      this.disbursementService.addAgency(result, 'add').subscribe(d => {
        this.spinner.hide();
        if(d.mobInvalid){
          this.mobInvalidPopup(d.mobInvalid)
        }else{
          result.dsbmtDtlKey = d.dsbmtDtlKey;
          this.allItems.push(result);
          this.calTotalAmount();
          this.loadPrevWalletNo()
        }
      }, error => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 400) {
          this.toastr.error(error.error.error);
        } else {
          this.toastr.error("something Went Wrong");
        }
      });
    } else if (this.edit && editValidAmt <= this.disbursementAmt) {
      if (result.pymtTypSeq == 124) {
        result.instrNum = '';
      }
      this.disbursementService.addAgency(result, 'update').subscribe(d => {
        this.spinner.hide();
        if(d.mobInvalid){
          this.mobInvalidPopup(d.mobInvalid)
        }else{
          const itemIndex = this.allItems.findIndex(item => item.dsbmtDtlKey === result.dsbmtDtlKey);
          this.allItems[itemIndex] = result;
          this.calTotalAmount();
          this.edit = false;
          this.loadPrevWalletNo()
        }
      }, error => {
        this.spinner.hide();
        if (error.status == 400) {
          this.toastr.warning(error.error.error);
        } else {
          this.toastr.error("something Went Wrong");
        }
      });
    }
    else {
      this.toastr.warning('Total Amount of Vouchers Should be Equal to Disburse Amount', 'Error!')
    }
    this.spinner.hide();
  }
  // Ended by Naveed - Dated - 23-01-2022

  openAddVoucher() {
    (<any>$('#addVoucher')).modal('show');
    this.agencyForm.reset();
    console.log(this.appSts)
    let pyments: any[] = [];
    if (this.appSts != '1305') {
      this.paymentModes.forEach((p) => {
        if (p.typId !== '0009' && p.typId !== '0010' && p.typId !== '0011') {
          pyments.push(p);
        }
      });
      this.paymentModes = null;
      this.paymentModes = pyments;
    }
    // modified By Naveed - Dated 23-01-2022
    // add 'mobWalChnl' and 'mobWalNum' form fields
    this.agencyForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      instrNum: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      amt: [this.disbursementAmt, Validators.required],
      loanAppSeq: [''],
      dsbmtDtlKey: [''],
      mobWalChnl: [''],
      mobWalNum: ['', Validators.compose([Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[92][0-9]+$')])]
    });
    // Ended by Naveed - Dated - 23-01-2022
  }
  editVoucher(voucher: DisbursementVoucherListItem) {
    this.editPrivousAmt = 0;
   
    (<any>$('#addVoucher')).modal('show');
    this.paymentModes.forEach(mode => {
      if (mode.typSeq == voucher.pymtTypSeq) {
        // Modified by Zohaib Asim - Dated 26/01/2021
        this.isCheck = mode.typId === '0008' || mode.typStr.match(/MOBILE WALLET/i) ? true : false;
        voucher.pymtTypSeq = mode;
      }
    });
   
    this.agencyForm.patchValue(voucher);
    this.editPrivousAmt = voucher.amt;
    this.edit = true;
    // modified By Naveed - Dated 23-01-2022
    // set value 'mobWalChnl' and 'mobWalNum' form fields
    this.agencyForm.get('pymtTypSeq').patchValue(voucher.pymtTypSeq);
    this.agencyForm.get('mobWalChnl').patchValue(voucher.mobWalChnl);
    this.agencyForm.get('mobWalNum').patchValue(voucher.mobWalNum);
    this.onRecoveryChange(false);
    // Ended by Naveed - Dated - 23-01-2022
  }

  // Added By Naveed - Dated 23-01-2022
  // display message when mobile wallet number already taken by other client
  mobInvalidPopup(mobInvalid){
    swal({
      title: 'Mobile Wallet No.',
      text: mobInvalid,
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    })
  }
  // Ended by Naveed - Dated - 23-01-2022

  deleteItem(voucher) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Disbursement Voucher?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.disbursementService.deleteAgency(voucher).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(voucher.dsbmtDtlKey), 1);
          this.calTotalAmount();
          this.loadPrevWalletNo()
          swal(
            'Deleted!',
            'Disbursement Voucher values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));

      }
    });

  }
  calTotalAmount() {
    this.totalAmount = 0;
    this.allItems.forEach((d: DisbursementVoucherListItem) => this.totalAmount += +d.amt);
  }

  private loadPaymentModes() {
    this.disbursementService.getPaymentModes().subscribe((data) => {
      this.paymentModes = data;
    });
    
    this.disbursementService.getMobileWalletTypes().subscribe((wallet) =>{
      this.paymentModesWallet = wallet;
    })
  }
  recievemsg($event) {
    this.disbursementAmt = $event;
  }
  paymentReq($event) {
    this.isPaymentReq = $event;
  }
  getPrdSeq($event) {
    this.prdSeq = $event;
  }
  getAppSts($event) {
    this.appSts = $event;
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Added By Naveed - Dated 23-01-2022
  // load all previous mobile wallet numbers for this client
  private loadPrevWalletNo() {
    this.disbursementService.getPrevLoanWalletNo().subscribe((response) => {
      this.prevWalletNo = response;
    });
  }
  // Ended by Naveed - Dated - 23-01-2022
}