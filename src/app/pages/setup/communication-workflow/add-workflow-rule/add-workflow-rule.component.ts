import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-workflow-rule',
  templateUrl: './add-workflow-rule.component.html',
  styleUrls: ['./add-workflow-rule.component.css']
})
export class AddWorkflowRuleComponent implements OnInit {
  workflowRuleForm: FormGroup;
    submitted = false;
    updateValue: any = 'add';
    functionListing: any = '';
    // editCommunicationKey: any = sessionStorage.getItem("editCommunication");
  // console.log(editCommunicationKey);
  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    sessionStorage.setItem('actionCommunication', '');
    this.workflowRuleForm = this.formBuilder.group({
      formSaveKey: ['add'],
            functionKey: ['', Validators.required],
            ruleName: ['', Validators.required],
            workflowComments: [''],
            ruleCriteria: ['', Validators.required],
            ruleCriteriafun: ['']
        });
    // function LIST
      this.dataService.functionList().subscribe(result => {
        this.functionListing  = result;
        console.log(result);
        }, error => console.log('There was an error: ', error));
      // edit
    const editCommunicationKey: any = sessionStorage.getItem('editCommunication');
    console.log(editCommunicationKey);
    if (editCommunicationKey) {
      this.dataService.editCommunicatioinWorkflowRule(editCommunicationKey).subscribe(result => {
        sessionStorage.setItem('actionCommunication', result.action);
        console.log(result);
        this.workflowRuleForm = this.formBuilder.group({
          formSaveKey: ['update']
          , commWorkflowSeq: [result.workflowSeq]
          , functionKey: [result.functionKey, Validators.required]
          , ruleName: [result.ruleName, Validators.required]
          , workflowComments: [result.workflowComments]
          , ruleCriteria: [result.ruleCriteria, Validators.required]
          , ruleCriteriafun: [result.ruleCriteria]
        });
        }, error => console.log('There was an error: ', error));
    }
  }
  get f() { return this.workflowRuleForm.controls; }
  onWorkflowRuleSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.workflowRuleForm.invalid) {
      return;
    }
    const formValue: any = this.workflowRuleForm.value;
    console.log(formValue.formSaveKey);
    if (formValue.formSaveKey === 'add') {
      this.dataService.addWorkflowRule(formValue).subscribe((data) => {
        console.log(data);
        sessionStorage.setItem('ruleCommSeq', data.commSeq);
        this.router.navigate(['/setup/communication-workflow/add-workflow-action']);
        }, (error)  => {
        console.log('err', error);
      });
    } else if (formValue.formSaveKey === 'update') {
      this.dataService.updateCommunicatioinWorkflowRule(formValue).subscribe((data) => {
        console.log(data);
        sessionStorage.setItem('editCommunication', data.commSeq);
        this.router.navigate(['/setup/communication-workflow/add-workflow-action', data.commSeq]);
        }, (error)  => {
        console.log('err', error);
      });
    }
    return false;
  }
  onCriteriaClick() {
    const formValue: any = this.workflowRuleForm.value;
    const editCommunicationKey: any = sessionStorage.getItem('editCommunication');
    if (editCommunicationKey) {
      this.updateValue = 'update';
    }
    // console.log(updateValue);
    this.workflowRuleForm = this.formBuilder.group({
      formSaveKey: this.updateValue,
            functionKey: [formValue['functionKey'], Validators.required],
            ruleName: [formValue['ruleName'], Validators.required],
            workflowComments: [formValue['workflowComments']],
            ruleCriteria: [formValue['ruleCriteriafun'], Validators.required],
            ruleCriteriafun: [''],
        });
  // console.log(formValue['ruleCriteriafun']);
  }


}
