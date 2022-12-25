import { Component, OnInit } from '@angular/core';
import { BusinessSectorService } from '../../../shared/services/business-sector.service';
import { CommonService } from '../../../shared/services/common.service';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import swal from 'sweetalert2';
import { BusinessSector } from '../../../shared/models/business-sector.model';

@Component({
  selector: 'app-business-sector',
  templateUrl: './business-sector.component.html',
  styleUrls: ['./business-sector.component.css']
})
export class BusinessSectorComponent implements OnInit {

  public businessSectorForm: FormGroup;
  submitted = false;

  statusArray : any[];
  public businessSectors: BusinessSector[];
  public addBusinessSector: BusinessSector = new BusinessSector();
  public isEdit: Boolean = false;
  constructor(private formBuilder: FormBuilder,private businessSectorService: BusinessSectorService, private commonService: CommonService) {
   }

   ngOnInit() {

    this.businessSectorForm = this.formBuilder.group({  
      bizSectNm: ['', Validators.required],
      bizSectStsKey: ['', Validators.required],
      bizSectSortOrdr: ['', Validators.required],
  });

    this.commonService.getValuesByGroupName('\tSTATUS').subscribe(
      d => this.statusArray = d
    );   
    this.businessSectorService.getBusinessSectors().subscribe(data => this.businessSectors = data);
  }

  get form() 
  { 
    return this.businessSectorForm.controls; 
  }

  onClick(key)
  {
    sessionStorage.setItem('bizSectSeq', JSON.stringify(key));
  }
  
  onAddNewClick() {
    this.isEdit = false;
    this.businessSectorForm.reset();
    this.addBusinessSector = new BusinessSector();
    (<any>$('#businessector')).modal('show');
  }
  
  addBusinessSectorSubmit(){
    this.submitted = true;
    if (this.businessSectorForm.invalid) {
        return;
    }

    this.addBusinessSector.bizSectNm= this.businessSectorForm.value.bizSectNm;
    this.addBusinessSector.bizSectStsKey= this.businessSectorForm.value.bizSectStsKey;
    this.addBusinessSector.bizSectSortOrdr= this.businessSectorForm.value.bizSectSortOrdr;

    (<any>$('#businessector')).modal('hide');
    console.log(this.addBusinessSector);
    if(this.isEdit) {
      this.businessSectorService.updateBusinessSector(this.addBusinessSector).subscribe(data => {
        this.addBusinessSector = data;
        this.businessSectorService.getBusinessSectors().subscribe(data => this.businessSectors = data);
      });
    }
    else {
      this.businessSectorService.addBusinessSector(this.addBusinessSector).subscribe(data => {
        this.addBusinessSector = data;
        this.businessSectorService.getBusinessSectors().subscribe(data => this.businessSectors = data);
      }); 
    }         
  }

  onEdit(businessSector){
    this.isEdit = true;
    this.businessSectorForm.patchValue(businessSector);
    console.log(businessSector);
    this.addBusinessSector = businessSector;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(businessSector) { 
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this BusinessSector?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.businessSectorService.deleteBusinessSector(businessSector).subscribe(data => {
          this.businessSectorService.getBusinessSectors().subscribe(data => this.businessSectors = data);
        }); 
      }
    });
    console.log(businessSector);  
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


