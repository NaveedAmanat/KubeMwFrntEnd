import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {DisbursementService} from '../../../shared/services/disbursement.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../shared/services/common.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {DisbursementVoucherListItem} from '../../../shared/models/disbursementVoucherListItem.model';
import {AssignCheck} from '../../../shared/models/assignCheck.model';
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';

 import {MomentDateAdapter} from '@angular/material-moment-adapter';
 import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
 import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
 // import {default as _rollupMoment} from 'moment';
 import { Moment } from 'moment';
 const moment = _moment;

 export const MY_FORMATS = {
   parse: {
     dateInput: 'LL',
   },
   display: {
     dateInput: 'DD/MM/YYYY',
     monthYearLabel: 'MMM YYYY',
     dateA11yLabel: 'LL',
     monthYearA11yLabel: 'MMMM YYYY',
   },
 };
@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css'],
     providers: [
     // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
     // application's root module. We provide it at the component level here, due to limitations of
     // our example generation script.
     { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
   ],
})
export class PaymentScheduleComponent implements OnInit {
  allItems: any[] = [];
  assignCheck: any[] = [];
  isPaymentSchedle:boolean=true;
  scheduleForm: FormGroup;
  totlPpl:number=0;
  totlcharg:number=0;
  totltotl:number=0;
  totalRev:number=0;
  frstInstDt:string;
  minDate: Date;
  maxDate: Date;
  prdSeq:string;
  isPaymentReq:boolean=false;
  constructor(private router: Router,
              private disbursementService: DisbursementService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder,
              private commonService: CommonService) {
              let  today:Date=new Date();
                this.minDate =new Date();
                this.maxDate = new Date();
                this.minDate.setDate(today.getDate()+10);
                this.maxDate.setDate(today.getDate() + 30);
                
                if(this.maxDate.getDay()===0){
                  this.maxDate = new Date();
                  this.maxDate.setDate(today.getDate()+31);
                }
                if(this.maxDate.getDay()===6){
                  this.maxDate = new Date();
                  this.maxDate.setDate(today.getDate()+29);
                }

   console.log(this.minDate+""+ this.maxDate) ;            
  this.scheduleForm = this.fb.group({
                  frstInstDt: [this.maxDate, Validators.required],
                });
  }

  ngOnInit() {
    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    this.disbursementService.getAllPaymentSchedules().subscribe((data) => {
      this.allItems = data;
      if(this.allItems.length==0){
        this.isPaymentSchedle = false;
      }
      this.setPdcsLimits();         
    });


  }

  onAssignCheque(number) {
    // this.assignCheck = code.assignCheck; // AssignCheque
    (<any>$('#AssignCheque')).modal('show');
    this.disbursementService.getPaymenrScheduleDetail(number).subscribe(d => {
      this.assignCheck = d;
      this.assignCheck.forEach((as: any, index) => {
        this.assignCheck[index].chrgTyp = as.chargesTypesDTO.chrgTyp;
      });
    });
    
  }

  generateSchedule() {
    (<any>$('#generatemodal')).modal('show');
  }
  regen:boolean = false;
  onSubmit() {
    this.regen = true;
    console.log("Sublmit");
    (<any>$('#generatemodal')).modal('hide');
    this.spinner.show();
    const dateSendingToServer = new DatePipe('en-US').transform(this.scheduleForm.get('frstInstDt').value, 'dd-MM-yyyy')
    this.isPaymentSchedle = true;
    this.disbursementService.generatePaymentSchedule(dateSendingToServer).subscribe((data) => {
      this.spinner.hide();
      this.allItems = data;
     this.frstInstDt=dateSendingToServer;
      data.forEach((d) => {
        this.totalRev=this.totalRev+d.ppalAmtDue+d.totChrgDue;
      });
      if(data.length==0){
        this.isPaymentSchedle = true;
      }
      this.setPdcsLimits();     
      this.regen = false;     
    },error=>{
      this.spinner.hide();
      console.log("ERROR - REGEN")
      this.regen = false;
    });

  }
  kskLRSGenrate(){
    const dateSendingToServer = new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy')
    this.isPaymentSchedle = true;
    this.spinner.show();
    this.disbursementService.generatePaymentSchedule(dateSendingToServer).subscribe((data) => {
      this.spinner.hide();
      this.allItems = data;
     this.frstInstDt=dateSendingToServer;
      data.forEach((d) => {
        this.totalRev=this.totalRev+d.ppalAmtDue+d.totChrgDue;
      });
      if(data.length==0){
        this.isPaymentSchedle = true;
      }
      this.setPdcsLimits();          
    });
    this.spinner.hide();
  }
  
  getPrdSeq($event) {
    this.prdSeq = $event;
  }


  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }
  private setPdcsLimits(){
    if(this.allItems.length>0){
    sessionStorage.setItem("frstInstDt",this.allItems[0].dueDt);
    sessionStorage.setItem("lsatInstDt",this.allItems[this.allItems.length-1].dueDt);
    //sessionStorage.setItem("pdcsLimit",JSON.stringify(this.allItems.length/6));
    // this.disbursementService.genrateHelthCard(new DatePipe('en-US').transform(this.allItems[this.allItems.length-1].dueDt, 'yyyy-MM-dd')).subscribe((data) => {
    // });
  }
  }
  method2(){
    console.log("ASDASD");
    return false;
  }

  /**
   * @added, Naveed 
   * @date, 15-07-2022
   * @description, exclude SUN,SAT Payment Schedule date picker 
   */
  excludeWeekEnd = (d: Date): boolean => {
    const day = new Date(d).getDay();
    return day !== 0;
    // return day !== 0; && day !== 6 ;
  }
}
