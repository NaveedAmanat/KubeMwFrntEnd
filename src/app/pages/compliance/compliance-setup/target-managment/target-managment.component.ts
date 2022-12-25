import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Region } from 'src/app/shared/models/region.model';
import { Area } from 'src/app/shared/models/area.model';

@Component({
  selector: 'app-target-managment',
  templateUrl: './target-managment.component.html',
  styleUrls: ['./target-managment.component.css']
})
export class TargetManagmentComponent implements OnInit {

  yearSpan: string[] = [
    // '2018',
    // '2019',
    // '2020',
    // '2021'
  ]
  d = new Date();

  complianceBranchForm: FormGroup;
  allTargetManagment: any;
  updatedTargetManagment: any;
  addButton: boolean = false;
  branchs: Branch[];
  regions: Region[];
  areas: Area[];
  filteredBranches: Branch[];
  filteredAreas: Area[];
  visitType = [{ seq: 1, desc: "Regular" }, { seq: 2, desc: "Floor" }, { seq: 3, desc: "ADC" }]
  yearValue: any;

  constructor(private fb: FormBuilder, private complianceService: ComplianceService,
    private toaster: ToastrService, private transfersService: TransfersService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.complianceBranchForm = this.fb.group({
      trgt: ['', Validators.required],
      brnchSeq: ['', Validators.required],
      areaSeq: ['', Validators.required],
      regSeq: ['', Validators.required],
      trgtYr: [''],
      adtTrgtSeq: [''],
      adtFlg: ['']
    });

    let i;
    for (i = this.d.getFullYear() + 2; i > this.d.getFullYear() - 3; i--) {
      this.yearSpan.push(i);
    }


    this.transfersService.getRegions().subscribe(d => {
      console.log(d)
      this.regions = d;
    });


    this.transfersService.getAreas().subscribe(d => {
      console.log(d)
      this.areas = d;
    });

    this.transfersService.getBranches().subscribe(d => {
      console.log(d)
      this.branchs = d;
    });
  }

  onRegionSelect(regSeq) {
    if (regSeq == undefined || regSeq ==null) {
      this.filteredAreas = [];
      return;
    }
   
    let count = 0;
    this.filteredAreas = [];

    this.areas.forEach(area => {
      if (area.regSeq == regSeq) {
        this.filteredAreas[count] = area;
        count++;
      }
    })
  }

  onAreaSelect(areaSeq) {
    if (areaSeq == undefined || areaSeq == null) {
      this.filteredBranches = [];
      return;
    }
   
    let count = 0;
    this.filteredBranches = [];

    this.branchs.forEach(branch => {
      if (branch.areaSeq == areaSeq) {
        this.filteredBranches[count] = branch;
        count++;
      }
    })
  }



  findVisitType(seq) {
    let visitType = "";
    this.visitType.forEach(ele => {
      if (ele.seq == seq) {
        visitType = ele.desc;
      }
    })
    return visitType;
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSelectionTargetManagmentPeriods(e) {
    console.log(e)
    this.addButton = true;
    this.spinner.show();
    this.complianceService.getTargetManagment(e.value).subscribe(res => {
      this.allTargetManagment = res;
      this.spinner.hide();
      this.addButton = true;
      console.log(this.allTargetManagment.length)
      if (this.allTargetManagment.length == 0) {
        this.toaster.warning('No Data Found Please Add Target', "Information");

      }
      this.complianceBranchForm.get('trgtYr').setValue(e.value);
      this.yearValue = e.value;
    }, (error) => {
      this.addButton = false;
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 404) {
        this.toaster.error("404", "Error")
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  branchName(brnchSeq) {
    let str = '';
    for (let i = 0; i < this.branchs.length; i++) {
      if (brnchSeq == this.branchs[i].brnchSeq) {
        str = this.branchs[i].brnchNm;
      }
    }
    return str;
  }

  regionName(regSeq) {
    let str = '';
    for (let i = 0; i < this.regions.length; i++) {
      if (regSeq == this.regions[i].regSeq) {
        str = this.regions[i].regNm;
      }
    }
    return str;
  }

  areaName(areaSeq) {
    let str = '';
    for (let i = 0; i < this.areas.length; i++) {
      if (areaSeq == this.areas[i].areaSeq) {
        str = this.areas[i].areaNm;
      }
    }
    return str;
  }


  openAddBranch() {
    this.complianceBranchForm.reset();
    this.complianceBranchForm.controls['trgtYr'].setValue(this.yearValue);
    (<any>$('#addTargetManagment')).modal('show');
  }



  onEditTargetManagment(branch) {
    (<any>$('#addTargetManagment')).modal('show');
    this.complianceBranchForm = this.fb.group({
      trgt: [branch.trgt, Validators.required],
      brnchSeq: [branch.brnchSeq],
      regSeq: [branch.regSeq],
      areaSeq: [branch.areaSeq],
      trgtYr: [branch.trgtYr],
      adtTrgtSeq: [branch.adtTrgtSeq],
      adtFlg: [branch.vstTyp]
    });
    console.log(this.complianceBranchForm.value)
    this.onRegionSelect(branch.regSeq);
    this.onAreaSelect(branch.areaSeq);
  }



  onDeleteTargetManagment(branch) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Target?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        console.log(branch.adtTrgtSeq);
        this.complianceService.deleteTargetManagment(branch.adtTrgtSeq).subscribe(data => {
          console.log(this.allTargetManagment)
          this.allTargetManagment.splice(this.allTargetManagment.indexOf(branch), 1);
          swal(
            'Deleted!',
            'Target Deleted Successfully.',
            'success'
          );
        });
      }
    });
  }



  onSubmitComplianceBranchVisitForm() {
    console.log(this.allTargetManagment)
    console.log(this.complianceBranchForm.controls['adtTrgtSeq'].value)
    for (let i = 0; i < this.allTargetManagment.length; i++) {
      if(this.complianceBranchForm.controls['adtTrgtSeq'].value == this.allTargetManagment[i].adtTrgtSeq)continue;
      for (let a = 0; a < this.branchs.length; a++) {
        if (
          this.complianceBranchForm.controls['adtFlg'].value == this.allTargetManagment[i].vstTyp &&
          this.complianceBranchForm.controls['brnchSeq'].value == this.allTargetManagment[i].brnchSeq &&
          this.complianceBranchForm.controls['trgtYr'].value == this.allTargetManagment[i].trgtYr
        ) {
          this.toaster.error('Cannot Add With Same Target Type With This Branch', "Error");
          return;
        }
      }
    }
    this.spinner.show();
    this.complianceService.postingTargetManagment(this.complianceBranchForm.value).subscribe(res => {
      this.spinner.hide();
      this.toaster.success('Saved', "Success");
      this.complianceService.getTargetManagment(this.complianceBranchForm.controls['trgtYr'].value).subscribe(res => {
        this.allTargetManagment = res;
        this.complianceBranchForm.controls['trgt'].reset();
      });
      (<any>$('#addTargetManagment')).modal('hide');
    }, (error) => {
      this.addButton = false;
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 404) {
        this.toaster.error("404", "Error")
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

}
