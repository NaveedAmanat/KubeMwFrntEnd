import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import { HealthInsurancePlanService } from '../../../shared/services/health-insurance-plan.service';
import { CommonService } from '../../../shared/services/common.service';
import swal from 'sweetalert2';
import { HealthInsurancePlan } from '../../../shared/models/health-insurance-plan.model';

@Component({
  selector: 'app-health-insurance-plan',
  templateUrl: './health-insurance-plan.component.html',
  styleUrls: ['./health-insurance-plan.component.css']
})
export class HealthInsurancePlanComponent implements OnInit {

  statusArray: any[];
  public HealthInsurancePlans: HealthInsurancePlan[];
  public addHealthInsurancePlan: HealthInsurancePlan = new HealthInsurancePlan();
  public isEdit: Boolean = false;

  public healthInsurancePlanForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private _HealthInsurancePlanService: HealthInsurancePlanService,private commonService: CommonService) {
   }

   ngOnInit() {
    this.healthInsurancePlanForm = this.formBuilder.group({
      planNm: ['', Validators.required],
      planStsKey: ['', Validators.required],
      anlPremAmt: ['', Validators.required],
      maxPlcyAmt: ['', Validators.required],
      glAcctNum: ['', Validators.required],
      dfrdAcctNum: ['', Validators.required],
      plnDscr: [''],
      hlthCardFlg: [false],
      mnthFlg: [false]
  });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );
    this._HealthInsurancePlanService.getHealthInsurancePlans().subscribe(data => this.HealthInsurancePlans = data);
  }

  get form() 
  { 
    return this.healthInsurancePlanForm.controls; 
  }
  onAddNewClick() {
    this.isEdit = false;
    this.healthInsurancePlanForm.reset();
    this.addHealthInsurancePlan = new HealthInsurancePlan();
    (<any>$('#businessector')).modal('show');
  }
  
  addHealthInsurancePlanSubmit(){
    this.submitted = true;
    if (this.healthInsurancePlanForm.invalid) {
        return;
    }

    this.addHealthInsurancePlan.planNm= this.healthInsurancePlanForm.value.planNm;
    this.addHealthInsurancePlan.anlPremAmt= this.healthInsurancePlanForm.value.anlPremAmt;
    this.addHealthInsurancePlan.maxPlcyAmt= this.healthInsurancePlanForm.value.maxPlcyAmt;
    this.addHealthInsurancePlan.planStsKey= this.healthInsurancePlanForm.value.planStsKey;
    this.addHealthInsurancePlan.glAcctNum= this.healthInsurancePlanForm.value.glAcctNum;
    this.addHealthInsurancePlan.dfrdAcctNum= this.healthInsurancePlanForm.value.dfrdAcctNum;

    //Added by Areeba - 15-9-2022
    this.addHealthInsurancePlan.plnDscr = this.healthInsurancePlanForm.value.plnDscr;
    this.addHealthInsurancePlan.hlthCardFlg = this.healthInsurancePlanForm.value.hlthCardFlg == null ? false : this.healthInsurancePlanForm.value.hlthCardFlg;
    this.addHealthInsurancePlan.mnthFlg = this.healthInsurancePlanForm.value.mnthFlg == null ? false : this.healthInsurancePlanForm.value.mnthFlg;
    //Ended by Areeba

    (<any>$('#businessector')).modal('hide'); 
    console.log(this.addHealthInsurancePlan);
    if(this.isEdit) {
      this._HealthInsurancePlanService.updateHealthInsurancePlan(this.addHealthInsurancePlan).subscribe(data => {
        this.addHealthInsurancePlan = data;
        this._HealthInsurancePlanService.getHealthInsurancePlans().subscribe(data => this.HealthInsurancePlans = data);
      });
    }
    else {
      this._HealthInsurancePlanService.addHealthInsurancePlan(this.addHealthInsurancePlan).subscribe(data => {
        this.addHealthInsurancePlan = data;
        this._HealthInsurancePlanService.getHealthInsurancePlans().subscribe(data => this.HealthInsurancePlans = data);
      }); 
    }         
  }

  onEdit(HealthInsurancePlan){
    this.isEdit = true;
    this.healthInsurancePlanForm.patchValue(HealthInsurancePlan);
    console.log(HealthInsurancePlan);
    this.addHealthInsurancePlan = HealthInsurancePlan;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(HealthInsurancePlan) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Plan?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this._HealthInsurancePlanService.deleteHealthInsurancePlan(HealthInsurancePlan).subscribe(data => {
          this._HealthInsurancePlanService.getHealthInsurancePlans().subscribe(data => this.HealthInsurancePlans = data);
        }); 
      }
    });
    console.log(HealthInsurancePlan);  
  } 

  findValueByKey(key) {
    let status = '';
    if (this.statusArray) {
      this.statusArray.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}


