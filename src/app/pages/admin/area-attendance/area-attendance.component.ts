import { Component, OnInit } from '@angular/core';
import { RecoveryService } from '../../../shared/services/recovery.service';
import { AttendanceCheckIn } from 'src/app/shared/models/recovery.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { error } from '@angular/compiler/src/util';
import { CommonService } from 'src/app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { toDate } from '@angular/common/src/i18n/format_date';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-area-attendance',
  templateUrl: './area-attendance.component.html',
  styleUrls: ['./area-attendance.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AreaAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  chekInSeq: AttendanceCheckIn[] = [];
  checkInAttendanceArray: any;
  checkOut = false;
  submitted: Boolean = false;
  fieldpost: Boolean = false;
  chkOut: Boolean = false;
  //Leave Application
  attDate = moment();
  maxAttDate = new Date();
  minLeaveRequestDate: any;

  fromDateMax = moment(new Date());
  maxDate: Date;
  minDate: Date;
  selectedApprovedBy = "";


  // public min = new Date(2018, 1, 12).setHours(7);

  // public max = new Date(new Date().setHours(13));

  leaveForm: FormGroup;

  leaveTypes: string[] = [
    'Annual Leave',
    'Casual Leave',
    'Maternity Leave',
    'Medical Leave'
  ]

  approvedBy: string[] = [
    'Cr BM',
    'Cr AM',
    'Cr RM',
    'Other'
  ]
  selectedValue: string = '';
  postingAllAttendance: any;
  postAll: any = { "att_date": this.attDate, "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch };
  employeeList: any;
  // chkOt: boolean = false;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService, ) {
    //      this.maxAttDate.set({
    //     hour:   23,
    //     minute: 59,
    //     second: 59
    // });
    // this.maxAttDate.setHours(23);
    // this.maxAttDate.setMinutes(59);
    // this.maxAttDate.setSeconds(59)
    console.log(this.maxAttDate)
    this.maxDate = new Date();
    this.minDate = new Date();
    // this.minDate = new Date(this.minDate.setDate(this.minDate.getDate() +2 1));
    console.log(this.minDate)
    let i = 0;
    while (i <= 1) {
      let d = new Date(this.minDate);
      d.setDate(d.getDate() - 1);
      if (d.getDay() != 0 && d.getDay() != 6) {
        i++;
      }
      this.minDate = new Date(this.minDate.setDate(this.minDate.getDate() - 1));
    }
    // this.minDate = new Date(new Date().setDate(new Date().getDate() - 2));
    console.log(this.minDate)

  }
  leaveStatusListing;
  leaveStatusListingForMale;
  leaveStatusListingForFemale;
  ngOnInit() {
    console.log(this.fromDateMax)
    //Attendance Form
    this.attendanceForm = this.fb.group({
      empSeq: ['', Validators.required],
      leaveTypes: ['', Validators.required],
      time: ['', Validators.required],
      clndrDt: [''],
      expSeq: ['']
    });

    //Leave Form
    this.leaveForm = this.fb.group({
      employeeId: [''],
      // transactionNo: ['', Validators.required],
      leaveId: ['', Validators.required],
      applicationDate: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      totalDays: [''],
      appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      bal: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      approvedId: ['', Validators.required],
      nam: [''],
      gender: [''],
      selectedAppreoved: ["", Validators.required],
      reason: ['', Validators.required],
      transDate: [new Date()],
      postFlg: [false]
    });

    this.commonService.getStatusListing().subscribe(res => {
      this.leaveStatusListing = res;
      console.log(this.leaveStatusListing);


      this.leaveStatusListingForFemale = this.leaveStatusListing;
      console.log(this.leaveStatusListingForFemale);



      this.leaveStatusListingForMale = this.leaveStatusListing;
      console.log(this.leaveStatusListingForMale);

    });
    this.spinner.show();
    this.getForDate();
    //   this.attendanceForm.controls['checkIn'].valueChanges.subscribe(
    //     (selectedValue) => {
    //       console.log(selectedValue);
    //       console.log(this.attendanceForm.get('checkIn').value);     
    //     }
    // );
  }
  showGen = false;
  attendanceListing = [];
  generate() {
    this.fieldpost = true;
    this.spinner.show();
    this.commonService.generateAttendanceForToday({ "att_date": this.attDate, "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch }).subscribe(res => {
      console.log(res);
      res.forEach(element => {
        element.checkOutSaved = false;
        element.checkInSaved = false;
      })
      // this.fieldpost = false;
      this.attendanceListing = res;
      this.spinner.hide();
      this.showGen = false;
      this.temp = JSON.parse(JSON.stringify(res));

    }, error => {
      console.log(error);
      this.toaster.error("Something Went Wrong")
      this.spinner.hide();
    });
  }

  onSelectionChanged(e) {
    console.log(e);
    if (this.selectedApprovedBy != 'Other') {
      this.leaveForm.controls['selectedAppreoved'].setValue(this.selectedApprovedBy);
    } else {
      this.leaveForm.controls['selectedAppreoved'].setValue("");
    }
  }

  onLeaveIdChange(e) {

  }

  postAllAttendence() {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to Post Attendance?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Yes, Post it!'
    }).then((result) => {
      if (result.value) {

        // if (this.leaveForm.controls['leave_id']) {
        //   return;
        // }


        // if (this.leaveForm.valid) {
        //   this.toaster.success("Forms are Valid!!");
        // }

        // if (this.leaveForm.invalid) {
        //   console.log(this.leaveForm.controls['employeeId'].value)
        //   this.toaster.error("Some forms are not Valid!!");
        //   return (this.leaveForm.controls['employeeId'].value);
        // }


        console.log(this.leaveStatusListing);
        this.spinner.show();
        console.log(this.attDate)
        console.log(moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']);
        this.fieldpost = true;
        // let x = this.attDate;
        // console.log(x)
        // let dtStr = x.getDate()+ "-"+(x.getMonth()+1)+'-'+x.getFullYear();
        let date = new DatePipe('en-US').transform(new Date, 'dd-MM-yyyy');
        this.commonService.postAllPostFlg(moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']).subscribe(res => {
          console.log(res);
          this.postingAllAttendance = res;
          this.attendanceListing.forEach(r => {
            r.postFlg = true;
          })
          this.fieldpost = true;
          this.spinner.hide();
          swal(
            'Posted!',
            'Attendance Posted Successfully.',
            'success'
          );
        }, error => {
          console.log(error)
          this.spinner.hide();
        });
      }
    });
  }

  temp;
  getForDate() {
    this.fieldpost = false;
    this.showGen = false;
    this.spinner.show();
    // let d = moment.parseZone(this.attDate.format('YYYY-MM-DD'))['_i'];
    this.commonService.getAllAttendanceForToday({ "att_date": moment.parseZone(this.attDate.format('YYYY-MM-DD'))['_i'], "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch }).subscribe(res => {
      console.log(res);

      if (this.maxAttDate.getDate() == this.attDate.date()) {
        this.maxAttDate = new Date();
      } else {
        this.maxAttDate.setHours(23);
        this.maxAttDate.setMinutes(59);
        this.maxAttDate.setSeconds(59)
      }

      res.forEach(element => {
        if (element.time_in != null) {
          element.time_in = new Date(element.time_in);
          element.checkInSaved = true;
        } else {
          element.checkInSaved = false;
        }
        if (element.time_out != null) {
          element.time_out = new Date(element.time_out);
          element.checkOutSaved = true;
        } else {
          element.checkOutSaved = false;
        }
      });
      this.attendanceListing = res;
      this.temp = JSON.parse(JSON.stringify(res));
      res.forEach(obj => {
        this.fieldpost = obj.postFlg;
      })
      if (this.attendanceListing.length <= 0)
        this.showGen = true;
      this.spinner.hide();
      let t = 0;
      for (var i = 0; i < this.temp.length; i++) {
        var obj1 = this.temp[i];
        if (obj1.leave_id == 6 || obj1.leave_id == 3) {
          if (obj1.time_in == null || !obj1.checkInSaved || obj1.time_out == null || !obj1.checkOutSaved) {
            this.fieldpost = true;
            t++
          } else if (obj1.time_in != null && obj1.checkInSaved && obj1.time_out != null && obj1.checkOutSaved && t == 0) {
            this.fieldpost = false;
          }
        }
      }
    }, error => {
      console.log(error)
      this.spinner.hide();
    });
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.leaveForm.controls;
  }



  onCheckOutSubmit(obj) {
    console.log(obj.time_in)
    let difference = obj.time_out - obj.time_in;

    if (difference < 10800000) {
      this.toaster.error("Check OUT msut be greater than 3 hours after Check IN");
      this.spinner.hide();
      return;
    }

    if (obj.time_in > obj.time_out) {
      this.toaster.error("Check Out Time must be greater than Check In Time");
      this.spinner.hide();
      return;
    }

    if (obj.time_out < new Date().setHours(12, 0, 0)) {
      this.toaster.error("Check Out Time cannot be less than 12:00 PM");
      this.spinner.hide();
      return;
    }

    if (obj.time_in > new Date().setHours(14, 0, 0)) {
      this.toaster.error("Check In Time cannot be greater than 02:00 PM");
      this.spinner.hide();
      return;
    }

    console.log(obj);
    this.spinner.show()
    this.commonService.updateAttendanceForEmployee(obj).subscribe(res => {
      this.fieldpost = false;
      obj.checkOutSaved = true;
      for (var z = 0; z < this.temp.length; z++) {
        var y = this.temp[z];
        if (obj.employee_id == y.employee_id) {
          this.temp[z] = obj;
        }
      }
      // this.temp[this.temp.indexOf(obj)] = obj
      let t = 0;
      for (var i = 0; i < this.temp.length; i++) {
        var obj1 = this.temp[i];
        if (obj1.leave_id == 6 || obj1.leave_id == 3) {
          if (obj1.time_in == null || !obj1.checkInSaved || obj1.time_out == null || !obj1.checkOutSaved) {
            this.fieldpost = true;
            t++
          } else if (obj1.time_in != null && obj1.checkInSaved && obj1.time_out != null && obj1.checkOutSaved && t == 0) {
            this.fieldpost = false;
          }
        }
      }
      console.log(res);
      this.spinner.hide();
      this.toaster.success("Saved")
    }, error => {
      console.log(error)
      this.spinner.hide();
    });
    // this.attendanceForm.controls['clndrDt'].setValue(this.attendanceForm.controls['time'].value);
    // console.log(this.attendanceForm.value);
    // this.checkOut = true;
    // if (this.attendanceForm.invalid) {
    //   return;
    // }
    // this.recoveryService.checkInAttendance(this.attendanceForm.value).subscribe(
    //   Response => console.log('Success!', Response),
    //   error => console.error('Error!', error)
    // );
  }
  onCheckInSubmit(obj) {

    if (obj.time_in > new Date().setHours(14, 0, 0)) {
      this.toaster.error("Check In Time cannot be greater than 02:00 PM");
      return;
    }
    if (obj.time_out != null) {
      let difference = obj.time_out - obj.time_in;

      if (difference < 10800000) {
        this.toaster.error("Check OUT msut be greater than 3 hours after Check IN");
        return;
      }

      if (obj.time_in > obj.time_out) {
        this.toaster.error("Check Out Time must be greater than Check In Time");
        return;
      }

      if (obj.time_out < new Date().setHours(12, 0, 0)) {
        this.toaster.error("Check Out Time cannot be less than 12:00 PM");
        return;
      }

      if (obj.time_in > new Date().setHours(14, 0, 0)) {
        this.toaster.error("Check In Time cannot be greater than 02:00 PM");
        return;
      }
    }
    // if (obj.time_in == null){
    //   this.chkOt = false;
    // } else {
    //   this.chkOt = true;
    // }

    this.commonService.updateAttendanceForEmployee(obj).subscribe(res => {
      this.fieldpost = false;
      for (var z = 0; z < this.temp.length; z++) {
        var y = this.temp[z];
        if (obj.employee_id == y.employee_id) {
          this.temp[z] = obj;
        }
      }
      obj.checkInSaved = true;
      if (obj.time_out != null) {
        obj.checkOutSaved = true;
      }
      // this.temp[this.temp.indexOf(obj)] = obj
      let t = 0;
      for (var i = 0; i < this.temp.length; i++) {
        var obj1 = this.temp[i];
        if (obj1.leave_id == 6 || obj1.leave_id == 3) {
          if (obj1.time_in == null || !obj1.checkInSaved || obj1.time_out == null || !obj1.checkOutSaved) {
            this.fieldpost = true;
            t++
          } else if (obj1.time_in != null && obj1.checkInSaved && obj1.time_out != null && obj1.checkOutSaved && t == 0) {
            this.fieldpost = false;
          }
        }
      }
      // if(t>0){
      //   this.fieldpost = true;
      // }
      this.toaster.success("Saved")
    }, error => {
      console.log(error)
      this.spinner.hide();
    });
  }


  onLeaveSubmit() {

    let fromDate = new Date(this.leaveForm.controls['fromDate'].value);
    console.log(fromDate.getDay());

    let toDate = this.leaveForm.controls['toDate'].value;
    console.log(toDate.getDate());

    let i = 0;
    while ((fromDate.getDate() <= toDate.getDate() &&
      fromDate.getMonth() == toDate.getMonth() && fromDate.getFullYear() == toDate.getFullYear())
      || (fromDate.getMonth() < toDate.getMonth() && fromDate.getFullYear() == toDate.getFullYear())
      || (fromDate.getFullYear() < toDate.getFullYear())
    ) {
      if (fromDate.getDay() != 0 && fromDate.getDay() != 6) {
        i += 1
      }
      fromDate.setDate(fromDate.getDate() + 1)
    }
    console.log(i)
    if (this.leaveForm.controls['leaveId'].value == "5") {
      if (i > 66) {
        this.toaster.error("MATERNITY LEAVES CANNOT EXCEED 66 DAYS!!");
        return;
      }
    }
    if (this.leaveForm.controls['leaveId'].value == "17") {
      if (i > 10) {
        this.toaster.error("PATERNITY LEAVES CANNOT EXCEED 10 DAYS!!");
        return;
      }
    }





    // if (this.leaveForm.controls['gender'].value == "F") {
    //   console.log(this.leaveForm.controls['gender'].value === "F")
    //   let differneceInLeaves1 = this.leaveForm.controls['toDate'].value - this.leaveForm.controls['fromDate'].value;
    //   console.log(differneceInLeaves1)
    //   if (differneceInLeaves1 > 5702400000) {
    //     this.toaster.error("Leaves cannot exceed 66 days");
    //     return;
    //   }
    // }

    // if (this.leaveForm.controls['gender'].value == "M") {
    //   console.log(this.leaveForm.controls['gender'].value == "M");
    //   let differneceInLeaves = this.leaveForm.controls['toDate'].value - this.leaveForm.controls['fromDate'].value;
    //   if (differneceInLeaves > 864000000) {
    //     this.toaster.error("Leaves cannot exceed 10 days");
    //     return;
    //   }
    // }
    if (this.leaveForm.controls['approvedId'].value == 'Other') {
      this.leaveForm.controls['approvedId'].setValue(this.leaveForm.controls['selectedAppreoved'].value)
    }

    this.submitted = true;
    if (!this.leaveForm.valid) {
      this.toaster.error("Fileds Are Invalid!!");
      return;
    }


    this.commonService.saveLeaveSummary(this.leaveForm.value).subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.toaster.success("Saved");
      (<any>$('#attendance')).modal('hide');
      //post all disable
      this.fieldpost = false;
      for (var z = 0; z < this.temp.length; z++) {
        var y = this.temp[z];
        if (this.leaveForm.controls['employeeId'].value == y.employee_id) {
          this.temp[z].leave_id = this.leaveForm.controls['leaveId'].value;
        }
      }
      let t = 0;
      for (var i = 0; i < this.temp.length; i++) {
        var obj = this.temp[i];
        if (obj.leave_id == 6 || obj.leave_id == 3) {
          if (obj.time_in == null || obj.time_out == null) {
            this.fieldpost = true;
            t++
          } else if (obj.time_in != null && obj.checkInSaved && obj.time_out != null && obj.checkOutSaved && t == 0) {
            this.fieldpost = false;
          }
        }
      }
      //end
    }, error => {
      console.log(error)
      this.spinner.hide();
      // this.leaveForm.reset(this.leaveForm.value);
      // this.leaveForm.reset();
      this.leaveForm.markAsPristine();
    });

  }
  onAttendSubmit() { }
  onLeaveChange() { }
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onLeaveRequestClick(obj) {
    this.selectedApprovedBy = '';
    console.log(obj);
    if (obj.leave_id == '3') {
      this.minLeaveRequestDate = new Date();
      this.minLeaveRequestDate.setHours(0);
      this.minLeaveRequestDate.setMinutes(0);
    } else {
      this.minLeaveRequestDate = new Date(new Date().setDate(new Date().getDate() - 2));
      this.minLeaveRequestDate.setHours(0);
      this.minLeaveRequestDate.setMinutes(0);
      this.minLeaveRequestDate.setSeconds(0);
      console.log(new Date(new Date().setDate(new Date().getDate() - 2)))

    }
    // let atdt = new Date(this.attDate.setHours(0, 0, 0, 0)); console.log(atdt); console.log(new Date(atdt));
    obj.applicationDate = moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i'];
    obj.employeeId = obj.employee_id;
    this.leaveForm = this.fb.group({
      employeeId: [obj.employee_id],
      // transactionNo: ['', Validators.required],
      leaveId: [+obj.leave_id],
      applicationDate: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      totalDays: [''],
      appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      bal: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      approvedId: ['', Validators.required],
      selectedAppreoved: ["", Validators.required],
      gender: [obj.gender],
      nam: [''],
      reason: ['', Validators.required],
      transDate: [new Date()],
      postFlg: [obj.postFlg]
    });
    this.commonService.getLeaveSummary(obj).subscribe(res => {
      console.log(res);
      if (res != null) {
        this.leaveForm = this.fb.group({
          employeeId: [obj.employeeId],
          // transactionNo: [res.transactionNo],
          leaveId: [+res.leaveId],
          applicationDate: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
          totalDays: [''],
          appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
          bal: [''],
          fromDate: [new Date(res.fromDate)],
          toDate: [new Date(res.toDate)],
          approvedId: ["", Validators.required],
          selectedAppreoved: [""],
          nam: [''],
          gender: [obj.gender],
          reason: [res.reason],
          transDate: [res.transDate],
          postFlg: [obj.postFlg]
        });
        let found = false;
        this.approvedBy.forEach(apb => {
          if (apb == res.approvedId) {
            this.leaveForm.controls['approvedId'].setValue(res.approvedId);
            found = true;
          }
        });
        if (!found) {
          this.leaveForm.controls['approvedId'].setValue('Other');
          this.leaveForm.controls['selectedAppreoved'].setValue(res.approvedId);
          this.selectedApprovedBy = 'Other';
        }
      }

      this.spinner.hide();
      (<any>$('#attendance')).modal('show');
    }, error => {
      console.log(error)
      this.spinner.hide();
    });
  }

  //preventing saturdays and sundays
  public myFilter = (d: any): boolean => {
    console.log(d)
    const day = d.day();
    return day !== 0 && day !== 6;
  }
}

