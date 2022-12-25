import { Component, OnInit } from '@angular/core';
import { DisbursementService } from '../../../shared/services/disbursement.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MwPdcDtlDTOs, Pdc } from '../../../shared/models/pdc.model';
import swal from 'sweetalert2';
import { MyErrorStateMatcher } from '../../../shared/helpers/MyErrorStateMatcher.helper';
import { ToastrService } from 'ngx-toastr';
import { ApplyPayment } from '../../../shared/models/recovery.model';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
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

@Component({
  selector: 'app-edit-pdc',
  templateUrl: './edit-pdc.component.html',
  styleUrls: ['./edit-pdc.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditPdcComponent implements OnInit {

 

  totalAmount: number = 0;
  allItems: MwPdcDtlDTOs[] = [];
  pdcForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  banks: any[];
  model: any = new Pdc();
  private isPdcHeaderAdded = false;
  private edit: boolean;
  rcevAmt: number = 0;
  //isPdcs:boolean=false;
  isPaymentReq: boolean = false;
  editPrivousAmt: number;
  post: boolean = false;
  minDate: Date;
  maxDate;
  pdcslimit: number;
  // should be false temporary true
  constructor(private router: Router,
    private disbursementService: DisbursementService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private commonService: CommonService) {
    this.pdcForm = this.fb.group({
      pdcId: [''],
      collDt: ['', Validators.required],
      cheqNum: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1,16}')])],
      amt: ['', Validators.required],
      pdcHdrSeq: [''],
      pdcDtlSeq: ['']
    });

   // this.minDate = new Date(sessionStorage.getItem("frstInstDt"));
   // this.maxDate = new Date(sessionStorage.getItem("lsatInstDt"));
    //this.pdcslimit=+sessionStorage.getItem("pdcsLimit");
  }
  onSubmit() {
    if (this.pdcForm.invalid) {
      return;
    }
    let allowPdc: boolean = true;
    const result: MwPdcDtlDTOs = Object.assign({}, this.pdcForm.value);
    this.allItems.forEach(item => {
      if (item.cheqNum == result.cheqNum && item.pdcDtlSeq != result.pdcDtlSeq) {
        allowPdc = false;
      }
    });
    if (!allowPdc) {
      this.toaster.warning('Check Number Already Exist!', 'Error!')
      return;
    }
    (<any>$('#addmember')).modal('hide');
    const validAmt: number = this.totalAmount + Number(result.amt);
    const editValidAmt = this.totalAmount + Number(result.amt) - this.editPrivousAmt;
    if (!this.edit && validAmt <= this.rcevAmt) {
      result.pdcHdrSeq = this.model.pdcHdrSeq;
      result.pdcId = this.allItems == null ? 1 : this.allItems.length + 1;
      this.allItems.push(result);
      this.calTotalAmount();

    } else if (this.edit && editValidAmt <= this.rcevAmt) {
      const itemIndex = this.allItems.findIndex(item => item.pdcId === result.pdcId);
        this.allItems[itemIndex] = result;
        this.edit = false;
        this.calTotalAmount();
    }
    else {
      this.toaster.warning('Total of PDCs should be equal to Receiveable Amount', 'Error!')
    }
  }

  savePdcs(){

    if (this.allItems.length != this.pdcslimit && this.pdcslimit > 0) {
      this.toaster.warning('Accepted number of PDCs are: ' + this.pdcslimit, 'Error!')
      return false;
    }
    if (this.totalAmount != this.rcevAmt && this.pdcslimit != 0) {
      this.toaster.warning('PDC amount should be equal to payable amount', 'Error!')
      return false;
    }

    this.disbursementService.batchPostingPdc(this.model.pdcHdrSeq,this.allItems).subscribe(d => {
      this.getAllItems();
    });

    
    
  }



  editPdc(mwPdcDtlDTOs) {
    this.pdcForm.reset();
    this.editPrivousAmt = 0;
    this.edit = true;
    (<any>$('#addmember')).modal('show');
    this.pdcForm.patchValue(mwPdcDtlDTOs);
    this.editPrivousAmt = mwPdcDtlDTOs.amt;
  }
  ngOnInit() {
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    this.getAllItems();
    this.loadBankList();
  }

private   getAllItems(){
  if (this.pdcslimit != 0) {
    this.disbursementService.getAllPdcs().subscribe((data) => {
      this.model = data;
      if (this.model != null) {
        this.allItems = this.model.mwPdcDtlDTOs;
        console.log('this.allItems', this.allItems)
      }
      if (this.allItems != null) {
		this.totalAmount = 0;
        this.allItems.forEach((d: MwPdcDtlDTOs) => this.totalAmount += + d.amt);
      }
    });
  }

}



  onAddPdc() {
    if (this.allItems.length == this.pdcslimit) {
      this.toaster.warning('Not Allowed to add more PDcs for this product', 'Info!');
      return false;
    }

    if (!this.isPdcHeaderAdded) {
      this.addPdcHeader();
      (<any>$('#addmember')).modal('show');
    } else {
      this.pdcForm.reset();
      (<any>$('#addmember')).modal('show');
    }
  }
  deleteItem(pdcDetail) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this PDC?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        pdcDetail.delFlg = true;
        this.allItems.splice(this.allItems.indexOf(pdcDetail.pdcId), 1);
        this.calTotalAmount();
      }
    });

  }

  public addPdcHeader() {
    this.spinner.show();
    this.model.loanAppSeq = this.disbursementService.loanAppSeq;
    this.disbursementService.addPdcHeader(this.model).subscribe(p => {
      this.spinner.hide();
      this.isPdcHeaderAdded = true;
      this.model.pdcHdrSeq = p.pdcHdrSeq;
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, `Login failed:`);
    });
  }
  loadBankList() {
    this.commonService.getValues(REF_CD_GRP_KEYS.BANKS).subscribe((res) => {
      this.banks = res;
    }, (error) => {
      console.log('err', error);
    });
  }
  calTotalAmount() {
    this.totalAmount = 0;
    this.allItems.forEach((d: MwPdcDtlDTOs) => this.totalAmount += + d.amt);
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  recievemsg($event) {
    this.rcevAmt = $event;
  }

  pdcRequired($event) {
    this.pdcslimit = $event;
  }
  paymentReq($event) {
    this.isPaymentReq = $event;
  }


  disbursementPosting() {
    (<any>$('#DisburseLoan')).modal('hide');
    console.log(this.allItems.length + "---" + this.pdcslimit)
    if (this.allItems.length != this.pdcslimit && this.pdcslimit > 0) {
      this.toaster.warning('Accepted number of PDCs are: ' + this.pdcslimit, 'Error!')
      return false;
    }
    if (this.totalAmount != this.rcevAmt && this.pdcslimit != 0) {
      this.toaster.warning('PDC amount should be equal to payable amount', 'Error!')
      return false;
    }

    this.disbursementService.disbursementPosting(this.post, false).subscribe((data) => {
      this.router.navigate(['/disbursement']);
    });
  }


  openDialog() {
    (<any>$('#DisburseLoan')).modal('show');
  }

}
