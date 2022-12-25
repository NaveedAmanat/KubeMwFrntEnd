import { Component, DoCheck, OnInit } from '@angular/core';
import { Address } from '../../../../shared/models/address.model';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { SchoolAppraisal, SchoolGradeDto } from '../../../../shared/models/schoolAppraisal.model';
import { MyErrorStateMatcher } from '../../../../shared/helpers/MyErrorStateMatcher.helper';
import { CommonService } from '../../../../shared/services/common.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DisbursementVoucherListItem } from '../../../../shared/models/disbursementVoucherListItem.model';
import { typeIsOrHasBaseType } from '../../../../../../node_modules/tslint/lib/language/typeUtils';
import { SchoolQA, SchoolQARaw, SchoolQualityCheckDto, SchoolQuestion, SchoolQAArray } from '../../../../shared/models/schoolQA.model';
import { Recovery } from '../../../../shared/models/recovery.model';
import { RecoverySub } from '../../../../shared/models/recovery.subModel';
// import {SCHOOL, SCHOOL_QUESTION} from '../../../../shared/mocks/mock_common_codes';
import { ToastrService } from 'ngx-toastr';
import { PrimaryIncome } from '../../../../shared/models/PrimaryIncome.model';
import { BusinessExpense } from '../../../../shared/models/BusinessExpense.model';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';

import * as _moment from 'moment';

