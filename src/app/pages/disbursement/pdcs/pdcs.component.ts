import { error } from '@angular/compiler/src/util';
import { Component, OnInit, Inject } from '@angular/core';
import { DisbursementService } from '../../../shared/services/disbursement.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { LoanService } from 'src/app/shared/services/loan.service';
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
  selector: 'app-pdcs',
  templateUrl: './pdcs.component.html',
  styleUrls: ['./pdcs.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PdcsComponent implements OnInit {

  isGenerate: boolean = false;
  totalAmount: number = 0;
  allItems: MwPdcDtlDTOs[] = [];
  pdcForm: FormGroup;
  checkListForm: FormGroup;
  generatePdcForm: FormGroup;
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
  showHlthCard: boolean = false;
  // should be false temporary true

  prdGrpSeq: number = 0;
  loanAppStatus = '0';
  cnicNum = '0';

  disbAmount: number = 0;
  
  constructor(private router: Router,
    private disbursementService: DisbursementService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private commonService: CommonService,
    private loanService: LoanService) {
    this.pdcForm = this.fb.group({
      pdcId: [''],
      collDt: ['', Validators.required],
      cheqNum: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1,16}')])],
      amt: ['', Validators.required],
      pdcHdrSeq: [''],
      pdcDtlSeq: ['']
    });

    this.checkListForm = this.fb.group({
      pdcFlg: [false, Validators.requiredTrue],
      orgnlCnicFlg: [false, Validators.requiredTrue],
      mfiActvLoansFlg: [false, Validators.requiredTrue],
      verisysFlg: [false, Validators.requiredTrue],
      clntAgremntFlg: [false, Validators.requiredTrue],
      clntDueDtAgremntFlg: [false, Validators.requiredTrue]
    });


    this.minDate = new Date(sessionStorage.getItem("frstInstDt"));
    this.maxDate = new Date(sessionStorage.getItem("lsatInstDt"));
    //this.pdcslimit=+sessionStorage.getItem("pdcsLimit");


  }
  onSubmit() {
    if (this.pdcForm.invalid) {
      return;
    }
    let allowPdc: boolean = true;
    const result: MwPdcDtlDTOs = Object.assign({}, this.pdcForm.getRawValue());
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

    console.log(editValidAmt)

    if (!this.edit && validAmt <= this.rcevAmt) {
      result.pdcHdrSeq = this.model.pdcHdrSeq;
      result.pdcId = this.allItems == null ? 1 : this.allItems.length + 1;
      this.disbursementService.addPdc(result, 'add').subscribe(d => {
        result.pdcDtlSeq = d.pdcDtlSeq;
        this.allItems.push(result);
        this.calTotalAmount();
      });

    } else if (this.edit && editValidAmt <= this.rcevAmt) {
      this.disbursementService.addPdc(result, 'update').subscribe(d => {
        const itemIndex = this.allItems.findIndex(item => item.pdcId === result.pdcId);
        this.allItems[itemIndex] = result;
        this.edit = false;
        this.calTotalAmount();
      });
    }
    else {
      this.toaster.warning('Total of PDCs should be equal to Receiveable Amount', 'Error!')
    }

  }
  editPdc(mwPdcDtlDTOs) {
    let collectionDate = this.pdcForm.get('collDt');
    let amt = this.pdcForm.get('amt');

    console.log(mwPdcDtlDTOs)
    this.pdcForm.reset();
    this.editPrivousAmt = 0;
    this.edit = true;
    collectionDate.disable();
    amt.disable();
    (<any>$('#addmember')).modal('show');
    // this.pdcForm = this.fb.group({
    //   pdcId: [mwPdcDtlDTOs.pdcId],
    //   collDt: [{ value: '', disabled: true }, mwPdcDtlDTOs.collDt],
    //   cheqNum: [{ value: '', disabled: true }, mwPdcDtlDTOs.cheqNum],
    //   amt: [mwPdcDtlDTOs.amt],
    //   pdcHdrSeq: [mwPdcDtlDTOs.pdcHdrSeq],
    //   pdcDtlSeq: [mwPdcDtlDTOs.pdcDtlSeq]
    // });
    this.pdcForm.patchValue(mwPdcDtlDTOs);
    this.editPrivousAmt = mwPdcDtlDTOs.amt;
  }
  plans = []; obj = null;
  ngOnInit() {
    console.log(Number.parseInt(sessionStorage.getItem('loanAppSeq')))
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    console.log(this.pdcslimit)
    if (this.pdcslimit != 0) {
      this.disbursementService.getAllPdcs().subscribe((data) => {
        this.model = data;
        console.log('this.allItems', data)
        console.log('this.model', this.model)
        if (this.model) {
          this.allItems = this.model.mwPdcDtlDTOs;
        }
        if (this.allItems != null) {
          this.allItems.forEach((d: MwPdcDtlDTOs) => this.totalAmount += + d.amt);
        }
      });
    }
    this.loadBankList();

    this.generatePdcForm = this.fb.group({
      loanAppSeq: [Number.parseInt(sessionStorage.getItem('loanAppSeq'))],
      bankKey: ['', Validators.required],
      brnchNm: ['', Validators.required],
      acctNum: ['', Validators.required],
      cheqNum: ['', Validators.required]
    });

    this.loanService.getInsurancePlans().subscribe((res) => {
      console.log(res);
      this.plans = res;
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });


    this.loanService.getSavedInsurancePlan(sessionStorage.getItem('loanAppSeq')).subscribe((res) => {
      this.obj = res;
      console.log(res);
    }, (error) => {
      console.log('err In Loan Info Service');
      console.log('err', error);
    });

    this.disbursementService.checkForAml().subscribe(res => {
      if (res != null) {
        this.amlMtch = res;
        if (res.matched == 'true')
          this.hasAmlMatch = true;
      }
    });

  }
  hasAmlMatch = false;
  amlChck = false;

  amlMtch: any = null;

  onAddPdc() {
    if (this.allItems.length == this.pdcslimit) {
      this.toaster.warning('Not Allowed to add more PDcs for this product', 'Info!');
      return false;
    }

    if (!this.isPdcHeaderAdded) {
      this.addPdcHeader();
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
        console.log(pdcDetail);
        this.disbursementService.deletePdc(pdcDetail).subscribe(() => {
          this.allItems.splice(this.allItems.indexOf(pdcDetail.pdcId), 1);
          this.calTotalAmount();
          swal(
            'Deleted!',
            'Pdcs values has been deleted.',
            'success'
          );
        }, error => console.log('There was an error: ', error));
      }
    });

  }

  private addPdcHeader() {
    this.spinner.show();
    this.model.loanAppSeq = this.disbursementService.loanAppSeq;
    this.disbursementService.addPdcHeader(this.model).subscribe(p => {
      this.spinner.hide();
      this.isPdcHeaderAdded = true;
      this.model.pdcHdrSeq = p.pdcHdrSeq;
    }
      // , (error) => {
      //   console.log(error)
      //   console.log(error.status)
      //   this.spinner.hide();
      //   this.toaster.error(error.error.error, `Login failed:`);
      //   console.log('err In User Service');
      //   console.log('err', error);
      // });
      , (error) => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error.error, "Error")
        }
      });
  }
  loadBankList() {
    this.commonService.getValues(REF_CD_GRP_KEYS.BANKS).subscribe((res) => {
      console.log(this.banks)
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

  /**
   * Added By Naveed - Date - 11-05-2022
   * get PrdGrpSeq and Loan Sts
   */

  getPrdGrpSeq($event) {
    this.prdGrpSeq = $event;
  }

  getDisbAmount($event) {
    this.disbAmount = $event;
  }

  getLoanAppStatus($event){
    this.loanAppStatus = $event;
  }

  getCnicNum($event){
    this.cnicNum = "";
    $event.split("").forEach((item, index) => {
      if (index == 5 || index == 12)
      this.cnicNum = this.cnicNum + '-';
      this.cnicNum = this.cnicNum + item;
    })
    console.log('this.cnicNum', this.cnicNum)
    // this.cnicNum = $event;
  }
 
  /**
   * Pdc Taken CheckBox Won't Shown If Product KEL/KFK
   */
  isPDCTakenShow(){
    let flag = false;
      if(this.prdGrpSeq == 13 || this.prdGrpSeq == 5766){
        this.checkListForm.controls.pdcFlg.clearValidators();
        flag = false;
      }else{
        this.checkListForm.controls.pdcFlg.setValidators(Validators.requiredTrue);
        flag = true;
      }
      this.checkListForm.controls.pdcFlg.updateValueAndValidity();
      return flag;
  }
 // End by Naveed
  pdcRequired($event) {
    this.pdcslimit = $event;
    console.log(this.pdcslimit)
  }
  paymentReq($event) {
    this.isPaymentReq = $event;
  }
  isHealthCard($event) {
    this.showHlthCard = $event;
  }
  disbFlg: boolean = false;

  disbursementPosting() {
    this.disbFlg = true;
    this.spinner.show();
    (<any>$('#DisburseLoan')).modal('hide');
    if (this.hasAmlMatch) {
      for (let z = 0; z < this.amlMtch.length; z++) {
        if (this.amlMtch[z].stpFlg) {
          this.toaster.warning('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
          this.spinner.hide();
          this.disbFlg = false;
          return false;
        }
      }

    }
    if (this.allItems != null && this.pdcslimit > 0 && this.allItems.length != this.pdcslimit) {
      this.toaster.warning('Accepted number of PDCs are: ' + this.pdcslimit, 'Error!');
      this.spinner.hide();
      this.disbFlg = false;
      return false;
    }
    if (this.totalAmount != this.rcevAmt && this.pdcslimit != 0) {
      this.toaster.warning('PDC amount should be equal to payable amount', 'Error!');
      this.spinner.hide();
      this.disbFlg = false;
      return false;
    }
    this.disbursementService.disbursementPosting(this.post, this.amlChck).subscribe((data) => {
    // Update By Naveed - Dated - 24-11-2021
    // oragnized response status
      this.spinner.hide();
      if(data.status  == 0){
        // Else-IF Condition added by Zohaib Asim - 19-12-2020 - KSZB Claims
         if (this.post && this.showHlthCard) {
          this.printHealthCard();
          } else if(this.post && (data.prdSeq == 10 && data.loanAppSts == "1305")
          || (data.prdSeq == 25 || data.prdSeq == 26 || data.prdSeq == 30 || data.prdSeq == 31
          || data.prdSeq == 32)){
          this.printHealthCard();
        }
        this.printOneLinkSlip();
      // End by Zohaib Asim
        this.toaster.success(data.sucess, 'Success!')
         if (data.chckAmnt != undefined || data.chckAmnt != null) {
          this.chckAmnt = data.chckAmnt;
          (<any>$('#AmountModal')).modal('show');
          return;
        }
        this.router.navigate(['/disbursement']);
      }else if (data.status == 1) {
        // Added By Naveed - Dated - 24-11-2021
        // Operation - SCR System Control
        this.discardApp();
        // Added By Naveed - Dated - 24-11-2021
      }else if(data.status == 2 || data.status == 3 || data.status == 4){
        this.toaster.warning(data.message, 'Warning');
        return;
      }

    }, err => {
      console.log(err)
      this.spinner.hide();
      if (err.status === 409) {
        this.spinner.hide();
        this.toaster.warning(err.error.error, "Error");
      }
    });
  }

  // Added By Naveed - Dated - 24-11-2021
  // Operation - SCR System Control
  discardApp(){
    swal({
      title: 'Discard it',
      text: 'Dear User, as per the 30-day loan application policy, this application has expired and will be discarded. Please generate new application for the client.',
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    })
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        let cmnt  = 'Discarded As per the 30-day loan application policy';
        let loanAppSeq = +sessionStorage.getItem('loanAppSeq')
        this.loanService.deleteApplication(loanAppSeq, cmnt).subscribe(res => {
          this.spinner.hide();
          swal(
            'Discarded!',
            'Application has been Discarded.',
            'success'
          );
          this.router.navigate(['/disbursement']);
        }, error => {
          this.spinner.hide();
          console.log(error)
        })
      }
    });
}

  chckAmtSubmit(){
    (<any>$('#AmountModal')).modal('hide');
    this.router.navigate(['/disbursement']);
  }
  chckAmnt = 0;
  openDialog() {
    this.checkListForm.reset();

    /**
     * Modified by Naveed - Date - 11-05-2022
     * Modified by Areeba - Date - 14-12-2022
     * CheckListForm won't shown if Product (KSK, KM(sale-1), KMWM(sale-1)) 
     */

    if(this.prdGrpSeq == 19 || ( this.prdGrpSeq == 6 && this.loanAppStatus == '1305') || ( this.prdGrpSeq == 24 && this.loanAppStatus == '1305')){
        (<any>$('#DisburseLoan')).modal('show');
    }else{
      this.spinner.show();
      this.disbursementService.getDisbursePostingCheckList().subscribe(
        response =>{
          this.spinner.hide();
            if(response.warning){
              this.toaster.warning('Warning', response.warning);
            }else{
              this.checkListForm.patchValue(response);
              console.log(this.checkListForm.value);
              (<any>$('#checkList')).modal('show');
            }
        },
        error =>{
          this.spinner.hide();
          this.toaster.error('Error', 'Internal Server Error ');
          console.log(error);
        }
      );
    }
  }

  submitCheckList(){  
    this.disbursementService.disbursePostingCheckList(this.checkListForm.value).subscribe(
        response =>{
            if(response.success){
              this.toaster.success('Success', response.success);
              (<any>$('#checkList')).modal('hide');
              (<any>$('#DisburseLoan')).modal('show');
            }else if(response.warning){
              this.toaster.warning('Warning', response.warning);
            }
        },
        error =>{
          this.toaster.error('Error', 'Internal Server Error ');
          console.log(error);
        }
    )
  }

  printHealthCard() {
    let plan = null;
    
    // Added by Zohaib Asim - Dated 23-12-2020
    // Object should have values to Print report
    if(this.obj == null){
      this.loanService.getSavedInsurancePlan(sessionStorage.getItem('loanAppSeq')).subscribe((res) => {
        this.obj = res;

        console.log("printHealthCard -> getSavedInsurancePlan:", res);
      }, (error) => {
        console.log('err In Loan Info Service');
        console.log('err', error);
      });
    }
    console.log("After this.obj condition")
    // End by Zohaib Asim

    if (this.obj != null && this.obj.healthInsrPlanSeq != null) {
      this.plans.forEach(pln => {
        if (this.obj.healthInsrPlanSeq == pln.hlthInsrPlanSeq) {
          plan = pln;
        }
      });
    }
    console.log(plan)
    if (plan != null && plan.hlthCardFlg != undefined && plan.hlthCardFlg != null && plan.hlthCardFlg != undefined) {
      if (plan.hlthCardFlg == true) {
        this.disbursementService.getHealthCardPdf().subscribe((response) => {
          var binaryData = [];
          binaryData.push(response);
          var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          window.open(fileURL, '_blank');
        });
      }
    }

  }


  // onSubmitGenerate() {
  //   this.isGenerate = !this.isGenerate;
  // }

  onGenerateClick() {
    (<any>$('#generatePdcsModal')).modal('show');
  }
  pdcGenFlg = false;
  generatePdcSubmit() {
    this.spinner.show();
    this.pdcGenFlg = true;
    console.log(this.generatePdcForm.value)
    // if (this.generatePdcForm.controls['acctNum'].value == this.generatePdcForm.controls['cheqNum'].value) {
    //   this.pdcGenFlg = false;
    //   this.spinner.hide();
    //   this.toaster.error("Account Num & Cheque Num Cannot be Same", "Error");
    //   return;
    // } else {
    this.disbursementService.generatePdcs(this.generatePdcForm.value).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      this.pdcGenFlg = false;
      console.log(res.mwPdcDtlDTOs)
      this.model = res;
      if (res != null) {
        this.allItems = this.model.mwPdcDtlDTOs;
      }
      if (this.allItems != null) {
        this.allItems.forEach((d: MwPdcDtlDTOs) => this.totalAmount += + d.amt);
      }
      (<any>$('#generatePdcsModal')).modal('hide');
      // this.isGenerate = !this.isGenerate;
    }, (error) => {
      console.log(error.status)
      this.pdcGenFlg = false;
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        this.toaster.error(error.error.error, "Error")
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }
  // }

  // Added by Areeba - Dated 31-10-2022
  printOneLinkSlip() {
    this.spinner.show();
    this.disbursementService.getOneLinkPdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }
  //Ended by Areeba
}


