import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../../shared/services/questionnaire.service';
import { CommonService } from '../../../shared/services/common.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import { Questionnaire } from '../../../shared/models/questionnaire.model';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  public questionnaireForm: FormGroup;
  submitted = false;

  statusArray : any[];
  public questionnaires: Questionnaire[];
  public addQuestionnaire: Questionnaire = new Questionnaire();
  public isEdit: Boolean = false;
  constructor(private formBuilder: FormBuilder,private questionnaireService: QuestionnaireService, private commonService: CommonService) {
   }

   ngOnInit() {

    this.questionnaireForm = this.formBuilder.group({  
      qstnrNm: ['', Validators.required],
      qstnrStsKey: ['', Validators.required],
  });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );   
    this.questionnaireService.getQuestionnaires().subscribe(data => this.questionnaires = data);
  }

  get form() 
  { 
    return this.questionnaireForm.controls; 
  }

  onClick(key)
  {
    sessionStorage.setItem('qstnrSeq', JSON.stringify(key));
  }
  onAddNewClick() {
    this.isEdit = false;
    this.questionnaireForm.reset();
    this.addQuestionnaire = new Questionnaire();
    (<any>$('#businessector')).modal('show');
  }
  
  addQuestionnaireSubmit(){
    this.submitted = true;
    if (this.questionnaireForm.invalid) {
        return;
    }

    this.addQuestionnaire.qstnrNm= this.questionnaireForm.value.qstnrNm;
    this.addQuestionnaire.qstnrStsKey= this.questionnaireForm.value.qstnrStsKey;


    (<any>$('#businessector')).modal('hide');
    console.log(this.addQuestionnaire);
    if(this.isEdit) {
      this.questionnaireService.updateQuestionnaire(this.addQuestionnaire).subscribe(data => {
        this.addQuestionnaire = data;
        this.questionnaireService.getQuestionnaires().subscribe(data => this.questionnaires = data);
      });
    }
    else {
      this.questionnaireService.addQuestionnaire(this.addQuestionnaire).subscribe(data => {
        this.addQuestionnaire = data;
        this.questionnaireService.getQuestionnaires().subscribe(data => this.questionnaires = data);
      }); 
    }         
  }

  onEdit(questionnaire){
    this.isEdit = true;
    this.questionnaireForm.patchValue(questionnaire);
    console.log(questionnaire);
    this.addQuestionnaire = questionnaire;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(questionnaire) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Questionnaire?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.questionnaireService.deleteQuestionnaire(questionnaire).subscribe(data => {
          this.questionnaireService.getQuestionnaires().subscribe(data => this.questionnaires = data);
        }); 
      }
    });
    console.log(questionnaire);  
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


