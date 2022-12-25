import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';


const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-compliance-branch',
  templateUrl: './compliance-branch.component.html',
  styleUrls: ['./compliance-branch.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ComplianceBranchComponent implements OnInit {
  addMemberForm: FormGroup;
  addMember = [];
  maxDate: string;
  minDate: Date;
  now: any;
  date: any;
  canAdd = true;
  startDate;
  isEdit: boolean = false;
  visitType = [{ seq: 1, desc: "Regular" }, { seq: 2, desc: "Floor" }, { seq: 3, desc: "ADC" }]
  // visitType = [{ seq: 1, desc: "Regular" }, { seq: 2, desc: "Floor" }]
  adtVistSeq: any;
  vstData: any;
  constructor(private fb: FormBuilder, private complianceService: ComplianceService, private spinner: NgxSpinnerService, public toaster: ToastrService,
    private router: Router
  ) {
    this.now = new Date();
    this.now.setDate((this.now.getDate() + 1));
    let month: any;
    if ((this.now.getMonth() + 1) < 10) {
      month = '0' + (this.now.getMonth() + 1);
    } else {
      month = '' + (this.now.getMonth() + 1);
    }
    let day: any;
    if ((this.now.getDate() + 1) < 10) {
      day = '0' + (this.now.getDate());
    } else {
      day = '' + (this.now.getDate());
    }
    const year: any = this.now.getFullYear();
    const currentDate: any = year + '-' + month + '-' + day;
    this.date = currentDate;
    this.maxDate = (year + 100) + '-' + month + '-' + day;

  }
  listing: any[]; trgt; empList: any = []; visitSts: any = [];
  complSts; pendingSts;
  ngOnInit() {
    this.trgt = JSON.parse(localStorage.getItem("trgt"));

    this.complianceService.getADTVstsByTyp(this.trgt.brnchSeq, this.trgt.vstTyp).subscribe(res => {
      this.listing = res;
      console.log(this.listing)
      console.log(this.trgt.trgt)
      this.canAdd = true;
      if (this.listing.length == this.trgt.trgt)
        this.canAdd = false;
    });
    this.complianceService.getEmployees().subscribe(res => {
      this.empList = res;
    })

    this.complianceService.getValues("0358").subscribe((res) => {
      this.visitSts = res;
      res.forEach(ele => {
        if (ele.codeRefCd == "01387")
          this.complSts = ele.codeKey;
        if (ele.codeRefCd == "01385")
          this.pendingSts = ele.codeKey;
      })

    }, (error) => {
      console.log('err', error);
    });
    this.addMemberForm = this.fb.group({
      adtVstSeq: [],
      trgtClnt: [''],
      asgnTo: ['', Validators.required],
      adtFlg: ['', Validators.required],
      strtDt: ['', Validators.required],
      endDt: ['', Validators.required],
      brnchSeq: [this.trgt.brnchSeq]
    });
    console.log(this.trgt.vstTyp);
    if (this.trgt.vstTyp == 1) {
      this.addMemberForm.controls['trgtClnt'].clearValidators();
    } else {
      this.addMemberForm.controls['trgtClnt'].setValidators(Validators.required);
    }
    this.minDate = new Date();
  }

  gettingAllListings() {
    this.complianceService.getADTVstsByTyp(this.trgt.brnchSeq, this.trgt.vstTyp).subscribe(res => {
      this.listing = res;
      this.canAdd = true;
      if (this.listing.length == this.trgt.trgt) {
        this.canAdd = false;
      }


      console.log("this.listing.length:" + this.listing.length);
      console.log("this.trgt.trgt:" + this.trgt.trgt);
    });
  }

  findEmployeeFromSeq(seq) {
    let empNm = "";
    this.empList.forEach(element => {
      if (element.empSeq == seq) {
        empNm = element.empNm + " (" + element.empLanId + ")";
      }
    });
    return empNm;
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
  findVisitSts(seq) {
    let sts = "";
    this.visitSts.forEach(elem => {
      if (elem.codeKey == seq) {
        sts = elem.codeValue;
      }
    })
    return sts;
  }
  //addMember
  openAddMember() {
    this.addMemberForm.clearValidators();
    this.isEdit = false;
    (<any>$('#addMember')).modal('show');

    if (this.trgt.vstTyp == 1) {
      this.addMemberForm.controls['trgtClnt'].clearValidators();
    } else {
      this.addMemberForm.controls['trgtClnt'].setValidators(Validators.required);
    }

    this.addMemberForm = this.fb.group({
      adtVstSeq: [],
      trgtClnt: [''],
      asgnTo: ['', Validators.required],
      adtFlg: ['', Validators.required],
      strtDt: ['', Validators.required],
      endDt: ['', Validators.required],
      brnchSeq: [this.trgt.brnchSeq]
    });
  }

  onSelectChange() {
    if (this.addMemberForm.controls['trgtClnt'].value == 0) {
      this.toaster.error("Number of Clients cannot be 0");
      return;
    }
  }
  onSubmitAddMemberForm() {
    console.log(!this.isEdit)
    if (this.isEdit == false) {
      console.log(this.addMemberForm);
      if (this.addMemberForm.controls['trgtClnt'].value == 0) {
        this.toaster.error("Number of Clients cannot be 0");
        return;
      };
      this.complianceService.addADTTarget(this.addMemberForm.value).subscribe(res => {
        this.listing.push(res);
        this.spinner.hide();
        this.toaster.success('Visit Added Successfully')
        this.canAdd = true;
        if (this.listing.length == this.trgt.trgt)
          this.canAdd = false;
      }, (error) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
      (<any>$('#addMember')).modal('hide');

      // this.addMember.push(this.addMemberForm.value)
      // console.log(this.addMember);
    } else {
      if (this.addMemberForm.controls['trgtClnt'].value == 0) {
        this.toaster.error("Number of Clients cannot be 0");
        return;
      }
      this.spinner.show();
      this.complianceService.updateADTTarget(this.addMemberForm.value).subscribe(res => {
        this.toaster.success('Visit Updated Successfully', 'Success')
        this.spinner.hide();
        this.gettingAllListings();
        (<any>$('#addMember')).modal('hide');
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

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onEdit(obj) {
    this.vstData = obj
    console.log(obj)
    // this.addMemberForm = this.fb.group({
    //   trgtClnt: [obj.trgtClnt],
    //   asgnTo: [obj.asgnTo],
    //   adtFlg: [obj.adtFlg],
    //   strtDt: [obj.strtDt],
    //   endDt: [obj.endDt],
    //   brnchSeq: [this.trgt.brnchSeq]
    // });
    this.addMemberForm.patchValue(obj);
    this.isEdit = true;
    console.log(this.isEdit);
    (<any>$('#addMember')).modal('show');
  }

  onDeleteVisit(obj) {
    console.log(obj)
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Visit?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.complianceService.deleteADTTarget(obj.adtVstSeq).subscribe(data => {
          console.log(this.trgt.brnchSeq)
          this.gettingAllListings();
        });
      }
    });
  }
  updateStatus(item) {
    console.log(item);
    this.complianceService.updateStatus(item.adtVstSeq).subscribe(res => {
      item.visitStsKey = res.visitStsKey;
      this.complianceService.getADTVstsByTyp(this.trgt.brnchSeq, this.trgt.vstTyp).subscribe(res => {
        this.listing = res;
      })
    }, error => {
      console.log(error);
      this.toaster.error(error.error.error, "ERROR")
    });
  }
  srvy;
  // loadAdtVstSrvy(item){
  //   this.complianceService.getVstSrvy(item.adtVstSeq).subscribe(res => {
  //     console.log(res)
  //     res.forEach(ele=>{
  //       ele.vstId = item.vstId;
  //     });
  //     this.srvy=res;
  //     (<any>$('#vstSrvy')).modal('show');
  //   });
  // }
  loadTargetVisits(obj) {
    localStorage.setItem("vst", JSON.stringify(obj));
    this.router.navigate(['compliance/compliance-visit']);
  }

  openBranchRankingReport(obj) {
    this.spinner.show();
    console.log(obj.adtVstSeq)
    this.complianceService.printBranchRankingReport(obj.adtVstSeq).subscribe((response) => {
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

  openCPCReport(obj) {
    this.spinner.show();
    console.log(obj.adtVstSeq)
    this.complianceService.printCPCReport(obj.adtVstSeq).subscribe((response) => {
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
}
