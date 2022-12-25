import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-un',
  templateUrl: './un.component.html',
  styleUrls: ['./un.component.css']
})
export class UnComponent implements OnInit {
	//nntehsilList: any = [];
	tehsilKey: any = sessionStorage.getItem('clickTehsil');
	unForm: FormGroup;
    submitted = false;
	model: any = {};
	// array of all items to be paged
    private allItems: any = [];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any = [];
	statusListing: any = '';
  constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder, private toaster: ToastrService,
	private spinner: NgxSpinnerService) { }

  ngOnInit() {
		this.unForm = this.formBuilder.group({
			formSaveKey: ['add'],
            thslSeq: [sessionStorage.getItem('clickTehsil')],
            ucName: ['', Validators.required],
			ucDescription: ['', Validators.required],
			statusKey: ['', Validators.required],
        });
        this.listing();
		//STATUS LIST
		this.DataService.statusList().subscribe(result => {
			this.statusListing  = result;
			console.log(result);
		}, error => console.log('There was an error: ', error));
  }
  listing() {
	this.filterValue = "";
	  this.DataService.getUN(sessionStorage.getItem('clickTehsil'), this.filterValue).subscribe((data) => {
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
  get f() { return this.unForm.controls; }
  onUNSubmit() {
	  this.submitted = true;

        // stop here if form is invalid
        if (this.unForm.invalid) {
            return;
        }
		const formValue: any = this.unForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === 'add') {
			this.DataService.addUN(formValue).subscribe((data) => {
			(<any>$('#UN')).modal('hide');
			// this.pagedItems.splice(0, 0, data.uc);
			this.allItems.push(data.uc);
			this.setPage(1);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		} else if (formValue.formSaveKey === 'update') {
			this.DataService.updateUN(formValue).subscribe((data) => {
			(<any>$('#UN')).modal('hide');
			this.listing();
			//this.pagedItems.splice(this.pagedItems.indexOf(data.uc['ucSeq']), 1);
			//this.pagedItems.push(data.uc);
				console.log(data);
			}, (error)  => {
				console.log('err', error);
			  });
		}
    return false;
  }
  unFun(id) {
	sessionStorage.setItem('clickUN', id);
	this.router.navigate(['/setup/geography/tesil', id]);
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
	  text: 'Are you sure you want to delete this Union Council?',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  this.DataService.delUN(passedId).subscribe(result => {
				//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
				this.listing();
				swal(
				  'Deleted!',
				  'Union Council has been deleted.',
				  'success'
				);
			}, error => console.log('There was an error: ', error));
	  }
	});

  }
  //add
  addItem() {
	  this.submitted = false;
	  (<any>$('#UN')).modal('show');
		this.unForm = this.formBuilder.group({
			formSaveKey: ['add'],
            thslSeq: [sessionStorage.getItem('clickTehsil')],
            ucName: ['', Validators.required],
			ucDescription: ['', Validators.required],
			statusKey: ['', Validators.required],
        });

  }
  //edit
  editItem(passedId) {
	  console.log(passedId);
    this.DataService.editUN(passedId).subscribe(result => {
		console.log(result);
		(<any>$('#UN')).modal('show');
		this.unForm = this.formBuilder.group({
			formSaveKey: ['update'],
            thslSeq: [result.thslSeq],
			ucSeq: [result.ucSeq],
			ucCode: [result.ucCd],
            ucName: [result.ucNm],
			ucDescription: [result.ucCmnt],
			statusKey: [result.ucStsKey],
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
	  this.DataService.getUN(sessionStorage.getItem('clickTehsil'), this.filterValue).subscribe((data) => {
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
