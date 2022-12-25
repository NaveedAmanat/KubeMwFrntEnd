import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../shared/services/question.service';
import { CommonService } from '../../../shared/services/common.service';
import { Question } from '../../../shared/models/Question.model';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  statusArray : any[];
  typeArray : any[];
  categoryArray : any[];
  public questions: Question[];
  public addQuestion: Question = new Question(null, null);
  public isEdit: Boolean = false;

  public questionForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private questionService: QuestionService, private commonService: CommonService) {
   }

   ngOnInit() {
    this.questionForm = this.formBuilder.group({  
      qstSeq: [],
      qstTypKey: ['', Validators.required],
      qstStr: ['', Validators.required],
      qstCtgryKey: ['', Validators.required],
      qstStsKey: ['', Validators.required],
      qstSortOrdr: ['', Validators.required],
  });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );   
    this.commonService.getValuesByGroupName('\tQUESTION TYPE').subscribe(
      d => this.typeArray = d
    );   
    this.commonService.getValuesByGroupName('\tSCHOOL QUESTIONAIRE CATEGORY').subscribe(
      d => this.categoryArray = d
    );   

    this.questionService.getQuestions(sessionStorage.getItem('qstnrSeq')).subscribe(data => this.questions = data);
  }
  get form() 
  { 
    return this.questionForm.controls; 
  }
  onClick(qstSeq)
  {
    sessionStorage.setItem('qstSeq', JSON.stringify(qstSeq));
  }
  onAddNewClick() {
    this.isEdit = false;
    this.questionForm.reset();
    this.addQuestion = new Question(null , null);
    (<any>$('#businessector')).modal('show');
  }
  
  addQuestionSubmit(){
    this.submitted = true;
    if (this.questionForm.invalid) {
        return;
    }

    this.addQuestion.qstTypKey= this.questionForm.value.qstTypKey;
    this.addQuestion.qstStr= this.questionForm.value.qstStr;
    this.addQuestion.qstCtgryKey= this.questionForm.value.qstCtgryKey;
    this.addQuestion.qstStsKey= this.questionForm.value.qstStsKey;
    this.addQuestion.qstnrSeq= parseInt(sessionStorage.getItem('qstnrSeq'));
    this.addQuestion.qstSortOrdr = this.questionForm.value.qstSortOrdr;
    this.addQuestion.qstSeq = this.addQuestion.qstSeq;
    (<any>$('#businessector')).modal('hide');
    console.log(this.addQuestion);
    if(this.isEdit) {
      this.questionService.updateQuestion(this.addQuestion).subscribe(data => {
        // this.addQuestion = data;
        this.questionService.getQuestions(sessionStorage.getItem('qstnrSeq')).subscribe(data => this.questions = data);
      });
    }
    else {
      this.questionService.addQuestion(this.addQuestion).subscribe(data => {
        // this.addQuestion = data;
        this.questionService.getQuestions(sessionStorage.getItem('qstnrSeq')).subscribe(data => this.questions = data);
      }); 
    }         
  }

  onEdit(question){
    this.isEdit = true;
    this.addQuestion = question;
    this.questionForm.controls["qstStr"].setValue(question.qstStr);
    this.questionForm.controls["qstStsKey"].setValue(question.qstStsKey);
    this.questionForm.controls["qstTypKey"].setValue(question.qstTypKey);
    this.questionForm.controls["qstCtgryKey"].setValue(question.qstCtgryKey);
    this.questionForm.controls["qstSortOrdr"].setValue(question.qstSortOrdr);
    this.questionForm.controls["qstSeq"].setValue(question.qstSeq);
    console.log(question);
    (<any>$('#businessector')).modal('show');
  }

  onDelete(question) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Question?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.questionService.deleteQuestion(question).subscribe(data => {
          this.questionService.getQuestions(sessionStorage.getItem('qstnrSeq')).subscribe(data => this.questions = data);
        }); 
      }
    });
    console.log(question);  
  }
  
  findValueByKey(key) {
    let status = '';
    if (this.statusArray) {
      this.statusArray.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  findTypeById(typeId) {
    let type = '';
    if (this.typeArray) {
      this.typeArray.forEach(s => {
        if (s.codeKey === typeId) {
          type = s.codeValue;
        }
      });
    }
    return type;
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  findCategoryById(categoryId) {
    let category = '';
    if (this.categoryArray) {
      this.categoryArray.forEach(s => {
        if (s.codeKey === categoryId) {
          category = s.codeValue;
        }
      });
    }
    return category;
  }
}


