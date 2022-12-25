import { Component, OnInit } from '@angular/core';
import { BusinessActivityService } from '../../../shared/services/business-activity.service';
import { CommonService } from '../../../shared/services/common.service';
import { BusinessActivity } from '../../../shared/models/business-activity.model';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-business-activity',
  templateUrl: './business-activity.component.html',
  styleUrls: ['./business-activity.component.css']
})
export class BusinessActivityComponent implements OnInit {

  public businessActivityForm: FormGroup;
  submitted = false;

  statusArray : any[];
  public businessActivities: BusinessActivity[];
  public addBusinessActivity: BusinessActivity = new BusinessActivity();
  public isEdit: Boolean = false;
  constructor(private formBuilder: FormBuilder,private businessActivityService: BusinessActivityService, private commonService: CommonService) {
   }

   ngOnInit() {

    this.businessActivityForm = this.formBuilder.group({  
      bizActyNm: ['', Validators.required],
      bizActyStsKey: ['', Validators.required],
      bizActySortOrdr: ['', Validators.required],
      });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );   
    this.businessActivityService.getBusinessActivities(sessionStorage.getItem('bizSectSeq')).subscribe(data => this.businessActivities = data);
  }

  get form() 
  { 
    return this.businessActivityForm.controls; 
  }

  onAddNewClick() {
    this.isEdit = false;
    this.businessActivityForm.reset();
    this.addBusinessActivity = new BusinessActivity();
    (<any>$('#businessector')).modal('show');
  }
  
  addBusinessActivitySubmit(){
    this.submitted = true;
    if (this.businessActivityForm.invalid) {
        return;
    }

    this.addBusinessActivity.bizActyNm= this.businessActivityForm.value.bizActyNm;
    this.addBusinessActivity.bizActyStsKey= this.businessActivityForm.value.bizActyStsKey;
    this.addBusinessActivity.bizActySortOrdr= this.businessActivityForm.value.bizActySortOrdr;
    this.addBusinessActivity.bizSectSeq= parseInt(sessionStorage.getItem('bizSectSeq'));

    (<any>$('#businessector')).modal('hide');
    console.log(this.addBusinessActivity);
    if(this.isEdit) {
      this.businessActivityService.updateBusinessActivity(this.addBusinessActivity).subscribe(data => {
        this.addBusinessActivity = data;
        this.businessActivityService.getBusinessActivities(sessionStorage.getItem('bizSectSeq')).subscribe(data => this.businessActivities = data);
      });
    }
    else {
      this.businessActivityService.addBusinessActivity(this.addBusinessActivity).subscribe(data => {
        this.addBusinessActivity = data;
        this.businessActivityService.getBusinessActivities(sessionStorage.getItem('bizSectSeq')).subscribe(data => this.businessActivities = data);
      }); 
    }         
  }

  onEdit(businessActivity){
    this.isEdit = true;
    this.businessActivityForm.patchValue(businessActivity);
    console.log(businessActivity);
    this.addBusinessActivity = businessActivity;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(businessActivity) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Business Activity?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.businessActivityService.deleteBusinessActivity(businessActivity).subscribe(data => {
          this.businessActivityService.getBusinessActivities(sessionStorage.getItem('bizSectSeq')).subscribe(data => this.businessActivities = data);
        }); 
      }
    });
    console.log(businessActivity);  
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

}


