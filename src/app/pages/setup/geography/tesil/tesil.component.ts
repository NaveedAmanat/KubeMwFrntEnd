import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tesil',
  templateUrl: './tesil.component.html',
  styleUrls: ['./tesil.component.css']
})
export class TesilComponent implements OnInit {
	nntehsilList: any = [];
	districtKey: any = sessionStorage.getItem('clickDistrict');
	tehsilForm: FormGroup;
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
		this.tehsilForm = this.formBuilder.group({
			formSaveKey: ['add'],
            districtSeq: [sessionStorage.getItem('clickDistrict')],
            thslName: ['', Validators.required],
			thslDescription: ['', Validators.required],
        });
		this.listing();
  }
  listing() {
	this.filterValue = "";
	  this.DataService.getTehsil(sessionStorage.getItem('clickDistrict'), this.filterValue).subscribe((data) => {
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
  get f() { return this.tehsilForm.controls; }
  onTehsilSubmit() {
	  this.submitted = true;

        // stop here if form is invalid
        if (this.tehsilForm.invalid) {
            return;
        }
		const formValue: any = this.tehsilForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addTehsil(formValue).subscribe((data) => {
			(<any>$('#Tehsil')).modal('hide');
			// this.pagedItems.splice(0, 0, data.tehsil);
			this.allItems.push(data.tehsil);
			this.setPage(1);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateTehsil(formValue).subscribe((data) => {
			(<any>$('#Tehsil')).modal('hide');
			this.listing();
			//this.pagedItems.splice(this.pagedItems.indexOf(data.tehsil['thslSeq']), 1);
			//this.pagedItems.push(data.tehsil);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		}
    return false;
  }
  tehsilFun(id, name) {
	sessionStorage.setItem('clickTehsil', id);
	this.router.navigate(['/setup/geography/un', id]);
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
	  text: 'Are you sure you want to delete this Tesil?',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  this.DataService.delTehsil(passedId).subscribe(result => {
				//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
				this.listing();
				swal(
				  'Deleted!',
				  'Tesil has been deleted.',
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
	  (<any>$('#Tehsil')).modal('show');
		this.tehsilForm = this.formBuilder.group({
			formSaveKey: ['add'],
            districtSeq: [sessionStorage.getItem('clickDistrict')],
            thslName: ['', Validators.required],
			thslDescription: ['', Validators.required],
        });

  }
  //edit
  editItem(passedId) {
	  console.log(passedId);
    this.DataService.editTehsil(passedId).subscribe(result => {
		console.log(result);
		(<any>$('#Tehsil')).modal('show');
		this.tehsilForm = this.formBuilder.group({
			formSaveKey: ['update'],
            districtSeq: [result.distSeq],
			thslSeq: [result.thslSeq],
			thslCode: [result.thslCd],
            thslName: [result.thslNm],
			thslDescription: [result.thslCmnt],
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
	  this.DataService.getTehsil(sessionStorage.getItem('clickDistrict'), this.filterValue).subscribe((data) => {
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
