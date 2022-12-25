import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from 'src/app/shared/services/training.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import * as REF_CD_GRP_KEYS from '../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import swal from 'sweetalert2';
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
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  addParticipantsForm: FormGroup;
  addNonClientParticipantsForm: FormGroup;
  addKssClientsParticipantsForm: FormGroup;
  kssTeacherForm: FormGroup;
  checkClientForm: FormGroup;
  dateRequired: boolean = false;
  totalParticipants: any = [];
  allTrainingTypes: any = [];
  allTrainingTypeBySeq: any = [];
  clientValidation: any = [];
  trainingSequence: any;
  trngTypeSeq: number;
  trng = JSON.parse(sessionStorage.getItem("trng"));
  productSequence;

  data = {
    dateOfTraining: [
      {
        training_date: ""
      }
    ]
  }
  recieveSpecificTraining: any;
  trngSeq: number;
  allParticipants: any[] = [];
  gender: any[];
  isNonClient: boolean = false;
  isClient: boolean = false;
  isBoth: boolean = false;
  relationshipClient: any[];
  address: FormArray;
  allStaffForTraining: any[];
  participantSequence: any;

  constructor(private fb: FormBuilder,
    private trainingServivce: TrainingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: ActivatedRoute,
    private commonService: CommonService,
  ) {

  }
  allTypesTraining = [];
  isKSS = false;
  isKKK = false;
  isKEL = false;
  isKMWK = false;
  isALL = false;
  isAllNonClient = false;
  completedTraining: boolean = false;
  ngOnInit() {
    this.addParticipantsForm = this.fb.group({
      trngSeq: [this.trng.trngSeq],
      prtcpntCnicNum: [{ value: '', disabled: false }, Validators.required],
      prtcpntNm: ['', Validators.required],
      prtcpntGndrKey: ['', Validators.required],
      prtcpnrRelKey: [''],
      loanCyclNum: ['', Validators.required],
      dsbmtDt: ['', Validators.required],
      prdSeq: ['']
    })

    this.addNonClientParticipantsForm = this.fb.group({
      trngSeq: [this.trng.trngSeq],
      // prtcpntCnicNum: [{ value: '', disabled: false }, Validators.required],
      prtcpntCnicNum: ['', Validators.required],
      prtcpntNm: ['', Validators.required],
      prtcpntGndrKey: ['', Validators.required],
      prtcpnrRelKey: [''],
    })

    this.addKssClientsParticipantsForm = this.fb.group({
      trngSeq: [this.trng.trngSeq],
      prtcpntCnicNum: ['', Validators.required],
      prtcpntNm: ['', Validators.required],
      prtcpntGndrKey: ['', Validators.required],
      prtcpnrRelKey: [''],
      dsbmtDt: ['', Validators.required],
      schNm: ['', Validators.required],
      tchrNm: ['', Validators.required],
      totStdnt: ['', Validators.required],
      prdSeq: ['']
    })

    this.kssTeacherForm = this.fb.group({
      address: this.fb.array([])
    })

    this.trainingServivce.getAllTypesTraining().subscribe(res => {
      this.allTypesTraining = res;
      console.log(this.allTypesTraining);
      console.log(this.trng)
      this.allTypesTraining.forEach(ele => {
        if (ele.trngTypeSeq == this.trng.trngTypeSeq) {
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
        if (tr.trngTypeSeq == this.trng.trngTypeSeq) {
          console.log(tr.trngClntCtgrtSeq)
          console.log(tr.trngPrtcpntTypSeq)
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
      })
    })


    this.checkClientForm = this.fb.group({
      nomCnic: ['', Validators.required]
    })

    this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
      this.gender = res;
      console.log(this.gender)
    })

    this.commonService.getValues(REF_CD_GRP_KEYS.RELATION_WITH_PARTICIPANTS).subscribe((res) => {
      console.log(REF_CD_GRP_KEYS.RELATION_WITH_PARTICIPANTS)
      this.relationshipClient = res;
      console.log(this.relationshipClient)
    })

    this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
      this.allParticipants = res;
      console.log(this.allParticipants)
    });

    // if (this.trng.trngStsKey == 1) {
    //   this.completedTraining = true;
    // } else {

    // }

    this.trng.trngStsKey == 1 ? this.completedTraining = false: this.completedTraining = true;
  }

  getGender(prtcpntGndrKey) {
    let str = "";
    if (prtcpntGndrKey == 19) {
      str = 'Female';
    } else if (prtcpntGndrKey == 18) {
      str = 'Male'
    } else if (prtcpntGndrKey == 20) {
      str = 'Transgender'
    } return str;
  }

  loanCycleForNonClients(loanCyclNum) {
    let str: any;
    if (loanCyclNum == null) {
      str = "-";
    } else if (loanCyclNum != null) {
      str = loanCyclNum;
    }
    return str;
  }

  disbursmentDateForNonClients(dsbmtDt) {
    let str: any;
    if (dsbmtDt == null) {
      str = '';
    } else if (dsbmtDt != null) {
      str = dsbmtDt;
    }
    return str;
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

  onAddButton() {
    // this.isEdit = false;
    this.checkClientForm.reset();
    this.addNonClientParticipantsForm.reset();
    this.addNonClientParticipantsForm.clearValidators();
    (<any>$('#addNonClientParticipants')).modal('show');
    console.log(this.trng.trngSeq)
    // console.log(this.addParticipantsForm.controls['trngSeq'].patchValue(this.trng.trngSeq));
    // this.addParticipantsForm.controls['trngSeq'].setValue(this.trng.trngSeq)
    this.isEdit = false;
  }

  onAddStaff(part) {
    this.kssTeacherForm.setControl('address', new FormArray([]));
    this.participantSequence = part.prtcpntSeq;
    console.log(this.participantSequence)
    this.trainingServivce.getAllStaff(this.participantSequence).subscribe(res => {
      this.allStaffForTraining = res;
      console.log(this.allStaffForTraining);
      if (this.allStaffForTraining.length > 0) {
        this.allStaffForTraining.forEach(element => {
          console.log(element);
          (this.kssTeacherForm.controls['address'] as FormArray).push(this.fb.group({
            prtcpntStfSeq: [element.prtcpntStfSeq],
            prtcpntSeq: [element.prtcpntSeq],
            stfNm: [element.stfNm],
            stfCntct: [element.stfCntct],
            stfTypKey: [element.stfTypKey],
          }))
        });

      } else {
        this.kssTeacherForm = this.fb.group({
          address: this.fb.array([this.addingAddress()])
        })

      }
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        this.toaster.error(error.error.error)
      }
    });
    (<any>$('#addTeaceherForKSS')).modal('show');
  }

  addNewAddressGroup() {
    const add = this.kssTeacherForm.get('address') as FormArray;
    add.push(this.fb.group({
      prtcpntStfSeq: [''],
      prtcpntSeq: [this.participantSequence],
      stfNm: ['', Validators.required],
      stfCntct: ['', Validators.required],
      stfTypKey: ['', Validators.required],
    }))
  }

  deleteAddressGroup(i: number) {
    const add = <FormArray>this.kssTeacherForm.controls['address'];
    console.log(add)
    console.log(i)
    add.removeAt(i)
  }

  addingAddress() {
    console.log(this.participantSequence)
    return this.fb.group({
      prtcpntStfSeq: [''],
      prtcpntSeq: [this.participantSequence],
      stfNm: ['', Validators.required],
      stfCntct: ['', Validators.required],
      stfTypKey: ['', Validators.required],
    })
  }

  onSubmitTeachersForm() {
    console.log(this.participantSequence)
    let someAddresses = this.kssTeacherForm.get('address').value;
    console.log(someAddresses)
    this.trainingServivce.addStaffForParticipants(someAddresses).subscribe(res => {
      console.log(res)
      this.toaster.success('Staff Saved', 'Success')
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        this.toaster.error(error.error.error)
      }
    });
    (<any>$('#addTeaceherForKSS')).modal('hide');
  }

  onCheckCnicButton() {
    this.isEdit = false;
    this.checkClientForm.reset();
    (<any>$('#checkClient')).modal('show');
  }

  isEdit: boolean = false;
  onEditParticipants(part) {
    console.log(part)
    console.log(part.prtcpntTRelKey)
    console.log(this.isNonClient)
    if (this.isAllNonClient && this.isNonClient) {
      console.log('5');
      console.log('this,gnasobfkj');
      this.addNonClientParticipantsForm = this.fb.group({
        prtcpntSeq: [part.prtcpntSeq],
        prdSeq: [part.prdSeq],
        trngSeq: [this.trng.trngSeq],
        prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
        prtcpntNm: [part.prtcpntNm],
        prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
        prtcpnrRelKey: [{ value: part.prtcpntTRelKey, disabled: true }],
      });
      (<any>$('#addNonClientParticipants')).modal('show');
      this.isEdit = true;
      // } else if (this.isKSS && this.isClient) {
      //   (<any>$('#addKssParticipants')).modal('show');
      //   this.addKssClientsParticipantsForm = this.fb.group({
      //     prtcpntSeq: [part.prtcpntSeq],
      //     trngSeq: [this.trng.trngSeq],
      //     prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
      //     prtcpntNm: [{ value: part.prtcpntNm, disabled: true }],
      //     prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
      //     prtcpnrRelKey: [''],
      //     loanCyclNum: [{ value: part.loanCyclNum, disabled: true }],
      //     dsbmtDt: [{ value: part.dsbmtDt, disabled: true }],
      //     schNm: [{ value: part.otherDetails, disabled: true }],
      //     tchrNm: ['', Validators.required],
      //     totStdnt: ['', Validators.required],
      //   })
      //   this.isEdit = true;
      // } else if (this.isClient && ) {
    } else if (part.dsbmtDt != null && part.loanCyclNum != null && this.isKSS) {
      console.log('4');
      (<any>$('#addKssParticipants')).modal('show');
      this.addKssClientsParticipantsForm = this.fb.group({
        prtcpntSeq: [part.prtcpntSeq],
        trngSeq: [this.trng.trngSeq],
        prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
        prtcpntNm: [{ value: part.prtcpntNm, disabled: true }],
        prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
        prtcpnrRelKey: [''],
        loanCyclNum: [{ value: part.loanCyclNum, disabled: true }],
        dsbmtDt: [{ value: part.dsbmtDt, disabled: true }],
        schNm: [{ value: part.otherDetails, disabled: true }],
        tchrNm: [part.tchrNm],
        totStdnt: [part.totStdnt],
        prdSeq: this.productSequence
      })
      this.isEdit = true;
    } else if (part.dsbmtDt != null && part.loanCyclNum != null && !this.isKSS) {
      console.log('3');
      (<any>$('#addParticipants')).modal('show');
      this.addParticipantsForm = this.fb.group({
        prdSeq: [part.prdSeq],
        prtcpntSeq: [part.prtcpntSeq],
        trngSeq: [this.trng.trngSeq],
        prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
        prtcpntNm: [{ value: part.prtcpntNm, disabled: true }],
        prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
        prtcpnrRelKey: [''],
        loanCyclNum: [{ value: part.loanCyclNum, disabled: true }],
        dsbmtDt: [{ value: part.dsbmtDt, disabled: true }],
      })
      this.isEdit = true;
    } else if (part.dsbmtDt == null && part.loanCyclNum == null && this.isKSS) {
      console.log('2');
      (<any>$('#addNonClientParticipants')).modal('show');
      this.addNonClientParticipantsForm = this.fb.group({
        prtcpntSeq: [part.prtcpntSeq],
        trngSeq: [this.trng.trngSeq],
        // prtcpntCnicNum: [{ value: this.checkClientForm.controls['cnicNum'].value, disabled: true }, Validators.required],
        prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
        prtcpntNm: [part.prtcpntNm],
        prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
        prtcpnrRelKey: [{ value: part.prtcpntTRelKey, disabled: true }]
      })
      this.isEdit = true;
    } else if (part.dsbmtDt == null && part.loanCyclNum == null && (this.isNonClient || this.isBoth)) {
      console.log(12);
      (<any>$('#addNonClientParticipants')).modal('show');
      this.addNonClientParticipantsForm = this.fb.group({
        prtcpntSeq: [part.prtcpntSeq],
        trngSeq: [this.trng.trngSeq],
        prtcpntCnicNum: [{ value: part.prtcpntCnic, disabled: true }],
        prtcpntNm: [part.prtcpntNm],
        prtcpntGndrKey: [{ value: part.prtcpntGndrKey, disabled: true }],
        prtcpnrRelKey: [part.prtcpntTRelKey]
      })
      console.log(this.addNonClientParticipantsForm.value);
      this.isEdit = true;
    }
    // })

  }

  onDeleteParticipants(part) {
    console.log(part.prtcpntSeq)
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Participants?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.trainingServivce.deleteParticipants(part.prtcpntSeq).subscribe(ele => {
          this.allParticipants.splice(this.allParticipants.indexOf(part), 1)
          swal(
            'Deleted!',
            'Participants Deleted Successfully.',
            'success'
          );
        });
      }
    });
  }

  onSubmitCheckClient() {

    this.isEdit = false;
    this.trainingServivce.validateClient(this.checkClientForm.value).subscribe(res => {
      this.clientValidation = res;

      console.log(res.nominee.client)
      // if already exist in selected training
      for (let a = 0; a < this.allParticipants.length; a++) {
        if (this.allParticipants[a].prtcpntCnic == this.checkClientForm.controls['nomCnic'].value) {
          (<any>$('#checkClient')).modal('hide');
          this.toaster.info('Participants Already Exist', 'Information');
          return;
        }
      }

      //if client and undefined
      if (res.nominee.client == undefined && this.isClient) {
        this.toaster.info("Non Client Cannot Be In Clients Training", "Information");
        return;
      }

      // if client but not kss client
      if (res.nominee.client != undefined && res.nominee.client.prdName == "KASHF SCHOOL SARMAYA" && !this.isKSS && this.isClient && !this.isALL) {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.error('Not KSS Training', 'KSS Client');
        return;
      }
      // if clinent but not kel client
      else if (res.nominee.client != undefined && res.nominee.client.prdName == "KASHF EASY LOAN" && !this.isKEL && this.isClient && !this.isALL) {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.error('Not KEL Training', 'KEL Client');
        return;
      }
      //if client but not kmwk client
      if (res.nominee.client != undefined && res.nominee.client.prdName == "KASHF MAWESHI KARZA BI-ANNUAL " && !this.isKMWK && this.isClient && !this.isALL) {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.error('Not KMWK Training', 'KMWK Client');
        return;
      }
      //if client but not kkk client
      if (res.nominee.client != undefined && res.nominee.client.prdName == "KASHF KAROBAR KARZA" && !this.isKKK && this.isClient && !this.isALL) {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.error('Not KKK Training', 'KKK Client');
        return;
      }

      if (res.nominee.client == undefined && this.isKSS && (this.isClient || this.isBoth)) {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.info('Non Clients Cannot Be In KSS Training', "Non Client")
        return;
      }

      // client should only be active
      if (res.nominee.client != undefined && res.nominee.client.clientStatus !== 703) {
        this.toaster.error("Client Is Not Active", "Error");
        return;
      }

      this.productSequence = res.nominee.client != undefined ? res.nominee.client.prdSeq : null;

      if (res.nominee.client != undefined && res.nominee.client.prdName == "KASHF SCHOOL SARMAYA" && res.nominee.client.clientStatus == 703 && this.isKSS) {
        this.toaster.info('KSS Client', 'Client');
        (<any>$('#checkClient')).modal('hide');
        (<any>$('#addKssParticipants')).modal('show');
        this.addKssClientsParticipantsForm = this.fb.group({
          trngSeq: [this.trng.trngSeq],
          prtcpntCnicNum: [{ value: this.clientValidation.nominee.client.cnicNum, disabled: true }],
          prtcpntNm: [{ value: this.clientValidation.nominee.client.firstName, disabled: true }],
          prtcpntGndrKey: [{ value: this.clientValidation.nominee.client.genderKey, disabled: true }],
          prtcpnrRelKey: [''],
          loanCyclNum: [{ value: this.clientValidation.nominee.client.loanCyclNum, disabled: true }],
          dsbmtDt: [{ value: this.clientValidation.nominee.client.dsbmtDt, disabled: true }],
          schNm: [{ value: this.clientValidation.nominee.client.otherDetails, disabled: true }],
          tchrNm: ['', Validators.required],
          totStdnt: ['', Validators.required],
          prdSeq: [this.productSequence]
        })
      } else if (res.nominee.client === undefined && this.isKSS) {
        // console.log('i am in');
        (<any>$('#checkClient')).modal('hide');
        (<any>$('#addKssParticipants')).modal('show');
        this.addKssClientsParticipantsForm = this.fb.group({
          trngSeq: [this.trng.trngSeq],
          // prtcpntCnicNum: [{ value: this.checkClientForm.controls['cnicNum'].value, disabled: true }, Validators.required],
          prtcpntCnicNum: [{ value: this.checkClientForm.controls['nomCnic'].value, disabled: true }],
          prtcpntNm: ['', Validators.required],
          prtcpntGndrKey: ['', Validators.required],
          prtcpnrRelKey: [''],
          schNm: ['', Validators.required],
          tchrNm: ['', Validators.required],
          totStdnt: ['', Validators.required],
          prdSeq: [this.productSequence]
        })
      } else if (res.nominee.client === undefined && !this.isKSS) {
        this.toaster.error('Not a Client', 'Alert');
        (<any>$('#checkClient')).modal('hide');
        (<any>$('#addNonClientParticipants')).modal('show');
        this.addNonClientParticipantsForm = this.fb.group({
          trngSeq: [this.trng.trngSeq],
          // prtcpntCnicNum: [{ value: this.checkClientForm.controls['cnicNum'].value, disabled: true }, Validators.required],
          // prtcpntCnicNum: [{ value: this.checkClientForm.controls['cnicNum'].value, disabled: true }],
          prtcpntCnicNum: [this.checkClientForm.controls['nomCnic'].value, Validators.required],
          prtcpntNm: ['', Validators.required],
          prtcpntGndrKey: ['', Validators.required],
          prtcpnrRelKey: ['']
        })
      } else if (this.clientValidation.nominee.client != undefined && res.nominee.client.clientStatus == 703 && !this.isKSS) {
        this.toaster.info('Client Found', 'Information');
        (<any>$('#checkClient')).modal('hide');
        (<any>$('#addParticipants')).modal('show');
        this.addParticipantsForm = this.fb.group({
          prdSeq: [this.productSequence],
          trngSeq: [this.trng.trngSeq],
          prtcpntCnicNum: [{ value: this.clientValidation.nominee.client.cnicNum, disabled: true }],
          prtcpntNm: [{ value: this.clientValidation.nominee.client.firstName, disabled: true }],
          prtcpntGndrKey: [{ value: this.clientValidation.nominee.client.genderKey, disabled: true }],
          prtcpnrRelKey: [''],
          loanCyclNum: [{ value: this.clientValidation.nominee.client.loanCyclNum, disabled: true }],
          dsbmtDt: [{ value: this.clientValidation.nominee.client.dsbmtDt, disabled: true }],
        })
      } else {
        (<any>$('#checkClient')).modal('hide');
        this.toaster.info('Is Not Client', 'Some Information')
      }

    });
  }

  // kss client submit
  onSubmitKSSClientsParticipants() {

    if (!this.isEdit) {
      console.log(this.addKssClientsParticipantsForm.value)
      let a = this.addKssClientsParticipantsForm.getRawValue();
      a.trngSeq = this.trng.trngSeq;
      a.prdSeq = this.productSequence;
      a.dsbmtDt = new Date(this.addKssClientsParticipantsForm.controls['dsbmtDt'].value)
      this.spinner.show();
      this.trainingServivce.addParticipantsAgainstTraining(a).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
        });
        this.spinner.hide();
      }, (error) => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error.error)
        }
      });
      (<any>$('#addKssParticipants')).modal('hide');
      this.addKssClientsParticipantsForm.reset();
    } else {
      console.log(this.addKssClientsParticipantsForm.value)
      let a = this.addKssClientsParticipantsForm.getRawValue();
      a.trngSeq = this.trng.trngSeq;
      a.prdSeq = this.productSequence;
      a.dsbmtDt = new Date(this.addKssClientsParticipantsForm.controls['dsbmtDt'].value)
      console.log(this.addKssClientsParticipantsForm.value)
      this.spinner.show();
      this.trainingServivce.updateParticipantsAgainstTraining(a).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
        });
        this.spinner.hide();
      }, (error) => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error)
        }
      });
      (<any>$('#addKssParticipants')).modal('hide');
      this.addKssClientsParticipantsForm.reset();
    }
  }


  //Client Submit function
  onSubmitClientTraining() {
    if (!this.isEdit) {
      let obj = this.addParticipantsForm.getRawValue();
      obj.trngSeq = this.trng.trngSeq;
      obj.prdSeq = this.productSequence;
      let disbursementDate = obj.dsbmtDt;
      let d = moment(disbursementDate, 'DD-MM-YYYY');
      console.log(d)
      obj.dsbmtDt = moment.parseZone(d.format('YYYY-MM-DD'))['_i'];
      console.log(obj.dsbmtDt)
      this.spinner.show();
      this.trainingServivce.addParticipantsAgainstTraining(obj).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
          console.log(this.allParticipants);
          (<any>$('#addParticipants')).modal('hide');
          this.addParticipantsForm.reset();
        })
        this.spinner.hide();
      }, (error) => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error.error)
        }
      });
    } else {
      let obj = this.addParticipantsForm.getRawValue();
      obj.trngSeq = this.trng.trngSeq;
      obj.prdSeq = this.productSequence;
      console.log(new Date(obj.dsbmtDt))
      let d = moment(obj.dsbmtDt, 'DD-MMM-YYYY');
      obj.dsbmtDt = moment.parseZone(d.format('YYYY-MM-DD'))['_i'];
      console.log(obj);
      this.spinner.show();
      this.trainingServivce.updateParticipantsAgainstTraining(obj).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
          console.log(this.allParticipants);
          (<any>$('#addParticipants')).modal('hide');
          this.addParticipantsForm.reset();
        })
        this.spinner.hide();
      }, (error) => {
        console.log(error)
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error)
        }
      });
    }
  }


  //submit non client
  onSubmitNonClientParticipants() {
    if (!this.isEdit) {
      console.log(this.trng.trngSeq)
      console.log(this.addNonClientParticipantsForm.getRawValue())
      let a = this.addNonClientParticipantsForm.getRawValue();
      a.trngSeq = this.trng.trngSeq;
      this.spinner.show();
      this.trainingServivce.addParticipantsAgainstTraining(a).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
        });
        // console.log(a)
        // this.allParticipants.push(a)
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error.error)
        }
      });
      (<any>$('#addNonClientParticipants')).modal('hide');
      this.addNonClientParticipantsForm.reset();
    } else {
      console.log(this.trng.trngSeq)
      console.log(this.addNonClientParticipantsForm.getRawValue())
      let a = this.addNonClientParticipantsForm.getRawValue();
      a.trngSeq = this.trng.trngSeq;
      this.spinner.show();
      this.trainingServivce.updateParticipantsAgainstTraining(a).subscribe(res => {
        this.trainingServivce.getallParticipants(this.trng.trngSeq).subscribe(res => {
          this.allParticipants = res;
        });
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error(error.error)
        }
      });
      (<any>$('#addNonClientParticipants')).modal('hide');
      this.addNonClientParticipantsForm.reset();
    }
  }


}
