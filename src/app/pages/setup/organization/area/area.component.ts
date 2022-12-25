import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { LoanService } from '../../../../shared/services/loan.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
	selector: 'app-area',
	templateUrl: './area.component.html',
	styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
	areaList: any = [];
	areaForm: FormGroup;
	employeeAssignmentForm: FormGroup;
	submitted = false;
	// array of all items to be paged
	private allItems: any = [];
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
	//status
	statusListing: any = '';
	addresses: any = [];
	constructor(private router: Router, private loanService: LoanService, private DataService: DataService, private formBuilder: FormBuilder,
		private toaster: ToastrService) { }

	ngOnInit() {
		this.areaForm = this.formBuilder.group({
			formSaveKey: ['add'],
			regionSeq: [sessionStorage.getItem('clickorganization')],
			areaName: ['', Validators.required],
			areaStatus: ['', Validators.required],
			areaDescription: ['', Validators.required],
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
		this.DataService.statusList().subscribe(result => {
			this.statusListing = result;
			console.log(result);
		}, error => console.log('There was an error: ', error));
		//userlist
		// this.DataService.searchArea().subscribe(result => {
		// 	this.userList = result;
		// 	console.log(result);
		// }, error => console.log('There was an error: ', error));
		//emplyee accignment
		this.employeeAssignmentForm = this.formBuilder.group({
			formSaveKey: ['add'],
			parentKey: [sessionStorage.getItem('UserAssignment')],
			regionManager: ['', Validators.required],
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
			coveringEmpToDate: [''],
			coveringEmpFromDate: [''],
			coveringEmpSeq: [''],
			empSeq: ['']
		});
	}
	regions;
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
			this.allItems = data;
			// initialize to page 1
			this.setPage(page);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	// convenience getter for easy access to form fields
	get f() { return this.areaForm.controls; }
	onAreaSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.areaForm.invalid) {
			return;
		}
		const formValue: any = this.areaForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addArea(formValue).subscribe((data) => {
				(<any>$('#Area')).modal('hide');
				// this.pagedItems.splice(0, 0, data.area);
				// this.allItems.push(data.area);
				// this.setPage(1);
				this.listing(1);
				//this.pagedItems.push(data.area);
				console.log(data);
				sessionStorage.setItem('areaKey', data['regSeq']);
			}, (error) => {
				console.log('err', error);
			});
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateArea(formValue).subscribe((data) => {
				(<any>$('#Area')).modal('hide');
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.area['areaSeq']), 1);
				//this.pagedItems.push(data.area);
				console.log(data);
				sessionStorage.setItem('areaKey', data['regSeq']);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	areaFun(id) {
		sessionStorage.setItem('clickArea', id);
		this.router.navigate(['/setup/organization/branch', id]);
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
			text: 'Are you sure you want to delete this Area?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				this.DataService.delArea(passedId).subscribe(result => {
					this.listing(this.pagedItems.currentPage);
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					//console.log(this.pagedItems);
					swal(
						'Deleted!',
						'Area has been deleted.',
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
	editArea = false;
	//add
	addItem() {
		this.editArea = false;
		this.submitted = false;
		(<any>$('#Area')).modal('show');
		this.areaForm = this.formBuilder.group({
			formSaveKey: ['add'],
			regionSeq: [sessionStorage.getItem('clickorganization')],
			areaName: ['', Validators.required],
			areaStatus: ['', Validators.required],
			areaDescription: ['', Validators.required],
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
		this.editArea = true;
		console.log(passedId);
		this.DataService.editArea(passedId).subscribe(result => {
			console.log(result);
			(<any>$('#Area')).modal('show');
			this.areaForm = this.formBuilder.group({
				formSaveKey: ['update'],
				areaSeq: [result.areaSeq],
				regionSeq: [result.regionSeq],
				areaId: [result.areaId],
				areaName: [result.areaName],
				areaStatus: [result.areaStatus],
				areaDescription: [result.areaDescription],
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

		}, error => console.log('There was an error: ', error));
	}
	//UserAssignment
	UserAssignment(passedId) {
		this.employeeAssignmentForm.reset();
		(<any>$('#UserAssignment')).modal('show');
		console.log(passedId);
		sessionStorage.setItem('UserAssignment', passedId);
		this.DataService.UserAssignmentArea(passedId).subscribe(result => {
			console.log(result);
			if (result != null)
				this.employeeAssignmentForm.controls['regionManager'].setValue(result.empSeq);
			// this.employeeAssignmentForm.controls['clerk'].setValue(result.clerk);
			// this.employeeAssignmentForm.controls['manager'].setValue(result.manager);

		}, error => console.log('There was an error: ', error));

		this.employeeAssignmentForm.controls['parentKey'].setValue(passedId);

	}
	//sarch start
	get s() { return this.employeeAssignmentForm.controls; }
	onemployeeAssignmentSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.employeeAssignmentForm.invalid) {
			return;
		}
		const formValue: any = this.employeeAssignmentForm.value;
		console.log(formValue);
		this.DataService.addAreaEmployee(formValue).subscribe(res => {
			this.toaster.success("Saved");
			(<any>$('#UserAssignment')).modal('hide');
		}, (error) => {
			this.toaster.error(error)
			console.log('err', error);
		});
		// if (formValue.formSaveKey === 'add') {
		// 	this.DataService.addEmployeeArea(formValue).subscribe((data) => {
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
			// this.DataService.searchArea().subscribe(result => {
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
		this.DataService.StatusUpdateArea(passedId).subscribe(result => {
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
	keyPress(event: any) {
		const pattern = /[a-zA-Z0-9\+\-\ ]/;

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
		this.areaForm.controls['province'].setValue(add['province']);
		this.areaForm.controls['district'].setValue(add['district']);
		this.areaForm.controls['tehsil'].setValue(add['tehsil']);
		this.areaForm.controls['uc'].setValue(add['uc']);
		this.areaForm.controls['city'].setValue(add['city']);
		this.areaForm.controls['provinceName'].setValue(add['provinceName']);
		this.areaForm.controls['districtName'].setValue(add['districtName']);
		this.areaForm.controls['tehsilName'].setValue(add['tehsilName']);
		this.areaForm.controls['ucName'].setValue(add['ucName']);
		this.areaForm.controls['cityName'].setValue(add['cityName']);
		//Object.assign(this.model.coBorrowerAddress ,add,this.model.coBorrowerAddress);
		console.log(this.areaForm);
	}

}
