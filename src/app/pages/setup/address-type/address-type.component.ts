import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../shared/services/data.service';

@Component({
  selector: 'app-address-type',
  templateUrl: './address-type.component.html',
  styleUrls: ['./address-type.component.css']
})
export class AddressTypeComponent implements OnInit {
//commonCodeValueList: any = [];
  commonCodeValueForm: FormGroup;
  submitted = false;
  // array of all items to be paged
  private allItems: any = [];
  // pager objecte
  pager: any = {};
  // paged items
  pagedItems: any = [];
  constructor(private router:Router,private DataService:DataService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.commonCodeValueForm = this.formBuilder.group({
      groupKey: [sessionStorage.getItem("clickCommonCode")],
      formSaveKey: ['add'],
      valueCode: ['', Validators.required],
      valueName: ['', Validators.required],
      valueDescription: ['', Validators.required]
    });
    this.DataService.getCommonCodeValue(sessionStorage.getItem("clickCommonCode")).subscribe((data) =>{
      console.log(data);
      this.allItems  = data;
      // initialize to page 1
      this.setPage(1);
    },(error)  => {
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
    let formValue: any = this.commonCodeValueForm.value;
    console.log(formValue.formSaveKey);
    if(formValue.formSaveKey === "add"){
      this.DataService.addCommonCodeValue(formValue).subscribe((data: any) =>{
        (<any>$("#businessector")).modal('hide');
        this.pagedItems.push(data.group);
        console.log(data);
        sessionStorage.setItem("groupKey",data['refCdSeq']);
      },(error)  => {
        console.log("err", error);
      });
    }else if(formValue.formSaveKey === "update"){
      this.DataService.updateCommonCodeValue(formValue).subscribe((data: any) =>{
        (<any>$("#businessector")).modal('hide');
        this.pagedItems.splice(this.pagedItems.indexOf(data.group['refCdSeq']), 1);
        this.pagedItems.push(data.group);
        //console.log(data.group['refCdSeq']);
        sessionStorage.setItem("groupKey",data['refCdSeq']);
      },(error)  => {
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
    this.DataService.delCommonCodeValue(passedId).subscribe(result => {
      this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
      console.log(this.pagedItems);
    }, error => console.log('There was an error: ', error));
  }
  //add
  addItem() {
    this.submitted = false;
    (<any>$("#businessector")).modal('show');
    this.commonCodeValueForm = this.formBuilder.group({
      groupKey: [sessionStorage.getItem("clickCommonCode")],
      formSaveKey: ['add'],
      valueCode: ['', Validators.required],
      valueName: ['', Validators.required],
      valueDescription: ['', Validators.required]
    });
  }
  //edit
  editItem(passedId) {
    console.log('edit');
    this.DataService.editCommonCodeValue(passedId).subscribe((result: any) => {
      console.log(result);
      (<any>$("#businessector")).modal('show');
      this.commonCodeValueForm = this.formBuilder.group({
        groupKey: [result.refCdGrpKey],
        codeValueSeq:[result.refCdSeq],
        formSaveKey: ['update'],
        valueCode: [result.refCd],
        valueName: [result.refCdCmnt],
        valueDescription: [result.refCdDscr]
      });
    }, error => console.log('There was an error: ', error));
  }
}
