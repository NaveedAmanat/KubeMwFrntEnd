import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-communication-workflow',
  templateUrl: './communication-workflow.component.html',
  styleUrls: ['./communication-workflow.component.css']
})
export class CommunicationWorkflowComponent implements OnInit {
	// array of all items to be paged
    private allItems: any = [];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any = [];

  constructor(private router:Router,private DataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
	  this.DataService.getCommunicatioinWorkflow().subscribe((data) =>{
          console.log(data);
          this.allItems  = data;
		  // initialize to page 1
		  this.setPage(1);
        },(error)  => {
          console.log("err");
          console.log("err", error);
        });
  }
  editCommunication(id){
	sessionStorage.setItem("editCommunication",id);
	this.router.navigate(["/setup/communication-workflow/add-workflow-rule", id]);
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
	  text: "Are you sure you want to delete this Union Communication Workflow?",
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  this.DataService.delCommunicatioinWorkflow(passedId).subscribe(result => {
				//this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
				//this.listing();
				swal(
				  'Deleted!',
				  'Communication Workflow has been deleted.',
				  'success'
				)
			}, error => console.log('There was an error: ', error));
	  }
	})
    
  }
  //add
  addItem() {
	sessionStorage.setItem("editCommunication","");
	this.router.navigate(["/setup/communication-workflow/add-workflow-rule"]); 
  }

}
