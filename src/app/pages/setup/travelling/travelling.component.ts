import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Branch } from 'src/app/shared/models/branch.model';
import { Travelling } from 'src/app/shared/models/travelling.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { TravellingService } from 'src/app/shared/services/travelling.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

/*Authored by Areeba
HR Travelling SCR
Dated - 07-06-2022
*/

@Component({
  selector: 'app-travelling',
  templateUrl: './travelling.component.html',
  styleUrls: ['./travelling.component.css']
})
export class TravellingComponent implements OnInit {

  constructor(private commonService: CommonService,
    private travellingService: TravellingService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  @ViewChild('trvlngForm') form;
  //Lists
  brnchs: Branch[];
  category: any;
  trvlngRol: any;
  calcTyp: any;
  portTyp: any;
  trvlng: Travelling[] = [];
  allTrvlng: Travelling[] = [];

  //Variables
  invalid: boolean = false;
  travellingForm: FormGroup;
  fromDt: Date = null;
  toDt: Date = null;
  onEdit: boolean = false;
  dateDisabled: boolean = true;
  dates: any[] = [];
  disbCategory: boolean = false;

  ngOnInit() {
    this.travellingService.getAllTravelling().subscribe((res) => {
      this.allTrvlng = res;
    });
    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.TRAVELLING_ROLE).subscribe((res) => {
      this.trvlngRol = res;
    });
    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.CALCULATION_TYPE).subscribe((res) => {
      this.calcTyp = res;
    });
    this.commonService.getValuesByRefCdGRp(REF_CD_GRP_KEYS.PORTFOLIO_CATEGORY_TYPE).subscribe((res) => {
      this.portTyp = res;
    });
    this.travellingForm = this.formBuilder.group({
      hrTrvlngSeq: [''],
      refCdTrvlngRol: [''],
      refCdCalcTyp: [''],
      refCdPortTypSeq: [''],
      fromDt: [new Date()],
      toDt: [new Date()],
      amt: ['']
    });
  }
