import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../../shared/services/answer.service';
import { CommonService } from '../../../shared/services/common.service';
import { Answer } from '../../../shared/models/Answer.model';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {

  public answerForm: FormGroup;
  submitted = false;

  statusArray : any[];
  public answers: Answer[];
  public addAnswer: Answer = new Answer();
  public isEdit: Boolean = false;
  constructor(private formBuilder: FormBuilder,private answerService: AnswerService, private commonService: CommonService) {
   }

   ngOnInit() {

    this.answerForm = this.formBuilder.group({  
      answrStr: ['', Validators.required],
      answrScore: ['', Validators.required],
      answrStsKey: ['', Validators.required],
  });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );   
    this.answerService.getAnswers(sessionStorage.getItem('qstSeq')).subscribe(data => this.answers = data);
  }

  get form() 
  { 
    return this.answerForm.controls; 
  }

  onAddNewClick() {
    this.isEdit = false;
    this.answerForm.reset();
    this.addAnswer = new Answer();
    (<any>$('#businessector')).modal('show');
  }
  
  addAnswerSubmit(){
    this.submitted = true;
    if (this.answerForm.invalid) {
        return;
    }

    this.addAnswer.answrStr= this.answerForm.value.answrStr;
    this.addAnswer.answrScore= this.answerForm.value.answrScore;
    this.addAnswer.answrStsKey= this.answerForm.value.answrStsKey;
    this.addAnswer.qstSeq= parseInt(sessionStorage.getItem('qstSeq'));

    (<any>$('#businessector')).modal('hide');
    console.log(this.addAnswer);
    if(this.isEdit) {
      this.answerService.updateAnswer(this.addAnswer).subscribe(data => {
        this.addAnswer = data;
        this.answerService.getAnswers(sessionStorage.getItem('qstSeq')).subscribe(data => this.answers = data);
      });
    }
    else {
      this.answerService.addAnswer(this.addAnswer).subscribe(data => {
        this.addAnswer = data;
        this.answerService.getAnswers(sessionStorage.getItem('qstSeq')).subscribe(data => this.answers = data);
      }); 
    }         
  }

  onEdit(answer){
    this.isEdit = true;
    this.answerForm.patchValue(answer);
    console.log(answer);
    this.addAnswer = answer;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(answer) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Answer?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.answerService.deleteAnswer(answer).subscribe(data => {
          this.answerService.getAnswers(sessionStorage.getItem('qstSeq')).subscribe(data => this.answers = data);
        }); 
      }
    });
    console.log(answer);  
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

}


