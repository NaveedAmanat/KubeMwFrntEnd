import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnmlService } from 'src/app/shared/services/anml.service';
import { AnmlList } from 'src/app/shared/models/anml-list.module';
import { ActivatedRoute } from '@angular/router';
import { LoanServicingService } from 'src/app/shared/services/loan-servicing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

@Component({
  selector: 'app-animal-death',
  templateUrl: './animal-death.component.html',
  styleUrls: ['./animal-death.component.css']
})
export class AnimalDeathComponent implements OnInit {
  animalDeathForm: FormGroup;
  minDate: Date;
  maxDate: Date = new Date();
  allItems: AnmlList[];
  animal: AnmlList;
  clntSeq: number;
  private sub: any;
  reverseForm: FormGroup;
  deathAdjustmentForm: FormGroup;
  submitted: Boolean = false;
  public isLastAnml: boolean;

  auth = JSON.parse(sessionStorage.getItem('auth'));
  constructor(
    private fb: FormBuilder,
    private anmlService: AnmlService, private route: ActivatedRoute,
    private loanServicingService: LoanServicingService, private toaster: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.animalDeathForm = this.fb.group({
      anmlRgstrSeq: ['', Validators.required],
      tagNum: ['', Validators.required],
      type: ['', Validators.required],
      dthDt: ['', Validators.required],
      dthCase: ['', Validators.required]
    });
    this.deathAdjustmentForm = this.fb.group({
      anmlDthAdj: ['', Validators.required]

    });
  }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.clntSeq = +params['id'];
    });

    console.log(this.clntSeq);
    this.anmlService.getAnmlList(this.clntSeq).subscribe((data => {
      this.allItems = data;
      this.allItems.forEach((ele) => {
        this.minDate = ele.rgstrDt;
      })
    }));

    this.reverseForm = this.fb.group({
      dthRptSeq: ['', Validators.required],
      cmnt: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z ]+$")]],
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  animalStatus(flag) {
    let str = '';
    if (flag == 3) {
      str = 'Death';
    } else if (flag == 4) {
      str = 'Theft';
    } else if (flag == 5) {
      str = 'Sold';
    }
    return str;
  }


  animalReportDeath(anml: AnmlList) {
    let dthAnmlCount = 0;
    this.allItems.forEach(a => {
      if (a.flag != 0) {
        dthAnmlCount++;
      }
    });
    if (this.allItems.length - 1 == dthAnmlCount) {
      this.isLastAnml = true;
    }
    this.animal = anml;
    this.animalDeathForm = this.fb.group({
      anmlRgstrSeq: [anml.anmlRgstrSeq, Validators.required],
      tagNum: [{ value: anml.tagNum, disabled: true }, Validators.required],
      type: ['', Validators.required],
      dthDt: ['', Validators.required],
      dthCase: ['', Validators.required]
    });
    (<any>$('#reportAnimalDeath')).modal('show');
  }

  submitAnimalReportDeath() {
    this.spinner.show();
    console.log(this.animalDeathForm.value);
    (<any>$('#reportAnimalDeath')).modal('hide');
    this.submitted = true;
    this.anmlService.addAnmlDeath(this.animalDeathForm.value).subscribe((data) => {
      console.log(this.clntSeq);
      this.spinner.hide();
      this.anmlService.getAnmlList(this.clntSeq).subscribe((data => {
        this.allItems = data;
      }));
      this.animal.dthDt = this.animalDeathForm.value.dthDt;
      this.animal.dthCase = this.animalDeathForm.value.dthCase;
      if (this.animalDeathForm.value.type === 3) {
        this.printInsuClmForm(this.animal.anmlRgstrSeq);
      }
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Internal Server Error", "Error")
      }
    });
  }


  reverseAnimal(anml) {
    (<any>$('#reverseAnimal')).modal('show');
    this.animal = null;
    this.animal = anml;
    this.reverseForm = this.fb.group({
      dthRptSeq: [anml.anmlRgstrSeq, Validators.required],
      cmnt: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z ]+$")]],
    });

  }

  onSubmitReverseAnimal() {
    this.spinner.show();
    (<any>$('#reverseAnimal')).modal('hide');
    console.log(this.reverseForm.value);
    this.reverseForm.value.cmnt == null ? ' ' : this.reverseForm.value.cmnt;
    this.loanServicingService.reversAnimalReportDeath(this.animal.anmlRgstrSeq, this.reverseForm.value.cmnt).subscribe(d => {

      this.spinner.hide();
      console.log(this.clntSeq);
      this.anmlService.getAnmlList(this.clntSeq).subscribe((data => {
        this.allItems = data;
        this.allItems.forEach((ele) => {
          this.minDate = ele.rgstrDt;
        })
      }));
      if (d != null) {
        this.animal.dthDt = ""
        this.animal.dthCase = "";
        this.animal.flag = "";
      }
    }, error => {

      this.spinner.hide();
    });
  }

  printInsuClmForm(anmlRgstrSeq: string) {
    this.loanServicingService.printAnmlInsuClmForm(anmlRgstrSeq).subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }


  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onClickOpenDeathAdjustmentForm(anml) {
    (<any>$('#deathAdjustment')).modal('show');
    this.deathAdjustmentForm.reset();
    this.animal = null;
    this.animal = anml;
    //console.log(this.deathAdjustmentForm.controls['anmlDthAdj'].value);
  }

  onSubmitAnimalDeathAdjustmentForm() {
    console.log(this.clntSeq);
    console.log(this.deathAdjustmentForm.controls['anmlDthAdj'].value);
    this.spinner.show();
    this.checkAnmlAdjAmt(this.clntSeq, this.deathAdjustmentForm.controls['anmlDthAdj'].value);
  }

  //Added by Areeba 16-9-2022
  checkAnmlAdjAmt(seq, amt) {
    this.anmlService.checkAnmlAdjAmt(seq, amt).subscribe((data => {
      if (data == false) {
        this.spinner.hide();
        //this.toaster.warning("Animal Loan Adjustment Amount should not be less than the last installment or greater than Total Disbursed amount + Service charges", "Warning");
        //this.toaster.warning("Please enter the loan adjustment amount received from Head office", "Warning");
        swal({
          title: 'Information',
          text: "Please enter the loan adjustment amount received from Head office",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        });
      }
      else {
        this.anmlService.postAnimalLoanAdjust(this.animal.anmlRgstrSeq,this.animal.anmlSts, this.deathAdjustmentForm.controls['anmlDthAdj'].value).subscribe(data => {
          this.animal.clmSts = 1;
          this.spinner.hide();
          console.log(data);
          this.toaster.success("Animal Death Adjusted");
          (<any>$('#deathAdjustment')).modal('hide');
          this.anmlService.getAnmlList(this.clntSeq).subscribe((data => {
            this.allItems = data;
          }));
        }, (error) => {
          this.spinner.hide();
          (<any>$('#deathAdjustment')).modal('hide');
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
      }
    }),
      (error) => {
        this.spinner.hide();
        this.toaster.error(error.error, "Error");
      })
  }
  //Ended by Areeba

}
