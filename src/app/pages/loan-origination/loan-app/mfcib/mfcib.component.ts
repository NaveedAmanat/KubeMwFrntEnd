import { CommonService } from '../../../../shared/services/common.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { LoanService } from '../../../../shared/services/loan.service';
import { Router } from '@angular/router';
import { MFCIBLoan } from '../../../../shared/models/mfcib.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-mfcib',
  templateUrl: './mfcib.component.html',
  styleUrls: ['./mfcib.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MFCIBComponent implements OnInit, DoCheck {

  output: JSON;
  obj: any =
    {
      "report": {
        "ROOT": {
          "CCP_SUMMARY": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 26096087,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": 9,
              "P30": "-",
              "P180": "-"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 5288909,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": "-",
              "P30": "-",
              "P180": "-"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 5165623,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": "-",
              "P30": "-",
              "P180": "-"
            }
          ],
          "INDIVIDUAL_DETAIL": {
            "CREATION_DATE": "17/10/2005",
            "NIC": "",
            "FATHER_HUSBAND_MNAME": "",
            "IS_SELF": "Y",
            "LAST_NAME": "BOKHARI",
            "FIRST_NAME": "FARAH",
            "FILE_NO": 58852626,
            "TRANX_NO": 545107247,
            "FATHER_HUSBAND_FNAME": "NBHJCK",
            "DOB": "09/01/1960",
            "GENDER": "Female",
            "MIDDLE_NAME": "",
            "CNIC": 3220320112278,
            "PROFESSION": "",
            "TRANX_DATE": "29/06/2019",
            "FATHER_HUSBAND_LNAME": "BPUVLJV",
            "REFERENCE_NO": 24320094496442,
            "MAKER": "MAKE",
            "CHECKER": "CHK"
          },
          "EMPLOYER_INFORMATION": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "EMPLOYER": "GOVERNMENT SCHOOL",
              "REPORTED_ON": "03/07/2015",
              "SELF_EMPLOYED": "NO",
              "CITY": "LAYYAH",
              "SEQ_NO": "Previous",
              "DESIGNATION": "HEAD MASTER",
              "ADDRESS": "GOVT GIRLS H/S JESAL KALSRA",
              "PHONE2": "",
              "PHONE1": 3008767816
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "EMPLOYER": "GOVERNMENT SCHOOL",
              "REPORTED_ON": "15/12/2015",
              "SELF_EMPLOYED": "NO",
              "CITY": "LAYYAH",
              "SEQ_NO": "Latest",
              "DESIGNATION": "HEAD MASTER",
              "ADDRESS": "GIRLS HIGHER SCONDERY SCHOOL THESIL KLASRA",
              "PHONE2": "",
              "PHONE1": 3156544909
            }
          ],
          "CREDIT_SCORE": {
            "ODDS": "",
            "FILE_NO": "",
            "TRANX_NO": "",
            "SCORE": "",
            "PROB_OF_DEFALUT": "",
            "PERCENTILE_RISK": "",
            "SBP_RISK_LEVEL": ""
          },
          "CCP_DETAIL": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "062019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "072017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "082017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "092017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 102017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 112017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 122017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "012018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "022018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "032018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "042018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "052018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "062018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "062019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "072017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "082017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "092017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 102017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 112017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 122017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "012018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "022018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "032018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "042018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "052018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "062018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "062019"
            }
          ],
          "REPORT_MESSAGE": {
            "FILE_NO": "",
            "MESSAGE": "",
            "TRANX_NO": ""
          },
          "FILE_NOTES": {
            "FILE_NO": "-",
            "TRANX_NO": "-",
            "REF_DATE": "-",
            "COMMENTS": "-",
            "ACCT_NO": "-"
          },
          "HOME_INFORMATION": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REPORTED_ON": "20/08/2018",
              "CITY": "LAYYAH",
              "SEQ_NO": "Previous",
              "ADDRESS": "MIHLA SADAT DR IZHAR WALI GALI",
              "PHONE2": "",
              "PHONE1": ""
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REPORTED_ON": "29/06/2019",
              "CITY": "LAHORE",
              "SEQ_NO": "Latest",
              "ADDRESS": "45, 5, NIL, NEAR MASQ",
              "PHONE2": "",
              "PHONE1": 4235555588
            }
          ],
          "CCP_SUMMARY_TOTAL": {
            "FILE_NO": 58852626,
            "TRANX_NO": 545107247,
            "P90": 0,
            "X": 0,
            "P150": 0,
            "P120": 0,
            "P60": 0,
            "OK": 9,
            "P30": 0,
            "P180": 0
          },
          "REVIEW": {
            "REVIEWS": "",
            "FILE_NO": "",
            "TRANX_NO": "",
            "MEMBER": ""
          },
          "ENQUIRIES": [
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "29/06/2019",
              "ASSOC_TY": "PRN",
              "AMOUNT": 90000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "THOKAR",
              "REFERENCE_NO": 24320094496442
            },
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "28/06/2019",
              "ASSOC_TY": "PRN",
              "AMOUNT": 50000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "THOKAR",
              "REFERENCE_NO": 24320094496441
            },
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "19/07/2018",
              "ASSOC_TY": "PRN",
              "AMOUNT": 40000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "KOT SULTAN",
              "REFERENCE_NO": 31300537281
            }
          ],
          "CCP_MASTER": [
            {
              "CURRENCY": "",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 26096087,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": 9,
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 40000,
              "TERM": "INT",
              "MATURITY_DATE": "31/07/2019",
              "STATUS_DATE": "30/04/2019",
              "OVERDUEAMOUNT": "",
              "ACCT_NO": 3130000544,
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 12000,
              "ACCT_TY": "IN",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "LAST_PAYMENT": 4000,
              "SEQ_NO": 26096087,
              "ACCT_STATUS": "OPEN",
              "MEM_NAME": "KASHF",
              "OPEN_DATE": "31/07/2018",
              "SUBBRN_NAME": "KOT SULTAN",
              "CO-BORROWER": "PRN"
            },
            {
              "CURRENCY": "PKR",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 5288909,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": "-",
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 1000000,
              "TERM": "INT",
              "MATURITY_DATE": "",
              "STATUS_DATE": "31/12/2016",
              "OVERDUEAMOUNT": 22082,
              "ACCT_NO": "-",
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "072017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "082017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "092017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 102017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 112017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 122017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "012018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "022018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "032018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "042018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "052018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "062018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 872194,
              "ACCT_TY": "PL",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "30+",
              "LAST_PAYMENT": 33972,
              "SEQ_NO": 5288909,
              "ACCT_STATUS": "OPEN",
              "MEM_NAME": "Private",
              "OPEN_DATE": "25/11/2015",
              "SUBBRN_NAME": "",
              "CO-BORROWER": "PRN"
            },
            {
              "CURRENCY": "PKR",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 5165623,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": "-",
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 878000,
              "TERM": "INT",
              "MATURITY_DATE": "",
              "STATUS_DATE": "30/11/2015",
              "OVERDUEAMOUNT": "",
              "ACCT_NO": "-",
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "072017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "082017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "092017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 102017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 112017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 122017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "012018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "022018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "032018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "042018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "052018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "062018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 0,
              "ACCT_TY": "PL",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "LAST_PAYMENT": 0,
              "SEQ_NO": 5165623,
              "ACCT_STATUS": "CLOSE",
              "MEM_NAME": "Private",
              "OPEN_DATE": "31/12/2013",
              "SUBBRN_NAME": "",
              "CO-BORROWER": "PRN"
            }
          ],
          "DEFAULTS": [
            {
              "ASSOC_TY": "-",
              "ORG_CURRENCY": "-",
              "UPD_CURRENCY": "-",
              "UPD_STATUS": "-",
              "GROUP_ID": "-",
              "FILE_NO": "-",
              "TRANX_NO": "-",
              "ORG_ACCT_TY": "-",
              "ORG_STATUS_DATE": "-",
              "ORG_STATUS": "-",
              "ORG_AMOUNT": "-",
              "UPD_STATUS_DATE": "-",
              "UPD_ACCT_NO": "-",
              "ORG_ACCT_NO": "-",
              "MEM_NAME": "-",
              "UPD_ACCT_TY": "-",
              "UPD_RTR": "-",
              "ORG_RTR": "-",
              "UPD_AMOUNT": "-",
              "SUBBRN_NAME": "-"
            }
          ]
        },
        "status": "CR"
      },
      "status": {
        "ROOT": {
          "CCP_SUMMARY": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 26096087,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": 9,
              "P30": "-",
              "P180": "-"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 5288909,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": "-",
              "P30": "-",
              "P180": "-"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "SEQ_NO": 5165623,
              "P90": "-",
              "X": "-",
              "P150": "-",
              "P120": "-",
              "P60": "-",
              "OK": "-",
              "P30": "-",
              "P180": "-"
            }
          ],
          "INDIVIDUAL_DETAIL": {
            "CREATION_DATE": "17/10/2005",
            "NIC": "",
            "FATHER_HUSBAND_MNAME": "",
            "IS_SELF": "Y",
            "LAST_NAME": "BOKHARI",
            "FIRST_NAME": "FARAH",
            "FILE_NO": 58852626,
            "TRANX_NO": 545107247,
            "FATHER_HUSBAND_FNAME": "NBHJCK",
            "DOB": "09/01/1960",
            "GENDER": "Female",
            "MIDDLE_NAME": "",
            "CNIC": 3220320112278,
            "PROFESSION": "",
            "TRANX_DATE": "29/06/2019",
            "FATHER_HUSBAND_LNAME": "BPUVLJV",
            "REFERENCE_NO": 24320094496442,
            "MAKER": "MAKE",
            "CHECKER": "CHK"
          },
          "EMPLOYER_INFORMATION": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "EMPLOYER": "GOVERNMENT SCHOOL",
              "REPORTED_ON": "03/07/2015",
              "SELF_EMPLOYED": "NO",
              "CITY": "LAYYAH",
              "SEQ_NO": "Previous",
              "DESIGNATION": "HEAD MASTER",
              "ADDRESS": "GOVT GIRLS H/S JESAL KALSRA",
              "PHONE2": "",
              "PHONE1": 3008767816
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "EMPLOYER": "GOVERNMENT SCHOOL",
              "REPORTED_ON": "15/12/2015",
              "SELF_EMPLOYED": "NO",
              "CITY": "LAYYAH",
              "SEQ_NO": "Latest",
              "DESIGNATION": "HEAD MASTER",
              "ADDRESS": "GIRLS HIGHER SCONDERY SCHOOL THESIL KLASRA",
              "PHONE2": "",
              "PHONE1": 3156544909
            }
          ],
          "CREDIT_SCORE": {
            "ODDS": "",
            "FILE_NO": "",
            "TRANX_NO": "",
            "SCORE": "",
            "PROB_OF_DEFALUT": "",
            "PERCENTILE_RISK": "",
            "SBP_RISK_LEVEL": ""
          },
          "CCP_DETAIL": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 26096087,
              "STATUS_MONTH": "062019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "072017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "082017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "092017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 102017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 112017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 122017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "012018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "022018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "032018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "042018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "052018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "062018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5288909,
              "STATUS_MONTH": "062019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "072017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "082017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "092017"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 102017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 112017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 122017
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "012018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "022018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "032018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "042018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "052018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "062018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "072018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "082018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "092018"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 102018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 112018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": 122018
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "012019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "022019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "032019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "042019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "052019"
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "-",
              "SEQ_NO": 5165623,
              "STATUS_MONTH": "062019"
            }
          ],
          "REPORT_MESSAGE": {
            "FILE_NO": "",
            "MESSAGE": "",
            "TRANX_NO": ""
          },
          "FILE_NOTES": {
            "FILE_NO": "",
            "TRANX_NO": "",
            "REF_DATE": "",
            "COMMENTS": "",
            "ACCT_NO": ""
          },
          "HOME_INFORMATION": [
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REPORTED_ON": "20/08/2018",
              "CITY": "LAYYAH",
              "SEQ_NO": "Previous",
              "ADDRESS": "MIHLA SADAT DR IZHAR WALI GALI",
              "PHONE2": "",
              "PHONE1": ""
            },
            {
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REPORTED_ON": "29/06/2019",
              "CITY": "LAHORE",
              "SEQ_NO": "Latest",
              "ADDRESS": "45, 5, NIL, NEAR MASQ",
              "PHONE2": "",
              "PHONE1": 4235555588
            }
          ],
          "CCP_SUMMARY_TOTAL": {
            "FILE_NO": 58852626,
            "TRANX_NO": 545107247,
            "P90": 0,
            "X": 0,
            "P150": 0,
            "P120": 0,
            "P60": 0,
            "OK": 9,
            "P30": 0,
            "P180": 0
          },
          "REVIEW": {
            "REVIEWS": "",
            "FILE_NO": "",
            "TRANX_NO": "",
            "MEMBER": ""
          },
          "ENQUIRIES": [
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "29/06/2019",
              "ASSOC_TY": "PRN",
              "AMOUNT": 90000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "THOKAR",
              "REFERENCE_NO": 24320094496442
            },
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "28/06/2019",
              "ASSOC_TY": "PRN",
              "AMOUNT": 50000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "THOKAR",
              "REFERENCE_NO": 24320094496441
            },
            {
              "ACCT_TY": "IN",
              "CURRENCY": "PKR",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "REFERENCE_DATE": "19/07/2018",
              "ASSOC_TY": "PRN",
              "AMOUNT": 40000,
              "MEM_NAME": "KASHF",
              "SEPARATE_DATE": "",
              "CO_BORROWER": "-",
              "SUBBRN_NAME": "KOT SULTAN",
              "REFERENCE_NO": 31300537281
            }
          ],
          "CCP_MASTER": [
            {
              "CURRENCY": "",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 26096087,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": 9,
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 40000,
              "TERM": "INT",
              "MATURITY_DATE": "31/07/2019",
              "STATUS_DATE": "30/04/2019",
              "OVERDUEAMOUNT": "",
              "ACCT_NO": 3130000544,
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "OK",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 26096087,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 12000,
              "ACCT_TY": "IN",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "LAST_PAYMENT": 4000,
              "SEQ_NO": 26096087,
              "ACCT_STATUS": "OPEN",
              "MEM_NAME": "KASHF",
              "OPEN_DATE": "31/07/2018",
              "SUBBRN_NAME": "KOT SULTAN",
              "CO-BORROWER": "PRN"
            },
            {
              "CURRENCY": "PKR",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 5288909,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": "-",
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 1000000,
              "TERM": "INT",
              "MATURITY_DATE": "",
              "STATUS_DATE": "31/12/2016",
              "OVERDUEAMOUNT": 22082,
              "ACCT_NO": "-",
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "072017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "082017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "092017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 102017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 112017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 122017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "012018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "022018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "032018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "042018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "052018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "062018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5288909,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 872194,
              "ACCT_TY": "PL",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "30+",
              "LAST_PAYMENT": 33972,
              "SEQ_NO": 5288909,
              "ACCT_STATUS": "OPEN",
              "MEM_NAME": "Private",
              "OPEN_DATE": "25/11/2015",
              "SUBBRN_NAME": "",
              "CO-BORROWER": "PRN"
            },
            {
              "CURRENCY": "PKR",
              "CCP_SUMMARY": {
                "FILE_NO": 58852626,
                "TRANX_NO": 545107247,
                "SEQ_NO": 5165623,
                "P90": "-",
                "X": "-",
                "P150": "-",
                "P120": "-",
                "P60": "-",
                "OK": "-",
                "P30": "-",
                "P180": "-"
              },
              "LIMIT": 878000,
              "TERM": "INT",
              "MATURITY_DATE": "",
              "STATUS_DATE": "30/11/2015",
              "OVERDUEAMOUNT": "",
              "ACCT_NO": "-",
              "CCP_DETAIL": [
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "072017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "082017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "092017"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 102017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 112017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 122017
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "012018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "022018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "032018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "042018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "052018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "062018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "072018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "082018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "092018"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 102018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 112018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": 122018
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "012019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "022019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "032019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "042019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "052019"
                },
                {
                  "FILE_NO": 58852626,
                  "TRANX_NO": 545107247,
                  "PAYMENT_STATUS": "-",
                  "SEQ_NO": 5165623,
                  "STATUS_MONTH": "062019"
                }
              ],
              "HIGH_CREDIT": "",
              "BALANCE": 0,
              "ACCT_TY": "PL",
              "FILE_NO": 58852626,
              "TRANX_NO": 545107247,
              "PAYMENT_STATUS": "OK",
              "LAST_PAYMENT": 0,
              "SEQ_NO": 5165623,
              "ACCT_STATUS": "CLOSE",
              "MEM_NAME": "Private",
              "OPEN_DATE": "31/12/2013",
              "SUBBRN_NAME": "",
              "CO-BORROWER": "PRN"
            }
          ],
          "DEFAULTS": [
            {
              "ASSOC_TY": "",
              "ORG_CURRENCY": "",
              "UPD_CURRENCY": "",
              "UPD_STATUS": "",
              "GROUP_ID": "",
              "FILE_NO": "",
              "TRANX_NO": "",
              "ORG_ACCT_TY": "",
              "ORG_STATUS_DATE": "",
              "ORG_STATUS": "",
              "ORG_AMOUNT": "",
              "UPD_STATUS_DATE": "",
              "UPD_ACCT_NO": "",
              "ORG_ACCT_NO": "",
              "MEM_NAME": "",
              "UPD_ACCT_TY": "",
              "UPD_RTR": "",
              "ORG_RTR": "",
              "UPD_AMOUNT": "",
              "SUBBRN_NAME": ""
            }
          ]
        },
        "status": "CR"
      }
    };


  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  model: any; formSaved = true;
  isEdit = false;
  hide = true;
  auth: any;
  mfcibLoan: MFCIBLoan;
  mfcibForm: FormGroup;
  formSeq: string;
  formControl: FormControl;
  matcher = new MyErrorStateMatcher();
  hasPermission = false;
  constructor(private router: Router,
    private fb: FormBuilder,
    private loanService: LoanService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService,
    private commonService: CommonService) { }
  today: any;

  ngOnInit() {
    this.model = JSON.parse(sessionStorage.getItem('model'));
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    this.mfcibForm = this.fb.group({
      appId: [this.model.loanAppSeq, Validators.required],
      memCod: ['706', Validators.required],
      ctrlBrnchCod: ['', Validators.required],
      sbBrnchCod: ['', Validators.required],
      chkUsrNam: ['CWEB', Validators.required],
      mkUsrNam: ['MWEB', Validators.required],
      mkrpas: [''],
      cnic: ['', Validators.required],
      nicPass: ['', Validators.required],
      frstNam: ['', Validators.required],
      midNam: ['', Validators.required],
      lstName: ['', Validators.required],
      gen: ['', Validators.required],
      dob: ['', Validators.required],
      fhfstNam: ['', Validators.required],
      fhMidNam: ['', Validators.required],
      fhLstNam: ['', Validators.required],
      ctDis: ['', Validators.required],
      addr: ['', Validators.required],
      phnum: ['', Validators.required],
      cellNum: ['', Validators.required],
      emailAdd: ['', Validators.required],
      amtTyp: ['', Validators.required],
      empCmpNam: ['', Validators.required],
      empOwnStat: ['', Validators.required],
      empBusCat: ['', Validators.required],
      empAdd: ['', Validators.required],
      empCtDis: ['', Validators.required],
      empPhNum: ['', Validators.required],
      empCelNum: ['', Validators.required],
      empEmlAdd: ['', Validators.required],
      gpId: ['', Validators.required],
      assType: ['', Validators.required],
      amnt: ['', Validators.required],

    });


    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
    });

    let now = new Date();
    // this.today = date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate();
    now = new Date();
    this.spinner.hide();
    let month: any;
    if ((now.getMonth() + 1) < 10) {
      month = '0' + (now.getMonth() + 1);
    } else {
      month = '' + (now.getMonth() + 1);
    }
    let day: any;
    if ((now.getDate() + 1) < 10) {
      day = '0' + (now.getDate());
    } else {
      day = '' + (now.getDate());
    }
    const year: any = now.getFullYear();
    this.today = year + '-' + month + '-' + day;
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
    this.spinner.hide();
    this.mfcibLoan = new MFCIBLoan(this.model.loanSeq, this.model.formSeq);
    this.mfcibLoan.clientSeq = this.model.clientSeq;
    if (sessionStorage.getItem('editLoan') === 'true') {
      this.formSaved = true;
      this.loanService.getMfcibLoans(this.model.loanSeq).subscribe((res) => {
        this.model.mfcibArray = res;

        res.forEach(obj => {
          if (obj.loanCompletionDate) {
            const array = obj.loanCompletionDate.split('T', 1);
            console.log(array.length);
            if (array.length) {
              obj.loanCompletionDate = array[0];
            }
          }
        });
        console.log(res);
        console.log(this.model.mfcibArray);
      }, (error) => {
        console.log('err', error);
      });
    }

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('mfcib', this.model);
    // end
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.mfcibForm.controls[controlName].hasError(errorName);
  }

  onSave() {
    if (this.model.forms) {
      this.model.forms.forEach(
        forms => {
          if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
            forms.isSaved = true;
          }
        }
      );
    }
    sessionStorage.setItem('model', JSON.stringify(this.model));
  }
  continueClicked() {
    console.log(this.model.forms)
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
  ngDoCheck() {
    sessionStorage.setItem('isSavedMFCIB', this.formSaved.toString());
  }
  onEditClicked(loan: MFCIBLoan) {
    this.mfcibLoan = JSON.parse(JSON.stringify(loan));
    this.mfcibLoan.index = this.model.mfcibArray.indexOf(loan);
    (<any>$('#Addmfcib')).modal('show');
    this.isEdit = true;
  }
  onAddClick() {
    this.mfcibLoan = new MFCIBLoan(this.model.loanSeq, this.model.formSeq);
    this.isEdit = false;
    this.mfcibLoan.clientSeq = this.model.clientSeq;
    (<any>$('#Addmfcib')).modal('show');
  }
  cancelClicked() {
    this.mfcibLoan = new MFCIBLoan(this.model.loanSeq, this.model.formSeq);
    this.mfcibLoan.clientSeq = this.model.clientSeq;
    (<any>$('#Addmfcib')).modal('hide');
  }
  itemToBeDeleted: any;
  deleteItem(item) {
    (<any>$('#deleteConfirmation')).modal('show');
    this.itemToBeDeleted = item;
  }
  confirmDelete() {
    this.spinner.show();
    console.log(this.itemToBeDeleted.mfcibSeq);
    this.loanService.deleteMfcibLoan(this.itemToBeDeleted.mfcibSeq).subscribe((res) => {
      this.spinner.hide();
      (<any>$('#deleteConfirmation')).modal('hide');
      console.log(res);
      console.log(this.model.mfcibArray);
      this.toaster.success("Deleted");
      // this.removeFromArray(item,this.model.mfcibArray);
      for (let i = 0; i < this.model.mfcibArray.length; i++) {
        if (this.model.mfcibArray[i].mfcibSeq === this.itemToBeDeleted.mfcibSeq) {
          this.model.mfcibArray.splice(i, 1);
        }
      }
      sessionStorage.setItem('model', JSON.stringify(this.model));
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
    });
  }
  removeFromArray(item, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].mfcibSeq === item.mfcibSeq) {
        array.splice(i, 1);
      }
    }
  }
  onAddMfcibFormSubmit() {
    console.log(this.mfcibLoan);
    this.mfcibLoan.loanAppSeq = this.model.loanAppSeq;
    this.mfcibLoan.clientSeq = this.model.clientSeq;
    if (+this.mfcibLoan.totalAmount < +this.mfcibLoan.currentOutStandingAmount) {
      this.toaster.error("Outstanding Amount should not be greater than Total Amount.")
      return;
    }
    this.spinner.show();
    if (this.isEdit) {
      this.loanService.updateMfcibLoan(this.mfcibLoan).subscribe((res) => {
        this.spinner.hide();
        this.toaster.success("Updated");
        console.log(res);
        console.log(this.model.mfcibArray);
        this.model.mfcibArray[this.mfcibLoan.index] = this.mfcibLoan;
        this.mfcibLoan = new MFCIBLoan(this.model.loanSeq, this.model.formSeq);
        (<any>$('#Addmfcib')).modal('hide');
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = true;
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
      });
    } else {
      console.log(JSON.stringify(this.mfcibLoan));
      this.loanService.saveMfcibLoan(this.mfcibLoan).subscribe((res) => {
        this.spinner.hide();
        this.toaster.success("Saved");
        console.log(res);
        this.mfcibLoan.mfcibSeq = res.mfcibSeq;
        this.model.mfcibArray.push(this.mfcibLoan);
        console.log(this.model.mfcibArray);
        this.mfcibLoan = new MFCIBLoan(this.model.loanSeq, this.model.formSeq);
        (<any>$('#Addmfcib')).modal('hide');
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
                forms.isSaved = true;
              }
            }
          );
        }
        sessionStorage.setItem('model', JSON.stringify(this.model));
      }, (error) => {
        this.toaster.error(error.error.error, "Error")
        this.spinner.hide();
        console.log('err', error);
      });
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  //  Start FETCH MFCIB
  mfcibDoc = null;
  onFetchClick() {
    this.loanService.getAllDocumentsForLoanApp(this.model.loanAppSeq).subscribe(res => {
      console.log(res)
      if (res != null) {
        let docs = [];
        res.forEach(d => {
          if (d.docImg != null && d.docSeq == 0) {
            docs.push(d);
            this.mfcibDoc = d.docImg;
            this.obj = JSON.parse(d.docImg);
            console.log(this.obj);
            (<any>$('#fetchmfcib')).modal('show');
          }
        });
        if (this.mfcibDoc == null || this.mfcibDoc == undefined) {
          (<any>$('#mfcibForm')).modal('show');
        }
      }
      // this.docs = res;
    });
  }

  onFetchMFCIB() {

  }

  cancelFetchClick() {
    (<any>$('#fetchmfcib')).modal('hide');
  }

  // END FETCH MFCIB



  //  Start MFCIB Form  

  onMfcibForm() {
    (<any>$('#mfcibForm')).modal('show');
  }

  onMFCIBFormSubmit() {
    console.log(this.mfcibForm.controls)
  }

  cancelMfcibForm() {
    (<any>$('#mfcibForm')).modal('hide');
  }
  // End  MFCIB Form





  deliqSumm = this.obj.report.ROOT.CCP_SUMMARY;
  indivInfo = this.obj.report.ROOT.INDIVIDUAL_DETAIL;
  crdtApp = this.obj.report.ROOT.ENQUIRIES;
  ccpList = this.obj.report.ROOT.CCP_MASTER;
  fileNotes = this.obj.report.ROOT.FILE_NOTES;
  defaults = this.obj.report.ROOT.DEFAULTS;

  getFormatedmonth(str) {
    str = "" + str;
    var lastFour = str.substr(str.length - 4);
    var month = str.slice(0, -4);
    return ((month.length == 1) ? "0" + month : month) + "/" + lastFour
  }
}
