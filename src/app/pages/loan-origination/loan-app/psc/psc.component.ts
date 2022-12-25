import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { Question } from '../../../../shared/models/Question.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-psc',
  templateUrl: './psc.component.html',
  styleUrls: ['./psc.component.css']
})
export class PscComponent implements OnInit, DoCheck {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true: false;

  constructor(private router: Router, private loanService: LoanService,
    private spinner: NgxSpinnerService,
    private breadcrumbProvider: BreadcrumbProvider,
    private toaster: ToastrService,
    private fb: FormBuilder) { }
  questions: Question[] = [];
  questionsKeys: string[] = [];
  model: any;
  pscForm: FormGroup;
  controls: any;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved);
    });
    // this.loanService.breadcrumbs.forEach(
    //   breadcrumb => this.breadcrumbProvider.addCheckedItem(breadcrumb.label, breadcrumb.href, breadcrumb.isSaved)
    // );
    this.spinner.hide();
    this.model = JSON.parse(sessionStorage.getItem('model'));
    console.log(this.model.previousPscScore)
    // console.log(this.model);
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
          }else if (element.formUrl == 'next-of-kin') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined ) {
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
    this.loanService.getQuestionAndAnswer().subscribe((res) => {
      // console.log(this.questions);
      this.model.questions = res;
      this.questions = res;
      this.model.questions.forEach(obj => {
        obj.questionSeq = obj.questionKey;
        obj.loanAppSeq = this.model.loanAppSeq;
        obj.formSeq = this.model.formSeq;
        
      });

      // if (sessionStorage.getItem('editLoan') === 'true') {
      this.formSaved = true;
      this.loanService.getPSC(this.model.loanAppSeq).subscribe((ress: any) => {
        console.log('here');
        console.log(ress);

        // console.log('questions here');
        if (ress.length) {
          for (let i = 0; i < this.model.questions.length; i++) {
            ress.forEach(r =>{
              if(r.questionSeq == this.model.questions[i].questionKey){
                this.model.questions[i].answerSeq = r.answerSeq;
                this.questions[i].answerSeq = r.answerSeq;
                this.questions[i].loanAppSeq = this.model.loanAppSeq;
                this.questionsKeys.push(r.answerSeq);
              }
            });
            
          }
        }
        // console.log(this.questionsKeys);
        this.createForm();
        this.calculatePscScore();
        // console.log(this.model.questions);
      }, (error) => {
        console.log('err', error);
      });
      // }

    }, (error) => {
      console.log('err', error);
    });
  }

  createForm() {
    console.log('create form');
    console.log(this.model.questions);
    this.controls = this.model.questions.map(c => new FormControl(c.answerSeq, Validators.required));

    this.pscForm = this.fb.group({
      questionArray: new FormArray(this.controls)
    });
    // const group = this.fb.group({});
    // this.questions.forEach(question => {
    //   group.addControl('question' + question.questionKey,
    //     new FormControl({value: question.answerSeq }, Validators.required));
    // });
    // return group;
  }
  formSaved = false;
  continueClicked() {
    // this.router.navigate(['loan-origination/documents']);
    if (this.model.forms) {
      let i = 0;
      this.model.forms.forEach(
        forms => {
          if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
            this.router.navigate(['/loan-origination/app/' + this.model.forms[i + 1].formUrl]);
          }
          i++;
        }
      );
    }
  }
  ngDoCheck() {
    sessionStorage.setItem('isSavedPsc', this.formSaved.toString());
  }
  customTrackBy(index: number, obj: any): any {
    return index;
  }
  saveClicked() {

  }
  onAnswerSelect(event) {
    console.log(event);
    const v = this.pscForm.value.questionArray[event];
    this.model.questions[event].answerSeq = v;
    console.log(v);
    this.calculatePscScore();
  }

  calculatePscScore() {
    this.score = 0;
    for (let i = 0; i < this.model.questions.length; i++) {
      if (this.model.questions[i].answerSeq) {
        for (let z = 0; z < this.model.questions[i].answers.length; z++) {
          if (this.model.questions[i].answers[z].answerKey == this.model.questions[i].answerSeq) {
            this.score = this.score + this.model.questions[i].answers[z].answerScore;
          }
        }
      }
    }
  }

  onPscFormSubmit() {
    this.spinner.show();
    console.log(this.model.loanAppSeq);

    for (let i = 0; i < this.model.questions.length; i++) {
      this.questions[i].pscScore = this.score;
      this.questions[i].loanAppSeq = this.model.loanAppSeq;
    }
    this.loanService.savePSC(this.model.questions).subscribe((res) => {
      this.spinner.hide();
      this.toaster.success('Saved');
      // console.log(res);
      if (this.model.forms) {
        this.model.forms.forEach(
          forms => {
            if ('/loan-origination/app/' + forms.formUrl == this.router.url) {
              forms.isSaved = true;
              this.breadcrumbProvider.addCheckedItemDis(forms.formNm, '/loan-origination/app/' + forms.formUrl, forms.isSaved, false);
            }
          }
        );
      }
      sessionStorage.setItem('model', JSON.stringify(this.model));
      // console.log('model here');
      // console.log(JSON.stringify(this.model));
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.error, 'Error');
      console.log('err', error);
    });
  }
  score = 0;
  calculateScore() {

  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
