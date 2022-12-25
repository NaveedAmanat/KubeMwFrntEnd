import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/shared/services/training.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParticipantsComponent } from '../participants/participants.component';
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
  selector: 'app-training-types',
  templateUrl: './training-types.component.html',
  styleUrls: ['./training-types.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TrainingTypesComponent implements OnInit {
  trainingTypesFrom: FormGroup;
  allTypesTraining: any;
  allTrainingTypes: any = [];
  isTrainingNonClient: boolean = false;
  shouldNotBeNonClientForBoth: boolean = false;

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private trainingServivce: TrainingService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.trainingTypesFrom = this.fb.group({
      trngTyp: ['', Validators.required],
      trngTnur: ['', Validators.required],
      trngClntCtgrySeq: ['', Validators.required],
      trngDueAftrDys: ['', Validators.required],
      trngStsKey: ['', Validators.required],
      trngPrtcpntTypSeq: ['', Validators.required],
      trngTypeCmnt: ['', Validators.required],
      trngLfeCycl: ['', Validators.required],
      // trngDlyAtndReqFlag: ['', Validators.required],
    })

    this.trainingServivce.getAllTypesTraining().subscribe(res => {
      this.allTypesTraining = res;
      console.log(this.allTypesTraining)
    })


  }


  get trainingTypesFormsControl() {
    return this.trainingTypesFrom.controls;
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openTrainingTypesModel() {
    this.trainingTypesFrom.clearValidators();
    this.trainingTypesFrom.reset();
    this.trainingTypesFrom.get('trngTyp').enable();
    this.isEdit = false;
    (<any>$('#trainingTypes')).modal('show');
  }

  isEdit: boolean = false;
  onEditTrainingType(train) {
    console.log(train.dailyAttendFlag)
    this.isEdit = true;
    (<any>$('#trainingTypes')).modal('show');
    this.trainingTypesFrom = this.fb.group({
      // trngTyp: [{ value: train.trngType, readonly: true }],
      trngTyp: [{ value: train.trngType, disabled: true }],
      trngTypeSeq: [train.trngTypeSeq],
      trngTnur: [train.trngTnur, Validators.required],
      trngClntCtgrySeq: [train.trngClntCtgrtSeq],
      trngPrtcpntTypSeq: [train.trngPrtcpntTypSeq],
      trngDueAftrDys: [train.trngDueAftrDys],
      trngStsKey: [train.trngStsKey],
      trngTypeCmnt: [train.trngTypeCmnt],
      trngLfeCycl: [train.trngLfCycl],
      // trngDlyAtndReqFlag: [train.dailyAttendFlag],
    })
    console.log(train)
    console.log(this.trainingTypesFrom)
  }

  trainingTypes(trngType) {
    let str = '';
    this.allTrainingTypes.forEach(ele => {
      if (ele.refCdSeq == trngType) {
        str = ele.refCdDscr;
      }
    })
    return str;
  }

  participantsTypes(trngPrtcpntTypSeq) {
    let str = '';
    if (trngPrtcpntTypSeq == 0) {
      str = 'All Clients';
    } else if (trngPrtcpntTypSeq == 1) {
      str = 'Non-Clients';
    } else if (trngPrtcpntTypSeq == 2) {
      str = 'Both';
    }
    return str;
  }

  trainingLifeCycle(trngLfCycl) {
    let str = '';
    if (trngLfCycl == false) {
      str = 'Once in Tenure with Kashf';
    } else if (trngLfCycl == true) {
      str = 'Once Every Loan Cycle';
    } else {
      str = '-';
    }
    return str;
  }

  trainingTenure(trngTnur) {
    let str = '';
    if (trngTnur == 0) {
      str = 'Single Day';
    } else if (trngTnur == 1) {
      str = 'Multiple Days';
    }
    return str;
  }

  trainingStatus(trngStsKey) {
    let str = '';
    if (trngStsKey == 1) {
      str = 'Active';
    } else if (trngStsKey == 2) {
      str = 'In Active';
    }
    return str;
  }

  clientCategory(trngClntCtgrtSeq) {
    let str = '';
    if (trngClntCtgrtSeq == 0) {
      str = 'KKK Clients Only'
    } else if (trngClntCtgrtSeq == 1) {
      str = 'KSS Clients Only';
    } else if (trngClntCtgrtSeq == 2) {
      str = 'KEL Clients Only';
    } else if (trngClntCtgrtSeq == 3) {
      str = 'KMWK Clients Only';
    } else if (trngClntCtgrtSeq == 4) {
      str = 'All Clients';
    } else if (trngClntCtgrtSeq == 5) {
      str = 'All Non Clients';
    }
    return str;
  }

  attendacneRequest(dailyAttendFlag) {
    let str = '';
    if (dailyAttendFlag == 0) {
      str = 'Yes'
    } else if (dailyAttendFlag == 1) {
      str = 'No';
    }
    return str;
  }

  trainingDueDays(trngDueAftrDys) {
    let str = '';
    if (trngDueAftrDys == 30) {
      str = '30 Days After DD'
    } else if (trngDueAftrDys == 60) {
      str = '60 Days After DD';
    } else if (trngDueAftrDys == 90) {
      str = '90 Days After DD';
    } else if (trngDueAftrDys == 120) {
      str = '120 Days After DD'
    } else if (trngDueAftrDys == 150) {
      str = '150 Days After DD'
    } else if (trngDueAftrDys == 180) {
      str = '180 Days After DD'
    }
    return str;
  }

  consecutiveTraining(trngIsConsFlag) {
    let str = '';
    if (trngIsConsFlag == 0) {
      str = 'Yes'
    } else if (trngIsConsFlag == 1) {
      str = 'No';
    }
    return str;
  }

  onSelectionParticipantsTypes(e) {
    console.log(e)
    if (e.value == 1) {
      this.trainingTypesFrom.controls['trngClntCtgrySeq'].setValue(5);
      this.isTrainingNonClient = true;
      this.shouldNotBeNonClientForBoth = false;
    } else if (e.value == 2 || e.value == 0) {
      this.trainingTypesFrom.controls['trngClntCtgrySeq'].reset();
      this.shouldNotBeNonClientForBoth = true;
      this.isTrainingNonClient = false;
    } else {
      this.trainingTypesFrom.controls['trngClntCtgrySeq'].reset();
      this.isTrainingNonClient = false;
      this.shouldNotBeNonClientForBoth = false;
    }
  }

  isClientCategoryNonClient: boolean = false;
  onSelectionClientsTypes(e) {
    console.log(e)
    if (e.value == 5) {
      this.trainingTypesFrom.controls['trngPrtcpntTypSeq'].setValue(1);
      this.isClientCategoryNonClient = true;
    } else {
      this.isClientCategoryNonClient = false;
    }
  }

  onDeleteTrainingType(train) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Training?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.trainingServivce.deleteTrainigTypes(train.trngTypeSeq).subscribe(res => {
          this.allTypesTraining.splice(this.allTypesTraining.indexOf(train), 1);
          swal(
            'Deleted!',
            'Training Deleted Successfully.',
            'success'
          );

        })
      }
    });
  }

  onSubmitTrainingTypes() {
    this.spinner.show();
    if (!this.isEdit) {
      for (let i = 0; i < this.allTypesTraining.length; i++) {
        if (this.trainingTypesFrom.controls['trngTyp'].value == this.allTypesTraining[i].trngType) {
          console.log(this.allTypesTraining[i].trngType);
          (<any>$('#trainingTypes')).modal('hide');
          this.spinner.hide();
          this.toaster.error('Training Type Already Exist', 'ERROR')
          return;
        }
      }
      this.trainingServivce.addTrainingTypes(this.trainingTypesFrom.getRawValue()).subscribe(res => {
        this.spinner.hide();
        this.allTypesTraining.push(res);
        console.log(res);
        this.toaster.success("Training Types Added", "Success");
        (<any>$('#trainingTypes')).modal('hide');
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    } else {
      // for (let i = 0; i < this.allTypesTraining.length; i++) {
      //   if (this.trainingTypesFrom.controls['trngTyp'].value !== this.allTypesTraining[i].trngType) {
      //     console.log(this.allTypesTraining[i].trngType);
      //     (<any>$('#trainingTypes')).modal('hide');
      //     this.spinner.hide();
      //     this.toaster.error('Cannot Change The Name Of Training Type', 'ERROR')
      //     return;
      //   }
      // }
      this.trainingTypesFrom.get('trngTyp').disable();
      this.trainingServivce.editTrainigTypes(this.trainingTypesFrom.getRawValue()).subscribe(res => {
        this.toaster.success("Training Type Edited", "Success")
        this.spinner.hide();
        this.isEdit = false;
        this.trainingServivce.getAllTypesTraining().subscribe(res => {
          this.allTypesTraining = res;
        }, (error) => {
          this.spinner.hide();
          if (error.status == 500) {
            this.isEdit = false;
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
        (<any>$('#trainingTypes')).modal('hide');
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.isEdit = false;
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
  }

}
