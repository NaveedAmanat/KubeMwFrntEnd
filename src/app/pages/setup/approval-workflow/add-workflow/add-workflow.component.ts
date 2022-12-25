import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.css']
})
export class AddWorkflowComponent implements OnInit {
	approvalWorkflowForm: FormGroup;
    submitted = false;
	model: any = {};
	// array of all items to be paged
    private allItems: any = [];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any = [];
  constructor(private router:Router,private DataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
	this.approvalWorkflowForm = this.formBuilder.group({
		workflowId: ['', Validators.required],
		description: ['', Validators.required],
		objectKey: ['1'],
		statusKey: ['1'],
		ruleCriteria: ['', Validators.required],
		isRegionalManager: [false],
		isAreaManager: [false],
		isBranchManager: [false],
		approvalCriteria: [''],
	});
  }
  // convenience getter for easy access to form fields
  get f() { return this.approvalWorkflowForm.controls; }
  onApprovalWorkSubmit(){
	  this.submitted = true;
 
        // stop here if form is invalid
        if (this.approvalWorkflowForm.invalid) {
            return;
        }
		let formValue: any = this.approvalWorkflowForm.value;
	this.DataService.addAprovalWorkflow(formValue).subscribe((data) =>{
    //let usr = JSON.parse(data);
	console.log(data);
    this.router.navigate(["setup/approval-workflow"]);
    },(error)  => {
        console.log("err", error);   
        //this.addToast({title:'Error', msg:error._body, timeout: 3000, theme:'default', position:'bottom-right', type:'error', closeOther:true})
      });
    return false;
  }
  onCriteriaClick(){
    let formValue: any = this.approvalWorkflowForm.value;
    this.approvalWorkflowForm = this.formBuilder.group({
            workflowId: [formValue['workflowId'], Validators.required],
            description: [formValue['description'], Validators.required],
            objectKey: [formValue['objectKey']],
            statusKey: [formValue['statusKey']],
			ruleCriteria: [formValue['approvalCriteria'], Validators.required],
			isRegionalManager: [formValue['isRegionalManager']],
			isAreaManager: [formValue['isAreaManager']],
			isBranchManager: [formValue['isBranchManager']],
            approvalCriteria: [''],

        });
  //console.log(formValue['ruleCriteriafun']);
  }
  

}
