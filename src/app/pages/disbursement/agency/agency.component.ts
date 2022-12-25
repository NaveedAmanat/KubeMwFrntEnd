import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DisbursementService} from '../../../shared/services/disbursement.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../shared/services/common.service';
import {AgencyVoucher, DisbursementVoucherListItem} from '../../../shared/models/disbursementVoucherListItem.model';
import {MyErrorStateMatcher} from '../../../shared/helpers/MyErrorStateMatcher.helper';
import swal from 'sweetalert2';
import {DISB_VOUCHER} from '../../../shared/mocks/mock_common_codes';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  allItems: DisbursementVoucherListItem[] = [];
  totalAmount = 0;
  agencyForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  submitted = false;
  model: AgencyVoucher = new AgencyVoucher();
  paymentModes: any[] = [];
  private edit = false;
  constructor(private router: Router,
              private disbursementService: DisbursementService,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder,
              private commonService: CommonService) {
    this.agencyForm = this.fb.group({
      pymtTypSeq: ['', Validators.required],
      instrNum: ['', Validators.required],
      amt: ['', Validators.required],
      loanAppSeq: [''],
      dsbmtDtlKey: ['']
    });
  }

  ngOnInit() {
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    this.disbursementService.getAllAgencies().subscribe((data) => {
      this.model = data;
      this.allItems = this.model.disbursementVoucherDetailDTOs;
      this.allItems.forEach((d: DisbursementVoucherListItem) => this.totalAmount += d.amt);
    });
    // this.model = DISB_VOUCHER;
    // this.allItems = this.model.disbursementVoucherDetailDTOs;
    // console.log(this.allItems);
    // this.allItems.forEach((d: DisbursementVoucherListItem) => this.totalAmount += d.amt);
    this.loadPaymentModes();
  }

  onSubmit() {
    const result: DisbursementVoucherListItem = Object.assign({}, this.agencyForm.value);
    (<any>$('#addVoucher')).modal('hide');
    result.loanAppSeq = this.disbursementService.loanAppSeq;
    if (!this.edit) {
      this.disbursementService.addAgency(result, 'add').subscribe(d => {
        result.dsbmtDtlKey = d.dsbmtDtlKey;
        this.allItems.push(result);
      });
    } else {
      this.disbursementService.addAgency(result, 'update').subscribe(d => {
          const itemIndex = this.allItems.findIndex(item => item.dsbmtDtlKey === result.dsbmtDtlKey);
          this.allItems[itemIndex] = result;
          this.edit = false;
      });
    }
  }
  openAddVoucher() {
    (<any>$('#addVoucher')).modal('show');
    this.agencyForm.reset();
  }
  editVoucher(voucher: DisbursementVoucherListItem) {
    (<any>$('#addVoucher')).modal('show');
    this.agencyForm.patchValue(voucher);
    this.edit = true;
  }

  deleteItem(voucher) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this agency?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.disbursementService.deleteAgency(voucher).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(voucher.dsbmtDtlKey), 1);
          swal(
            'Deleted!',
            'agency values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });

  }

  private loadPaymentModes() {
    this.disbursementService.getPaymentModes().subscribe((data) => {
      this.paymentModes = data;
    });
    // this.paymentModes = [
    //   {
    //     'typSeq': 9,
    //     'typStr': 'EASY PAISA',
    //     'glAcctNum': null,
    //     'typStsKey': null,
    //     'typCtgryKey': null,
    //     'typId': null,
    //     'chrgTyp': null,
    //     'effStartDt': null,
    //     'effEndDt': null,
    //     'crtdBy': null,
    //     'crtdDt': null,
    //     'lastUpdBy': null,
    //     'lastUpdDt': null,
    //     'delFlg': null,
    //     'crntRecFlg': null
    //   },
    //   {
    //     'typSeq': 11,
    //     'typStr': 'UBL OMNI',
    //     'glAcctNum': null,
    //     'typStsKey': null,
    //     'typCtgryKey': null,
    //     'typId': null,
    //     'chrgTyp': null,
    //     'effStartDt': null,
    //     'effEndDt': null,
    //     'crtdBy': null,
    //     'crtdDt': null,
    //     'lastUpdBy': null,
    //     'lastUpdDt': null,
    //     'delFlg': null,
    //     'crntRecFlg': null
    //   },
    //   {
    //     'typSeq': 13,
    //     'typStr': 'NADRA',
    //     'glAcctNum': null,
    //     'typStsKey': null,
    //     'typCtgryKey': null,
    //     'typId': null,
    //     'chrgTyp': null,
    //     'effStartDt': null,
    //     'effEndDt': null,
    //     'crtdBy': null,
    //     'crtdDt': null,
    //     'lastUpdBy': null,
    //     'lastUpdDt': null,
    //     'delFlg': null,
    //     'crntRecFlg': null
    //   },
    //   {
    //     'typSeq': 14,
    //     'typStr': 'JAZZ Cash',
    //     'glAcctNum': null,
    //     'typStsKey': null,
    //     'typCtgryKey': null,
    //     'typId': null,
    //     'chrgTyp': null,
    //     'effStartDt': null,
    //     'effEndDt': null,
    //     'crtdBy': null,
    //     'crtdDt': null,
    //     'lastUpdBy': null,
    //     'lastUpdDt': null,
    //     'delFlg': null,
    //     'crntRecFlg': null
    //   }
    // ];
  }


}
