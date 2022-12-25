import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CnicExpiryService } from '../service/cnic-expiry.service';

@Component({
  selector: 'app-expiring-cnic',
  templateUrl: './expiring-cnic.component.html',
  styleUrls: ['./expiring-cnic.component.css']
})
export class ExpiringCnicComponent implements OnInit {
  expiringCnicForm: FormGroup;
  allClientsCnicExpiry: any;

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cnicExpiryService: CnicExpiryService,
    public sanitizer: DomSanitizer) {
      //Updated by Areeba
    this.expiringCnicForm = this.fb.group({
      loanAppSeq: ['', Validators.required],
      cmnt: ['', Validators.required],
      cnicNum: ['', Validators.required],
      relTyp: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllCnicExpiring();
  }

  get expiringCnicFormControls() {
    return this.expiringCnicForm.controls
  }

  openExpiringModal(client) {
    console.log(client)
    //Updated by Areeba
    this.expiringCnicForm = this.fb.group({
      loanAppSeq: [client.loanAppSeq],
      cmnt: ['', Validators.required],
      cnicNum: [client.cnicNum],
      relTyp: [client.relTyp]
    });
    (<any>$('#expiringCninc')).modal('show');
  }

  getAllCnicExpiring() {
    console.log(this.expiringCnicForm.value);
    this.cnicExpiryService.getAllCnicUpdate().subscribe(res => {
      this.allClientsCnicExpiry = res;
    });
  };


  modelSrc; client;
  loadModalForFrontPic(client) {
    document.getElementById('myModal').style.display = "block";
    this.modelSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + client.cnicFrntPic)
  }

  modelSrcBack;
  loadModalForBackPic(client) {
    document.getElementById('myModalBack').style.display = "block";
    this.modelSrcBack = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + client.cnicBckPic)
  }

  closeModal() {
    document.getElementById('myModal').style.display = "none";
  }

  closeModalBack() {
    document.getElementById('myModalBack').style.display = "none";
  }

  onApproveExpiringCnic() {
    this.expiringCnicForm.get('cmnt').clearValidators();
    this.expiringCnicForm.get('cmnt').updateValueAndValidity();
    this.spinner.show();
    //Updated by Areeba
    this.cnicExpiryService.getApproveCnic(this.expiringCnicForm.controls['loanAppSeq'].value, this.expiringCnicForm.controls['cmnt'].value, this.expiringCnicForm.controls['cnicNum'].value,this.expiringCnicForm.controls['relTyp'].value).subscribe(res => {
      (<any>$('#expiringCninc')).modal('hide');
      this.getAllCnicExpiring();
      this.spinner.hide();
      this.toaster.success("Cnic Upd Approved", "Success");
    }, (error) => {
      (<any>$('#expiringCninc')).modal('hide');
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error.status == 400) {
        this.toaster.error("Bad Request", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error");
      }
    });
  };

  onRejectExpiringCnic() {
    if (!this.expiringCnicForm.valid) {
      this.toaster.error("Please Enter Comments", "Error");
      return;
    } else {
      console.log(this.expiringCnicForm.controls['cmnt'].value)
      this.spinner.show();
      this.cnicExpiryService.getRejectCnic(this.expiringCnicForm.controls['loanAppSeq'].value, this.expiringCnicForm.controls['cmnt'].value).subscribe(res => {
        (<any>$('#expiringCninc')).modal('hide');
        this.getAllCnicExpiring();
        this.spinner.hide();
        this.toaster.success("Cnic Upd Rejected", "Success");
        console.log(res);
      }, (error) => {
        (<any>$('#expiringCninc')).modal('hide');
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error("Bad Request", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error");
        };
      });
    };
  };

  onSendBackExpiringCnic() {
    if (!this.expiringCnicForm.valid) {
      this.toaster.error("Please Enter Comments", "Error");
      return;
    } else {
      console.log(this.expiringCnicForm.controls['cmnt'].value);
      this.spinner.show();
      this.cnicExpiryService.getSendBackCnic(this.expiringCnicForm.controls['loanAppSeq'].value, this.expiringCnicForm.controls['cmnt'].value).subscribe(res => {
        (<any>$('#expiringCninc')).modal('hide');
        this.getAllCnicExpiring();
        this.spinner.hide();
        this.toaster.success("Cnic Upd Send Back", "Success");
      }, (error) => {
        (<any>$('#expiringCninc')).modal('hide');
        this.spinner.hide();
        if (error.status == 500) {
          this.toaster.error("Something Went Wrong", "Error");
        } else if (error.status == 400) {
          this.toaster.error("Bad Request", "Error");
        } else if (error) {
          this.toaster.error("Something Went Wrong", "Error");
        }
      });
    };
  };
}
