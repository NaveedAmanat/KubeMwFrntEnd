import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../shared/services/common.service';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { LoanService } from '../../../../shared/services/loan.service';
import { Router } from '@angular/router';
import { SchoolQAArray } from '../../../../shared/models/schoolQA.model';
import { SchoolInformation } from '../../../../shared/models/SchoolInformation.model';
import { NgxSpinnerService } from 'ngx-spinner';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';

@Component({
  selector: 'app-school-information',
  templateUrl: './school-information.component.html',
  styleUrls: ['./school-information.component.css'],
})
export class SchoolInformationComponent implements OnInit {
  auth = JSON.parse(sessionStorage.getItem("auth"));
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true: false;
  hasPermission = false;
  
  constructor(private router: Router
    , private loanService: LoanService
    , private breadcrumbProvider: BreadcrumbProvider
    , private commonService: CommonService
    , private toaster: ToastrService
    , private spinner: NgxSpinnerService) { }

  model: any;
  rawQuestionsArray;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });
    this.model = JSON.parse(sessionStorage.getItem('model'));
    if (this.model.schoolInformation == undefined || this.model.schoolInformation == null) {
      this.model.schoolInformation = new SchoolInformation();
      this.model.schoolInformation.loanAppSeq = this.model.loanAppSeq;
      this.model.schoolInformation.SchoolQAArray = [];
      this.model.schoolInformation.documentChecklist = [];
      this.model.schoolInformation.mwAnswers = [];
      this.model.schoolInformation.schoolQualityCheckDtos = [];
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

    


    if (sessionStorage.getItem('editLoan') === 'true') {
      console.log(this.model.loanSeq);
      this.spinner.show();
      this.loanService.getSchoolInformation(this.model.loanAppSeq).subscribe((schoolAP: any) => {
        console.log("School", schoolAP);
        this.model.schoolInformation = schoolAP;
        this.getQuestions(2);
        this.getDocQuestions(3);
        this.spinner.hide();
      },
        error => {
          console.log(error);
          this.spinner.hide();
          this.getQuestions(2);
          this.getDocQuestions(3);
        });
    } else {
      if (this.model.schoolInformation.SchoolQAArray.length <= 0) {
        this.getQuestions(2);
      } else {
        let i = -1;
        this.model.schoolInformation.SchoolQAArray.forEach(res => {
          res.questions.forEach(q => {
            if (q.answerSeq <= 0) {
              i++;
            }
          })
        });
        if (i == -1) {
          this.hasQlty = true;
        }
      }
      if (this.model.schoolInformation.documentChecklist.length <= 0) {
        this.getDocQuestions(3);
      } else {
        let i = -1;
        this.model.schoolInformation.documentChecklist.forEach(res => {
          res.questions.forEach(q => {
            if (q.answerSeq <= 0) {
              i++;
            }
          })
        });
        if (i == -1) {
          this.hasDocs = true;
        }
      }
    }
    this.loadLovs();
    // Added by Naveed 29-07-2021
    this.hasPermission = this.commonService.checkPermission('school-information', this.model);
    // end
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
  getQuestions(seq) {
    this.loanService.getSchoolByQstnrSeq(seq).subscribe((rawQA: SchoolQAArray[]) => {
      console.log(rawQA)
      this.rawQuestionsArray = rawQA;
      this.model.schoolInformation.SchoolQAArray = rawQA;
      this.model.schoolInformation.schoolQualityCheckDtos.forEach(question => {
        this.model.schoolInformation.SchoolQAArray.forEach(q => {
          q.questions.forEach(res => {
            if (res.questionKey == question.qstSeq) {
              res.answerSeq = question.answrSeq.toString();
              return;
            }
          })
        })
      })
      let i = -1;
      this.model.schoolInformation.SchoolQAArray.forEach(res => {
        res.questions.forEach(q => {
          if (q.answerSeq <= 0) {
            i++;
          }
        })
      });
      if (i == -1) {
        this.hasQlty = true;
      }
    }, (error) => {
      console.log('err', error);
    });
  }
  hasDocs;
  hasQlty;
  getDocQuestions(seq) {
    this.loanService.getSchoolByQstnrSeq(seq).subscribe((rawQA: SchoolQAArray[]) => {
      console.log(rawQA)
      this.rawQuestionsArray = rawQA;
      this.model.schoolInformation.documentChecklist = rawQA;
      this.model.schoolInformation.schoolQualityCheckDtos.forEach(question => {
        this.model.schoolInformation.documentChecklist.forEach(q => {
          q.questions.forEach(res => {
            if (res.questionKey == question.qstSeq) {
              res.answerSeq = question.answrSeq.toString();
              return;
            }
          })
        })
      });
      let i = -1;
      this.model.schoolInformation.documentChecklist.forEach(res => {
        res.questions.forEach(q => {
          if (q.answerSeq <= 0) {
            i++;
          }
        })
      });
      if (i == -1) {
        this.hasDocs = true;
      }
    }, (error) => {
      console.log('err', error);
    });
  }
  booleanQA;
  private loadLovs() {
    this.commonService.getValues(REF_CD_GRP_KEYS.DEFAULT_BOOLEAN).subscribe(d => this.booleanQA = d);
  }
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
          return array[i].codeRefCd;
        }
      }
    }
    return -1;
  }


  onSubmit() {
    this.spinner.show();
    this.model.schoolInformation.formSeq = this.model.formSeq;
    this.model.schoolInformation.loanAppSeq = this.model.loanAppSeq;
    this.loanService.addSchoolInformation(this.model.schoolInformation).subscribe(res => {
      this.spinner.hide();
      this.model.schoolInformation = res.schoolInformationDto;
      this.hasDocs = this.model.schoolInformation.hasDocChck;
      this.hasQlty = this.model.schoolInformation.hasQltyChck;
      this.toaster.success('Saved School Information Successfully', 'Success');
      if (this.model.forms) {
        this.model.forms.forEach(
          forms => {
            if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
              forms.isSaved = this.model.schoolInformation.formComplete;
              this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
            }
          }
        );
      }
      sessionStorage.setItem('model', JSON.stringify(this.model));
      
      this.spinner.show();
      this.loanService.getSchoolInformation(this.model.loanAppSeq).subscribe((schoolAP: any) => {
        this.model.schoolInformation = schoolAP;
        this.getQuestions(2);
        this.getDocQuestions(3);
        this.spinner.hide();
      },
        error => {
          console.log(error);
          this.spinner.hide();
          this.getQuestions(2);
          this.getDocQuestions(3);
        });
        

    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Server Error");
      console.log('err', error);
    });
  }
}
