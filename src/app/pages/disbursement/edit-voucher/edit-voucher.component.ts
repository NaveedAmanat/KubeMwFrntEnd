import { Component, OnInit } from '@angular/core';
import { DisbursementVoucherListItem, AgencyVoucher } from 'src/app/shared/models/disbursementVoucherListItem.model';
import swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/MyErrorStateMatcher.helper';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css']
})
export class EditVoucherComponent implements OnInit {

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
  auth: any;
  constructor(private router: Router,
    private disbursementService: DisbursementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private toaster: ToastrService) {
    this.agencyForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      instrNum: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      amt: [{ value: '', disabled: true }, Validators.required],
      loanAppSeq: [''],
      dsbmtDtlKey: ['']
    });
  }

  ngOnInit() {
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    console.log(this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq')))
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
    this.disbursementService.getAllAgencies().subscribe((data) => {
      this.model = data;
      this.allItems = this.model.disbursementVoucherDetailDTOs;
      this.allItems.forEach((d: DisbursementVoucherListItem) => {
        this.totalAmount += + d.amt;
        console.log(d)
        d.pymtTypSeq = { typSeq: d.pymtTypSeq }
      });
      console.log(this.allItems)
    });
    console.table(this.allItems)
    this.loadPaymentModes();
    sessionStorage.setItem("frstInstDt", new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy'));
    sessionStorage.setItem("lsatInstDt", new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy'));
  }
  onRecoveryChange() {
    const instrNum = this.agencyForm.get('instrNum');
    if (this.agencyForm.get('pymtTypSeq').value.typId === '0008') {
      this.isCheck = true;
      instrNum.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
    } else {
      instrNum.clearValidators();
      this.isCheck = false;
    }
    instrNum.updateValueAndValidity();

  }
  onSubmit() {
    if (this.edit) {
      let a = this.agencyForm.controls['pymtTypSeq'].value
      if (this.voucher.pymtTypSeq.typSeq == a.typSeq) {
        this.toastr.info('Payment Cannot Same', 'Information');
        return;
      }

      if ((this.voucher.pymtTypSeq.typId == "0001" || this.voucher.pymtTypSeq.typId == "0008") && a.typId == "0004") {
        this.toastr.info('Easy Pay Not Allowed', 'Information');
        return;
      }
    }



    // console.log(this.voucher.pymtTypSeq.typSeq)
    // console.log(this.agencyForm.controls['pymtTypSeq'].value)
    // return;
    const result: any = Object.assign({}, this.agencyForm.getRawValue());
    result.pymtTypSeq = result.pymtTypSeq.typSeq;
    (<any>$('#addVoucher')).modal('hide');
    const validAmt: number = this.totalAmount + Number(result.amt);
    const editValidAmt = this.totalAmount + Number(result.amt) - this.editPrivousAmt;
    result.loanAppSeq = this.disbursementService.loanAppSeq;
    if (!this.edit && validAmt <= this.disbursementAmt) {
      this.disbursementService.addAgency(result, 'add').subscribe(d => {
        result.dsbmtDtlKey = d.dsbmtDtlKey;
        this.allItems.push(result);
        this.calTotalAmount();
      });
    } else if (this.edit && editValidAmt <= this.disbursementAmt) {
      if (result.pymtTypSeq == 124) {
        result.instrNum = '';
      }
      this.disbursementService.addAgency(result, 'update').subscribe(d => {
        console.log(result)
        this.paymentModes.forEach(mode => {
          if (mode.typSeq == result.pymtTypSeq) {
            this.isCheck = mode.typId === '0008' ? true : false;
            result.pymtTypSeq = mode;
          }
        });
        const itemIndex = this.allItems.findIndex(item => item.dsbmtDtlKey === result.dsbmtDtlKey);
        this.allItems[itemIndex] = result;
        this.calTotalAmount();
        this.edit = false;
      });
    }
    else {
      this.toastr.warning('Total Amount of Vouchers Should be Equal to Disburse Amount', 'Error!')
    }

  }
  openAddVoucher() {
    (<any>$('#addVoucher')).modal('show');
    this.agencyForm.reset();
    this.agencyForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      instrNum: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')])],
      amt: [this.disbursementAmt, Validators.required],
      loanAppSeq: [''],
      dsbmtDtlKey: ['']
    });
  }
  voucher;
  editVoucher(voucher: DisbursementVoucherListItem) {
    console.log(this.allItems)
    this.editPrivousAmt = 0;
    this.onRecoveryChange();

    this.paymentModes.forEach(mode => {
      if (mode.typSeq == voucher.pymtTypSeq.typSeq) {
        this.isCheck = mode.typId === '0008' ? true : false;
        voucher.pymtTypSeq = mode;
      }
    });
    this.agencyForm.patchValue(voucher);
    // this.agencyForm.controls.pymtTypSeq.setValue(this.voucher.pymtTypSeq.typSeq)
    this.editPrivousAmt = voucher.amt;
    this.edit = true;
    this.voucher = voucher;
    console.log(this.voucher);
    (<any>$('#addVoucher')).modal('show');
  }

  gettingValueOfPayment(typStr) {
    let a = '';
  }

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
  paymentModesOrig: any = [];
  private loadPaymentModes() {
    this.disbursementService.getClntPaymentTypes().subscribe((data) => {
      this.paymentModes = data;
      this.paymentModesOrig = data;
      console.log(this.paymentModes);
      let i = -1;
      this.paymentModes.forEach((m, ind) => {
        if (m.typId == '0007') {
          i = ind;
        }
      })
      if (i > -1) {
        this.paymentModes.splice(i, 1);
      }
    });
  }
  saveVouchers() {
    this.disbursementService.saveVoucherErrorRectifications().subscribe(d => {
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 404) {
        this.toaster.error("404", "Error")
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });

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
}
