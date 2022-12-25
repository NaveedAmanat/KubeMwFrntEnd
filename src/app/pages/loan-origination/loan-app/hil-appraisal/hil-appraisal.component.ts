import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/MyErrorStateMatcher.helper';
import { HilAppraisal } from 'src/app/shared/models/hil-appraisal.model';
import { LoanApplicant } from 'src/app/shared/models/LoanApplicant.model';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoanService } from 'src/app/shared/services/loan.service';

/*  Authored by Areeba
    Dated - 10-05-22
    Home Loan Application
*/


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-hil-appraisal',
  templateUrl: './hil-appraisal.component.html',
  styleUrls: ['./hil-appraisal.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class HilAppraisalComponent implements OnInit {

  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  hilAppraisalForm: FormGroup;
  bizDtlForm: FormGroup;
  model: any; formSaved = false;
  coborrowerFormData: any = new Object();
  matcher = new MyErrorStateMatcher();
  hasPermission = false;
  valid = false;
  nominee: any;
  maxDate: Date = new Date();

  @ViewChild('picker1') private picker: MatDatepicker<Date>;
  chosenYearHandler(ev, input) {
    let { _d } = ev; 
    this.yrOfCnstrctn = _d;
    this.picker.close();
  }
  constructor(private router: Router,
    private fb: FormBuilder, private breadcrumbProvider: BreadcrumbProvider,
    private loanService: LoanService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) { }

    toDate(year){
      var dt = new Date(year, 1, 1);
      return dt;
    }

    loanPurpose : any;
  ngOnInit() {
    this.hilAppraisalForm = this.fb.group({
      //bizDtl: ['', Validators.required],
      yrOfCnstrctn: ['', Validators.required],
      noOfFlrs: ['', Validators.required],
      plotAreaInMrla: ['', Validators.required],
      noOfRooms: ['', Validators.required],
      noOfBdroom: ['', Validators.required],
      noOfWshroom: ['', Validators.required],
      isKtchnSeprt: ['', Validators.required]
    });
    this.bizDtlForm = this.fb.group({
      clntSeq : [''],
      bizDtl: ['', Validators.required]

    });

    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
    });
    this.spinner.hide();

    this.commonService.getActivity("8").subscribe((res) => {
      this.loanPurpose = res;
    });
    this.model = JSON.parse(sessionStorage.getItem('model'));
    console.log(this.model)
    if (this.model.forms) {
      let hasboth = false;
      this.model.forms.forEach(element => {
        if (element.formUrl == 'nominee') {
          this.model.forms.forEach(form => {
            if (form.formUrl == 'next-of-kin') {
              hasboth = true;
              form.hasNextOfKin = true;
              element.hasNextOfKin = true;
              hasboth = true;
            }
          })
        }
      });
      this.model.forms.forEach(
        (element, index) => {
          if ((element.formUrl === 'co-borrower' && this.model.selfPDC) || (element.formUrl === 'co-borrower' && this.model.isSAN)) {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
          } else if (element.formUrl == "mfcib" || element.formUrl == "documents") {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          } else if (element.formUrl == 'next-of-kin') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {

                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else if (element.formUrl == 'nominee') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == false || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else {
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          }
          if ('/loan-origination/app/' + element.formUrl === this.router.url) {
            this.model.formSeq = element.formSeq;
          }
        }
      );
    }

    if (!this.model.hilAppraisal) {
      this.model.hilAppraisal = new HilAppraisal();
      // this.model.hilAppraisal.bizDtl = [];
      this.model.hilAppraisal.yrOfCnstrctn = [];
      this.model.hilAppraisal.noOfFlrs = [];
      this.model.hilAppraisal.plotAreaInMrla = [];
      this.model.hilAppraisal.noOfRooms = [];
      this.model.hilAppraisal.noOfBdroom = [];
      this.model.hilAppraisal.noOfWshroom = [];
      this.model.hilAppraisal.isKtchnSeprt = [];
    }

    if (sessionStorage.getItem('editLoan') == 'true') {
      this.getBizAprslSeq(this.model.loanAppSeq);

    } else {
      console.log("You cannot edit this loan.");
      // this.loadLovs();
      // this.onSectorChangeLocal();
    }

  }

  bizDtl: string;
  bizAprslSeq: string;
  hmAprslSeq: string;
  yrOfCnstrctn: number;
  noOfFlrs: number;
  plotAreaInMrla: number;
  noOfRooms: number;
  noOfBdroom: number;
  noOfWshroom: number;
  isKtchnSeprt: boolean;

  getBizAprslSeq(loanAppSeq) {
    this.spinner.show();
    this.loanService.getBusinessAppraisal(loanAppSeq).subscribe((res) => {
      this.bizAprslSeq = res.BusinessApraisal.bizAprslSeq;
      this.loanService.getHilAppraisal(this.bizAprslSeq).subscribe((res) => {
        if (res != null) {
          this.spinner.hide();
          this.hmAprslSeq = res.hmAprslSeq;
          // this.bizDtl = res.
          this.yrOfCnstrctn = res.yrOfCnstrctn;
          this.noOfFlrs = res.noOfFlrs;
          this.plotAreaInMrla = res.plotAreaInMrla;
          this.noOfRooms = res.noOfRooms;
          this.noOfBdroom = res.noOfBdroom;
          this.noOfWshroom = res.noOfWshroom;
          if (res.isKtchnSeprt == 1)
            this.isKtchnSeprt = true;
          else
            this.isKtchnSeprt = false;

          this.hilAppraisalForm = this.fb.group({
            yrOfCnstrctn: [res.yrOfCnstrctn],
            noOfFlrs: [res.noOfFlrs],
            plotAreaInMrla: [res.plotAreaInMrla],
            noOfRooms: [res.noOfRooms],
            noOfBdroom: [res.noOfBdroom],
            noOfWshroom: [res.noOfWshroom],
            isKtchnSeprt: [res.isKtchnSeprt]
          });
        }
      }, (error) => {
        console.log('err In Loan Service');
        console.log('err', error);
      });
    }, (error) => {
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  continueClicked() {
    if (this.model.forms) {
      let i = 0;
      this.model.forms.forEach(
        forms => {
          if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
            this.router.navigate(["/loan-origination/app/" + this.model.forms[i + 1].formUrl]);
          }
          i++;
        }
      );
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get form() {
    return this.hilAppraisalForm.controls;
  }

  submitted = false;

  changePurpose(event){
    this.model.bizDtl = event.value;
    console.log(this.model.bizDtl);
  }

  loanAppObj: LoanApplicant;
  onHilAppraisalFormSubmit(hilAppraisal) {
    this.spinner.show();
    let hilAprslObj = new HilAppraisal();

    if (hilAppraisal.yrOfCnstrctn == "" || hilAppraisal.plotAreaInMrla == "" || hilAppraisal.noOfFlrs == "" || hilAppraisal.noOfRooms == ""
      || hilAppraisal.noOfBdroom == "" || hilAppraisal.noOfWshroom == "") {
      this.valid = false;
      return;
    }
    else this.valid = true;
    // this.form.yrOfCnstrctn.setValidators([Validators.required]);
    // this.form.plotAreaInMrla.setValidators([Validators.required]);
    // this.form.noOfFlrs.setValidators([Validators.required]);
    // this.form.noOfRooms.setValidators([Validators.required]);
    // this.form.noOfBdroom.setValidators([Validators.required]);
    // this.form.noOfWshroom.setValidators([Validators.required]);
    // this.form.isKtchnSeprt.setValidators([Validators.required]);

    // this.form.yrOfCnstrctn.updateValueAndValidity();
    // this.form.plotAreaInMrla.updateValueAndValidity();
    // this.form.noOfFlrs.updateValueAndValidity();
    // this.form.noOfRooms.updateValueAndValidity();
    // this.form.noOfBdroom.updateValueAndValidity();
    // this.form.noOfWshroom.updateValueAndValidity();
    // this.form.isKtchnSeprt.updateValueAndValidity();

    // this.submitted = true;

    // if (this.hilAppraisalForm.invalid) {
    //   console.log("invalid");
    //   return;
    // }

    //hilAprslObj.bizDtl = this.bizDtl;
    hilAprslObj.hmAprslSeq = parseInt(this.hmAprslSeq);
    hilAprslObj.bizAprslSeq = parseInt(this.bizAprslSeq);
    hilAprslObj.yrOfCnstrctn = this.yrOfCnstrctn;
    hilAprslObj.plotAreaInMrla = this.plotAreaInMrla;
    hilAprslObj.noOfFlrs = this.noOfFlrs;
    hilAprslObj.noOfRooms = this.noOfRooms;
    hilAprslObj.noOfBdroom = this.noOfBdroom;
    hilAprslObj.noOfWshroom = this.noOfWshroom;
    hilAprslObj.isKtchnSeprt = this.isKtchnSeprt ? 1 : 0;

    this.loanService.updateHilAppraisal(hilAprslObj).subscribe((res) => {
      this.formSaved = true;
      this.spinner.hide();
      this.toaster.success('HIL Appraisal Saved');

    }, (error) => {
      this.spinner.hide();
      this.toaster.warning('err', error);
      console.log('err In Loan Service');
      console.log('err', error);
    });

    this.loanService.savePersonalInfo(this.model).subscribe((res) => {
      sessionStorage.setItem('model', JSON.stringify(this.model));
      this.formSaved = true;
      this.spinner.hide();

    }, (error) => {
      this.spinner.hide();
      this.toaster.warning('err', error);
      console.log('err In Loan Service');
      console.log('err', error);
    });

    if (this.model.forms) {
      this.model.
        forms.forEach(
          forms => {
            if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
              forms.isSaved = true;
              this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
            }
          }
        );
    }
  }
  cancelClicked() {

  }

}
