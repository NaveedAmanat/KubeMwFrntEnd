import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements OnInit {
	provinceList: any = [];
	provinceForm: FormGroup;
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
	  this.provinceForm = this.formBuilder.group({
			formSaveKey: ['add'],
            countrySeq: [sessionStorage.getItem('clickCountry')],
            provName: ['', Validators.required],
			provDescription: ['', Validators.required],
        });
        this.listing();
  }
  listing() {
	this.filterValue = "";
	  this.DataService.getProvince(sessionStorage.getItem('clickCountry'), this.filterValue).subscribe((data) => {
          console.log(data);
          this.allItems  = data;
		  // initialize to page 1
		  this.setPage(1);
        }, (error)  => {
          console.log('err');
          console.log('err', error);
        });
  }
  // convenience getter for easy access to form fields
  get f() { return this.provinceForm.controls; }
  onProvinceSubmit() {
	  this.submitted = true;

        // stop here if form is invalid
        if (this.provinceForm.invalid) {
            return;
        }
		const formValue: any = this.provinceForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addProvince(formValue).subscribe((data) => {
			(<any>$('#Province')).modal('hide');
			// this.pagedItems.splice(0, 0, data.Province);
			this.allItems.push(data.Province);
			this.setPage(1);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateProvince(formValue).subscribe((data) => {
			(<any>$('#Province')).modal('hide');
			this.listing();
			//this.pagedItems.splice(this.pagedItems.indexOf(data.Province['stSeq']), 1);
			//this.pagedItems.push(data.Province);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		}
    return false;
  }
  provinceFun(id, name) {
	sessionStorage.setItem('clickProvince', id);
	this.router.navigate(['/setup/geography/district', id]);
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
	  text: 'Are you sure you want to delete this Province?',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  this.DataService.delProvince(passedId).subscribe(result => {
				//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
				this.listing();
				swal(
				  'Deleted!',
				  'Province has been deleted.',
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
	  this.submitted = false;
	  (<any>$('#Province')).modal('show');
		this.provinceForm = this.formBuilder.group({
			formSaveKey: ['add'],
            countrySeq: [sessionStorage.getItem('clickCountry')],
            provName: ['', Validators.required],
			provDescription: ['', Validators.required],
        });
  }
  //edit
  editItem(passedId) {
	  console.log(passedId);
    this.DataService.editProvince(passedId).subscribe(result => {
		console.log(result);
		(<any>$('#Province')).modal('show');
		this.provinceForm = this.formBuilder.group({
			formSaveKey: ['update'],
			countrySeq: [result.cntrySeq],
            provSeq: [result.stSeq],
			provCode: [result.stCd],
            provName: [result.stNm],
			provDescription: [result.stCmnt],
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
      this.listing();
      return;
    }
    this.getFilteredData(1, filterValue.trim().toLowerCase())
  }

  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.listing();
      //setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  getFilteredData(page:number, filterValue:string){
      this.spinner.show();
	  this.DataService.getProvince(sessionStorage.getItem('clickCountry'), this.filterValue).subscribe((data) => {
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
