import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-add-workflow-action',
	templateUrl: './add-workflow-action.component.html',
	styleUrls: ['./add-workflow-action.component.css']
})
export class AddWorkflowActionComponent implements OnInit {
	workflowActionNewTaskForm: FormGroup;
	workflowActionNewSmsForm: FormGroup;
	workflowActionEmailAlertForm: FormGroup;
	test: FormGroup;
	//ruleCommSeq: any = sessionStorage.getItem("ruleCommSeq");
	submitted = false;
	public newtast = true;
	public newsms = false;
	public EmailAlert = false;
	//PhoneField: boolean = true;
	public PhoneField = true;
	public Individual = false;
	public EmailField = true;
	public EmailIndividual = false;
	actionCommunication: any = "";
	statusListing: any = "";
	constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder) { }

	ngOnInit() {

		this.actionCommunication = sessionStorage.getItem("actionCommunication");
		if (this.actionCommunication === "New SMS") {
			this.test = this.formBuilder.group({
				okvalue: ['newsms'],
			});
		} else if (this.actionCommunication === "Email Alert") {
			this.test = this.formBuilder.group({
				okvalue: ['EmailAlert'],
			});
		} else {
			this.test = this.formBuilder.group({
				okvalue: ['newtast'],
			});
		}

		this.workflowActionNewTaskForm = this.formBuilder.group({
			action: ['New Task'],
			formSaveKey: ['add'],
			workflowSeq: [sessionStorage.getItem("ruleCommSeq")],
			taskSubject: ['', Validators.required],
			taskDays: ['', Validators.required],
			taskDueable: ["", Validators.required],
			taskDate: ['', Validators.required],
			taskAssignTo: ['1', Validators.required],
			taskStatus: ['1', Validators.required],
			taskActionComments: ['', Validators.required],
		});
		this.workflowActionNewSmsForm = this.formBuilder.group({
			action: ['New SMS'],
			formSaveKey: ['add'],
			workflowSeq: [sessionStorage.getItem("ruleCommSeq")],
			messageRecpientType: ['Phone Field', Validators.required],
			messageText: ['', Validators.required],
			individualPhones: [''],
			isClientPhone: [''],
			coBorrowerPhone: [''],
			spousePhone: ['']
			//clntHlthInsrSeq:['']
		});
		this.workflowActionEmailAlertForm = this.formBuilder.group({
			action: ['Email Alert'],
			formSaveKey: ['add'],
			workflowSeq: [sessionStorage.getItem("ruleCommSeq")],
			emailRecepient: ['Email Field', Validators.required],
			emailSubject: ['', Validators.required],
			emailText: ['', Validators.required],
			emailAddresses: [''],
			isGroup1: [''],
			isGroup2: [''],
			isGroup3: [''],
		});
		//STATUS LIST
		this.DataService.statusList().subscribe(result => {
			this.statusListing = result;
			console.log(result);
		}, error => console.log('There was an error: ', error));
		//edit
		let editCommunicationKey: any = sessionStorage.getItem("editCommunication");
		console.log(editCommunicationKey);
		console.log("=====");
		if (editCommunicationKey) {
			this.DataService.editCommunicatioinWorkflowRule(editCommunicationKey).subscribe(result => {
				console.log(result);
				if (result.action === "New Task") {
					this.newtast = true;
					this.newsms = false;
					this.EmailAlert = false;
					this.workflowActionNewTaskForm = this.formBuilder.group({
						action: ['New Task'],
						formSaveKey: ['update'],
						actionSeq: [result.actionSeq],
						workflowSeq: [result.workflowSeq],
						taskSubject: [result.taskSubject, Validators.required],
						taskDays: [result.taskDays, Validators.required],
						taskDueable: ["", Validators.required],
						taskDate: [result.taskDate, Validators.required],
						taskAssignTo: [result.taskAssignTo, Validators.required],
						taskStatus: [result.taskStatus, Validators.required],
						taskActionComments: [''],
					});
				}
				else if (result.action === "New SMS") {
					this.newtast = false;
					this.newsms = true;
					this.EmailAlert = false;
					if (result.individualPhone === 'Phone Field') {
						this.PhoneField = true;
						this.Individual = false;
					}
					else if (result.individualPhone === 'Individual') {
						this.PhoneField = false;
						this.Individual = true;
					} else {
						this.PhoneField = true;
						this.Individual = false;
					}
					this.workflowActionNewSmsForm = this.formBuilder.group({
						action: ['New SMS'],
						formSaveKey: ['update'],
						actionSeq: [result.actionSeq],
						workflowSeq: [result.workflowSeq],
						messageRecpientType: [result.messageRecpientType, Validators.required],
						messageText: [result.messageText, Validators.required],
						individualPhones: [result.individualPhone],
						isClientPhone: [result.isClientPhone],
						coBorrowerPhone: [result.coBorrowerPhone],
						spousePhone: [result.spousePhone]
						//clntHlthInsrSeq:[result.]
					});
				}
				else if (result.action === "Email Alert") {
					this.newtast = false;
					this.newsms = false;
					this.EmailAlert = true;
					if (result.emailRecepient === 'Email Field') {
						this.EmailField = true;
						this.EmailIndividual = false;
					}
					else if (result.emailRecepient === 'Individual') {
						this.EmailField = false;
						this.EmailIndividual = true;
					} else {
						this.EmailField = true;
						this.EmailIndividual = false;
					}
					this.workflowActionEmailAlertForm = this.formBuilder.group({
						action: ['Email Alert'],
						formSaveKey: ['update'],
						actionSeq: [result.actionSeq],
						workflowSeq: [result.workflowSeq],
						emailRecepient: [result.emailRecepient, Validators.required],
						emailSubject: [result.emailSubject, Validators.required],
						emailText: [result.emailText, Validators.required],
						emailAddresses: [result.emailAddress],
						isGroup1: [result.isGroup1],
						isGroup2: [result.isGroup2],
						isGroup3: [result.isGroup3],
					});
				} else {
					this.newtast = true;
					this.newsms = false;
					this.EmailAlert = false;
					this.workflowActionNewTaskForm = this.formBuilder.group({
						action: ['New Task'],
						formSaveKey: ['update'],
						actionSeq: [result.actionSeq],
						workflowSeq: [result.workflowSeq],
						taskSubject: [result.taskSubject, Validators.required],
						taskDays: [result.taskDays, Validators.required],
						taskDueable: ["", Validators.required],
						taskDate: [result.taskDate, Validators.required],
						taskAssignTo: [result.taskAssignTo, Validators.required],
						taskStatus: [result.taskStatus, Validators.required],
						taskActionComments: [''],
					});
				}
			}, error => console.log('There was an error: ', error));
		}
	}
	get f() { return this.workflowActionNewTaskForm.controls; }
	onWorkworkflowActionNewTaskSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.workflowActionNewTaskForm.invalid) {
			return;
		}
		let formValue: any = this.workflowActionNewTaskForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === "add") {
			this.DataService.addWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		} else if (formValue.formSaveKey === "update") {
			this.DataService.updateCommunicatioinWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		}
		return false;
	}
	get a() { return this.workflowActionNewSmsForm.controls; }
	workflowActionNewSmsSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.workflowActionNewSmsForm.invalid) {
			return;
		}
		let formValue: any = this.workflowActionNewSmsForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === "add") {
			this.DataService.addWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		} else if (formValue.formSaveKey === "update") {
			this.DataService.updateCommunicatioinWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		}
		return false;
	}
	get b() { return this.workflowActionEmailAlertForm.controls; }
	workflowActionEmailAlertSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.workflowActionEmailAlertForm.invalid) {
			return;
		}
		let formValue: any = this.workflowActionEmailAlertForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === "add") {
			this.DataService.addWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		} else if (formValue.formSaveKey === "update") {
			this.DataService.updateCommunicatioinWorkflowAction(formValue).subscribe((data) => {
				console.log(data);
				sessionStorage.setItem("ActionDueDtSeq", data.dueDtSeq);
				this.router.navigate(["setup/communication-workflow"]);
			}, (error) => {
				console.log("err", error);
			});
		}
		return false;
	}

	//divs hide show
	WorkflowActionChanged(value) {
		this.ngOnInit();
		if (value === "newtast") {
			this.newtast = true;
			this.newsms = false;
			this.EmailAlert = false;
		}
		else if (value === "newsms") {
			this.newtast = false;
			this.newsms = true;
			this.EmailAlert = false;
		}
		else if (value === "EmailAlert") {
			this.newtast = false;
			this.newsms = false;
			this.EmailAlert = true;
		}
	}
	onPhoneChange(value) {
		if (value === 'Phone Field') {
			this.PhoneField = true;
			this.Individual = false;
		}
		else if (value === 'Individual') {
			this.PhoneField = false;
			this.Individual = true;
		}
	}
	onEmailChange(value) {
		if (value === 'Email Field') {
			this.EmailField = true;
			this.EmailIndividual = false;
		}
		else if (value === 'Individual') {
			this.EmailField = false;
			this.EmailIndividual = true;
		}
	}

	ontestSubmit() { }
}
