import {Component, OnInit} from '@angular/core';
import {RecoveryService} from '../../../shared/services/recovery.service';
import {AttendanceCheckIn} from 'src/app/shared/models/recovery.model';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {error} from '@angular/compiler/src/util';
import {CommonService} from 'src/app/shared/services/common.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';

//added BY Naveed 10/11/2020 'DecimalPipe'
import {DatePipe, DecimalPipe} from "@angular/common";
// End by Naveed
import {toDate} from '@angular/common/src/i18n/format_date';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import {Moment} from 'moment';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
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
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  chekInSeq: AttendanceCheckIn[] = [];
  checkInAttendanceArray: any;
  checkOut = false;
  submitted: Boolean = false;
  fieldpost: Boolean = false;
  chkOut: Boolean = false;

  //Added BY Naveed 10/11/2020
  auth: any;
  isReverseEnable: Boolean = false;

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
  postAll: any = {"att_date": this.attDate, "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch};
  employeeList: any;

  // chkOt: boolean = false;
  constructor(
      private commonService: CommonService,
      private fb: FormBuilder,
      private spinner: NgxSpinnerService,
      private toaster: ToastrService,
      // Added BY Naveed 10/11/2020 'DecimalPipe'
      private _decimalPipe: DecimalPipe) {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    // End by Naveed

    //      this.maxAttDate.set({
    //     hour:   23,
    //     minute: 59,
    //     second: 59
    // });
    // this.maxAttDate.setHours(23);
    // this.maxAttDate.setMinutes(59);
    // this.maxAttDate.setSeconds(59)
    //console.log(this.maxAttDate)
    this.maxDate = new Date();
    this.minDate = new Date();
    // this.minDate = new Date(this.minDate.setDate(this.minDate.getDate() +2 1));
    //console.log(this.minDate)
    let i = 0;
    while (i <= 1) {
      let d = new Date(this.minDate);
      d.setDate(d.getDate() - 1);
      if (d.getDay() != 0 && d.getDay() != 6) {
        i++;
      }
      this.minDate = new Date(this.minDate.setDate(this.minDate.getDate() - 1));
    }

  }

  leaveStatusListing;
  originalStatusListing;
  leaveStatusListingForMale;
  leaveStatusListingForFemale;

  ngOnInit() {
    this.fieldpost = true;
    //console.log(this.fromDateMax)

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
      totalDays: ["0"],
      appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      leaveBalance: ["0"],
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
      this.originalStatusListing = res;

      // Edited By: Naveed 02-11-2020
      // reason:  LL, MT, HL, PAT and traning was not being displayed on MWX
      // system will display above metioned leaves
      /*
      let i;
      for (i = this.leaveStatusListing.length - 1; i >= 0; i -= 1) {
          if (this.leaveStatusListing[i].short_desc == 'LL' || this.leaveStatusListing[i].short_desc == 'MT' || this.leaveStatusListing[i].short_desc == 'HL' || this.leaveStatusListing[i].short_desc == 'PAT') {
              // console.log('i am in if')
              this.leaveStatusListing.splice(i, 1);
          }
      }*/

      // this.leaveStatusListingForFemale = this.originalStatusListing;
      // console.log(this.leaveStatusListingForFemale);


      // this.leaveStatusListingForMale = this.originalStatusListing;
      // console.log(this.leaveStatusListingForMale);

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

  // Added By Naveed  10/11/2020
  // this method will be called when to date selected
  currentPeriodClicked(event, leaveId) {
    let todt = new Date(event);
    let frmdt = new Date(this.leaveForm.get('fromDate').value);
    //console.log("currentPeriodClicked - todt", todt);
    //console.log("currentPeriodClicked - frmdt", frmdt);

    let balance: any;
    if (leaveId == '3') {
      balance = this._decimalPipe.transform(Math.fround((todt.getTime() - frmdt.getTime()) / (1000 * 60 * 60)), '1.2-2');
      ;
    } else {
      //balance = (todt.getTime() - frmdt.getTime()) / (1000 * 60 * 60 * 24) + 1;
      var nextDay = new Date(frmdt);
      var cnt = 0;
      do {
        cnt += (nextDay.getDay() >= 1 && nextDay.getDay() <= 5) ? 1 : 0;
        nextDay.setDate(nextDay.getDate() + 1);
      } while (nextDay <= todt);
      //console.log("Number of week days between " + frmdt + " and " + todt + " = " + cnt);
      balance = cnt;
    }
    //  this.leaveForm.controls["remainingBalance"].setValue(+this.leaveForm.get('leaveBalance').value - +balance);
    this.leaveForm.controls["totalDays"].setValue(balance);

    // ----------------------------------------------------

    // ----------------------------------------------------
  }

  //end method

  showGen = false;
  attendanceListing = [];

  generate() {
    this.fieldpost = true;
    this.spinner.show();
    this.commonService.generateAttendanceForToday({
      "att_date": this.attDate,
      "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch
    }).subscribe(res => {
      //console.log(res);
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
    //console.log(e);
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


        //console.log(this.leaveStatusListing);
        this.spinner.show();
        //console.log(this.attDate)
        //console.log(moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']);
        this.fieldpost = true;
        // let x = this.attDate;
        // console.log(x)
        // let dtStr = x.getDate()+ "-"+(x.getMonth()+1)+'-'+x.getFullYear();
        let date = new DatePipe('en-US').transform(new Date, 'dd-MM-yyyy');
        this.commonService.postAllPostFlg(moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']).subscribe(res => {
          //console.log(res);
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
          this.fieldpost = false;
          console.log(error)
          this.spinner.hide();
          this.toaster.error('Something went wrong');
        });
      }
    });
  }

  temp;

  getForDate() {
    this.fieldpost = true;
    this.showGen = false;
    this.spinner.show();
    // let d = moment.parseZone(this.attDate.format('YYYY-MM-DD'))['_i'];
    this.commonService.getAllAttendanceForToday({
      "att_date": moment.parseZone(this.attDate.format('YYYY-MM-DD'))['_i'],
      "brnchSeq": JSON.parse(sessionStorage.getItem("auth")).emp_branch
    }).subscribe(res => {
      //console.log(res);

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
      //console.log(this.attendanceListing)
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
      for (let sub = 0; sub < this.attendanceListing.length; sub++) {
        if (this.attendanceListing.length != 0 && this.attendanceListing[sub].postFlg == true) {
          this.fieldpost = true;
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
    //console.log(obj.time_in)
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

    //console.log(obj);
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
      //console.log(res);
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


  /* Commented by Zohaib Asim
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
  }*/

  // Edit By Naveed  10/11/2020
  // this when method will be called when you save attendance(Present) of employee
  // show message if employee leave on that day
  onCheckInSubmit(obj) {
    obj.applicationDate = moment.parseZone(this.attDate.format("DD-MM-YYYY"))[
        "_i"
        ];
    obj.employeeId = obj.employee_id;

    this.commonService.getLeaveSummary(obj).subscribe(res => {

      let diff = null;
      let frmTime, frmDate;
      let toTime, toDate;

      if (res != null) {
        if (res.leaveId == '3') {
          frmTime = this.formatAMPM(new Date(res.fromDate));
          toTime = this.formatAMPM(new Date(res.toDate))

          diff = this._decimalPipe.transform(Math.fround((new Date(res.toDate).getTime() - new Date(res.fromDate).getTime()) / (1000 * 60 * 60)), '1.2-2');
          //console.log(new Date(obj.time_in).getTime() - new Date(res.fromDate).getTime());
        }

        // Added by Zohaib - Dated 16/11/2020
        let currDate = obj.applicationDate;
        frmDate = new DatePipe("en-US").transform(new Date(res.fromDate), "dd-MM-yyyy");
        toDate = new DatePipe("en-US").transform(new Date(res.toDate), "dd-MM-yyyy");
        //console.log("CurrentDate", currDate);
        //console.log("FromDate", frmDate);
        //console.log("ToDate", toDate);

        //let currDate = moment.parseZone(this.attDate.format("DD-MM-YYYY"))["_i"];
        // If User has applied for the Leave, They cannot mark any status
        if (res.leaveId != '3' && (currDate >= frmDate && currDate <= toDate)) {
          this.toaster.info(`Your Leave Application Submitted ${this.getLeaveDesc(res.leaveId)} For ${diff != null ? diff + ` Hour's From  ${frmTime} To ${toTime} ` : ''} Current Date, Please Contact Your's Manager`);
          return;
        }
      }
      this.savePresent(obj);
    }, error => {
      console.log(error);
    });
  }

  //end


  // Edit By Naveed  10/11/2020
  savePresent(obj) {
    if (obj.time_in > new Date().setHours(14, 0, 0)) {
      this.toaster.error("Check In Time cannot be greater than 02:00 PM");
      return;
    }
    if (obj.time_out != null) {
      let difference = obj.time_out - obj.time_in;

      if (difference < 10800000) {
        this.toaster.error(
            "Check OUT msut be greater than 3 hours after Check IN"
        );
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

    this.commonService.updateAttendanceForEmployee(obj).subscribe(
        (res) => {
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
              if (
                  obj1.time_in == null ||
                  !obj1.checkInSaved ||
                  obj1.time_out == null ||
                  !obj1.checkOutSaved
              ) {
                this.fieldpost = true;
                t++;
              } else if (
                  obj1.time_in != null &&
                  obj1.checkInSaved &&
                  obj1.time_out != null &&
                  obj1.checkOutSaved &&
                  t == 0
              ) {
                this.fieldpost = false;
              }
            }
          }
          // if(t>0){
          //   this.fieldpost = true;
          // }
          this.toaster.success("Saved");
        },
        (error) => {
          this.toaster.error(error.error.error)
          console.log(error);
          this.spinner.hide();
        }
    );
  }

  // end method


  // Added By Naveed  10/11/2020
  // this method will be called when delete/reverse leave request
  reverseLeaveRequest() {
    let appDate = this.leaveForm.value.applicationDate;

    let fromDate = new DatePipe("en-US").transform(this.leaveForm.value.fromDate, "dd-MM-yyyy");
    let toDate = new DatePipe("en-US").transform(this.leaveForm.value.toDate, "dd-MM-yyyy");
    let employeeId = this.leaveForm.value.employeeId;
    let attendanceDate = moment.parseZone(this.attDate.format("DD-MM-YYYY"))[
        "_i"
        ];

    // User can not reverse leave
    if (appDate < attendanceDate && !(attendanceDate >= fromDate && attendanceDate <= toDate)) {
      this.toaster.info("You cannot Reverse Applied Leaves.");
      return;
    }

    //
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to Reverse Leave Request?",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#007bff",
      confirmButtonText: "Yes, Reverse Leave Request !",
    }).then((result) => {
      if (result.value) {
        this.commonService.reverseLeaveRequest(employeeId, appDate).subscribe(res => {
          this.toaster.success("Leave Request Reversed");
          (<any>$("#attendance")).modal("hide");
          this.isReverseEnable = true;
        }, error => {
          console.log(error)
        });
      }
    });
  }

  //end method


  onLeaveSubmit() {

    let fromDate = new Date(this.leaveForm.controls['fromDate'].value);
    // console.log("fromDate.getDay()", fromDate.getDay());

    let toDate = this.leaveForm.controls['toDate'].value;
    // console.log("toDate.getDate()", toDate.getDate());

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
    //console.log(i)
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


    /* Commented by Zohaib Asim
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
    });*/

    // Added by Zohaib Asim - Dated 12/11/2020
    // Check Leave Balance should be greater than Total Days

    // System will Allow following leaves to be submitted - Dated 2/12/2020
    // 13-SUSPENDED, 18-COMPENSATORY LEAVE, 19-WORK FROM HOME, 8-UNINFORMED LEAVE
    // 9-ON TRAINING, 11-RESIGNED, 14-RECOMMENDED FOR TERMINATION, 15-DEATH, 16-UN-APPROVED LEAVE
    /*let formLeaveId = this.leaveForm.controls['leaveId'].value;
    if ( (formLeaveId == 1 || formLeaveId == 2 || formLeaveId == 3) &&
        this.leaveForm.controls['leaveBalance'].value < this.leaveForm.controls['totalDays'].value) {
        this.toaster.info('Total Days Cannot Greater Then Leave Balance');
        return;
    }*/

    // Added by Zohaib Asim - Dated 16/11/2020
    // If user marked itself present and same day applying for AL,ML
    let saveLeaveFlag = false;
    this.commonService.getAttendanceDetails(this.leaveForm.controls['employeeId'].value,
        this.leaveForm.controls['appDat'].value).subscribe(
        (res) => {
          console.log("GetAttendanceDetails:", res);

          if (res != null && res.leaveId != null) {
            //console.log("res is not null");
            // let currDate = new DatePipe("en-US").transform(new Date(), "dd-MM-yyyy");
            let attendanceDate = moment.parseZone(this.attDate.format("DD-MM-YYYY"))[
                "_i"
                ];
            //let appDate = this.leaveForm.controls["applicationDate"].value
            let formFromDate = new DatePipe("en-US").transform(new Date(this.leaveForm.controls["fromDate"].value), "dd-MM-yyyy");
            let formToDate = new DatePipe("en-US").transform(new Date(toDate), "dd-MM-yyyy");

            console.log("CurrentDate", attendanceDate);
            console.log("FromDate", formFromDate);
            console.log("ToDate", formToDate);
            // console.log(appDate == formFromDate);
            // console.log("attendanceDate >= fromDate", attendanceDate >= formFromDate);
            // console.log("attendanceDate <= toDate", attendanceDate <= formToDate);
            //

            if (res.leaveId == 6 &&
                (this.leaveForm.controls['leaveId'].value == 1 || this.leaveForm.controls['leaveId'].value == 2)
                && (attendanceDate >= formFromDate && attendanceDate <= formToDate)) {
              this.toaster.info('User Leave cannot be applied, because his/her attendance has been marked for today.');
              return;
            } else {
              saveLeaveFlag = true;
            }
          } else {
            saveLeaveFlag = true;
          }

          // Flag to save leave details
          //console.log("Leave Form Object: ", this.leaveForm.value)
          if (saveLeaveFlag) {
            this.saveLeaveForm(this.leaveForm.value);
          }
        }, (error) => {
          console.log(error);
        }
    );
  }

  // Added by Zohaib Asim - Dated 16/11/2020
  // Save Leave Form will save the user input details
  saveLeaveForm(leaveFormValues) {
    // Save Leave Form
    this.commonService.saveLeaveSummary(leaveFormValues).subscribe(
        (res) => {
          //console.log(res);
          this.spinner.hide();
          this.toaster.success("Saved");
          (<any>$("#attendance")).modal("hide");
          //post all disable
          this.fieldpost = false;
          for (var z = 0; z < this.temp.length; z++) {
            var y = this.temp[z];
            if (this.leaveForm.controls["employeeId"].value == y.employee_id) {
              this.temp[z].leave_id = this.leaveForm.controls["leaveId"].value;
            }
          }
          let t = 0;
          for (var i = 0; i < this.temp.length; i++) {
            var obj = this.temp[i];
            if (obj.leave_id == 6 || obj.leave_id == 3) {
              if (obj.time_in == null || obj.time_out == null) {
                this.fieldpost = true;
                t++;
              } else if (
                  obj.time_in != null &&
                  obj.checkInSaved &&
                  obj.time_out != null &&
                  obj.checkOutSaved &&
                  t == 0
              ) {
                this.fieldpost = false;
              }
            }
          }
          //end
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          // this.leaveForm.reset(this.leaveForm.value);
          // this.leaveForm.reset();
          this.leaveForm.markAsPristine();
        }
    );
  }

  // End

  onAttendSubmit() {
  }

  onLeaveChange() {
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onLeaveRequestClick(obj) {
    this.selectedApprovedBy = '';
    //console.log(obj);
    if (obj.leave_id == '3') {
      this.minLeaveRequestDate = new Date();
      this.minLeaveRequestDate.setHours(0);
      this.minLeaveRequestDate.setMinutes(0);
    } else {
      //   this.minLeaveRequestDate = new Date(new Date().setDate(new Date().getDate() - 2));
      //   this.minLeaveRequestDate.setHours(0);
      //   this.minLeaveRequestDate.setMinutes(0);
      //   this.minLeaveRequestDate.setSeconds(0);
      //   console.log(new Date(new Date().setDate(new Date().getDate() - 2)))

      this.minLeaveRequestDate = new Date();
      let index = 0;
      while (index <= 1) {
        let date = new Date(this.minLeaveRequestDate);
        date.setDate(date.getDate() - 1);
        if (date.getDay() != 0 && date.getDay() != 6) {
          index++;
        }
        this.minLeaveRequestDate = new Date(this.minLeaveRequestDate.setDate(this.minLeaveRequestDate.getDate() - 1));
        this.minLeaveRequestDate.setHours(0);
        this.minLeaveRequestDate.setMinutes(0);
        this.minLeaveRequestDate.setSeconds(0);
        // console.log(this.minLeaveRequestDate)
      }
    }
    // let atdt = new Date(this.attDate.setHours(0, 0, 0, 0)); console.log(atdt); console.log(new Date(atdt));
    obj.applicationDate = moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i'];
    obj.employeeId = obj.employee_id;
    this.leaveForm = this.fb.group({
      employeeId: [obj.employee_id],
      // transactionNo: ['', Validators.required],
      leaveId: [+obj.leave_id],
      applicationDate: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      totalDays: ["0"],
      appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
      leaveBalance: ["0"],
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

    // Get Leave Summary Details will return current date employee leave
    let getLeaveSummaryFlag = false;

    this.commonService.getLeaveSummary(obj).subscribe(res => {
      //console.log("onLeaveRequestClick -> getLeaveSummary", res);
      // Edit By  Naveed, date 04-11-2020
      // if employee already apply for leave then system will fetch stored application date
      this.isReverseEnable = true;

      let appDate;
      if (res == null) {
        appDate = [moment.parseZone(this.attDate.format("DD-MM-YYYY"))["_i"]];
        this.leaveForm.controls["totalDays"].setValue("0");
      } else if (res.applicationDate == null) {
        appDate = [moment.parseZone(this.attDate.format("DD-MM-YYYY"))["_i"]];
      } else {
        appDate = new DatePipe("en-US").transform(
            new Date(res.applicationDate),
            "dd-MM-yyyy"
        );
      }
      // end if

      if (res != null) {
        // Addedd by Naveed
        this.isReverseEnable = false;
        getLeaveSummaryFlag = true;

        //
        this.leaveForm = this.fb.group({
          employeeId: [obj.employeeId],
          // transactionNo: [res.transactionNo],
          leaveId: [+res.leaveId],
          applicationDate: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
          totalDays: [res.totalDays],
          appDat: [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']],
          leaveBalance: ["0"],
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

        // Added By Naveed  10/11/2020
        // Get Leave Balance
        this.getLeaveBalanceByEmployeeAndLeave(obj.employeeId, res.leaveId,
            [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']]);
        // End
      }

      this.spinner.hide();
      (<any>$('#attendance')).modal('show');
    }, error => {
      console.log(error)
      this.spinner.hide();
    });

    // Added by Zohaib Asim - Dated 16/11/2020
    // Get Leave Balance if no leave applied
    if (!getLeaveSummaryFlag) {
      this.getLeaveBalanceByEmployeeAndLeave(obj.employeeId, obj.leave_id,
          [moment.parseZone(this.attDate.format('DD-MM-YYYY'))['_i']]);
    }
  }

  //preventing saturdays and sundays
  public myFilter = (d: any): boolean => {
    console.log(d)
    let day = d.day();
    return day !== 0 && day !== 6;
  }

  public myFilter2 = (d: Date): boolean => {
    let day = d.getDay();
    return day !== 0 && day !== 6;

  }

  // added By Naveed  10/11/2020
  // gte Leave Desc against leaveId
  getLeaveDesc(obj) {
    let desc;
    this.leaveStatusListing.forEach(element => {
      if (obj == element.leave_id) {
        desc = element.description;
      }
    });
    return desc;
  }

  // Added by Zohaib Asim - Dated 16/11/2020
  // Get Leave Balance
  getLeaveBalanceByEmployeeAndLeave(employeeId, leaveId, attendanceDate) {
    if (leaveId == '1' || leaveId == '2' || leaveId == '3') {
      //this.commonService.getLeaveBalanceByEmployeeLeaveId(employeeId, leaveId).subscribe(
      this.commonService.getLeaveBalanceByEmployeeLeaveIdAndAttDate(employeeId, leaveId, attendanceDate).subscribe(
          (res) => {
            //console.log("getLeaveBalanceByEmployeeLeaveIdAndAttDate", res);
            // this.leaveForm.controls["leaveBalance"].setValue(res.balance);
            this.leaveForm.patchValue({
              leaveBalance: res.balance
            })
          },
          (error) => {
            console.log("Error->getLeaveBalanceByEmployeeLeaveIdAndAttDate",error);
          }
      );// end
    } else {
      this.leaveForm.controls["leaveBalance"].setValue("0");
    }
  }

  // End

  // added By Naveed  10/11/2020
  // get AM/AM against Date
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }//end

}
