import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-approval-workflow',
  templateUrl: './approval-workflow.component.html',
  styleUrls: ['./approval-workflow.component.css']
})
export class ApprovalWorkflowComponent implements OnInit {
	// array of all items to be paged
    private allItems: any = [];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any = [];
  constructor(private router:Router,private DataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
	  this.DataService.getAprovalWorkflow().subscribe((data) =>{
          console.log(data);
          this.allItems  = data;
		  // initialize to page 1
		  this.setPage(1);
        },(error)  => {
          console.log("err");
          console.log("err", error);
        });
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
    this.DataService.delAprovalWorkflow(passedId).subscribe(result => {
		this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
		console.log(this.pagedItems)
    }, error => console.log('There was an error: ', error));
  }
  

}
