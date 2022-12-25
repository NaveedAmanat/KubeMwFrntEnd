import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Moment } from 'moment';
import { MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import { ToastrService } from 'ngx-toastr';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-branch-portfolio',
  templateUrl: './branch-portfolio.component.html',
  styleUrls: ['./branch-portfolio.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BranchPortfolioComponent implements OnInit {

  //Form Groups Name
  generateListForm: FormGroup;
  branchPortfolioForm: FormGroup;


  //Data
  allProducts: any;
  allBrnches: any;
  allListings: any;
  activeProducts: any;
  periodSpan: any;
  allBranchTargets: any = [];


  //Use for faking the allBrnches
  branchName: any;

  selectPeriod: boolean = false;
  saveAllPortfolio: boolean = false;

  //Total Branch Target
  totalBranchTargetClient = "0";
  totalBranchTargetAmount = "0";

  //Total Bdo Target
  totalBdoTargetClient = "0";
  totalBdoTargetAmount = "0";



  constructor(
    private transferService: TransfersService,
    private paymentTypesService: PaymentTypesService,
    private fb: FormBuilder,
    private toaster: ToastrService,
  ) { }

  ngOnInit() {

    //All Products
    this.transferService.getAllProductsForBranch().subscribe(data => {
      this.allProducts = data;
    });

    //All Branches
    this.paymentTypesService.getAllBrnches().subscribe(response => {
      this.allBrnches = response;
      let branch;
      branch = this.allBrnches
      branch.forEach(element => {
        if (element.brnchSeq == JSON.parse(sessionStorage.getItem("auth")).emp_branch) {
          this.branchName = element.brnchNm
        }
      });
    })

    // Branch Portfolio Form
    // this.branchPortfolioForm = this.fb.group({
    //   trgtClnt: ['', Validators.required],
    //   trgtAmt: ['', Validators.required],
    // });

    // Generate List Form
    this.generateListForm = this.fb.group({
      productControl: ['', Validators.required],
      perd: ['']
    })

    this.createform();
  }

  createform() {
    let arr = [];
    for (let i = 0; i < this.allBranchTargets.length; i++) {
      arr.push(this.BuildFormDynamic(this.allBranchTargets[i]))
    }
    this.branchPortfolioForm = this.fb.group({
      branchTargetPortfolio: this.fb.array(arr)
    })
  }


  BuildFormDynamic(bdo): FormGroup {
    return this.fb.group({
      portId: [bdo.portId],
      brnchTrgtsSeq: [bdo.brnchTrgtsSeq],
      bdoName: [bdo.empNm],
      trgtClnt: [bdo.trgtClnt],
      trgtAmt: [bdo.trgtAmnt]
    })
  }

  // only numbers 
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  //Generating Listings for Table
  generateListings() {
    console.log(this.generateListForm.value);
  }


  onSelectionChangeProducts(e) {
    this.selectPeriod = false;
    this.generateListForm.controls['perd'].reset();
    this.totalBranchTargetClient = "0";
    this.totalBranchTargetAmount = "0";
    this.totalBdoTargetClient = "0";
    this.totalBdoTargetAmount = "0";
    this.allBranchTargets = [];
    this.createform();
    this.transferService.getAllPeriodsOfBranchPortfolio(this.generateListForm.controls['productControl'].value).subscribe(response => {
      this.periodSpan = response;
      this.selectPeriod = true;
    })
  }

  onSelectionChangPeriod(e) {
    this.totalBranchTargetClient = e.clients;
    this.totalBranchTargetAmount = e.amount;
    this.totalBdoTargetClient = "0";
    this.totalBdoTargetAmount = "0";
    this.allBranchTargets = [];
    this.createform();
    this.transferService.getListingsForBranchPortfolio(e.brnchTrgtSeq).subscribe(res => {
      res.forEach(ele => {
        if (ele.trgtAmnt == null || ele.trgtClnt == null) {
          ele.trgtAmnt = 0;
          ele.trgtClnt = 0;
        }
      });
      this.allBranchTargets = res;
      console.log(this.allBranchTargets)
      this.saveAllPortfolio = true;
      this.createform();
      this.onSelectionChangTargetBdoAmount(0);
      this.onSelectionChangTargetBdoClient(0);
    })
  }


  onSelectionChangTargetBdoClient(e) {
    // console.log(this.branchPortfolioForm.value.branchTargetPortfolio.length)
    // console.log(this.branchPortfolioForm)
    // console.log(this.branchPortfolioForm.value)
    // console.log(this.branchPortfolioForm.value.branchTargetPortfolio)

    // for (let i = 0; i < this.branchPortfolioForm.value.branchTargetPortfolio.length; i++) {
    //   console.log(this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtClnt)
    //   if(this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtClnt = 0){
    //     alert("you can't enter 0 against target amount or ");
    //   }
    // }
    let total = 0;
    this.branchPortfolioForm.value.branchTargetPortfolio.forEach(element => {
      total = total + +element.trgtClnt;
    });
    this.totalBdoTargetClient = '' + total;
  }

  onSelectionChangTargetBdoAmount(e) {
    let total = 0;
    this.branchPortfolioForm.value.branchTargetPortfolio.forEach(element => {
      total = total + +element.trgtAmt;
    });
    this.totalBdoTargetAmount = '' + total;
  }


  //Submitting function for all table data
  onSubmitBranchPortfolioForAll() {
    console.log(this.branchPortfolioForm.value)


    // for (let i = 0; i < this.branchPortfolioForm.value.branchTargetPortfolio.length; i++) {
    //   console.log(this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtClnt)
    //   if (this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtClnt == "0") {
    //     this.toaster.error('Target Client Cannot be 0')
    //     return;
    //   }
    // }

    // for (let i = 0; i < this.branchPortfolioForm.value.branchTargetPortfolio.length; i++) {
    //   console.log(this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtAmt)
    //   if (this.branchPortfolioForm.value.branchTargetPortfolio[i].trgtAmt == "0") {
    //     this.toaster.error('Target Amount Cannot be 0')
    //     return;
    //   }
    // }


    if (this.totalBdoTargetClient > this.totalBranchTargetClient) {
      this.toaster.error('Total BDO Target Client is greater than Total Branch Target Client')
      return;
    }
    if (this.totalBdoTargetClient < this.totalBranchTargetClient) {
      this.toaster.error('Total BDO Target Client is less than Total Branch Target Client')
      return;
    }
    if (this.totalBdoTargetAmount > this.totalBranchTargetAmount) {
      this.toaster.error('Total BDO Target Amount is greater than Total Branch Target Amount')
      return;
    }
    if (this.totalBdoTargetAmount < this.totalBranchTargetAmount) {
      this.toaster.error('Total BDO Target Amount is less than Total Branch Target Amount')
      return;
    }
    this.transferService.savingAllBranchPortfolios(this.branchPortfolioForm.value.branchTargetPortfolio).subscribe(res => {
      this.toaster.success('Saved');
    }, error => {
      this.toaster.error('Something Went Wrong')
    });
  }


}
