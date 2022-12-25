import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from 'src/app/shared/services/training.service';

@Component({
  selector: 'app-training-attendance',
  templateUrl: './training-attendance.component.html',
  styleUrls: ['./training-attendance.component.css']
})
export class TrainingAttendanceComponent implements OnInit {

  @ViewChild('list') _matSelectionList: MatSelectionList;
  _listDisabled = false;

  trng = JSON.parse(sessionStorage.getItem("trng"));
  allParticipants;
  form: FormGroup;
  completedTraining: boolean = false;

  constructor(
    private trainingServivce: TrainingService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    console.log(this.trng.trngStsKey);
    this.trainingServivce.getallParticipantsWithDates(this.trng.trngSeq).subscribe(res => {
      this.allParticipants = res;
      console.log(this.allParticipants);
    });
    this.trng.trngStsKey == 1 ? this._listDisabled = true : this._listDisabled = false;
  }

  selectedOptions = [];
  onSubmitAttendance(list, part) {

    if (this.trng.trngStsKey == 1) {
      this.toaster.error("Cannot Update as Training is marked Completed", "Error");
      console.log(part);
      // part.atndFlg.setValue(!part.atndFlg)
      return;
    }

    this.spinner.show();
    this.selectedOptions = list.selectedOptions.selected.map(item => item.value);
    let obj = {
      prtcpntSeq: part.prtcpntSeq,
      trngSeq: part.trngSeq,
      atndFlg: part.atndFlg,
      trngDtSeq: part.trngDtSeq,
    }

    if (this.selectedOptions.includes(part.atndFlg)) {
      console.log("checked");
      obj.atndFlg = true;

    } else {
      console.log("unchecked");
      obj.atndFlg = false;
    };

    this.trainingServivce.attendanceForTraining(obj).subscribe(res => {
      console.log(obj.atndFlg)
      this.spinner.hide();
      obj.atndFlg == false ? this.toaster.error("Marked As Absent For : " + part.prtcpntName, "Success") : this.toaster.success("Marked As Present For : " + part.prtcpntName, "Success");
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        console.log(error.error.title)
        this.toaster.error(error.error.title, "Error")
      }
    });
  }
}
