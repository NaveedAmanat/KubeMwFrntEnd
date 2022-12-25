import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { LoanService } from '../../../../shared/services/loan.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../../shared/services/common.service';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { PaymentTypesService } from '../../../../shared/services/paymentTypes.service';
import { BranchRemit } from '../../../../shared/models/branch-remit.model';
import { BranchRemitService } from '../../../../shared/services/branch-remit.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-branch',
	templateUrl: './branch.component.html',
	styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
	clickBranch: any = sessionStorage.getItem('clickArea');
	branchTypes: any = [];
	branchForm: FormGroup;
	employeeAssignmentForm: FormGroup;
	AccountSetupForm: FormGroup;
	AssignTabletForm: FormGroup;
	AssignLocationForm: FormGroup;
	ProductAssignForm: FormGroup;
	submitted = false;
	// array of all items to be paged
	private allItems: any = [];
	allPaymentTypes: any = [];
	// pager object
	pager: any = {};
	// paged items
	pagedItems: any = [];
	// search items
	userList: any = '';
	regionManager: any = '';
	coveringRegManager: any = '';
	clerk: any = '';
	coveringClerk: any = '';
	manager: any = '';
	coveringManager: any = '';
	//AccountSetup
	AccountSetupName: any = '';
	AccountSetupId: any = '';
	//status
	statusListing: any = '';
	ProductAssignValue: any = [];
	ProductAssignId: any = [];
	ProductAssignCheckBox: any = [];
	AssignLocationValue: any = [];
	AssignLocationId: any = [];
	AssignLocationCheckBox: any = [];
	addresses: any = [];


	constructor(private router: Router, private DataService: DataService,
		private loanService: LoanService,
		private formBuilder: FormBuilder,
		private commonService: CommonService,
		private paymentTypesService: PaymentTypesService,
		private branchRemitService: BranchRemitService,
		private toaster: ToastrService,
		private spinner: NgxSpinnerService) { }
	ngOnInit() {
		this.commonService.getValuesByGroupName('BRANCH TYPE').subscribe(
			d => this.branchTypes = d
		);


		this.branchForm = this.formBuilder.group({
			formSaveKey: ['add'],
			areaSeq: [sessionStorage.getItem('clickArea')],
			branchCode: ['1'],
			branchName: ['', Validators.required],
			brnchTypKey: ['', Validators.required],
			branchType: [''],
			branchStatus: ['', Validators.required],
			branchDescription: ['', Validators.required],
			brnchEmail: ['', Validators.required],
			brnchPhNum: ['', Validators.required],
			regionSeq: [sessionStorage.getItem('clickorganization')],
			// province: [''],
			// district: [''],
			// tehsil: [''],
			// uc: [''],
			// city: [''],
			// provinceName: ['', Validators.required],
			// districtName: ['', Validators.required],
			// tehsilName: ['', Validators.required],
			// ucName: ['', Validators.required],
			// cityName: ['', Validators.required],
			// houseNum: [''],
			// street: [''],
			// village: [''],
			// other: ['']

		});
		this.listing(1);
		//STATUS LIST
		this.commonService.getValues('0016').subscribe((res) => {
			this.statusListing = res;
		}, (error) => {
			console.log('err', error);
		});
		// this.DataService.statusList().subscribe(result => {
		// 	this.statusListing = result;
		// 	console.log(result);
		// }, error => console.log('There was an error: ', error));
		//userlist
		// this.DataService.getAllEmployeeList().subscribe(result => {
		// 	this.userList = result;
		// 	console.log(result);
		// }, error => console.log('There was an error: ', error));
		//emplyee accignment
		this.employeeAssignmentForm = this.formBuilder.group({
			formSaveKey: ['add'],
			parentKey: [sessionStorage.getItem('UserAssignment')],
			regionManager: [''],
			coveringRegManager: [''],
			coveringRegManagerDateFrom: [''],
			coveringRegManagerDateTo: [''],
			clerk: [''],
			coveringClerk: [''],
			coveringClerkDateFrom: [''],
			coveringClerkDateTo: [''],
			manager: [''],
			coveringManager: [''],
			coveringManagerDateFrom: [''],
			coveringManagerDateTo: [''],
			action: ['add'],
			brnchEmpSeq: [''],
			empSeq: ['', Validators.required],
			coveringEmpSeq: [''],
			brnchSeq: [''],
			coveringEmpFromDate: [''],
			coveringEmpToDate: ['']
		});
		//AccountSetupForm
		this.AccountSetupForm = this.formBuilder.group({
			formSaveKey: ['add'],
			branchSeq: ['', Validators.required],
			bankName: ['', Validators.required],
			bankBranch: ['', Validators.required],
			accTitle: ['', Validators.required],
			accNo: ['', Validators.required],
			ibanNo: ['', Validators.required],

		});
		this.AssignTabletForm = this.formBuilder.group({
			entyTypFlg: 2,
			dvcAddr: ['', Validators.required],
			entyTypSeq: ['', Validators.required],
			crtdBy: ['', Validators.required],
			//Added by Areeba - 7-6-2022
			phNum: ['']
		})
		//AssignLocationForm
		this.AssignLocationForm = this.formBuilder.group({
			formSaveKey: ['add'],
			citySeq: [''],
		});
		//ProductAssignForm
		this.ProductAssignForm = this.formBuilder.group({
			formSaveKey: ['add'],
			prdSeq: [''],
		});

		this.loadLovs();
	}
	regions; areas; editBranch = false;
	regionChange() {
		this.DataService.getArea(this.branchForm.get('regionSeq').value).subscribe((data) => {
			console.log(data);
			this.areas = data;
			this.branchForm.controls['areaSeq'].setValue(null);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	listing(page: number) {
		this.DataService.getOrganization().subscribe((data) => {
			console.log(data);
			this.regions = data;
		}, (error) => {
			console.log("err");
			console.log("err", error);
		});
		this.DataService.getArea(sessionStorage.getItem('clickorganization')).subscribe((data) => {
			console.log(data);
			this.areas = data;
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
		this.DataService.getBranch(sessionStorage.getItem('clickArea')).subscribe((data) => {
			console.log(data);
			this.allItems = data;
			// initialize to page 1
			this.setPage(page);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	get f() { return this.branchForm.controls; }
	onBranchSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.branchForm.invalid) {
			return;
		}
		const formValue: any = this.branchForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addBranch(formValue).subscribe((data) => {
				(<any>$('#branch')).modal('hide');
				// this.pagedItems.splice(0, 0, data.branch);
				// this.allItems.push(data.branch);
				// this.setPage(1);
				this.listing(1);
				//this.pagedItems.push(data.branch);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateBranch(formValue).subscribe((data) => {
				(<any>$('#branch')).modal('hide');
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.branch['brnchSeq']), 1);
				//this.pagedItems.push(data.branch);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	branchFun(id, name) {
		sessionStorage.setItem('clickBranch', id);
		sessionStorage.setItem('branchName', name);
		this.router.navigate(['setup/organization/portfolio', id]);
		//this.router.navigate(['/product-details', id]);
	}
	//pagenation
	setPage(page: number) {
		// get pager object from service
		this.pager = this.DataService.getPager(this.allItems.length, page);

		// get current page of items
		this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
	}
	//delete
	deleteItem(passedId) {
		swal({
			title: 'Are you sure?',
			text: 'Are you sure you want to delete this Branch?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				this.DataService.delBranch(passedId).subscribe(result => {
					this.listing(this.pager.currentPage);
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					swal(
						'Deleted!',
						'Branch has been deleted.',
						'success'
					);
				}, error => {
					swal(
						'Deleted!',
						error.error['error'],
						'error'
					);
					console.log('There was an error: ', error.error['error']);
				});
			}
		});

	}
	//add
	addItem() {
		this.editBranch = false;
		this.submitted = false;
		(<any>$('#branch')).modal('show');
		this.branchForm = this.formBuilder.group({
			formSaveKey: ['add'],
			areaSeq: [sessionStorage.getItem('clickArea')],
			branchCode: ['1'],
			branchName: ['', Validators.required],
			brnchTypKey: ['', Validators.required],
			branchType: [''],
			branchStatus: ['', Validators.required],
			branchDescription: ['', Validators.required],
			brnchEmail: ['', Validators.required],
			brnchPhNum: ['', Validators.required],
			// province: [''],
			// district: [''],
			// tehsil: [''],
			// uc: [''],
			// city: [''],
			// provinceName: ['', Validators.required],
			// districtName: ['', Validators.required],
			// tehsilName: ['', Validators.required],
			// ucName: ['', Validators.required],
			// cityName: ['', Validators.required],
			// houseNum: [''],
			// street: [''],
			// village: [''],
			// other: ['']
		});
	}
	//edit
	editItem(passedId) {
		this.editBranch = true;
		console.log(passedId);
		this.DataService.editBranch(passedId).subscribe(result => {
			console.log(result);
			(<any>$('#branch')).modal('show');
			this.branchForm = this.formBuilder.group({
				formSaveKey: ['update'],
				branchSeq: [result.branchSeq],
				areaSeq: [result.areaSeq],
				branchCode: [result.branchCode],
				branchName: [result.branchName],
				brnchTypKey: [result.brnchTypKey],
				branchType: [result.brnchTypKey],
				branchStatus: [result.branchStatus],
				branchDescription: [result.branchDescription],
				brnchEmail: [result.brnchEmail],
				brnchPhNum: [result.brnchPhNum],
				// areaSeq: [sessionStorage.getItem('clickArea')],
				regionSeq: [+sessionStorage.getItem('clickorganization')],
				// province: [result.province],
				// district: [result.district],
				// tehsil: [result.tehsil],
				// uc: [result.uc],
				// city: [result.city],
				// provinceName: [result.provinceName],
				// districtName: [result.districtName],
				// tehsilName: [result.tehsilName],
				// ucName: [result.ucName],
				// cityName: [result.cityName],
				// houseNum: [result.houseNum],
				// street: [result.sreet_area],
				// village: [result.village],
				// other: [result.otherDetails]
			});
			console.log(this.branchForm);
		}, error => console.log('There was an error: ', error));
	}
	//UserAssignment
	UserAssignment(passedId) {
		this.spinner.show();
		this.DataService.getAllEmployeeListForBrnch(passedId, 1).subscribe(list => {
			this.userList = list;
			console.log(list);
			this.employeeAssignmentForm.reset();
			this.employeeAssignmentForm.controls['brnchSeq'].setValue(passedId);
			(<any>$('#UserAssignment')).modal('show');
			console.log(passedId);
			sessionStorage.setItem('UserAssignment', passedId);
			this.DataService.UserAssignmentBranch(passedId).subscribe(result => {
				console.log(result);
				this.spinner.hide();
				if (result.length > 0) {
					this.employeeAssignmentForm.controls['brnchEmpSeq'].setValue(result[0].brnchEmpSeq);
					this.employeeAssignmentForm.controls['empSeq'].setValue(result[0].empSeq);
					this.employeeAssignmentForm.controls['coveringEmpSeq'].setValue(result[0].coveringEmpSeq);
					this.employeeAssignmentForm.controls['brnchSeq'].setValue(passedId);
					this.employeeAssignmentForm.controls['coveringEmpFromDate'].setValue(result[0].coveringEmpFromDt);
					this.employeeAssignmentForm.controls['coveringEmpToDate'].setValue(result[0].coveringEmpToDt);
					this.employeeAssignmentForm.controls['action'].setValue('edit');
				} else {
					this.employeeAssignmentForm.controls['brnchSeq'].setValue(passedId);
					this.employeeAssignmentForm.controls['action'].setValue('add');
				}
			}, error => {
				console.log('There was an error: ', error);

				this.spinner.hide();
			});
		}, error => {
			console.log('There was an error: ', error)
			this.spinner.hide();
		});
	}
	//sarch start
	get s() { return this.employeeAssignmentForm.controls; }
	onemployeeAssignmentSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.employeeAssignmentForm.invalid) {
			console.log("FORM INVALID")
			return;
		}
		const formValue: any = this.employeeAssignmentForm.value;
		console.log(formValue);
		this.DataService.addEmployeeBranch(formValue).subscribe((data) => {
			(<any>$('#UserAssignment')).modal('hide');
			//this.pagedItems.push(data.region);
			console.log(data);
		}, (error) => {
			console.log('err', error);
		});
		// const formValue: any = this.employeeAssignmentForm.value;
		// console.log(formValue);
		// if(formValue.action == 'add'){
		// 	this.DataService.addEmployeeBranch(formValue).subscribe((data) => {
		// 		(<any>$('#UserAssignment')).modal('hide');
		// 		//this.pagedItems.push(data.region);
		// 		console.log(data);
		// 	}, (error) => {
		// 		console.log('err', error);
		// 	});
		// }else if(formValue.action == 'edit'){

		// }
		// if (formValue.formSaveKey === 'add') {
		// 	this.DataService.addEmployeeBranch(formValue).subscribe((data) => {
		// 		(<any>$('#UserAssignment')).modal('hide');
		// 		//this.pagedItems.push(data.region);
		// 		console.log(data);
		// 	}, (error) => {
		// 		console.log('err', error);
		// 	});
		// } else if (formValue.formSaveKey === 'update') {
		// 	this.DataService.updateOrganization(formValue).subscribe((data) => {
		// 		(<any>$('#UserAssignment')).modal('hide');
		// 		this.pagedItems.splice(this.pagedItems.indexOf(data.region['regSeq']), 1);
		// 		this.pagedItems.push(data.region);
		// 		console.log(data);
		// 	}, (error) => {
		// 		console.log('err', error);
		// 	});
		// }
		return false;
	}
	//search service
	search($event, field) {
		// search items
		this.regionManager = '';
		this.coveringRegManager = '';
		this.clerk = '';
		this.coveringClerk = '';
		this.manager = '';
		this.coveringManager = '';
		console.log(field);
		const value = $event.target.value;
		console.log(value);
		if (value.length >= 2) {
			// this.DataService.searchBranch().subscribe(result => {
			// 	if (field === 'regionManager') {
			// 		this.regionManager = result;
			// 	} else if (field === 'coveringRegManager') {
			// 		this.coveringRegManager = result;
			// 	} else if (field === 'clerk') {
			// 		this.clerk = result;
			// 	} else if (field === 'coveringClerk') {
			// 		this.coveringClerk = result;
			// 	} else if (field === 'manager') {
			// 		this.manager = result;
			// 	} else if (field === 'coveringManager') {
			// 		this.coveringManager = result;
			// 	}
			// 	console.log(result);


			// }, error => console.log('There was an error: ', error));
		}
	}
	serchSelected(Value, field) {
		console.log(field);
		//let formValue: any = this.employeeAssignmentForm.value;
		//emplyee accignment
		if (field === 'regionManager') {
			this.employeeAssignmentForm.controls['regionManager'].setValue(Value);
			this.regionManager = '';
		} else if (field === 'coveringRegManager') {
			this.employeeAssignmentForm.controls['coveringRegManager'].setValue(Value);
			this.coveringRegManager = '';
		} else if (field === 'clerk') {
			this.employeeAssignmentForm.controls['clerk'].setValue(Value);
			this.clerk = '';
		} else if (field === 'coveringClerk') {
			this.employeeAssignmentForm.controls['coveringClerk'].setValue(Value);
			this.coveringClerk = '';
		} else if (field === 'manager') {
			this.employeeAssignmentForm.controls['manager'].setValue(Value);
			this.manager = '';
		} else if (field === 'coveringManager') {
			this.employeeAssignmentForm.controls['coveringManager'].setValue(Value);
			this.coveringManager = '';
		}
	}
	//update
	StatusUpdate(passedId) {
		console.log(passedId);
		this.DataService.StatusUpdateBranch(passedId).subscribe(result => {
			console.log(result);
			/*
			this.employeeAssignmentForm.controls['regionManager'].setValue(result.regionManager);
			(<any>$("#Countrycodes")).modal('show');
			this.organizationForm = this.formBuilder.group({
				regionSeq: [result.regSeq],
				regionCode: [""],
				formSaveKey: ['update'],
							regionName: [result.regNm],
							regionType: [result.regTyp],
							regionStatus: [result.regStsKey],
				regionDescription: [result.regDscr],
				regionAddress: [""],
				//regionStatus: ['', Validators.required]
					});*/

		}, error => console.log('There was an error: ', error));
	}
	//AccountSetup
	AccountSetup(passedId, name) {
		this.AccountSetupName = name;
		this.AccountSetupId = passedId;
		(<any>$('#AccountSetup')).modal('show');
		this.AccountSetupForm.controls['branchSeq'].setValue(passedId);
		this.DataService.AccountSetupBranch(passedId).subscribe(result => {
			console.log(result);
			this.AccountSetupForm = this.formBuilder.group({
				formSaveKey: ['update'],
				branchSeq: [result.brnchSeq],
				bankName: [+result.bankName],
				bankBranch: [result.bankBrnch],
				accTitle: [result.acctNm],
				accNo: [result.acctNum],
				ibanNo: [result.iban],

			});

		}, error => console.log('There was an error: ', error));
	}
	//AccountSetup
	get a() { return this.AccountSetupForm.controls; }
	onAccountSetupSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.AccountSetupForm.invalid) {
			return;
		}
		const formValue: any = this.AccountSetupForm.value;
		console.log(formValue);
		if (formValue.formSaveKey === 'add') {
			console.log('1');
			this.DataService.AccountSetup(formValue).subscribe((data) => {
				(<any>$('#AccountSetup')).modal('hide');
				//this.pagedItems.push(data.region);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else if (formValue.formSaveKey === 'update') {
			console.log('2');
			this.DataService.UpdateAccountSetup(formValue).subscribe((data) => {
				(<any>$('#AccountSetup')).modal('hide');
				//this.pagedItems.splice(this.pagedItems.indexOf(data.region['regSeq']), 1);
				//this.pagedItems.push(data.region);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	//AssignLocation
	AssignLocation(passedId) {
		(<any>$('#AssignLocation')).modal('show');
		console.log(passedId);
		this.AssignLocationId = passedId;
		this.DataService.getAssignLocation().subscribe((data) => {
			console.log(data);
			this.AssignLocationValue = data;
			//check already checked
			this.DataService.getAssignLocationExist(passedId).subscribe((data) => {
				for (const i of Object.keys(data)) {
					console.log(data[i].citySeq);
					//document.getElementById('check-'+data[i].citySeq).checked = true;
					(<HTMLInputElement>document.getElementById('check-' + data[i].citySeq)).checked = true;
				}
			}, (error) => {
				console.log('err');
				console.log('err', error);
			});
			// initialize to page 1
			this.setPage(1);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});

	}
	changeRadioStatus($event) {
		const value = $event.target.value;
		const checked = { 'citySeq': value, 'branchSeq': this.AssignLocationId };
		if ($event.target.checked === true) {
			this.AssignLocationCheckBox.push(checked);
			console.log(JSON.stringify(this.AssignLocationCheckBox));
			this.AssignLocationForm.controls['citySeq'].setValue(this.AssignLocationCheckBox);

			this.DataService.assignLocation(checked).subscribe((data) => {
				// (<any>$('#AssignLocation')).modal('hide');

				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else {
			this.DataService.removeLocation(checked).subscribe((data) => {
				// (<any>$('#AssignLocation')).modal('hide');

				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
			let index = -1; let i = 0;
			this.AssignLocationCheckBox.forEach(element => {
				i++;
				if (element.citySeq == $event.target.value) {
					index = i;
				}
			});
			if (index >= 0) {
				this.AssignLocationCheckBox.splice(index);
				this.AssignLocationCheckBox.controls['prdSeq'].setValue(this.AssignLocationCheckBox);
			}
		}
		//console.log(value);
	}
	//AssignLocationForm
	get l() { return this.AssignLocationForm.controls; }
	onAssignLocationSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.AssignLocationForm.invalid) {
			return;
		}
		const formValue: any = this.AssignLocationForm.value;
		console.log(formValue.citySeq);
		if (formValue.formSaveKey === 'add') {
			// this.DataService.AssignLocation(formValue.citySeq).subscribe((data) => {
			(<any>$('#AssignLocation')).modal('hide');

			// 	console.log(data);
			// }, (error) => {
			// 	console.log('err', error);
			// });
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateOrganization(formValue).subscribe((data) => {
				(<any>$('#UserAssignment')).modal('hide');
				this.pagedItems.splice(this.pagedItems.indexOf(data.region['regSeq']), 1);
				this.pagedItems.push(data.region);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	//ProductAssign
	ProductAssign(passedId) {
		(<any>$('#ProductAssign')).modal('show');
		console.log(passedId);
		this.ProductAssignId = passedId;
		this.DataService.getProductAssign().subscribe((data) => {
			console.log(data);
			this.ProductAssignValue = data;
			//check already checked
			this.DataService.getProductAssignExist(passedId).subscribe((data) => {
				console.log(data);
				for (const i of Object.keys(data)) {
					console.log(data[i].prdSeq);
					(<HTMLInputElement>document.getElementById('checkP-' + data[i].prdSeq)).checked = true;
				}
			}, (error) => {
				console.log('err');
				console.log('err', error);
			});
			// initialize to page 1
			this.setPage(1);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});

	}
	changeRadioProductAssignStatus($event) {
		console.log($event.target.value)
		console.log($event)
		console.log($event.target.checked)

		const value = $event.target.value;
		const checked = { 'prdSeq': value, 'branchSeq': this.ProductAssignId };

		console.log(checked)
		console.log(this.ProductAssignCheckBox)
		if ($event.target.checked === true) {
			this.ProductAssignCheckBox.push(checked);
			console.log(JSON.stringify(this.ProductAssignCheckBox));
			this.ProductAssignForm.controls['prdSeq'].setValue(this.ProductAssignCheckBox);
			this.DataService.addProduct(checked).subscribe((data) => {
				// (<any>$('#ProductAssign')).modal('hide');

				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else {

			this.DataService.removeProduct(checked).subscribe((data) => {
				// (<any>$('#ProductAssign')).modal('hide');

				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
			console.log(this.ProductAssignCheckBox.indexOf(checked))
			let index = -1; let i = 0;
			this.ProductAssignCheckBox.forEach(element => {
				i++;
				if (element.prdSeq == $event.target.value) {
					index = i;
				}
			});
			if (index >= 0) {
				this.ProductAssignCheckBox.splice(index);
				this.ProductAssignForm.controls['prdSeq'].setValue(this.ProductAssignCheckBox);
			}
		}
		//console.log(value);
	}
	//ProductAssignForm
	get p() { return this.ProductAssignForm.controls; }
	onProductAssignSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.ProductAssignForm.invalid) {
			return;
		}
		const formValue: any = this.ProductAssignForm.value;
		console.log(formValue.prdSeq);
		if (formValue.formSaveKey === 'add') {
			// this.DataService.ProductAssign(formValue.prdSeq).subscribe((data) => {
			(<any>$('#ProductAssign')).modal('hide');

			// 	console.log(data);
			// }, (error) => {
			// 	console.log('err', error);
			// });
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateOrganization(formValue).subscribe((data) => {
				(<any>$('#ProductAssign')).modal('hide');
				this.pagedItems.splice(this.pagedItems.indexOf(data.region['regSeq']), 1);
				this.pagedItems.push(data.region);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}

	emailValidate(event: any) {
		const pattern = /[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	phNumValidate(event: any) {
		const pattern = /[0-9]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	keyPress(event: any) {
		const pattern = /[a-zA-Z0-9\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
	keyPressText(event: any) {
		const pattern = /[a-zA-Z\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
	//get addresses
	getLocations() {
		(<any>$('#Location')).modal('show');
		this.loanService.getLocations().subscribe((res) => {
			console.log(res);
			this.addresses = res;
			// this.addresses = res;
		}, (error) => {
			console.log('err In Loan Service');
			console.log('err', error);
		});
	}
	//address:any = new Address();
	selectAddress(add) {
		console.log(add);
		//this.address = add;
		this.branchForm.controls['province'].setValue(add['province']);
		this.branchForm.controls['district'].setValue(add['district']);
		this.branchForm.controls['tehsil'].setValue(add['tehsil']);
		this.branchForm.controls['uc'].setValue(add['uc']);
		this.branchForm.controls['city'].setValue(add['city']);
		this.branchForm.controls['provinceName'].setValue(add['provinceName']);
		this.branchForm.controls['districtName'].setValue(add['districtName']);
		this.branchForm.controls['tehsilName'].setValue(add['tehsilName']);
		this.branchForm.controls['ucName'].setValue(add['ucName']);
		this.branchForm.controls['cityName'].setValue(add['cityName']);
		//Object.assign(this.model.coBorrowerAddress ,add,this.model.coBorrowerAddress);
		// console.log(this.model.coBorrowerAddress)
	}

	findValueByKey(key, array) {
		let status = 'not found';
		array.forEach(s => {
			if (s.codeKey === key) {
				status = s.codeValue;
			}
		});
		return status;
	}
	findValueByKeyStatus(key) {
		let status = 'not found';
		this.statusListing.forEach(s => {
			if (s.codeKey === key) {
				status = s.codeValue;
			}
		});
		return status;
	}
	onlyNumbers(event: any) {
		const pattern = /[0-9-]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	banks;

	loadLovs() {
		this.commonService.getValues(REF_CD_GRP_KEYS.BANKS).subscribe((res) => {
			this.banks = res;
		}, (error) => {
			console.log('err', error);
		});
	}
	counter = 0;
	tempArray: any = [];
	openPayment(key) {
		(<any>$('#AssignCheque')).modal('show');
		sessionStorage.setItem('brnchSeq', JSON.stringify(key));
		this.paymentTypesService.getAllTypesByBrnch(3, sessionStorage.getItem('brnchSeq')).subscribe(
			data => this.allPaymentTypes = data);


		this.branchRemitService.getBranchRemitsbyBranchSeq(parseInt(sessionStorage.getItem('brnchSeq'))).subscribe(
			data => {
				this.tempArray = data

				console.log(this.tempArray);
				this.paymentTypesService.getAllTypes(3).subscribe(
					d => {
						this.allPaymentTypes = d;
						this.allPaymentTypes.forEach(pymt => {
							this.tempArray.forEach(element => {
								if (element.pymtTypSeq === pymt.typSeq) {
									pymt.ischecked = true;
								}

							});
							//						this.counter++;


							// 	//this.totalSegs++;
							// 	//this.segregateArray[seg.instNum - 1].ischecked = true;
							// 	//this.segregateArray[seg.instNum - 1].prdSgrtInstSeq = seg.prdSgrtInstSeq;
						});
					});
			});


	}
	unregisterDevice() {
		this.spinner.show();
		this.DataService.unregisterDevice(this.AssignTabletForm.value).subscribe(res => {
			console.log(res);
			this.spinner.hide();
			this.hasDvc = false;

			//Added by Areeba - 7-6-2022
			this.DataService.getLastDvcPhNum(this.AssignTabletForm.value.entyTypSeq).subscribe(data => {
				console.log(data);
				if (data == null) {
					this.AssignTabletForm = this.formBuilder.group({
						entyTypFlg: 2,
						dvcAddr: ['', Validators.required],
						entyTypSeq: [this.AssignTabletForm.value.entyTypSeq, Validators.required],
						crtdBy: ['', Validators.required],
						phNum: [''],
					})
					this.toaster.success(res["body"]);
				}
				else {
					this.AssignTabletForm = this.formBuilder.group({
						entyTypFlg: 2,
						dvcAddr: ['', Validators.required],
						entyTypSeq: [this.AssignTabletForm.value.entyTypSeq, Validators.required],
						crtdBy: ['', Validators.required],
						phNum: [data],
					})
					this.toaster.success(res["body"]);
				}
			}, error => {
				this.spinner.hide();
				this.toaster.error(error.error.error, "Error");
			});
			//Ended by Areeba

		}, error => {
			console.log(error);
			this.spinner.hide();
			this.toaster.error(error.error.error, "Error");
		})
	}

	registerDevice() {
		if (this.AssignTabletForm.value.dvcAddr == "" || this.AssignTabletForm.value.entyTypSeq == null
			|| this.AssignTabletForm.value.crtdBy == "") {
			this.toaster.error("Enter Missing values.");
		}
		else if (this.AssignTabletForm.invalid) {
			return;
		}
		else {
			this.spinner.show();
			this.DataService.registerDevice(this.AssignTabletForm.value).subscribe(res => {
				this.spinner.hide();
				this.hasDvc = true;
				this.toaster.success(res["body"]);
			}, error => {
				this.spinner.hide();
				this.toaster.error(error.error.error, "Error");
			})
		}
	}
	hasDvc = false;
	openTabAssignment(key) {
		this.spinner.show();
		this.DataService.getDvcRgstrFrTyp(2, key).subscribe(res => {
			this.spinner.hide();
			if (res != null) {
				this.hasDvc = true;
				this.AssignTabletForm = this.formBuilder.group({
					entyTypFlg: 2,
					dvcAddr: [res['dvcAddr'], Validators.required],
					entyTypSeq: [key, Validators.required],
					crtdBy: [res['crtdBy'], Validators.required],
					//Added by Areeba - 7-6-2022
					phNum: [res['phNum']]
				})
			} else {
				this.hasDvc = false;
				//Added by Areeba - 7-6-2022
				this.DataService.getLastDvcPhNum(key).subscribe(data => {
					console.log(data);
					if (data == null) {
						this.AssignTabletForm = this.formBuilder.group({
							entyTypFlg: 2,
							dvcAddr: ['', Validators.required],
							entyTypSeq: [key, Validators.required],
							crtdBy: ['', Validators.required],
							phNum: ['']
						})
					}
					else {
						this.AssignTabletForm = this.formBuilder.group({
							entyTypFlg: 2,
							dvcAddr: ['', Validators.required],
							entyTypSeq: [key, Validators.required],
							crtdBy: ['', Validators.required],
							phNum: [data]
						})
					}
				}, error => {
					this.spinner.hide();
					this.toaster.error(error.error.error, "Error");
				});
				//Ended by Areeba
			}

			(<any>$('#AssignTablet')).modal('show');
		}, error => {
			this.spinner.hide();
			console.log(error);
		});

	}
	addUpdateType(pymt, event) {

		console.log(pymt);
		const branchRemit = new BranchRemit();
		if (pymt.ischecked) {
			console.log("here");


			branchRemit.pymtTypSeq = pymt.typSeq;
			branchRemit.brnchSeq = parseInt(sessionStorage.getItem('brnchSeq'));

			this.branchRemitService.addBranchRemit(branchRemit).subscribe()//res => {
			console.log(branchRemit);
			// 	seg.prdSgrtInstSeq = res.PrdSgrtInst.prdSgrtInstSeq;
			//   });
		} else {
			console.log("there");
			this.branchRemitService.deleteBranchRemit(branchRemit.brnchRemitSeq).subscribe();
		}
	}
}
