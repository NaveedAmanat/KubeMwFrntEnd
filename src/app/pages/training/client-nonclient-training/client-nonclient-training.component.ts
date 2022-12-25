import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/shared/services/training.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParticipantsComponent } from '../participants/participants.component';
import { ConsoleService } from '@ng-select/ng-select/ng-select/console.service';
import { Auth } from 'src/app/shared/models/Auth.model';
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
  selector: 'app-client-nonclient-training',
  templateUrl: './client-nonclient-training.component.html',
  styleUrls: ['./client-nonclient-training.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ClientNonclientTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  trainingAttendanceForm: FormGroup;
  totalTrainings: any = [];
  allTrainings: any = [];
  myForm: FormGroup;
  allTrainingTypes: any = [];
  dateRequired: boolean = false;
  allBranches: any;
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  totalTrainingTenure: any;
  activeTypes: any = [];
  staffPresent: boolean = false;
  expanded: boolean = false;
  isClient: boolean = false;
  isKSS = false;
  isKKK = false;
  isKEL = false;
  isKMWK = false;
  isALL = false;
  isAllNonClient = false;
  isNonClient: boolean = false;
  isBoth: boolean = false;
  isChecked: boolean = false;
  isCheckedStaff: boolean = false;

  data = {
    dateOfTraining: [
      {
        trng_dat: ""
      }
    ]
  }
  allTypesTraining: any[];
  allParticipants: any[];
  trainingDates: any;
  allStaffForAttendance: any[];
  allAttendacneForParticipants: any;
  trainingSequence: any;

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private trainingServivce: TrainingService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.allTypesTraining = [];
    this.allTrainings = [];
    this.allBranches = [];

    this.trainingForm = this.fb.group({
      trngTypeSeq: ['', Validators.required],
      trnrNm: ['', Validators.required],
      trngStsKey: ['', Validators.required],
      brnchSeq: ['', Validators.required],
      // trngDlyAtndReqFlag: ['', Validators.required],
      trng_dat: this.fb.array([]),
    });

    this.trainingAttendanceForm = this.fb.group({
      atndncFlg: [''],
      tengesAtndncSeq: [''],
      prtcpntStfSeq: [''],
      typFLg: [''],
      atndDt: ['']
    });

    let control = <FormArray>this.trainingForm.controls.trng_dat;
    control.push(
      this.fb.group({
        trng_dat: [],
      })
    )

    this.trainingServivce.getAllBrnches().subscribe(res => {
      this.allBranches = res;
    })

    this.trainingServivce.getAllTypesTraining().subscribe(res => {
      this.allTypesTraining = res;

      // for active types only
      this.activeTypes = this.allTypesTraining;
      for (var i = this.activeTypes.length - 1; i >= 0; --i) {
        if (this.activeTypes[i].trngStsKey == 2) {
          this.activeTypes.splice(i, 1);
        }
      }
    })

    this.trainingServivce.getAllTrainingTypes().subscribe(res => {
      this.allTrainingTypes = res;
      console.log(this.allTrainingTypes)
    })

    this.trainingServivce.getAllTrainings().subscribe(res => {
      this.allTrainings = res;
      console.log(this.allTrainings)
    })

  }

  totalDaysToAdd = 0;
  exactTenure: boolean = false;
  addNewDates(dat) {
    console.log(this.totalTrainingTenure)
    console.log(dat)

    let control = <FormArray>this.trainingForm.controls.trng_dat;
    this.totalDaysToAdd = control.length + 1;
    console.log(this.totalDaysToAdd)
    console.log(control.length)
    if (control.length < this.totalTrainingTenure) {
      control.push(
        this.fb.group({
          trng_dat: [dat],
        })
      )
    } else {
      this.toaster.error('Cannot Exceed From Tenure', 'ERROR')
    }

    this.dateRequired = !this.dateRequired;
  }

  deleteDates(index) {
    let control = <FormArray>this.trainingForm.controls.trng_dat;
    control.removeAt(index)
  }

  // getAttendanceFlag(trngDlyAtndReqFlag) {
  //   let str = '';
  //   if (trngDlyAtndReqFlag == 0) {
  //     str = "Yes"
  //   } else if (trngDlyAtndReqFlag == 1) {
  //     str = "No"
  //   }
  //   return str;
  // }

  setDates() {
    let control = <FormArray>this.trainingForm.controls.trng_dat;
    this.data.dateOfTraining.forEach(x => {
      control.push(this.fb.group({
        trng_dat: x.trng_dat
      }))
      console.log(x.trng_dat)
    })
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

  createFrom() {
    this.trainingForm = this.fb.group({
      trngTypeSeq: ['', Validators.required],
      trnrNm: ['', Validators.required],
      trngStsKey: ['', Validators.required],
      brnchSeq: ['', Validators.required],
      // trngDlyAtndReqFlag: ['', Validators.required],
      trng_dat: this.fb.array([]),
    });

    let control = <FormArray>this.trainingForm.controls.trng_dat;
    control.push(
      this.fb.group({
        trng_dat: [],
      })
    )
  }

  openTrianingModel() {
    this.totalDaysToAdd = 0;
    this.isEdit = false;
    this.trainingForm.reset();
    this.createFrom();
    this.trainingForm.get('trnrNm').setValue(this.auth.emp_name);
    console.log(this.trainingForm.value);
    (<any>$('#training')).modal('show');
  }

  trainingTypeDescription(trngTypeSeq) {
    let str = '';
    for (let i = 0; i < this.allTypesTraining.length; i++) {
      if (trngTypeSeq == this.allTypesTraining[i].trngTypeSeq) {
        str = this.allTypesTraining[i].trngType;
      }
    }
    return str;
  }

  gettingBracnchName(brnchSeq) {
    let str = '';
    for (let a = 0; a < this.allBranches.length; a++) {
      if (this.allBranches[a].brnchSeq == brnchSeq) {
        str = this.allBranches[a].brnchNm;
      }
    }
    return str;
  }


  gettingStatus(trngStsKey) {
    let str = '';
    if (trngStsKey == 0) {
      str = 'In Progress';
    } else if (trngStsKey == 1) {
      str = 'Completed';
    }
    return str;
  }

  isEdit: boolean = false;
  onEditTraining(train) {
    console.log(train);
    console.log(this.allTypesTraining);
    console.log(train.trngTypeSeq);

    this.allTypesTraining.forEach(ele => {
      if (ele.trngTypeSeq == train.trngTypeSeq) {
        console.log('if')
        console.log(ele)
        this.totalTrainingTenure = ele.trngTnur;
      };
    });
    console.log(this.totalTrainingTenure);
    this.trainingForm = this.fb.group({
      trngTypeSeq: [train.trngTypeSeq],
      trnrNm: [train.trnrNm],
      trngStsKey: [train.trngStsKey],
      brnchSeq: [train.brnchSeq],
      // trngDlyAtndReqFlag: [train.trngDlyAtndReqFlag],
      trng_dat: this.fb.array([]),
      trngSeq: [train.trngSeq]
    });
    var res = train.trng_dates.split(",");
    res.forEach(ele => {
      this.addNewDates(moment(ele, 'DD-MMM-YYYY'));
    })
    // this.totalDaysToAdd = this.trainingForm.value;
    console.log(this.trainingForm.value)
    this.isEdit = true;
    console.log(train);
    (<any>$('#training')).modal('show');
  }


  onDeleteTraining(train) {

    this.trainingServivce.getallParticipants(train.trngSeq).subscribe(res => {
      console.log(res.length)
      if (res.length > 0) {
        this.toaster.error("Training Contain Participants", "Cannot Delete");
        // return;
      } else {
        console.log(train.trngSeq)
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
            this.trainingServivce.deleteTraining(train.trngSeq).subscribe(ele => {
              this.allTrainings.splice(this.allTrainings.indexOf(train), 1)
              swal(
                'Deleted!',
                'Training Deleted Successfully.',
                'success'
              );
            });
          }
        });
      }
    })
  }

  onSelectionTypes(w) {
    console.log(w)
    console.log(this.allTrainingTypes)
    this.allTypesTraining.forEach(ele => {
      if (ele.trngTypeSeq == w.value) {
        this.totalTrainingTenure = ele.trngTnur
        console.log(this.totalTrainingTenure)
      }
    })
  }

  onSubmitTraining() {
    // for (let z = 0; z < this.allTrainings; z++) {
    //   for (let i = 0; i < this.allTypesTraining.length; i++) {
    //     console.log(i)
    //     console.log(z)
    //     if (this.allTrainings[z].trngTypeSeq == this.allTypesTraining[i].trngTypeSeq) {
    //       console.log('i am in if')
    //       console.log(this.allTypesTraining[i].trngTypeSeq)
    //       this.toaster.error('Cannot Assign Multiple Training Against This Trianing', 'ERROR')
    //       return;
    //     }
    //   }
    // }

    // for (let i = 0; i < this.allTrainings.length; i++) {
    //   if (this.trainingForm.controls['trngTypeSeq'].value == this.allTrainings[i].trngTypeSeq) {
    //     console.log(this.trainingForm.controls['trngTypeSeq'].value);
    //     (<any>$('#training')).modal('hide');
    //     this.toaster.error('Cannot Assign Multiple Training Against This Trianing', 'ERROR')
    //     return;
    //   }
    // }
    console.log(this.totalDaysToAdd)
    console.log(this.totalTrainingTenure)

    // if (this.totalDaysToAdd != this.totalTrainingTenure) {
    //   this.toaster.error("Please Add " + this.totalTrainingTenure + " Dates", "Error");
    //   return;
    // }

    if (!this.isEdit) {
      console.log(this.trainingForm.value);
      let a = this.trainingForm.value
      console.log(this.getFormatedDate(this.trainingForm.value.trng_dat))
      this.spinner.show();
      a.trng_dat = this.getFormatedDate(this.trainingForm.value.trng_dat)
      a.trngdscr = "desription";
      a.trngId = "id";
      this.trainingServivce.addTrainings(this.trainingForm.value).subscribe(res => {
        this.trainingServivce.getAllTrainings().subscribe(res => {
          this.allTrainings = res;
        })
        console.log(res);
        this.toaster.success("Training Added Successfully", "Success");
        (<any>$('#training')).modal('hide');
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    } else {
      console.log(this.trainingForm.value);
      let a = this.trainingForm.value
      console.log(this.getFormatedDate(this.trainingForm.value.trng_dat))
      this.spinner.show();
      a.trng_dat = this.getFormatedDate(this.trainingForm.value.trng_dat);
      console.log(a.trng_dat)
      a.trngdscr = "desription";
      a.trngId = "id";
      console.log(a);
      this.trainingServivce.editTrainings(a).subscribe(res => {
        this.trainingServivce.getAllTrainings().subscribe(res => {
          this.allTrainings = res;
        })
        console.log(res);
        (<any>$('#training')).modal('hide');
        this.toaster.success("Updated Successfully", "Success");
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }
  }

  getFormatedDate(arr) {
    let str = [];
    for (let i = 0; i < arr.length; i++) {
      console.log(moment.parseZone(arr[i].trng_dat.format('YYYY-MM-DD'))['_i']);
      let d = moment.parseZone(arr[i].trng_dat.format('YYYY-MM-DD'))['_i'];
      // str.push(moment.parseZone(arr[i].trng_dat.format('DD-MM-YYYY'))['_i']);
      str.push(d);
    }
    return str;
  }

  showParticipants(t) {
    console.log(t)
    sessionStorage.setItem("trng", JSON.stringify(t));
    this.router.navigate(['/training/participants']);
  }

  onClickAttendance(t) {
    console.log(t);
    this.trainingServivce.getallParticipantsWithDates(t.trngSeq).subscribe(res => {
      this.allParticipants = res;
      if (this.allParticipants.length == 0) {
        this.toaster.info("Please Add Participants", "Information");
      } else {
        sessionStorage.setItem("trng", JSON.stringify(t));
        this.router.navigate(['/training/training-attendance']);
      }
    });
  }

  openGESAreport(train) {
    this.spinner.show();
    console.log(train.trngSeq)
    this.trainingServivce.printGESAReport(train.trngSeq).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  openAICGReport(train) {
    this.spinner.show();
    console.log(train.trngSeq)
    this.trainingServivce.printAICGReport(train.trngSeq).subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }

  onClickAttendanceButton(train) {
    this.trainingSequence = train.trngSeq;
    this.isClient = false;
    this.isKSS = false;
    this.isKKK = false;
    this.isKEL = false;
    this.isKMWK = false;
    this.isALL = false;
    this.isAllNonClient = false;
    this.isNonClient = false;
    this.isBoth = false;


    this.allTypesTraining.forEach(ele => {
      if (train.trngTypeSeq == ele.trngTypeSeq) {
        if (ele.trngPrtcpntTypSeq == 0) {
          this.isClient = true;
        } else if (ele.trngPrtcpntTypSeq == 1) {
          this.isNonClient = true;
        } else if (ele.trngPrtcpntTypSeq == 2) {
          this.isBoth = true;
        }
      }
    })

    this.allTypesTraining.forEach(tr => {
      if (train.trngTypeSeq == tr.trngTypeSeq) {
        if (tr.trngClntCtgrtSeq == 1) {
          this.isKSS = true;
        } else if (tr.trngClntCtgrtSeq == 0) {
          this.isKKK = true;
        } else if (tr.trngClntCtgrtSeq == 2) {
          this.isKEL = true;
        } else if (tr.trngClntCtgrtSeq == 3) {
          this.isKMWK = true;
        } else if (tr.trngClntCtgrtSeq == 4) {
          this.isALL = true;
        } else if (tr.trngClntCtgrtSeq == 5) {
          this.isAllNonClient = true;
        }
      }
    });

    this.expanded = true;

    // Training Dates
    let str = train.trng_dates;
    this.trainingDates = str.split(',');
    console.log(this.trainingDates);

    let trainingDatesObjArray = [];

    this.trainingDates.forEach(dateEle => {
      trainingDatesObjArray.push({ date: dateEle, isChecked: false })
    });
    console.log(trainingDatesObjArray)
    // Attendacne Data
    this.trainingServivce.getallParticipantsWithDates(train.trngSeq).subscribe(res => {
      this.trainingServivce.getAllTrainingAttendance(train.trngSeq).subscribe(res2 => {
        this.allAttendacneForParticipants = res2;
        this.allParticipants = res;
        console.log(this.allAttendacneForParticipants);
        console.log(this.allParticipants);


        this.allParticipants.forEach(participant => {
          participant.trainingDates = trainingDatesObjArray;
          this.allAttendacneForParticipants.forEach(attendance => {
            if (attendance.prtcpntStfSeq == participant.prtcpntSeq) {
              participant.trainingDates.forEach(dateEle => {
                let dateString = attendance.atndDt;
                let dateObj = new Date(dateString);
                let momentObj = moment(dateObj);
                let momentString = momentObj.format('DD-MM-YY');

                let dateString2 = dateEle.dateEle;
                let momentObj2 = moment(dateString2);
                let momentString2 = momentObj2.format('DD-MM-YY');
                console.log(momentString + "  === " + momentString2)
                if (momentString == momentString2) {
                  console.log('i am insde dates')
                  console.log(attendance)
                  let str;
                  if (attendance.atndncFlg == 1) {
                    str = "present";
                    console.log('i am ' + ' ' + str)
                    dateEle.isChecked = true;
                  } else {
                    str = "Absent";
                    console.log('i am ' + ' ' + str);
                    dateEle.isChecked = false;
                  }
                  console.log(dateEle)
                }
              });
            }
          });
          console.log(this.allParticipants)
        });

        if (this.allParticipants.length > 0) {
          (<any>$('#attendanceModal')).modal('show');
        } else {
          this.toaster.info("Training Does Not Have Any Participants", "Information")
        }

      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong In Getting All Participants", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong In Getting Attendace List", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });



  }

  onStaffAttendance(part) {
    this.trainingServivce.getAllStaff(part.prtcpntSeq).subscribe(res => {
      this.allStaffForAttendance = res;

      this.allAttendacneForParticipants.forEach(attendance => {
        this.allStaffForAttendance.forEach(participantStaf => {
          this.trainingDates.forEach(dateEle => {


            let dateString = attendance.atndDt;
            let dateObj = new Date(dateString);
            let momentObj = moment(dateObj);
            let momentString = momentObj.format('DD-MM-YY');

            let dateString2 = dateEle;
            let momentObj2 = moment(dateString2);
            let momentString2 = momentObj2.format('DD-MM-YY')

            if (attendance.prtcpntStfSeq == participantStaf.prtcpntSeq && momentString == momentString2 && attendance.atndncFlg == 1) {
              console.log('Was Present')
              this.isCheckedStaff = true;
            } else {
              console.log('Was Abscent');
              this.isCheckedStaff = false;
            }
          });
        });
      });
    });

  }

  onSelectChangePart(event: MatCheckboxChange, part, item, i) {
    this.isChecked = false;

    let str;
    if (event.checked == true) {
      str = 1;
    } else if (event.checked == false) {
      str = 0;
    }

    let obj = this.trainingAttendanceForm.value;
    obj.atndncFlg = str;
    obj.tengesAtndncSeq = "";
    obj.prtcpntStfSeq = part.prtcpntSeq;
    obj.typFLg = 1;
    let d = moment(item);
    obj.atndDt = moment.parseZone(d.format('YYYY-MM-DD'))['_i'];
    this.spinner.show();
    this.trainingServivce.addTrainingForPartAndStaff(obj).subscribe(res => {
      this.spinner.hide();
      this.toaster.success('Attendance Saved', 'Success')
      console.log(res);
    }, (error) => {
      this.isChecked = false;
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        console.log(error.error.title)
        this.toaster.error(error.error.title, "Error")
      }
    });

  }

  onSelectChangeStaff(event: MatCheckboxChange, staf, item, k) {
    this.isCheckedStaff = false;

    let str;
    if (event.checked == true) {
      str = 1;
    } else if (event.checked == false) {
      str = 0;
    }

    let obj = this.trainingAttendanceForm.value;
    obj.atndncFlg = str;
    obj.tengesAtndncSeq = "";
    obj.prtcpntStfSeq = staf.prtcpntStfSeq;
    obj.typFLg = 2;
    let d = moment(item);
    obj.atndDt = moment.parseZone(d.format('YYYY-MM-DD'))['_i'];
    this.spinner.show();
    this.trainingServivce.addTrainingForPartAndStaff(obj).subscribe(res => {
      this.spinner.hide();
      this.toaster.success('Saved', 'Success')
      console.log(res);
    }, (error) => {
      this.isCheckedStaff = false;
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        console.log(error.error.title)
        this.toaster.error(error.error.title, "Error")
      }
    });

  }

  onSubmitAttendacneParticipants() {
    console.log(this.trainingAttendanceForm.value);
  }
}