import { Moment } from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-school-appraisal',
  templateUrl: './school-appraisal.component.html',
  styleUrls: ['./school-appraisal.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SchoolAppraisalComponent implements OnInit, DoCheck {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  isSubmit = false;
  matcher = new MyErrorStateMatcher();
  ownerShips: any[];
  schoolGradeForm: FormGroup;
  isEdit = false;
  private isEditGrade = false;
  averageIncome = 0;
  netDeposible = 0;
  businessProfit = 0;
  totalBusinessExpense = 0;
  totalHouseholdExpense = 0;
  schoolQualityCheckDtos: any[] = [];
  rawQuestions: any;
  incomeType: any;
  hasPermission= false;
  
  constructor(private router: Router
    , private loanService: LoanService
    , private breadcrumbProvider: BreadcrumbProvider
    , private commonService: CommonService
    , private toaster: ToastrService
    , private fb: FormBuilder
    , private spinner: NgxSpinnerService
  ) { }


  model: any;
  addresses: Address[] = [];
  address: Address = new Address();
  stRatio = 0;
  indexGrade: number;
  totalPrimaryIncome = 0;
  totalSecondaryIncome = 0;
  totalGrade: SchoolGradeDto = new SchoolGradeDto();
  questionsForm: FormGroup;
  controls: any;
  questions: any[] = [];
  disFlags: any[] = [{ name: 'Yes', value: 1 }, { name: 'No', value: 0 }];
  yearEst: any;
  primaryIncome: PrimaryIncome = new PrimaryIncome();
  secondaryIncome: PrimaryIncome = new PrimaryIncome();
  schoolGradeArray: any;
  businessExpense: BusinessExpense = new BusinessExpense();
  householdExpense: BusinessExpense = new BusinessExpense();
  today; yearBefore;
  ngOnInit() {
    this.schoolGradeForm = this.fb.group({
      schGrdSeq: [],
      grdKey: ['', Validators.required],
      avgFee: ['', Validators.required],
      totFemStdnt: ['', Validators.required],
      totMaleStdnt: ['', Validators.required],
      noFeeStdnt: ['', Validators.required],
      gradeFlag: ["a"]
    });
    this.today = new Date();
    this.yearBefore = new Date();
    this.yearBefore.setFullYear(this.yearBefore.getFullYear() - 1);
    console.log(this.yearBefore)
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });
    // this.loanService.breadcrumbs.forEach(
    //   breadcrumb => this.breadcrumbProvider.addCheckedItem(breadcrumb.label, breadcrumb.href, breadcrumb.isSaved)
    // );
    this.model = JSON.parse(sessionStorage.getItem('model'));
    if (this.model.schoolAppraisal == undefined || this.model.schoolAppraisal == null) {
      this.model.schoolAppraisal = new SchoolAppraisal();
      this.model.schoolAppraisal.loanAppSeq = this.model.loanAppSeq;
      this.model.schoolAppraisal.addressDto = new Address();
      this.model.schoolAppraisal.schoolGradeDtos = [];
      this.model.schoolAppraisal.schoolQualityCheckDtos = [];
      this.model.schoolAppraisal.totFemTchrs = 0;
      this.model.schoolAppraisal.totMaleTchrs = 0;
    }
    console.log(this.model);
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
    // this.loanService.getSchoolQAs().subscribe((rawQA: SchoolQARaw[]) => {
    //   this.questions = rawQA;
    //   this.rawQuestions = rawQA;
    //   this.questions.forEach((s) => {
    //     this.schoolQualityCheckDtos.push(new SchoolQualityCheckDto({ answrSeq: 0, qstSeq: s.questionKey, schQltyChkFlag: 'a' }));
    //     s.answrSeq = 0;
    //   });
    //   this.questions.forEach(r => {
    //     r.schoolQuestions = [];
    //     this.questions.filter((r2: SchoolQARaw) => r2.questionCategoryKey === r.questionCategoryKey).forEach(
    //       filteredRs => r.schoolQuestions.push(new SchoolQuestion(filteredRs)));
    //   });
    //   this.questions = this.removeDuplicates(this.questions, 'questionCategoryKey');
    //   this.getLocations();
    //   this.loadLovs();
    //   this.createQuestionierForm();
    // }, (error) => {
    //   console.log('err', error);
    // });




    // for testing
    //     this.questions = SCHOOL_QUESTION;
    //     this.rawQuestions = SCHOOL_QUESTION;
    //     this.questions.forEach((s) => {
    //       this.schoolQualityCheckDtos.push(new SchoolQualityCheckDto({answrSeq: 0, qstSeq: s.questionKey}));
    //       s.answrSeq = 0;
    //     });
    //     this.questions.forEach(r => {
    //       r.schoolQuestions = [];
    //       this.questions.filter((r2: SchoolQARaw) => r2.questionCategoryKey === r.questionCategoryKey).forEach(
    //         filteredRs => r.schoolQuestions.push(new SchoolQuestion(filteredRs)));
    //     });
    //     this.questions = this.removeDuplicates(this.questions, 'questionCategoryKey');
    //     this.getLocations();
    //     this.loadLovs();
    //     this.createQuestionierForm();

    ///
    if (sessionStorage.getItem('editLoan') === 'true') {
      console.log(this.model.loanAppSeq);
      this.spinner.show();
      this.loanService.getSchoolApperaisal(this.model.loanAppSeq).subscribe((schoolAP: any) => {
        console.log(schoolAP)
        if (schoolAP != null) {
          this.model.schoolAppraisal = schoolAP;
          this.yearEst = this.model.schoolAppraisal.schAge;
          this.model.schoolAppraisal.addressDto = schoolAP.addressDto;
          this.model.schoolAppraisal.schoolGradeDtos = (schoolAP.schoolGradeDtos == null) ? [] : JSON.parse(JSON.stringify(schoolAP.schoolGradeDtos));
          // this.schoolGradeArray = (schoolAP.schoolGradeDtos == null) ? [] : JSON.parse(JSON.stringify(schoolAP.schoolGradeDtos));
          this.model.schoolAppraisal.schoolQualityCheckDtos = (schoolAP.schoolQualityCheckDtos == null) ? [] : JSON.parse(JSON.stringify(schoolAP.schoolQualityCheckDtos));
          this.schoolQualityCheckDtos = (schoolAP.schoolQualityCheckDtos == null) ? [] : JSON.parse(JSON.stringify(schoolAP.schoolQualityCheckDtos));

          if (schoolAP.schyr != 0) {
            this.date = moment();
            const ctrlValue = this.date;
            ctrlValue.year(schoolAP.schyr);
          }

          this.model.schoolAppraisal.primaryIncome = (schoolAP.primaryIncome == null) ? [] : schoolAP.primaryIncome;
          this.model.schoolAppraisal.secondaryIncome = (schoolAP.secondaryIncome == null) ? [] : schoolAP.secondaryIncome;
          this.model.schoolAppraisal.businessExpense = (schoolAP.businessExpense == null) ? [] : schoolAP.businessExpense;
          this.model.schoolAppraisal.householdExpense = (schoolAP.householdExpense == null) ? [] : schoolAP.householdExpense;
          console.log('updated here');
          console.log(this.schoolQualityCheckDtos);
          // this.rawQuestions.forEach((s, index) => {
          //   s.answrSeq = schoolAP.schoolQualityCheckDtos[index].answrSeq;
          // });
          // this.removeItemsFromLOVUsingBizApp();
          this.calculateNetDeposible();
          this.calculateBusinessProfit();
          this.calculateTotalValues();
          this.calculateTotalGrades();
          this.calculateStRatio();
          this.createQuestionierForm();
          this.getLocations();
          this.loadLovs();
          this.getQuestions();
          this.spinner.hide();
          console.log(JSON.stringify(this.model.schoolAppraisal));
        }
      }, (error) => {
        console.log('err', error);
        this.spinner.hide();
        this.model.schoolAppraisal = new SchoolAppraisal();
        this.model.schoolAppraisal.loanAppSeq = this.model.loanAppSeq;
        this.model.schoolAppraisal.addressDto = new Address();
        this.model.schoolAppraisal.schoolGradeDtos = [];
        this.model.schoolAppraisal.schoolQualityCheckDtos = [];
        this.model.schoolAppraisal.totFemTchrs = 0;
        this.model.schoolAppraisal.totMaleTchrs = 0;
        this.getLocations();
        this.loadLovs();
        this.getQuestions();
      });

    } else {
      // this.schoolGradeArray = JSON.parse(JSON.stringify(this.model.schoolAppraisal.schoolGradeDtos));
      if (this.model.schoolAppraisal.schyr != 0 && this.model.schoolAppraisal.schyr != undefined && this.model.schoolAppraisal.schyr != null) {
        this.date = moment();
        const ctrlValue = this.date;
        ctrlValue.year(this.model.schoolAppraisal.schyr);
      }
      if (this.model.schoolAppraisal.SchoolQAArray == undefined || this.model.schoolAppraisal.SchoolQAArray == null) {
        this.getQuestions();
      } else {
        if (this.model.schoolAppraisal.SchoolQAArray.length == 0) {
          this.getQuestions();
        }
      }
      this.calculateNetDeposible();
      this.calculateBusinessProfit();
      this.calculateTotalValues();
      this.calculateTotalGrades();
      this.calculateStRatio();
      this.getLocations();
      this.loadLovs();


    }

    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('school-appraisal', this.model);
    // end
    console.log(this.model)

  }
  rawQuestionsArray;
  getNewSchoolGradeForm() {
    this.schoolGradeForm = this.fb.group({
      schGrdSeq: [],
      grdKey: ['', Validators.required],
      avgFee: ['', Validators.required],
      totFemStdnt: ['', Validators.required],
      totMaleStdnt: ['', Validators.required],
      noFeeStdnt: ['', Validators.required],
      gradeFlag: ["a"]
    });
  }
  calculateTotalValues() {
    this.totalPrimaryIncome = 0;
    console.log(this.model.primaryIncome.length);
    for (let i = 0; i < this.model.schoolAppraisal.primaryIncome.length; i++) {
      const x = +this.model.schoolAppraisal.primaryIncome[i].incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
      console.log(this.totalPrimaryIncome);
    }
    this.totalSecondaryIncome = 0;
    for (let i = 0; i < this.model.schoolAppraisal.secondaryIncome.length; i++) {
      const x = +this.model.schoolAppraisal.secondaryIncome[i].incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
    }
    this.totalBusinessExpense = 0;
    for (let i = 0; i < this.model.schoolAppraisal.businessExpense.length; i++) {
      const x = +this.model.schoolAppraisal.businessExpense[i].expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
    }
    this.totalHouseholdExpense = 0;
    for (let i = 0; i < this.model.schoolAppraisal.householdExpense.length; i++) {
      const x = +this.model.schoolAppraisal.householdExpense[i].expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
    }
    this.incomeChange();
  }
  onQuestionRadioSelectChange(index) {
    console.log(index);
    this.model.schoolAppraisal.schoolQualityCheckDtos = [];
    const v = this.questionsForm.value.questionArray[index];
    this.schoolQualityCheckDtos[index].answrSeq = v;
    this.schoolQualityCheckDtos[index].schQltyChkFlag = 'u';
    this.schoolQualityCheckDtos.forEach(s => {
      this.model.schoolAppraisal.schoolQualityCheckDtos.push(new SchoolQualityCheckDto(s));
    });
    console.log(this.model.schoolAppraisal);
  }
  calculateSchoolAge() {
    console.log(this.yearEst);
    this.model.schoolAppraisal.schAge = this.calculateAge();
    console.log(this.model.schoolAppraisal.schAge);
  }
  createQuestionierForm() {
    console.log('create from');
    console.log(this.rawQuestions);
    if (sessionStorage.getItem('editLoan') === 'true') {
    }
    this.controls = this.questions.map((c, index) => new FormControl(this.rawQuestions[index].answrSeq, Validators.required));

    this.questionsForm = this.fb.group({
      questionArray: new FormArray(this.controls)
    });
  }
  onSubmitQuestionsForm() {
    this.schoolQualityCheckDtos.forEach(s => {
      this.model.schoolAppraisal.schoolQualityCheckDtos.push(new SchoolQualityCheckDto(s));
    });
  }
  onSubmit() {
    this.spinner.show();
    console.log(JSON.stringify(this.model.schoolAppraisal));
    this.model.schoolAppraisal.formSeq = this.model.formSeq;
    this.model.schoolAppraisal.loanAppSeq = this.model.loanAppSeq;
    if (this.model.schoolAppraisal.schAprslSeq == undefined || this.model.schoolAppraisal.schAprslSeq == 0) {
      this.loanService.addSchoolAppraisal(this.model.schoolAppraisal).subscribe(res => {
        this.spinner.hide();
        if (res != null) {
          let school = res.SchoolAppraisalDto;
          console.log(school)

          this.model.schoolAppraisal.schAprslSeq = school.schAprslSeq;
          // this.schoolGradeArray = JSON.parse(JSON.stringify(school.schoolGradeDtos));
          this.model.schoolAppraisal.hasBasic = school.hasBasic;
          this.model.schoolAppraisal.hasAddress = school.hasAddress;
          this.model.schoolAppraisal.hasGrade = school.hasGrade;
          this.model.schoolAppraisal.hasAttend = school.hasAttend;
          this.model.schoolAppraisal.hasIncome = school.hasIncome;
          this.model.schoolAppraisal.hasExpense = school.hasExpense;
          this.model.schoolAppraisal.hasQltyChck = school.hasQltyChck;
          this.model.schoolAppraisal.formComplete = school.formComplete;
        }
        // sessionStorage.setItem("model", JSON.stringify(this.model));
        this.toaster.success('Saved School Appraisal Successfully', 'Success');
        // this.addIncomeExpense(school.schAprslSeq);
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
                forms.isSaved = this.model.schoolAppraisal.formComplete;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          );
        }
        console.log(this.model)
        sessionStorage.setItem('model', JSON.stringify(this.model));
      }, (error) => {
        this.spinner.hide();
        this.toaster.error("Server Error");
        console.log('err', error);
      });
    } else {
      this.loanService.updateSchoolAppraisal(this.model.schoolAppraisal).subscribe(res => {
        this.spinner.hide();
        if (res != null) {
          let school = res.SchoolAppraisalDto;
          console.log(school)

          this.model.schoolAppraisal.schAprslSeq = school.schAprslSeq;
          this.model.schoolAppraisal.schoolGradeDtos = school.schoolGradeDtos;
          // this.schoolGradeArray = JSON.parse(JSON.stringify(school.schoolGradeDtos));
          this.model.schoolAppraisal.hasBasic = school.hasBasic;
          this.model.schoolAppraisal.hasAddress = school.hasAddress;
          this.model.schoolAppraisal.hasGrade = school.hasGrade;
          this.model.schoolAppraisal.hasAttend = school.hasAttend;
          this.model.schoolAppraisal.hasIncome = school.hasIncome;
          this.model.schoolAppraisal.hasExpense = school.hasExpense;
          this.model.schoolAppraisal.hasQltyChck = school.hasQltyChck;
          this.model.schoolAppraisal.formComplete = school.formComplete;
        }

        // sessionStorage.setItem("model", JSON.stringify(this.model));
        this.toaster.success('Updated School Appraisal Successfully', 'Success');
        // this.addIncomeExpense(school.schAprslSeq);
        if (this.model.forms) {
          this.model.forms.forEach(
            forms => {
              if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
                forms.isSaved = this.model.schoolAppraisal.formComplete;
                this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
              }
            }
          );
        }
        console.log(this.model)
        sessionStorage.setItem('model', JSON.stringify(this.model));
      }, (error) => {
        this.spinner.hide();
        this.toaster.error("Server Error");
        console.log('err', error);
      });
    }
  }
  // addIncomeExpense(schAprslSeq) {
  //   this.model.schoolAppraisal.primaryIncome.forEach(obj => {
  //     obj.IncomeHdrSeq = schAprslSeq;
  //     this.incomeService(obj);
  //   });
  //   this.model.schoolAppraisal.secondaryIncome.forEach(obj => {
  //     obj.IncomeHdrSeq = schAprslSeq;
  //     this.incomeService(obj);
  //   });
  //   this.model.schoolAppraisal.businessExpense.forEach(obj => {
  //     obj.bizAprslSeq = schAprslSeq;
  //     this.expenseService(obj);
  //   });
  //   this.model.schoolAppraisal.householdExpense.forEach(obj => {
  //     obj.bizAprslSeq = schAprslSeq;
  //     this.expenseService(obj);
  //   });
  // }
  ngDoCheck() {
    sessionStorage.setItem('isSavedSchool', this.isSubmit.toString());
  }
  // grade tab
  openAddGrade() {
    (<any>$('#GradeDetails')).modal('show');
    this.model.schoolAppraisal.schoolGradeDtos.forEach(res => {
      this.removeItemFromLOV(res.grdKey, this.grade);
    })
    this.schoolGradeForm.reset();
    this.schoolGradeForm.controls.gradeFlag.setValue("a");
    this.isEditGrade = false;
  }
  editGrade(grade: SchoolGradeDto, index) {
    (<any>$('#GradeDetails')).modal('show');
    grade.gradeFlag = "u";

    this.gradeOrig.forEach(orig => {
      if (orig.codeKey == grade.grdKey) {
        this.grade.push({ codeKey: orig.codeKey, codeValue: orig.codeValue });
      }
    })

    this.schoolGradeForm.patchValue(grade);
    this.isEditGrade = true;
    this.indexGrade = index;
  }

  deleteGrade(index, grd) {
    console.log(index);
    grd.gradeFlag = "d";
    let i = -1;
    this.model.schoolAppraisal.schoolGradeDtos.forEach((grade, ind) => {
      if (grade.schGrdSeq == grd.schGrdSeq) {
        grade.gradeFlag = "d";
        i = ind;
      }
    })
    this.model.schoolAppraisal.schoolGradeDtos.splice(index, 1);
    this.calculateTotalGrades();
  }
  onSubmitGrade() {
    const result: SchoolGradeDto = Object.assign({}, this.schoolGradeForm.value);

    if (+result.totFemStdnt < +result.femStdntPrsnt) {
      this.toaster.error("Female Students Present can not be greater than Total Female Students");
      return;
    }
    if (+result.totMaleStdnt < +result.maleStdntPrsnt) {
      this.toaster.error("Male Students Present can not be greater than Total Male Students");
      return;
    }
    if ((+result.totFemStdnt + +result.totMaleStdnt) < +result.noFeeStdnt) {
      this.toaster.error("Students Paying no fee can not be greater than Total Students");
      return;
    }
    (<any>$('#GradeDetails')).modal('hide');
    if (!this.isEditGrade) {
      console.log(result);
      result.gradeFlag = "a";
      this.model.schoolAppraisal.schoolGradeDtos.push(result);
    } else {
      result.gradeFlag = "u";
      this.model.schoolAppraisal.schoolGradeDtos[this.indexGrade] = result;
      this.isEditGrade = false;
    }
    this.removeItemFromLOV(result.grdKey, this.grade);
    this.calculateTotalGrades();
    this.getNewSchoolGradeForm();
    console.log(this.model.schoolAppraisal);
  }
  private calculateTotalGrades() {
    this.totalGrade = new SchoolGradeDto();
    if (this.model.schoolAppraisal.schoolGradeDtos != null && this.model.schoolAppraisal.schoolGradeDtos != undefined) {
      this.model.schoolAppraisal.schoolGradeDtos.forEach(g => {

        this.totalGrade.avgFee = this.totalGrade.avgFee + Number.parseInt(g.avgFee);

        this.totalGrade.totFemStdnt = this.totalGrade.totFemStdnt + Number.parseInt(g.totFemStdnt);
        this.totalGrade.totMaleStdnt = this.totalGrade.totMaleStdnt + Number.parseInt(g.totMaleStdnt);
        this.totalGrade.noFeeStdnt = this.totalGrade.noFeeStdnt + Number.parseInt(g.noFeeStdnt);
        this.totalGrade.femStdntPrsnt = this.totalGrade.femStdntPrsnt + Number.parseInt(g.femStdntPrsnt);
        this.totalGrade.maleStdntPrsnt = this.totalGrade.maleStdntPrsnt + Number.parseInt(g.maleStdntPrsnt);
        // this.totalGrade.classAverageFee = this.totalGrade.avgFee / this.model.schoolAppraisal.schoolGradeDtos.length;
        this.totalGrade.girlsAverage = Math.abs((this.totalGrade.totFemStdnt / (this.totalGrade.totFemStdnt + this.totalGrade.totMaleStdnt)) * 100);
        this.totalGrade.totalFee = this.totalGrade.classAverageFee;
        this.totalGrade.totalStudents = this.totalGrade.totFemStdnt + this.totalGrade.totMaleStdnt;
        let classRevenue = Math.round(((+g.totFemStdnt + +g.totMaleStdnt) - (+g.noFeeStdnt)) * (+g.avgFee));
        this.totalGrade.schoolRevenue += classRevenue;
        this.totalGrade.classAverageFee = Math.floor(this.totalGrade.schoolRevenue / this.totalGrade.totalStudents);
        if (this.totalGrade.classAverageFee == undefined)
          this.totalGrade.classAverageFee = 0;
      });
    }
  }
  calculateStRatio() {
    this.calculateTotalGrades();
    if (this.model.schoolAppraisal.totMaleTchrs !== 0 && this.model.schoolAppraisal.totFemTchrs !== 0) {
      const st = this.totalGrade.totFemStdnt + this.totalGrade.totMaleStdnt;
      const t = this.model.schoolAppraisal.totMaleTchrs + this.model.schoolAppraisal.totFemTchrs;
      this.stRatio = st / this.totalGrade.totalStudents;
    }
  }
  addOtherIncome() {
  }

  addSecondryIncome() {
  }

  addBusinessExp() {
  }

  addHouseExp() {
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
  getQuestions() {
    this.loanService.getSchoolByQstnrSeq(2).subscribe((rawQA: SchoolQAArray[]) => {
      console.log(rawQA)
      this.rawQuestionsArray = rawQA;
      this.model.schoolAppraisal.SchoolQAArray = rawQA;
      this.model.schoolAppraisal.schoolQualityCheckDtos.forEach(question => {
        this.model.schoolAppraisal.SchoolQAArray.forEach(q => {
          q.questions.forEach(res => {
            if (res.questionKey == question.qstSeq) {
              res.answerSeq = question.answrSeq;
              return;
            }
          })
        })
      })
    }, (error) => {
      console.log('err', error);
    });
  }
  getLocations() {
    this.loanService.getLocationsForPort(this.model.portSeq).subscribe((res) => {
      console.log(res);
      this.addresses = res;
    }, (error) => {
      console.log('err In Loan Service');
      console.log('err', error);
    });
  }
  selectAddress(add: Address) {
    this.address = add;
    Object.assign(this.model.schoolAppraisal.addressDto, add, this.model.schoolAppraisal.addressDto);
    console.log(this.model.schoolAppraisal.addressDto);
  }
  boolean = [{ codeKey: 1, codeValue: "YES" }, { codeKey: 0, codeValue: "NO" }];
  booleanQA; mfcibArray; otherLoanAmountPerMonth = 0;
  expenseType; relation; principal; ownership; schoolType; schoolLevel; schoolMedium; schoolArea; grade; schoolExpense; secondaryIncomeArray;
  schoolExpenseArray; householdExpenseArray; schoolOwnerShip; buildingOwnerShip; incomeTypeOrig; expenseTypeOrig; schoolExpenseArrayOrig;
  secondaryIncomeArrayOrig; householdExpenseArrayOrig; gradeOrig;
  private loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_OWNERSHIP).subscribe(d => this.schoolOwnerShip = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.RELATIONSHIP_TYPE).subscribe(d => this.relation = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_PRINCIPAL).subscribe(d => this.principal = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_BUILDING_OWNERSHIP).subscribe(d => this.buildingOwnerShip = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.BOOLEAN).subscribe(d => this.booleanQA = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_TYPE).subscribe(d => this.schoolType = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_LEVEL).subscribe(d => this.schoolLevel = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_MEDIUM).subscribe(d => this.schoolMedium = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_AREA).subscribe(d => this.schoolArea = d);
    // this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_TYPE).subscribe(d => this.schoolType = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_GRADE_LEVEL).subscribe(d => {
      this.grade = d; this.gradeOrig = JSON.parse(JSON.stringify(d));
      this.model.schoolAppraisal.schoolGradeDtos.forEach(res => {
        this.removeItemFromLOV(res.grdKey, this.grade);
      })
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_EXPENSES).subscribe(d => this.schoolExpense = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.KSS_SECONDARY_INCOME).subscribe(d => {
      this.secondaryIncomeArray = d; this.secondaryIncomeArrayOrig = JSON.parse(JSON.stringify(d));
      this.model.schoolAppraisal.secondaryIncome.forEach(x => {
        this.removeItemFromLOV(x.incomeTypeKey, this.secondaryIncomeArray);
      });
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_EXPENSES).subscribe(d => {
      this.schoolExpenseArray = d; this.schoolExpenseArrayOrig = JSON.parse(JSON.stringify(d));
      this.model.schoolAppraisal.businessExpense.forEach(x => {
        this.removeItemFromLOV(x.expTypKey, this.schoolExpenseArray);
      });
    });
    // this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_EXPENSES).subscribe(d => this.schoolExpenseArray = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.HOUSEHOLD_EXPENSES).subscribe(d => {
      this.householdExpenseArray = d; this.householdExpenseArrayOrig = JSON.parse(JSON.stringify(d))
      this.model.schoolAppraisal.householdExpense.forEach(x => {
        this.removeItemFromLOV(x.expTypKey, this.householdExpenseArray);
      });

      // Other Loans
      this.loanService.getMfcibLoans(this.model.loanAppSeq).subscribe((res) => {
        this.mfcibArray = res;
        let key = this.findSeqFromCd("0017", this.householdExpenseArrayOrig);
        this.model.schoolAppraisal.householdExpense.forEach(exp=>{
            if(exp.expTypKey == key){
              exp.DSED = true;
            }
        })
        res.forEach(obj => {
          if (obj.loanCompletionDate) {
            if (obj.isExpense) {
              let date = new Date();
              let months = this.monthDiff(date, new Date(obj.loanCompletionDate));
              if (months == 0) {
                this.otherLoanAmountPerMonth = +this.otherLoanAmountPerMonth + +obj.currentOutStandingAmount;
              } else {
                let amount = Math.floor(obj.currentOutStandingAmount / months);
                this.otherLoanAmountPerMonth = +this.otherLoanAmountPerMonth + +amount;
              }
            }
            const array = obj.loanCompletionDate.split('T', 1);
            if (array.length) {
              obj.loanCompletionDate = array[0];
            }

          }
        });
        if (this.otherLoanAmountPerMonth > 0) {
        let key = this.findSeqFromCd("0017", this.householdExpenseArrayOrig);
          if (key >= 0) {
            this.model.schoolAppraisal.householdExpense.forEach(expense => {
              if (expense.expTypKey == key) {
                let index = this.model.schoolAppraisal.householdExpense.indexOf(expense);
                if (index >= 0) {
                  this.model.schoolAppraisal.householdExpense.splice(index, 1);
                }
              }
            });
            let otherLoan = new BusinessExpense();
            otherLoan.expAmount = "" + this.otherLoanAmountPerMonth;
            otherLoan.expTypKey = key;
            otherLoan.expCategoryKey = 2;
            otherLoan.DSED = true;
            this.model.schoolAppraisal.householdExpense.push(otherLoan);
            console.log(otherLoan)
            this.totalHouseholdExpense = this.totalHouseholdExpense + +otherLoan.expAmount;
            this.removeItemFromLOV(key, this.householdExpenseArray);
          }

        }
      }, (error) => {
        console.log('err', error);
      });
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.INCOME_SOURCE_SCHOOL_OTHER).subscribe((res) => {
      this.incomeType = res;
      this.incomeTypeOrig = JSON.parse(JSON.stringify(res));
      this.model.schoolAppraisal.primaryIncome.forEach(x => {
        this.removeItemFromLOV(x.incomeTypeKey, this.incomeType);
      });
      console.log(res);
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.EXPENSE_TYPE).subscribe((res) => {
      this.expenseType = res;
      this.expenseTypeOrig = JSON.parse(JSON.stringify(res));
      console.log(res);
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getCommunityForPort(this.model.portKey).subscribe((res) => {
      this.communityArray = res;
    }, (error) => {
      console.log('err', error);
    });
  }
  communityArray = [];
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  findKeyFromValue(value, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        console.log(array[i].codeValue.toLowerCase() + "===" + value.toLowerCase());
        console.log(array[i].codeValue.toLowerCase() == value.toLowerCase())
        if (array[i].codeValue.toLowerCase() == value.toLowerCase()) {
          return array[i].codeKey;
        }
      }
    }
    return -1;
  }
  monthDiff(d1, d2) {
    var months;

    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth() + 1;

    if (d1.getDate() < 15) {
      months += 1;
    }
    if (d2.getDate() < 15) {
      months -= 1;
    }
    return months <= 0 ? 0 : months;
  }
  incomeChange() {
    this.averageIncome = Math.floor(((this.model.schoolAppraisal.maxMonthSale * this.model.schoolAppraisal.maxSaleMonth) +
      (this.model.schoolAppraisal.minMonthSale * this.model.schoolAppraisal.minSaleMonth)) / 12);
    console.log(this.averageIncome);
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  onPrimaryIncomeFormSubmit() {
    this.primaryIncome.incomeCategoryKey = 1;
    if (this.isEdit) {
      this.isEdit = false;
      this.totalPrimaryIncome = 0;
      this.model.schoolAppraisal.primaryIncome[this.itemToEdit.index] = this.primaryIncome;
      for (let i = 0; i < this.model.schoolAppraisal.primaryIncome.length; i++) {
        const x = +this.model.schoolAppraisal.primaryIncome[i].incomeAmount;
        this.totalPrimaryIncome = this.totalPrimaryIncome + x;
      }
      (<any>$('#addPrimaryIncome')).modal('hide');
      this.primaryIncome = new PrimaryIncome();
    } else {
      console.log(this.primaryIncome);
      // this.primaryIncome.incomeTypeKey = this.primaryIncome.incomeCategoryKey;
      this.model.schoolAppraisal.primaryIncome.push(this.primaryIncome);
      const x = +this.primaryIncome.incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
      (<any>$('#addPrimaryIncome')).modal('hide');
      this.primaryIncome = new PrimaryIncome();
    }
    this.removeItemsFromLOVUsingBizApp();
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  addPrimaryIncome() {
    (<any>$('#addPrimaryIncome')).modal('show');
    this.primaryIncome = new PrimaryIncome();
    this.isEdit = false;
  }
  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey === key) {
          return array[i].codeValue;
        }
      }
    }
  }
  // editPIncome(primaryIncome: PrimaryIncome) {
  //   this.primaryIncome = primaryIncome;
  //   (<any>$('#addPrimaryIncome')).modal('show');
  //   this.isEdit = true;
  // }
  // deletePIncome(pIncome) {
  //   const index = this.model.schoolAppraisal.primaryIncome.indexOf(pIncome, 0);
  //   console.log(index);
  //   if (index > -1) {
  //     this.model.schoolAppraisal.primaryIncome.splice(index, 1);
  //   }
  //   this.totalPrimaryIncome = 0;
  //   for (let i = 0; i < this.model.schoolAppraisal.primaryIncome.length; i++) {
  //     const x = +this.model.schoolAppraisal.primaryIncome[i].incomeAmount;
  //     this.totalPrimaryIncome = this.totalPrimaryIncome + x;
  //   }
  //   this.removeItemsFromLOVUsingBizApp();
  //   this.calculateNetDeposible();
  //   this.calculateBusinessProfit();
  //   (<any>$('#addPrimaryIncome')).modal('hide');
  // }
  addSecondaryIncome() {
    (<any>$('#addSecondaryIncome')).modal('show');
    this.secondaryIncome = new PrimaryIncome();
    this.isEdit = false;
  }
  // editSIncome(secondaryIncome: PrimaryIncome) {
  //   this.secondaryIncome = secondaryIncome;
  //   (<any>$('#addSecondaryIncome')).modal('show');
  //   this.isEdit = true;
  // }
  // deleteSIncome(sIncome) {
  //   const index = this.model.schoolAppraisal.secondaryIncome.indexOf(sIncome, 0);
  //   console.log(index);
  //   if (index > -1) {
  //     this.model.schoolAppraisal.secondaryIncome.splice(index, 1);
  //   }
  //   this.totalSecondaryIncome = 0;
  //   for (let i = 0; i < this.model.schoolAppraisal.secondaryIncome.length; i++) {
  //     const x = +this.model.schoolAppraisal.secondaryIncome[i].incomeAmount;
  //     this.totalSecondaryIncome = this.totalSecondaryIncome + x;
  //   }
  //   this.removeItemsFromLOVUsingBizApp();
  //   this.calculateNetDeposible();
  //   this.calculateBusinessProfit();
  //   (<any>$('#addSecondaryIncome')).modal('hide');
  // }
  onSecondaryIncomeFormSubmit() {
    this.secondaryIncome.incomeCategoryKey = 2;
    if (this.isEdit) {
      this.isEdit = false;
      this.totalSecondaryIncome = 0;
      this.model.schoolAppraisal.secondaryIncome[this.itemToEdit.index] = this.secondaryIncome;
      for (let i = 0; i < this.model.schoolAppraisal.secondaryIncome.length; i++) {
        const x = +this.model.schoolAppraisal.secondaryIncome[i].incomeAmount;
        this.totalSecondaryIncome = this.totalSecondaryIncome + x;
      }
      (<any>$('#addSecondaryIncome')).modal('hide');
      this.secondaryIncome = new PrimaryIncome();
    } else {
      console.log(this.secondaryIncome);
      // this.secondaryIncome.incomeTypeKey = this.secondaryIncome.incomeCategoryKey;
      this.model.schoolAppraisal.secondaryIncome.push(this.secondaryIncome);
      const x = +this.secondaryIncome.incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
      (<any>$('#addSecondaryIncome')).modal('hide');
      this.secondaryIncome = new PrimaryIncome();
      console.log(this.model.schoolAppraisal.secondaryIncome);
    }
    this.removeItemsFromLOVUsingBizApp();
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  calculateNetDeposible() {
    this.netDeposible = this.totalPrimaryIncome + this.totalSecondaryIncome +
      this.averageIncome - this.totalBusinessExpense - this.totalHouseholdExpense;
  }
  calculateBusinessProfit() {
    this.businessProfit = this.totalPrimaryIncome - this.totalBusinessExpense;
  }
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  calculateAge() { // birthday is a date

    const ageDate = this.commonService.formatDateCustom(Date.now(), 'yyyy');
    const currentYear = Math.abs(Number.parseInt(ageDate));
    if (this.yearEst > currentYear) {
      return 0;
    }
    return currentYear - this.yearEst;
  }
  incomeService(income: PrimaryIncome) {
    this.loanService.saveIncome(income).subscribe((res) => {
      console.log(res);
      this.toaster.success('Income added successfully', 'Success');
    }, (error) => {
      console.log('err In ADD INCOME Service');
      console.log('err', error);
    });
  }
  BusinessExpenses() {
    (<any>$('#BusinessExpenses')).modal('show');
    this.businessExpense = new BusinessExpense();
    this.isEdit = false;
  }
  // editBExpense(bExpense) {
  //   this.businessExpense = bExpense;
  //   (<any>$('#BusinessExpenses')).modal('show');
  //   this.isEdit = true;
  // }
  HouseholdExpenses() {
    (<any>$('#HouseholdExpenses')).modal('show');
    this.householdExpense = new BusinessExpense();
    this.isEdit = false;
  }
  onHouseholdExpenseFormSubmit() {
    this.householdExpense.expCategoryKey = 2;
    if (this.isEdit) {
      this.isEdit = false;
      this.model.schoolAppraisal.householdExpense[this.itemToEdit.index] = this.householdExpense;
      this.totalHouseholdExpense = 0;
      for (let i = 0; i < this.model.schoolAppraisal.householdExpense.length; i++) {
        const x = +this.model.schoolAppraisal.householdExpense[i].expAmount;
        this.totalHouseholdExpense = this.totalHouseholdExpense + x;
      }
      (<any>$('#HouseholdExpenses')).modal('hide');
      this.householdExpense = new BusinessExpense();
    } else {
      // this.householdExpense.expTypKey = this.householdExpense.expCategoryKey;
      this.model.schoolAppraisal.householdExpense.push(this.householdExpense);
      const x = +this.householdExpense.expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
      this.householdExpense = new BusinessExpense();
      (<any>$('#HouseholdExpenses')).modal('hide');
      console.log(this.model.schoolAppraisal.householdExpense);
    }
    this.removeItemsFromLOVUsingBizApp();
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  // itemToEdit;
  // editHExpense(hExpense) {
  //   this.householdExpense = JSON.parse(JSON.stringify(hExpense));
  //   this.itemToEdit = JSON.parse(JSON.stringify(hExpense));
  //   this.itemToEdit.index = this.model.schoolAppraisal.householdExpense.indexOf(hExpense);
  //   (<any>$('#HouseholdExpenses')).modal('show');
  //   this.householdExpenseArrayOrig.forEach(element => {
  //     if (element.codeKey == hExpense.expTypKey) {
  //       this.householdExpenseArray.push(element);
  //     }
  //   });
  //   this.isEdit = true;
  // }
  // hExpenseToDel;
  // deleteHExpense(hExpense) {
  //   this.hExpenseToDel = hExpense;
  //   (<any>$('#deleteHConfirmation')).modal('show');
  // }
  // confirmHDelete() {

  //   const index = this.model.schoolAppraisal.householdExpense.indexOf(this.hExpenseToDel);
  //   console.log(index);
  //   if (index > -1) {
  //     this.model.schoolAppraisal.householdExpense.splice(index, 1);
  //   }
  //   this.totalHouseholdExpense = 0;
  //   for (let i = 0; i < this.model.schoolAppraisal.householdExpense.length; i++) {
  //     const x = +this.model.schoolAppraisal.householdExpense[i].expAmount;
  //     this.totalHouseholdExpense = this.totalHouseholdExpense + x;
  //   }
  //   this.calculateNetDeposible();
  //   this.calculateBusinessProfit();
  //   this.removeItemsFromLOVUsingBizApp();
  //   (<any>$('#HouseholdExpenses')).modal('hide');
  //   // (<any>$('#deleteHConfirmation')).modal('hide');
  // }
  // deleteBExpense(bExpense) {
  //   const index = this.model.schoolAppraisal.businessExpense.indexOf(bExpense, 0);
  //   console.log(index);
  //   if (index > -1) {
  //     this.model.schoolAppraisal.businessExpense.splice(index, 1);
  //   }
  //   this.totalBusinessExpense = 0;
  //   for (let i = 0; i < this.model.schoolAppraisal.businessExpense.length; i++) {
  //     const x = +this.model.schoolAppraisal.businessExpense[i].expAmount;
  //     this.totalBusinessExpense = this.totalBusinessExpense + x;
  //   }
  //   this.removeItemsFromLOVUsingBizApp();
  //   this.calculateNetDeposible();
  //   this.calculateBusinessProfit();
  //   (<any>$('#BusinessExpenses')).modal('hide');
  // }
  onBusinessExpenseFormSubmit() {
    this.businessExpense.expCategoryKey = 1;
    if (this.isEdit) {
      this.isEdit = false;
      this.totalBusinessExpense = 0;
      this.model.schoolAppraisal.businessExpense[this.itemToEdit.index] = this.businessExpense;
      for (let i = 0; i < this.model.schoolAppraisal.businessExpense.length; i++) {
        const x = +this.model.schoolAppraisal.businessExpense[i].expAmount;
        this.totalBusinessExpense = this.totalBusinessExpense + x;
      }
      (<any>$('#BusinessExpenses')).modal('hide');
      this.businessExpense = new BusinessExpense();
    } else {
      // this.businessExpense.expTypKey = this.businessExpense.expCategoryKey;
      this.model.schoolAppraisal.businessExpense.push(this.businessExpense);
      const x = +this.businessExpense.expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
      this.businessExpense = new BusinessExpense();
      (<any>$('#BusinessExpenses')).modal('hide');
    }
    this.removeItemsFromLOVUsingBizApp();
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  expenseService(expense: BusinessExpense) {
    this.loanService.saveExpense(expense).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log('err In Expense Service');
      console.log('err', error);
    });
  }


  ////////////-======BONGIAN======-/////////
  itemToEdit: any;
  editPIncome(primaryIncome: PrimaryIncome) {
    this.primaryIncome = JSON.parse(JSON.stringify(primaryIncome));
    this.itemToEdit = JSON.parse(JSON.stringify(primaryIncome));
    this.itemToEdit.index = this.model.schoolAppraisal.primaryIncome.indexOf(primaryIncome);
    this.incomeTypeOrig.forEach(element => {
      if (element.codeKey == primaryIncome.incomeTypeKey) {
        this.incomeType.push(element);
      }
    });
    (<any>$('#addPrimaryIncome')).modal('show');
    this.isEdit = true;
  }
  pItemToDel;
  deletePIncome(pIncome) {
    (<any>$('#deletePConfirmation')).modal('show');
    this.pItemToDel = pIncome;
  }
  confirmPDelete() {
    const index = this.model.schoolAppraisal.primaryIncome.indexOf(this.pItemToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.schoolAppraisal.primaryIncome.splice(index, 1);
    }
    this.totalPrimaryIncome = 0;
    for (let i = 0; i < this.model.schoolAppraisal.primaryIncome.length; i++) {
      const x = +this.model.schoolAppraisal.primaryIncome[i].incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addPrimaryIncome')).modal('hide');
    (<any>$('#deletePConfirmation')).modal('hide');
  }
  editSIncome(secondaryIncome: PrimaryIncome) {
    this.secondaryIncomeArray = JSON.parse(JSON.stringify(this.secondaryIncomeArrayOrig));
    this.itemToEdit = JSON.parse(JSON.stringify(secondaryIncome));
    this.secondaryIncome = JSON.parse(JSON.stringify(secondaryIncome));
    this.itemToEdit.index = this.model.schoolAppraisal.secondaryIncome.indexOf(secondaryIncome);
    (<any>$('#addSecondaryIncome')).modal('show');
    this.secondaryIncomeArrayOrig.forEach(element => {
      if (element.codeKey == secondaryIncome.incomeTypeKey) {
        this.secondaryIncomeArray.push(element);
      }
    });
    this.isEdit = true;
  }
  sIncomeToDel;
  deleteSIncome(sIncome) {
    this.sIncomeToDel = sIncome;
    (<any>$('#deleteSConfirmation')).modal('show');
  }
  confirmSDelete() {
    const index = this.model.schoolAppraisal.secondaryIncome.indexOf(this.sIncomeToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.schoolAppraisal.secondaryIncome.splice(index, 1);
    }
    this.totalSecondaryIncome = 0;
    for (let i = 0; i < this.model.schoolAppraisal.secondaryIncome.length; i++) {
      const x = +this.model.schoolAppraisal.secondaryIncome[i].incomeAmount;
      this.totalSecondaryIncome = this.totalSecondaryIncome + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#addSecondaryIncome')).modal('hide');
    (<any>$('#deleteSConfirmation')).modal('hide');
  }
  editBExpense(bExpense) {
    this.businessExpense = JSON.parse(JSON.stringify(bExpense));
    this.itemToEdit = JSON.parse(JSON.stringify(bExpense));
    this.itemToEdit.index = this.model.schoolAppraisal.businessExpense.indexOf(bExpense);
    (<any>$('#BusinessExpenses')).modal('show');
    this.schoolExpenseArrayOrig.forEach(element => {
      if (element.codeKey == bExpense.expTypKey) {
        this.schoolExpenseArray.push(element);
      }
    });
    this.isEdit = true;
  }
  bExpenseToDel;
  deleteBExpense(bExpense) {
    this.bExpenseToDel = bExpense;
    (<any>$('#deleteBConfirmation')).modal('show');
  }
  confirmBDelete() {

    const index = this.model.schoolAppraisal.businessExpense.indexOf(this.bExpenseToDel, 0);
    console.log(index);
    if (index > -1) {
      this.model.schoolAppraisal.businessExpense.splice(index, 1);
    }
    this.totalBusinessExpense = 0;
    for (let i = 0; i < this.model.schoolAppraisal.businessExpense.length; i++) {
      const x = +this.model.schoolAppraisal.businessExpense[i].expAmount;
      this.totalBusinessExpense = this.totalBusinessExpense + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#BusinessExpenses')).modal('hide');
    (<any>$('#deleteBConfirmation')).modal('hide');
  }
  editHExpense(hExpense) {
    this.householdExpense = JSON.parse(JSON.stringify(hExpense));
    this.itemToEdit = JSON.parse(JSON.stringify(hExpense));
    this.itemToEdit.index = this.model.schoolAppraisal.householdExpense.indexOf(hExpense);
    (<any>$('#HouseholdExpenses')).modal('show');
    this.householdExpenseArrayOrig.forEach(element => {
      if (element.codeKey == hExpense.expTypKey) {
        this.householdExpenseArray.push(element);
      }
    });
    this.isEdit = true;
  }
  hExpenseToDel;
  deleteHExpense(hExpense) {
    this.hExpenseToDel = hExpense;
    (<any>$('#deleteHConfirmation')).modal('show');
  }
  confirmHDelete() {
    const index = this.model.schoolAppraisal.householdExpense.indexOf(this.hExpenseToDel);
    console.log(index);
    if (index > -1) {
      this.model.schoolAppraisal.householdExpense.splice(index, 1);
    }
    this.totalHouseholdExpense = 0;
    for (let i = 0; i < this.model.schoolAppraisal.householdExpense.length; i++) {
      const x = +this.model.schoolAppraisal.householdExpense[i].expAmount;
      this.totalHouseholdExpense = this.totalHouseholdExpense + x;
    }
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
    this.removeItemsFromLOVUsingBizApp();
    (<any>$('#HouseholdExpenses')).modal('hide');
    (<any>$('#deleteHConfirmation')).modal('hide');
  }
  ///////=======END========/////
  date;

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.date = moment();
    const ctrlValue = this.date;
    ctrlValue.year(normalizedYear.year());
    this.date = ctrlValue;
    this.model.schoolAppraisal.schyr = normalizedYear.year();
    console.log(normalizedYear.year())
    datepicker.close();
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  removeItemsFromLOVUsingBizApp() {
    this.incomeType = JSON.parse(JSON.stringify(this.incomeTypeOrig));
    this.secondaryIncomeArray = JSON.parse(JSON.stringify(this.secondaryIncomeArrayOrig));
    this.schoolExpenseArray = JSON.parse(JSON.stringify(this.schoolExpenseArrayOrig));
    this.householdExpenseArray = JSON.parse(JSON.stringify(this.householdExpenseArrayOrig));

    this.model.schoolAppraisal.primaryIncome.forEach(x => {
      this.removeItemFromLOV(x.incomeTypeKey, this.incomeType);
    });
    this.model.schoolAppraisal.secondaryIncome.forEach(x => {
      this.removeItemFromLOV(x.incomeTypeKey, this.secondaryIncomeArray);
    });
    this.model.schoolAppraisal.businessExpense.forEach(x => {
      this.removeItemFromLOV(x.expTypKey, this.schoolExpenseArray);
    });
    this.model.schoolAppraisal.householdExpense.forEach(x => {
      this.removeItemFromLOV(x.expTypKey, this.householdExpenseArray);
    });
  }

  removeItemFromLOV(key, lov) {
    let index = -1;
    for (let i = 0; i < lov.length; i++) {
      if (key == lov[i].codeKey) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      lov.splice(index, 1);
    }
  }

  getTotal() {
    let x = +this.model.schoolAppraisal.totMaleTchrs + +this.model.schoolAppraisal.totFemTchrs;
    if (x == 0)
      return 0;

    return this.totalGrade.totalStudents / x;
  }
  findSeqFromCd(cd, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeRefCd == cd) {
          return array[i].codeKey;
        }
      }
    }
    return -1;
  }
}
