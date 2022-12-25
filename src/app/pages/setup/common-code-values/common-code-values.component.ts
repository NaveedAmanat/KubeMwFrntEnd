import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
	selector: 'app-common-code-values',
	templateUrl: './common-code-values.component.html',
	styleUrls: ['./common-code-values.component.css']
})
export class CommonCodeValuesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  dataSource: any;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
	//commonCodeValueList: any = [];
	commonCodeValueForm: FormGroup;
	submitted = false;
  showFields = false;
	// array of all items to be paged
	private allItems: any = [];
	// pager objecte
	pager: any = {};
	// paged items
	pagedItems: any = [];
	constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder,
		private spinner: NgxSpinnerService, private toaster: ToastrService) {
	}

	ngOnInit() {
    this.displayedColumns = ['refCd', 'refCdDscr', 'activeFlg', 'sortOrder', 'action'];
		this.commonCodeValueForm = this.formBuilder.group({
			groupKey: [sessionStorage.getItem("clickCommonCode")],
			formSaveKey: ['add'],
			valueDescription: ['', Validators.required],
			activeStatus: ['', Validators.required],
			sortOrder: ['', Validators.required],
		});
		this.listing(1);
	}
	listing(page:number) {
		this.spinner.show();
		this.DataService.getCommonCodeValue(sessionStorage.getItem("clickCommonCode")).subscribe((data) => {
			console.log(data);
			this.spinner.hide();
			this.allItems = data;
			// initialize to page 1
			this.setPage(page);
      this.dataSource = new MatTableDataSource(this.allItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
		}, (error) => {
			this.spinner.hide();
			console.log("err");
			console.log("err", error);
		});
	}
	// convenience getter for easy access to form fields
	get f() { return this.commonCodeValueForm.controls; }
	onCommonCodeValueSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.commonCodeValueForm.invalid) {
			return;
		}
		this.spinner.show();
		let formValue: any = this.commonCodeValueForm.value;
		console.log(formValue.formSaveKey);
		if (formValue.formSaveKey === "add") {
			this.DataService.addCommonCodeValue(formValue).subscribe((data) => {
				(<any>$("#businessector")).modal('hide');
				// this.pagedItems.splice(0, 0, data.group);
				// this.pagedItems.push(data.group);
				// this.allItems.push(data.group);
				this.listing(1);
				console.log(data);
				this.spinner.hide();
				sessionStorage.setItem("groupKey", data['refCdSeq']);
			}, (error) => {
				this.spinner.hide();
				console.log("err", error);
			});
		} else if (formValue.formSaveKey === "update") {
			this.DataService.updateCommonCodeValue(formValue).subscribe((data) => {
				(<any>$("#businessector")).modal('hide');
				this.spinner.hide();
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(data.group['refCdSeq']), 1);
				//this.pagedItems.push(data.group);
				//console.log(data.group['refCdSeq']);
				sessionStorage.setItem("groupKey", data['refCdSeq']);
			}, (error) => {
				this.spinner.hide();
				console.log("err", error);
			});
			//console.log(formValue.groupSaveKey);
		}
		//this.DataService.formValue.groupSaveKey(formValue).subscribe((data) =>{

		return false;
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
			text: "Are you sure you want to delete this Common Code Value?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				this.DataService.delCommonCodeValue(passedId).subscribe(result => {
					//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
					this.listing(this.pager.currentPage);
					swal(
						'Deleted!',
						'Common code values has been deleted.',
						'success'
					)
				}, error => console.log('There was an error: ', error));
			}
		})

	}
	//add
	addItem() {
		this.submitted = false;
		(<any>$("#businessector")).modal('show');
		this.commonCodeValueForm = this.formBuilder.group({
			groupKey: [sessionStorage.getItem("clickCommonCode")],
			formSaveKey: ['add'],
			valueDescription: ['', Validators.required],
			activeStatus: ['', Validators.required],
			sortOrder: ['', Validators.required],
		});
	}
	//edit
	editItem(passedId) {
		console.log('edit');
		this.DataService.editCommonCodeValue(passedId).subscribe(result => {
			console.log(result);
			(<any>$("#businessector")).modal('show');
			this.commonCodeValueForm = this.formBuilder.group({
				groupKey: [result.refCdGrpKey],
				codeValueSeq: [result.refCdSeq],
				formSaveKey: ['update'],
				valueCode: [result.refCd],
				valueName: [result.refCdCmnt],
				activeStatus: [""+result.activeFlg, Validators.required],
				valueDescription: [result.refCdDscr, Validators.required],
				sortOrder: [result.sortOrder, Validators.required],
			});
		}, error => {
      console.log('There was an error: ', error);
      this.toaster.error(error.message,'Common Code Value Error')
    });
	}
	keyPress(event: any) {
		const pattern = /[a-zA-Z0-9 ]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
  showField() {
    this.showFields = true;
  }
	onlyNumbers(event: any) {
		const pattern = /[0-9]/;
	
		const inputChar = String.fromCharCode(event.charCode);
		if (event.charCode != 8 && !pattern.test(inputChar)) {
		  event.preventDefault();
		}
	  }
}