calculation:any;
percentage:boolean = false;
calcDisabled: boolean = true;
  changeCat(event) {
    this.category = event.value;
    this.refCdTrvlngRol = this.category;
    this.getTravellingList();
  }
  onChangeCalculation(event){
    this.calcDisabled = false;
    this.calculation = event.value;
    if(this.findValueFromKey(this.calculation, this.calcTyp) == 'FIXED'){
      this.percentage = false;
    }
    else{
      this.percentage = true;
    }
    this.amt = null;
  }
  onFromDateChange(event) {
    this.fromDt = event.value;
  }
  onToDateChange(event) {
    this.toDt = event.value;
  }

  // Find value from code
  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == key) {
          return array[i].codeValue;
        }
      }
    }
  }

  getTravellingList() {

    this.travellingService.getAllTravelling().subscribe((res) => {
      this.allTrvlng = res;
    })

    if (this.category == null || this.category == "") {
      this.toaster.info('Please select a category');
      return;
    }
    
    this.travellingService.getTravelling(this.category).subscribe((data) => {
      this.trvlng = data;
    }, (error) => {
      console.log('err', error);
      this.toaster.warning('err', error);

    });
  }

  dateFilter = (d: Date): boolean => {
    let result = true;

    for (let i = 0; i < this.dates.length; i++) {
      result = !(d >= this.dates[i][0] && d <= this.dates[i][1]);
      if (!result) {
        break;
      }
    }

    return result;
  };

  onLoadDates(event, trvlng){ 
    this.loadDates(trvlng);
  }

  loadDates(trvlng) {
    if(trvlng.refCdTrvlngRol == null){
      trvlng.refCdTrvlngRol = this.refCdTrvlngRol;
    }
    if ((trvlng.refCdTrvlngRol != null && trvlng.refCdPortTypSeq != null)) {
      this.dateDisabled = false;
      this.dates = [];
      this.allTrvlng.forEach(t => {
        if (t.refCdTrvlngRol == trvlng.refCdTrvlngRol && t.refCdPortTypSeq == trvlng.refCdPortTypSeq) {
          if (this.onEdit && this.prevFromDt.valueOf() == new Date(t.fromDt).valueOf() && this.prevToDt.valueOf() == new Date(t.toDt).valueOf()) {
            console.log("Updating Date Range");
          }
          else
            this.dates.push([new Date(t.fromDt), new Date(t.toDt)]);
        }
      })
    }
    else
      this.dateDisabled = true;
  }
  checkDates(fromDt, toDt){
    let result;
    var start,end;

    for (let i = 0; i < this.dates.length; i++) {
      start = new DatePipe('en-US').transform(this.dates[i][0], 'yyyy-MM-dd');
      end = new DatePipe('en-US').transform(this.dates[i][0], 'yyyy-MM-dd');
      if(fromDt < start && toDt > end){
        result = false;
        break;
      }
      else result = true;
    }
    return result;
  }
  
  // Add a New Travelling
  addTrvlng() {

    this.dateDisabled = true;
    this.onEdit = false;
    this.disbCategory = false;

    this.amt = null;
    this.refCdCalcTyp = null;
    this.refCdPortTypSeq = null;
    this.fromDt = null;
    this.toDt = null;
    this.hrTrvlngSeq = null;
    this.calcDisabled = true;
    this.form.controls.refCdCalcTyp.clearValidators();
    this.form.controls.refCdPortTypSeq.clearValidators();
    this.form.controls.amt.clearValidators();
    this.travellingForm.reset();
    if(this.category == null){
      this.toaster.info("Please select a category first.");
      return;
    }
    else{
    this.refCdTrvlngRol = this.category;
    this.disbCategory = true;
    (<any>$('#addTrvlng')).modal('show');
    }
  }

  amt: number;
  refCdTrvlngRol: number;
  refCdCalcTyp: any;
  refCdPortTypSeq: any;
  hrTrvlngSeq: number;
  prevFromDt: Date;
  prevToDt: Date;

  editTrvlng(trvlng) {
    this.onEdit = true;
    this.disbCategory = true;
    this.dateDisabled = true;
    this.calcDisabled = false;
    
    //this.refCdTrvlngRol = trvlng.refCdTrvlngRol;
    this.amt = trvlng.amt;

    this.refCdCalcTyp = trvlng.refCdCalcTyp;
    this.refCdPortTypSeq = trvlng.refCdPortTypSeq;
    this.fromDt = new Date(trvlng.fromDt);
    this.toDt = new Date(trvlng.toDt);
    this.hrTrvlngSeq = trvlng.hrTrvlngSeq;
    this.prevFromDt = new Date(trvlng.fromDt);
    this.prevToDt = new Date(trvlng.toDt);

    this.loadDates(trvlng);
    
    (<any>$('#addTrvlng')).modal('show');
  }

  percentCheck:boolean = true;

  onTrvlngFormSubmit(trvlng) {
    const fromDt = new DatePipe('en-US').transform(this.fromDt, 'yyyy-MM-dd');
    const toDt = new DatePipe('en-US').transform(this.toDt, 'yyyy-MM-dd');
    // stop here if form is invalid
    if(this.findValueFromKey(trvlng.refCdCalcTyp, this.calcTyp) != 'FIXED' && (trvlng.amt < 0 || trvlng.amt > 100)){
      this.percentCheck = false;
      return;
    }
    else{
      this.percentCheck = true;
    }
    if(trvlng.refCdTrvlngRol == null && this.refCdTrvlngRol == null){
      this.invalid = true;
    }

    else if (trvlng.refCdCalcTyp == null
      || trvlng.refCdPortTypSeq == null || trvlng.amt == ""
      || this.fromDt == null || this.toDt == null) {
      this.invalid = true;
    }
    else {
      trvlng.refCdTrvlngRol = this.refCdTrvlngRol;
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    if(this.checkDates(fromDt, toDt) == false){
      this.toaster.info('Enter a valid Date Range');
      return;
    }

    this.travellingForm.reset();
    this.travellingForm = this.formBuilder.group({
      hrTrvlngSeq: [this.hrTrvlngSeq],
      refCdTrvlngRol: [this.refCdTrvlngRol],
      refCdCalcTyp: [trvlng.refCdCalcTyp],
      refCdPortTypSeq: [trvlng.refCdPortTypSeq],
      fromDt: [fromDt],
      toDt: [toDt],
      amt: [trvlng.amt]
    });
    this.travellingService.addTravelling(this.travellingForm.value).subscribe((data) => {
      if (this.onEdit == true)
        this.toaster.success('HR Travelling Expense updated');
      else
        this.toaster.success('New HR Travelling Expense added');
      this.getTravellingList();
    }, (error) => {
      console.log('err', error);
      this.toaster.warning('err', error);

    });
    (<any>$('#addTrvlng')).modal('hide');
  }

  deleteTrvlng(trvlng) {
    swal({
			title: 'Are you sure?',
			text: 'Are you sure you want to delete this Expense?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			this.spinner.show();
			if (result.value) {
				this.travellingService.deleteTravelling(trvlng.hrTrvlngSeq).subscribe((res) => {
					
					this.spinner.hide();
					swal(
						'Deleted!',
						'HR Travelling Expense has been deleted.',
						'success'
					);
          this.getTravellingList();
				}, error => {
					this.spinner.hide();
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

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyPercentage(event: any) {
    const pattern = /^[1-9][0-9]?$|^100$/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
