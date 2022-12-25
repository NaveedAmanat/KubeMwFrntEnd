import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-geography',
	templateUrl: './geography.component.html',
	styleUrls: ['./geography.component.css']
})
export class GeographyComponent implements OnInit {
	//countryList: any = [];
	countryForm: FormGroup;
	submitted = false;
	model: any = {};
	// array of all items to be paged
	private allItems: any = [];
	// pager object
	pager: any = {};
	// paged items
	pagedItems: any = [];

	constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder, private toaster: ToastrService,
		private spinner: NgxSpinnerService) { }
	ngOnInit() {
		this.countryForm = this.formBuilder.group({
			formSaveKey: ['add'],
			countryName: ['', Validators.required],
			countryDescription: ['', Validators.required],
		});
		this.listing(1);
	}
	listing(page:number) {
		this.filterValue = "";
		this.DataService.getCountry(this.filterValue).subscribe((data) => {
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
	get f() { return this.countryForm.controls; }
	onCountrySubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.countryForm.invalid) {
			return;
		}
		const formValue: any = this.countryForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addCountry(formValue).subscribe((data) => {
				(<any>$('#Countrycodes')).modal('hide');
				// this.pagedItems.splice(0, 0, data.country);
				// this.allItems.push(data.country);
				// this.setPage(1);
				this.listing(1);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateCountry(formValue).subscribe((data) => {
				(<any>$('#Countrycodes')).modal('hide');
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.country['cntrySeq']), 1);
				//this.pagedItems.push(data.country);
				console.log(data);
			}, (error) => {
				console.log('err', error);
			});
		}
		return false;
	}
	countryFun(id, name) {
		sessionStorage.setItem('clickCountry', id);
		this.router.navigate(['/setup/geography/province', id]);
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
			text: 'Are you sure you want to delete this Country?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				this.DataService.delCountry(passedId).subscribe(result => {
					this.listing(this.pager.currentPage);
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					swal(
						'Deleted!',
						'Country has been deleted.',
						'success'
					);
				}, error => {
					swal(
						'Something Went Wrong!',
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
		this.submitted = false;
		(<any>$('#Countrycodes')).modal('show');
		this.countryForm = this.formBuilder.group({
			formSaveKey: ['add'],
			countryName: ['', Validators.required],
			countryDescription: ['', Validators.required],
		});
	}
	//edit
	editItem(passedId) {
		console.log(passedId);
		this.DataService.editCountry(passedId.cntrySeq).subscribe(result => {
			console.log(result);
			(<any>$('#Countrycodes')).modal('show');
			this.countryForm = this.formBuilder.group({
				formSaveKey: ['update'],
				countrySeq: [result.cntrySeq],
				countryCode: [result.cntryCd],
				countryName: [result.cntryNm],
				countryDescription: [result.cntryCmnt],
			});
		}, error => console.log('There was an error: ', error));
	}

	//Added by Areeba

	filterValue: any = "";
	searchVal = "";

	showFields = false;
	showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.listing(1);
      return;
    }
    this.getFilteredData(1, filterValue.trim().toLowerCase())
  }

  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.listing(1);
      //setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  getFilteredData(page:number, filterValue:string){
      this.spinner.show();
	this.DataService.getCountry(filterValue).subscribe((data) => {
		console.log(data);
		this.allItems = data;
		this.spinner.hide();
		if (this.allItems.length <= 0) {
			this.toaster.info('No Data Found Against This Search', 'Information')
		  }
		
		// initialize to page 1
		this.setPage(page);
		
	}, error => {
      this.spinner.hide();
      console.log(error)
    })
  }
  //Ended by Areeba

}
