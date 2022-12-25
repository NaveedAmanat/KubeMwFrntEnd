import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
	selector: 'app-portfolio',
	templateUrl: './portfolio.component.html',
	styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
	//portfolioList: any = [];
	clickBranch: any = JSON.parse(sessionStorage.getItem("auth")).emp_branch;
	branchName: any = sessionStorage.getItem('branchName');
	portfolioForm: FormGroup;
	employeeAssignmentForm: FormGroup;
	AssignLocationForm: FormGroup;
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
	//location
	AssignLocationValue: any = [];
	AssignLocationId: any = [];
	AssignLocationCheckBox: any = [];
	constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder, private toaster: ToastrService, private spinner: NgxSpinnerService) { }

	ngOnInit() {
		this.portfolioForm = this.formBuilder.group({
			formSaveKey: ['add'],
			branchSeq: [sessionStorage.getItem('clickBranch')],
			portfolioId: ['1'],
			portfolioName: ['', Validators.required],
			portfolioStatus: ['', Validators.required],
			regionSeq: [+sessionStorage.getItem('clickorganization')],
			areaSeq: [+sessionStorage.getItem('clickArea')],
		});

		this.AssignTabletForm = this.formBuilder.group({
			entyTypFlg: 1,
			dvcAddr: ['', Validators.required],
			entyTypSeq: ['', Validators.required],
			crtdBy: ['', Validators.required],
		})
		//STATUS LIST
		this.DataService.statusList().subscribe(result => {
			this.statusListing = result;
			console.log(result);
		}, error => console.log('There was an error: ', error));
		this.listing(1);
		//userlist
		this.DataService.getAllEmployeeListForBrnch(this.clickBranch, 2).subscribe(list => {
			this.userList = list;
		}, error => console.log('There was an error: ', error));
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
			coveringManagerDateTo: ['']
		});
		//AssignLocationForm
		this.AssignLocationForm = this.formBuilder.group({
			formSaveKey: ['add'],
			citySeq: [''],
		});
	}
	listing(page: number) {
		// this.DataService.getOrganization().subscribe((data) => {
		// 	console.log(data);
		// 	this.regions = data;
		// }, (error) => {
		// 	console.log("err");
		// 	console.log("err", error);
		// });
		// this.DataService.getArea(sessionStorage.getItem('clickorganization')).subscribe((data) => {
		// 	console.log(data);
		// 	this.areas = data;
		// }, (error) => {
		// 	console.log('err');
		// 	console.log('err', error);
		// });
		// this.DataService.getBranch(sessionStorage.getItem('clickArea')).subscribe((data) => {
		// 	console.log(data);
		// 	this.branches = data;
		// }, (error) => {
		// 	console.log('err');
		// 	console.log('err', error);
		// });
		this.DataService.getPortfolio(JSON.parse(sessionStorage.getItem("auth")).emp_branch).subscribe((data) => {
			console.log(data);
			this.allItems = data;
			// initialize to page 1
			this.setPage(page);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	get f() { return this.portfolioForm.controls; }
	onPortfolioSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.portfolioForm.invalid) {
			return;
		}
		const formValue: any = this.portfolioForm.value;
		console.log(formValue);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addPortfolio(formValue).subscribe((data) => {
				(<any>$('#AddPortfolio')).modal('hide');
				// this.pagedItems.splice(0, 0, data.port);
				//this.pagedItems.push(data.port);
				// this.allItems.push(data.port);
				// this.setPage(1);
				this.listing(1);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updatePortfolio(formValue).subscribe((data) => {
				(<any>$('#AddPortfolio')).modal('hide');
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.port['portSeq']), 1);
				//this.pagedItems.push(data.port);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	portfolioFun(id, name) {
		sessionStorage.setItem('clickPortfolio', id);
		sessionStorage.setItem('portfolioName', name);
		this.router.navigate(['setup/organization/community', id]);
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
			text: 'Are you sure you want to delete this Portfolio?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				this.DataService.delPortfolio(passedId).subscribe(result => {
					this.listing(this.pager.currentPage);
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					swal(
						'Deleted!',
						'Portfolio has been deleted.',
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
	regions; areas; branches; editPortfolio = false;
	regionChange() {
		this.DataService.getArea(this.portfolioForm.get('regionSeq').value).subscribe((data) => {
			console.log(data);
			this.areas = data;
			this.portfolioForm.controls['areaSeq'].setValue(null);
			this.portfolioForm.controls['branchSeq'].setValue(null);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	areaChange() {
		this.DataService.getBranch(this.portfolioForm.controls['areaSeq'].value).subscribe((data) => {
			console.log(data);
			this.branches = data;
			this.portfolioForm.controls['branchSeq'].setValue(null);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	}
	//add
	addItem() {
		this.editPortfolio = false;
		this.submitted = false;
		(<any>$('#AddPortfolio')).modal('show');
		this.portfolioForm = this.formBuilder.group({
			formSaveKey: ['add'],
			branchSeq: [sessionStorage.getItem('clickBranch')],
			portfolioId: ['1'],
			portfolioName: ['', Validators.required],
			portfolioStatus: ['', Validators.required],
		});
	}
	//edit
	editItem(passedId) {
		this.editPortfolio = true;
		console.log(passedId);
		this.DataService.editPortfolio(passedId).subscribe(result => {
			console.log(result);
			console.log(sessionStorage.getItem('clickorganization'));
			console.log(sessionStorage.getItem('clickArea'));

			(<any>$('#AddPortfolio')).modal('show');
			this.portfolioForm = this.formBuilder.group({
				formSaveKey: ['update'],
				portfolioSeq: [result.portSeq],
				branchSeq: [result.brnchSeq],
				portfolioId: [result.portCd],
				portfolioName: [result.portNm],
				portfolioStatus: [result.portStsKey],
				regionSeq: [+sessionStorage.getItem('clickorganization')],
				areaSeq: [+sessionStorage.getItem('clickArea')],
			});
		}, error => console.log('There was an error: ', error));
	}
	passedId;
	//UserAssignment
	UserAssignment(passedId) {
		this.spinner.show();
		this.employeeAssignmentForm.controls['regionManager'].setValue("");
		this.employeeAssignmentForm.controls['coveringRegManagerDateFrom'].setValue("");
		this.employeeAssignmentForm.controls['coveringRegManagerDateTo'].setValue("");
		this.employeeAssignmentForm.controls['coveringRegManager'].setValue("");
		(<any>$('#UserAssignment')).modal('show');
		console.log(passedId);
		this.passedId = passedId;
		sessionStorage.setItem('UserAssignment', passedId);
		this.DataService.getUserAssignmentPortfolio(passedId).subscribe(result => {
			console.log(result);
			this.spinner.hide();
			if (result.length) {

				// result[result.length-1].coveringRegManagerDateFrom = result[result.length-1].coveringEmpFromDt;
				// result[result.length-1].coveringRegManagerDateTo = result[result.length-1].coveringEmpToDt;
				// result[result.length-1].coveringRegManager = result[result.length-1].coveringEmpSeq;
				// console.log(result[result.length-1])
				this.employeeAssignmentForm.controls['regionManager'].setValue(+result[result.length - 1].empSeq);
				this.employeeAssignmentForm.controls['coveringRegManagerDateFrom'].setValue(result[result.length - 1].coveringEmpFromDt);
				this.employeeAssignmentForm.controls['coveringRegManagerDateTo'].setValue(result[result.length - 1].coveringEmpToDt);
				this.employeeAssignmentForm.controls['coveringRegManager'].setValue(result[result.length - 1].coveringEmpSeq);
				console.log(this.employeeAssignmentForm.controls['regionManager'].value)
			}
			// this.employeeAssignmentForm.controls['regionManager'].setValue(result.regionManager);
			// this.employeeAssignmentForm.controls['clerk'].setValue(result.clerk);
			// this.employeeAssignmentForm.controls['manager'].setValue(result.manager);
		}, error => {
			console.log('There was an error: ', error);
			this.spinner.hide();
		});
	}
	//sarch start
	get s() { return this.employeeAssignmentForm.controls; }
	onemployeeAssignmentSubmit() {
		console.log(this.employeeAssignmentForm.value)
		this.submitted = true;

		// stop here if form is invalid
		if (this.employeeAssignmentForm.invalid) {
			return;
		}
		const formValue: any = this.employeeAssignmentForm.value;
		formValue.parentKey = this.passedId;
		console.log(formValue);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addEmployeePortfolio(formValue).subscribe((data) => {
				(<any>$('#UserAssignment')).modal('hide');
				this.toaster.success("Saved")
				//this.pagedItems.push(data.region);
				console.log(data);
			}, (error) => {
				console.log('err', error);
				if (error.status == 400)
					this.toaster.error(error.error.error, "Bad Request")
				else
					this.toaster.error("Something Went Wrong")
			});
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
			// this.DataService.searchPortfolio().subscribe(result => {
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
		this.DataService.StatusUpdatePortfolio(passedId).subscribe(result => {
			console.log(result);
			this.listing(this.pager.currentPage);
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
	//AssignLocation
	AssignLocation(passedId, branchId) {
		(<any>$('#AssignLocation')).modal('show');
		console.log(branchId);
		this.AssignLocationId = passedId;
		this.DataService.getAssignLocationPort(branchId).subscribe((data) => {
			console.log(data);
			this.AssignLocationValue = data;
			//check already checked
			this.DataService.getAssignLocationExistPort(passedId).subscribe((data) => {
				for (const i of Object.keys(data)) {
					console.log(data[i].citySeq);
					(<HTMLInputElement>document.getElementById('check-' + data[i].citySeq)).checked = true;
				}
				console.log(data);
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
		const checked = { 'citySeq': value, 'portSeq': this.AssignLocationId };
		if ($event.target.checked === true) {
			this.AssignLocationCheckBox.push(checked);
			console.log(JSON.stringify(this.AssignLocationCheckBox));
			this.AssignLocationForm.controls['citySeq'].setValue(this.AssignLocationCheckBox);
			this.DataService.assignLocationPort(checked).subscribe((data) => {
				// (<any>$('#AssignLocation')).modal('hide');

				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else {
			this.DataService.removeLocationPort(checked).subscribe((data) => {
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
		console.log('1');
		this.submitted = true;

		// stop here if form is invalid
		if (this.AssignLocationForm.invalid) {
			return;
		}
		const formValue: any = this.AssignLocationForm.value;
		console.log(formValue.citySeq);
		if (formValue.formSaveKey === 'add') {
			// this.DataService.AssignLocationPort(formValue.citySeq).subscribe((data) => {
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
	keyPressText(event: any) {
		const pattern = /[a-zA-Z\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
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

	AssignTabletForm: FormGroup;
	unregisterDevice() {
		this.spinner.show();
		this.DataService.unregisterDevice(this.AssignTabletForm.value).subscribe(res => {
			console.log(res);
			this.spinner.hide();
			this.hasDvc = false;
			this.AssignTabletForm = this.formBuilder.group({
				entyTypFlg: 1,
				dvcAddr: ['', Validators.required],
				entyTypSeq: [this.AssignTabletForm.value.entyTypSeq, Validators.required],
				crtdBy: ['', Validators.required],
			})
			this.toaster.success(res["body"]);
		}, error => {
			this.spinner.hide();
			console.log(error);
			this.toaster.error(error.error.error, "Error");
		})
	}

	registerDevice() {
		this.spinner.show();
		this.DataService.registerDevice(this.AssignTabletForm.value).subscribe(res => {
			console.log(res);
			this.spinner.hide();
			this.hasDvc = true;
			this.toaster.success(res["body"]);
		}, error => {
			console.log(error);
			this.spinner.hide();
			this.toaster.error(error.error.error, "Error");
		})
	}
	hasDvc = false;
	openTabAssignment(key) {
		this.spinner.show();
		this.DataService.getDvcRgstrFrTyp(1, key).subscribe(res => {
			this.spinner.hide();
			if (res != null) {
				this.hasDvc = true;
				this.AssignTabletForm = this.formBuilder.group({
					entyTypFlg: 1,
					dvcAddr: [res['dvcAddr'], Validators.required],
					entyTypSeq: [key, Validators.required],
					crtdBy: [res['crtdBy'], Validators.required],
				})
			} else {
				this.hasDvc = false;
				this.AssignTabletForm = this.formBuilder.group({
					entyTypFlg: 1,
					dvcAddr: ['', Validators.required],
					entyTypSeq: [key, Validators.required],
					crtdBy: ['', Validators.required],
				})
			}
			(<any>$('#AssignTablet')).modal('show');
		}, error => {
			this.spinner.hide();
			console.log(error);
		});

	}


	customSearchFn(term: string, item) {
		term = term.toLowerCase();
		return item.empNm.toLowerCase().indexOf(term) > -1 || item.empLanId.toLowerCase() === term;
	}

	customSearchF(term: string, item) {
		term = term.toLowerCase();
		return item.empNm.toLowerCase().indexOf(term) > -1 || item.empLanId.toLowerCase() === term;
	}
}
