import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/services/common.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';


@Component({
	selector: 'app-portfolio',
	templateUrl: './portfolio.component.html',
	styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
	//portfolioList: any = [];
	clickBranch: any = sessionStorage.getItem('clickBranch');
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

	//Added by Areeba - 07-06-2022
	//type
	typeListing: any = '';
	//Ended by Areeba

	//location
	AssignLocationValue: any = [];
	AssignLocationId: any = [];
	AssignLocationCheckBox: any = [];
	constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder, private toaster: ToastrService, private spinner: NgxSpinnerService,
		private commonService: CommonService) { }

	ngOnInit() {
		this.portfolioForm = this.formBuilder.group({
			formSaveKey: ['add'],
			branchSeq: [sessionStorage.getItem('clickBranch')],
			portfolioId: ['1'],
			portfolioName: ['', Validators.required],
			portfolioStatus: ['', Validators.required],
			//Added by Areeba - 07-06-2022
			portfolioType: ['', Validators.required],
			regionSeq: [+sessionStorage.getItem('clickorganization')],
			areaSeq: [+sessionStorage.getItem('clickArea')],
		});

		this.AssignTabletForm = this.formBuilder.group({
			entyTypFlg: 1,
			dvcAddr: ['', Validators.required],
			entyTypSeq: ['', Validators.required],
			crtdBy: ['', Validators.required],
			//Added by Areeba - 7-6-2022
			phNum: [''],
		})
		//Added by Areeba - 07-06-2022
		this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.PORTFOLIO_CATEGORY_TYPE).subscribe((res) => {
			this.typeListing = res;
		});
		//Ended by Areeba

		//STATUS LIST
		this.DataService.statusList().subscribe(result => {
			this.statusListing = result;
			console.log(result);
		}, error => console.log('There was an error: ', error));
		this.listing(1);
		//userlist
		this.DataService.getAllEmployeeListForBrnch(sessionStorage.getItem('clickBranch'), 2).subscribe(list => {
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
		this.spinner.show();
		this.DataService.getOrganization().subscribe((data) => {
			console.log(data);
			this.regions = data;
		}, (error) => {
			console.log("err");
			console.log("err", error);
			this.spinner.hide();
		});
		this.DataService.getArea(sessionStorage.getItem('clickorganization')).subscribe((data) => {
			console.log(data);
			this.areas = data;
		}, (error) => {
			console.log('err');
			console.log('err', error);
			this.spinner.hide();
		});
		this.DataService.getBranch(sessionStorage.getItem('clickArea')).subscribe((data) => {
			console.log(data);
			this.branches = data;
		}, (error) => {
			console.log('err');
			console.log('err', error);
			this.spinner.hide();
		});
		this.DataService.getPortfolio(sessionStorage.getItem('clickBranch')).subscribe((data) => {
			console.log(data);
			this.allItems = data;
			// initialize to page 1
			this.setPage(page);
			this.spinner.hide();
		}, (error) => {
			console.log('err');
			console.log('err', error);
			this.spinner.hide();
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
		this.spinner.show();
		if (formValue.formSaveKey === 'add') {
			this.DataService.addPortfolio(formValue).subscribe((data) => {
				(<any>$('#AddPortfolio')).modal('hide');
				// this.pagedItems.splice(0, 0, data.port);
				//this.pagedItems.push(data.port);
				// this.allItems.push(data.port);
				// this.setPage(1);
				this.listing(1);
				console.log(data);
				this.spinner.hide();
			}, (error) => {
				console.log('err', error);
				this.spinner.hide();
			});
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updatePortfolio(formValue).subscribe((data) => {
				(<any>$('#AddPortfolio')).modal('hide');
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.port['portSeq']), 1);
				//this.pagedItems.push(data.port);
				console.log(data);
				this.toaster.info(data.port);
				this.spinner.hide();
			}, (error) => {
				console.log('err', error);
				this.spinner.hide();
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
			this.spinner.show();
			if (result.value) {
				this.DataService.delPortfolio(passedId).subscribe(result => {
					this.listing(this.pager.currentPage);
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					this.spinner.hide();
					swal(
						'Deleted!',
						'Portfolio has been deleted.',
						'success'
					);
				}, error => {
					this.spinner.hide();
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
			//Added by Areeba - 07-06-2022
			portfolioType: ['', Validators.required],
		});
	}
	//edit
	editItem(passedId) {
		this.editPortfolio = true;
		console.log(passedId);
		this.spinner.show();
		this.DataService.editPortfolio(passedId).subscribe(result => {
			console.log(result);
			console.log(sessionStorage.getItem('clickorganization'));
			console.log(sessionStorage.getItem('clickArea'));
			this.spinner.hide();

			(<any>$('#AddPortfolio')).modal('show');
			this.portfolioForm = this.formBuilder.group({
				formSaveKey: ['update'],
				portfolioSeq: [result.portSeq],
				branchSeq: [result.brnchSeq],
				portfolioId: [result.portCd],
				portfolioName: [result.portNm],
				portfolioStatus: [result.portStsKey],
				//Added by Areeba - 07-06-2022
				portfolioType: [result.portTyp],
				regionSeq: [parseInt(sessionStorage.getItem('clickorganization'))],
				areaSeq: [parseInt(sessionStorage.getItem('clickArea'))],
			});
		}, error => { this.spinner.hide(); console.log('There was an error: ', error) });
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
		})
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
		formValue.parentKey = this.passedId;
		console.log(formValue);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addEmployeePortfolio(formValue).subscribe((data) => {
				(<any>$('#UserAssignment')).modal('hide');
				//this.pagedItems.push(data.region);
				this.toaster.success("Saved")
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
	branchId : any;
	//AssignLocation
	AssignLocation(passedId, branchId) {
		this.ucSearchVal = '';
		(<any>$('#AssignLocation')).modal('show');
		this.AssignLocationId = passedId;
		this.branchId = branchId;
		this.spinner.show();
		this.DataService.getAssignLocationPort(branchId).subscribe((data) => {
			console.log(data);
			this.AssignLocationValue = data;
			//check already checked
			this.DataService.getAssignLocationExistPort(passedId).subscribe((data) => {
				for (const i of Object.keys(data)) {
					(<HTMLInputElement>document.getElementById('check-' + data[i].citySeq)).checked = true;
				}
				this.spinner.hide();
				console.log(data);
			}, (error) => {
				this.spinner.hide();
				console.log('err');
				console.log('err', error);
			});
			// initialize to page 1
			this.setPage(1);
		}, (error) => {
			this.spinner.hide();
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
	//Added by Areeba - 07-06-2022
	findValueByKeyType(key) {
		let type = 'not found';
		this.typeListing.forEach(s => {
			if (s.codeKey === key) {
				type = s.codeValue;
			}
		});
		return type;
	}
	//Ended by Areeba


	AssignTabletForm: FormGroup;
	unregisterDevice() {
		this.spinner.show();
		console.log(this.AssignTabletForm.value);
		this.DataService.unregisterDevice(this.AssignTabletForm.value).subscribe(res => {
			console.log(res);
			this.spinner.hide();
			this.hasDvc = false;

			//Added by Areeba - 7-6-2022
			this.DataService.getLastDvcPhNum(this.AssignTabletForm.value.entyTypSeq).subscribe(data => {
				console.log(data);
				if (data == null) {
					this.AssignTabletForm = this.formBuilder.group({
						entyTypFlg: 1,
						dvcAddr: ['', Validators.required],
						entyTypSeq: [this.AssignTabletForm.value.entyTypSeq, Validators.required],
						crtdBy: ['', Validators.required],
						phNum: [''],
					})
					this.toaster.success(res["body"]);
				}
				else {
					this.AssignTabletForm = this.formBuilder.group({
						entyTypFlg: 1,
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
			this.spinner.hide();
			console.log(error);
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
		this.DataService.getDvcRgstrFrTyp(1, key).subscribe(res => {
			this.spinner.hide();
			if (res != null) {
				this.hasDvc = true;
				this.AssignTabletForm = this.formBuilder.group({
					entyTypFlg: 1,
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
							entyTypFlg: 1,
							dvcAddr: ['', Validators.required],
							entyTypSeq: [key, Validators.required],
							crtdBy: ['', Validators.required],
							phNum: [''],
						})
					}
					else {
						this.AssignTabletForm = this.formBuilder.group({
							entyTypFlg: 1,
							dvcAddr: ['', Validators.required],
							entyTypSeq: [key, Validators.required],
							crtdBy: ['', Validators.required],
							phNum: [data],
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
	//Added by Areeba - 7-6-2022
	phNumValidate(event: any) {
		const pattern = /[0-9]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
	//Ended by Areeba

	//Search UC
	ucFilterValue: any = "";
	searchVal = "";
	ucSearchVal = "";
	ucShowFields = false;
	ucShowField() {
	  this.ucShowFields = true;
	}
	ucCloseField() {
	  this.ucShowFields = false;
	}
  
	ucApplyFilter(ucFilterValue: string) {
	  this.ucFilterValue = ucFilterValue;
	  if (this.ucFilterValue.length == 0) {
		this.getAllUCsForBranch();
		return;
	  }
	  this.getFilteredUcs(ucFilterValue.trim().toLowerCase())
	}
  
	ucSearchValue() {
	  this.ucFilterValue = this.ucSearchVal.trim();
	  if (this.ucFilterValue.length == 0) {
		this.getAllUCsForBranch();
		//setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
		return;
	  }
	}
  
	getFilteredUcs(ucFilterValue:string){
		this.spinner.show();
	  this.DataService.getAssignLocationPortFilter(this.branchId, ucFilterValue).subscribe(res => {
		this.spinner.hide();
		this.AssignLocationValue = res;
		if (this.AssignLocationValue.length <= 0) {
		  this.toaster.info('No Data Found Against This Search', 'Information')
		};
		this.AssignLocationValue.forEach(element => {
		  element.checked = false;
		});
		this.getUcsForPortfolio();
	  }, error => {
		this.spinner.hide();
		console.log(error)
	  })
	}
	getAllUCsForBranch(){
		this.spinner.show();
		this.AssignLocationValue = [];
		this.ucSearchVal = '';
		this.ucFilterValue = '';
	
		this.spinner.show();
		this.DataService.getAssignLocationPortFilter(this.branchId, "").subscribe(res => {
		  this.spinner.hide();
		  this.AssignLocationValue = res;
		  this.AssignLocationValue.forEach(element => {
			element.checked = false;
		  });
		  this.getUcsForPortfolio();
		  // initialize to page 1
			this.setPage(1);
		}, error => {
		  this.spinner.hide();
		  console.log(error)
		})
	  }
	  getUcsForPortfolio(){
		this.DataService.getAssignLocationExistPort(this.AssignLocationId).subscribe((data) => {
			for (const i of Object.keys(data)) {
				if(<HTMLInputElement>document.getElementById('check-' + data[i].citySeq))
				(<HTMLInputElement>document.getElementById('check-' + data[i].citySeq)).checked = true;
			}
			console.log(data);
		}, (error) => {
			console.log('err');
			console.log('err', error);
		});
	  }	
}
