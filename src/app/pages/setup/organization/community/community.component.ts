import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
	//communityList: any = [];
	clickCommunity: any = sessionStorage.getItem("clickPortfolio");
	communityName: any = sessionStorage.getItem("portfolioName");
    communityForm: FormGroup;
    submitted = false;
	// array of all items to be paged
    private allItems: any = [];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any = [];
	//status
	statusListing: any = "";
  constructor(private router:Router,private DataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
	  this.communityForm = this.formBuilder.group({
			formSaveKey: ['add'],
			portfolioSeq: [sessionStorage.getItem("clickPortfolio")],
			cmntyName: ['', Validators.required],
			cmntyDescription: [''],
			cmntyStatus: ['', Validators.required]
		});
		this.listing(1);
		//STATUS LIST
		this.DataService.statusList().subscribe(result => {
			this.statusListing  = result;
			console.log(result);	
		}, error => console.log('There was an error: ', error));
  }
  listing(page:number){
	  this.DataService.getCommunity(sessionStorage.getItem("clickPortfolio")).subscribe((data) =>{
		  console.log(data);
		  this.allItems  = data;
		  // initialize to page 1
		  this.setPage(page);
		},(error)  => {
		  console.log("err");
		  console.log("err", error);
		});
  }
  get f() { return this.communityForm.controls; }
  onCommunitySubmit() {
        this.submitted = true;
 
        // stop here if form is invalid
        if (this.communityForm.invalid) {
            return;
        }
		let formValue: any = this.communityForm.value;
		console.log(formValue.formSaveKey);
		if(formValue.formSaveKey === "add"){
			this.DataService.addCommunity(formValue).subscribe((data) =>{
			(<any>$("#AddCommunity")).modal('hide');
			// this.pagedItems.splice(0, 0, data.cmnty);
        // this.allItems.push(data.cmnty);
				// this.setPage(1);
				this.listing(1);
			//this.pagedItems.push(data.cmnty);
				console.log(data);
			},(error)  => {
				console.log("err", error);   
		  });
		}else if(formValue.formSaveKey === "update"){
			this.DataService.updateCommunity(formValue).subscribe((data) =>{
			(<any>$("#AddCommunity")).modal('hide');
			this.listing(this.pager.currentPage);
			//this.pagedItems.splice(this.pagedItems.indexOf(data.cmnty['protfolio_SEQ']), 1);
			//this.pagedItems.push(data.cmnty);
				console.log(data);
			},(error)  => {
				console.log("err", error);
		  });
		}
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
	  text: "Are you sure you want to delete this Community?",
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  this.DataService.delCommunity(passedId).subscribe(result => {
				this.listing(this.pager.currentPage);
				//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
				swal(
				  'Deleted!',
				  'Community has been deleted.',
				  'success'
				)
			}, error => console.log('There was an error: ', error));
	  }
	})
    
  }
  //add
  addItem() {
	  this.submitted = false;
	  (<any>$("#AddCommunity")).modal('show');
		this.communityForm = this.formBuilder.group({
			formSaveKey: ['add'],
			portfolioSeq: [sessionStorage.getItem("clickPortfolio")],
			cmntyName: ['', Validators.required],
			cmntyDescription: [''],
			cmntyStatus: ['', Validators.required]
		});
  }
  //edit
  editItem(passedId) {
	  console.log(passedId);
    this.DataService.editCommunity(passedId).subscribe(result => {
		console.log(result);
		(<any>$("#AddCommunity")).modal('show');
		this.communityForm = this.formBuilder.group({
			formSaveKey: ['update'],
			portfolioSeq: [result.protfolioSeq],
			comSeq: [result.cmntySeq],
			cmntyCode: [result.cmntyCd, Validators.required],
			cmntyName: [result.cmntyNm, Validators.required],
			cmntyDescription: [result.cmntyCmnt],
			cmntyStatus: [result.cmntyStsKey, Validators.required]
		});
    }, error => console.log('There was an error: ', error));
  }
  //update
  StatusUpdate(passedId) {
	   console.log(passedId);
    this.DataService.StatusUpdateCommunity(passedId).subscribe(result => {
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
  keyPressText(event: any) {
    const pattern = /[a-zA-Z\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  findValueByKeyStatus(key) {
    let status = 'not found';
    this.statusListing.forEach(s => {
      if (s.codeKey === key) {
        status =  s.codeValue;
      }
    });
    return status;
  }

}
