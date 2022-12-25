import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {
  issueForm: FormGroup;
  totalIssue: any = [];
  sbCtgrySeq: string;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private complianceService: ComplianceService,
    private toaster: ToastrService, ) { }

  ngOnInit() {
    this.sbCtgrySeq = this.route.snapshot.paramMap.get('sbCtgrySeq');
    console.log(this.sbCtgrySeq)
    this.issueForm = this.fb.group({
      sbCtgrySeq: [this.sbCtgrySeq],
      adtIsuSeq: [],
      isuId: [],
      isuNm: ['', Validators.required]
    })

    this.complianceService.getAllIssues(this.sbCtgrySeq).subscribe(res => {
      this.totalIssue = res;
    });
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

  openIssuesModel() {
    this.issueForm.reset();
    this.issueForm.controls['sbCtgrySeq'].setValue(this.sbCtgrySeq);
    (<any>$('#issue')).modal('show');
  }


  onEditIssue(iss) {
    console.log(this.sbCtgrySeq);
    (<any>$('#issue')).modal('show');
    this.issueForm = this.fb.group({
      sbCtgrySeq: [this.sbCtgrySeq],
      adtIsuSeq: [iss.adtIsuSeq],
      isuId: [iss.isuId],
      isuNm: [iss.isuNm, Validators.required]
    })
  }

  onDeleteIssue(iss) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this issue?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.complianceService.deleteIssue(iss.adtIsuSeq).subscribe(data => {
          this.totalIssue.splice(this.totalIssue.indexOf(iss), 1);
          swal(
            'Deleted!',
            'Issue Deleted Successfully.',
            'success'
          );
        });
      }
    });
  }

  onSubmitIssue() {
    console.log(this.sbCtgrySeq)
    this.complianceService.postingIssues(this.issueForm.value).subscribe(response => {
      this.toaster.success('Issue Saved');
      this.complianceService.getAllIssues(this.sbCtgrySeq).subscribe(res => {
        this.totalIssue = res;
      });
      (<any>$('#issue')).modal('hide');
    }, error => {
      this.toaster.error('Something Went Wrong')
    });
  }

}
