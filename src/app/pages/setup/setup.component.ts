import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

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
  //commonCodeList: any = [];
  commonCodeForm: FormGroup;
  submitted = false;
  // array of all items to be paged
  private allItems: any = [];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any = [];
  //listing: any;
  showFields = false;
  constructor(private router: Router, private DataService: DataService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toaster: ToastrService) { }

  ngOnInit() {
    this.displayedColumns = ['refCdGrp', 'refCdGrpName', 'refCdGrpCmnt', 'action'];
    this.commonCodeForm = this.formBuilder.group({
      groupCode: [''],
      formSaveKey: ['add'],
      groupName: ['', Validators.required],
      groupDescription: ['', Validators.required]
    });
    this.listing(1);
  }
  listing(page: number) {
    this.spinner.show();
    this.DataService.getAllCommonCode().subscribe((data) => {
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
      console.log('err');
      console.log('err', error);
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.commonCodeForm.controls; }
  currentpage: number = 0;
  onCommonCodeSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.commonCodeForm.invalid) {
      console.log(this.commonCodeForm);
      return;
    }
    this.spinner.show();
    const formValue: any = this.commonCodeForm.value;
    console.log(formValue.formSaveKey);
    if (formValue.formSaveKey === 'add') {
      this.DataService.addCommonCode(formValue).subscribe((data) => {
        //let usr = JSON.parse(data);
        this.spinner.hide();
        this.toaster.success('Saved');
        (<any>$('#cmmoncodes')).modal('hide');
        // this.pagedItems.splice(0, 0, data.group);
        console.log(data);
        this.listing(1);

        //this.pagedItems.push(data.group);
        sessionStorage.setItem('groupSeq', data['clientSeq']);
      }, (error) => {
        this.spinner.hide();
        this.toaster.error('Error');
        console.log('err', error);
      });
    } else if (formValue.formSaveKey === 'update') {
      this.DataService.updateAllCommonCode(formValue).subscribe((data) => {
        //let usr = JSON.parse(data);
        (<any>$('#cmmoncodes')).modal('hide');
        this.listing(this.pager.currentPage);
        this.spinner.hide();
        this.toaster.success('Updated');
        //this.pagedItems.splice(this.pagedItems.indexOf(data.group['refCdGrpSeq']), 1);
        ///this.pagedItems.push(data.group);
        console.log(data);
        sessionStorage.setItem('groupSeq', data['clientSeq']);
      }, (error) => {
        this.spinner.hide();
        this.toaster.error('Error');
        console.log('err', error);
      });
    }
    return false;
  }
  commonCodeVale(id) {
    sessionStorage.setItem('clickCommonCode', id);
    this.router.navigate(['/setup/common-code-values', id]);
    //this.router.navigate(['/product-details', id]);
  }
  //pagenation
  setPage(page: number) {
    // get pager object from service
    this.pager = this.DataService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  //add
  addItem() {
    this.submitted = false;
    (<any>$('#cmmoncodes')).modal('show');
    this.commonCodeForm = this.formBuilder.group({
      groupCode: [''],
      formSaveKey: ['add'],
      groupName: ['', Validators.required],
      groupDescription: ['', Validators.required]
    });
  }
  //edit
  editItem(passedId) {
    this.currentpage = this.pager.currentPage;
    console.log(passedId);
    this.DataService.editAllCommonCode(passedId).subscribe(result => {
      console.log(result);
      (<any>$('#cmmoncodes')).modal('show');
      this.commonCodeForm = this.formBuilder.group({
        groupSeq: [result.refCdGrpSeq],
        formSaveKey: ['update'],
        groupCode: [result.refCdGrp],
        groupName: [result.refCdGrpName],
        groupDescription: [result.refCdGrpCmnt],
      });
    }, error => console.log('There was an error: ', error));
  }
  showField() {
    this.showFields = true;
  }
  keyPress(event: any) {
    const pattern = /[a-zA-Z0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
