import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-party-ledger',
  templateUrl: './party-ledger.component.html',
  styleUrls: ['./party-ledger.component.css']
})
export class PartyLedgerComponent implements OnInit {

  scheduleForm: FormGroup;
  maxDate: Date;
  constructor( private reportsService:ReportsService,private fb: FormBuilder) {
    this.maxDate=new Date();
    this.scheduleForm = this.fb.group({
      clntId: [new Date(), Validators.required],
    }); }

  ngOnInit() {
  }
  

  postedReport(){
  }

}
