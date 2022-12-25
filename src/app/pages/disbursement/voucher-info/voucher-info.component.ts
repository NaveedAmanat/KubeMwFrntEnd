import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DisbursementVoucher } from '../../../shared/models/disbursementVoucher.model';
import { DisbursementService } from '../../../shared/services/disbursement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-voucher-info',
  templateUrl: './voucher-info.component.html',
  styleUrls: ['./voucher-info.component.css']
})
export class VoucherInfoComponent implements OnInit {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));


  isKSK: boolean = false;
  isMurabaha: boolean = false;
  isKTK: boolean = false;
  showLPDButton: boolean = false;
  model: DisbursementVoucher;
  minDate: Date;
  maxDate: Date;
  @Input() totalRev: number;
  @Input() frstInstDt: string;

  @Output() pdcslimit = new EventEmitter();

  @Output() isPaymentReq = new EventEmitter();

  @Output() disbursementAmt = new EventEmitter();

  @Output() recvAmt = new EventEmitter();

  @Output() prdSeq = new EventEmitter();

  @Output() prdGrpSeq = new EventEmitter();

  @Output() loanAppStatus = new EventEmitter();

  @Output() appSts = new EventEmitter();

  @Output() showHlthCard = new EventEmitter();

  @Output() disbAmount = new EventEmitter();
  
  @Output() firstInstallment = new EventEmitter();

  @Output() cnicNum = new EventEmitter();

  // Added by Zohaib Asim - Dated 16-03-2021
  // psdCount: any = 0;
  // End by Zohaib Asim

  constructor(private disbursementService: DisbursementService, private fb: FormBuilder, private router: Router, private toaster: ToastrService, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {

    //this.maxDate.setDate(this.minDate.getDate()+30);

    this.disbursementService.loanAppSeq = Number.parseInt(sessionStorage.getItem('loanAppSeq'));
    this.disbursementService.getDisbursementVoucher().subscribe((data) => {
      this.model = data;
      console.log("getDisbursementVoucher", this.model);
      this.disbursementAmt.emit(data.aprvdLoanAmt);
      this.pdcslimit.emit(data.prdSeq === '0010' && data.loanAppStatus === '1305' ? 0 : +data.pdcNum)
      this.isPaymentReq.emit(true);
      this.recvAmt.emit(data.totRecv);
      this.prdSeq.emit(data.prdSeq);
      this.appSts.emit(data.loanAppStatus);
      this.prdGrpSeq.emit(data.prdGrpSeq);
      this.loanAppStatus.emit(data.loanAppStatus);
      this.disbAmount.emit(data.aprvdLoanAmt)
      this.cnicNum.emit(data.cnicNum)
      if (this.model != undefined) {
        //this.totalRev=data.totRecv;
        this.frstInstDt = data.frstInstDt;
        this.showHlthCard.emit(data.prdSeq === '2657' || data.prdSeq === '0010' || data.prdSeq === '0019' ? false : true);
        this.isKSK = data.prdSeq == '0019' ? true : false;
        //Modified by Areeba - 23-12-2022 - Included KMWM in Murabaha
        this.isMurabaha = data.prdSeq == '0010' || data.prdSeq == '39' || data.prdSeq == '40' || data.prdSeq == '52' || data.prdSeq == '53' ? true : false;
        this.isKTK = data.prdSeq == '51' ? true : false;
        this.showLPDButton = data.prdSeq == '0019' ? true : false;
        if (this.model.loanCyclNum === null) {
          this.model.loanCyclNum = '1';
        }
      }
    });

    this.disbursementService.getPaymentSchedule().subscribe((data) => {
      let amt = 0;
      data.forEach(e => {
        amt = amt + e.detail.ppalAmtDue + e.detail.totChrgDue + this.calculateTotalCharge(e.chargers);
      });
      // this.recvAmt.emit(amt);
      this.totalRev = amt;
    });

    // Added by Zohaib Asim - Dated 16-03-2021
    this.disbursementService.setLoanApp(this.disbursementService.loanAppSeq);

    // Payment Schedule Detail Generated or Not
    //console.log("LoanObject:", this.loan.loanAppSeq);
    /*this.disbursementService.pymtSchedDtlGenerated(this.disbursementService.loanAppSeq).subscribe((response) => {
      this.psdCount = response.PSDCount;
      console.log("pymtSchedDtlGenerated" , response);
    }, (error) => {
      //this.spinner.hide();
      console.log("Error")
    });*/

  }
  calculateTotalCharge(chargers) {
    let amt = 0;
    chargers.forEach(ch => {
      amt = amt + ch.amt;
    })
    return amt;
  }

  printHealthCard() {
    this.disbursementService.getHealthCardPdf().subscribe((response) => {
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    });
  }
  printPaymentSchedule() {
    // Added by Zohaib Asim - Dated 16-03-2021
    // Production Issue: Report(Clickable) error while Loan is in Submitted Status
    /***if(this.getPymtSchedDtlGenerated(this.model)){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }***/
    // End by Zohaib Asim
    
    this.spinner.show();
    this.disbursementService.getPaymentSchedulePdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');

      // Added by Areeba - 3-11-2022 - KSWK Information
      if (this.model.prdGrpSeq == 22) {
        this.disbursementService.getRepaymentInfoKSWKPdf().subscribe((response) => {
          this.spinner.hide();
          var binaryData = [];
          binaryData.push(response);
          var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          window.open(fileURL, '_blank');
        }, (error) => {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong", "Error");
        });
      }
      // Ended by Areeba
    }, (error) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.toaster.error("Something Went Wrong", "Error");
      } else if (error) {
        this.toaster.error("Something Went Wrong", "Error")
      }
    });
  }
  printUndertaking() {
    this.spinner.show();
    this.disbursementService.getUndertakingPdf().subscribe((response) => {
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


  printAgencyInfoReport() {
    this.spinner.show();
    this.disbursementService.getPrintSomeFunckingShit().subscribe((response) => {
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



  printClientInfo() {
    // Added by Zohaib Asim - Dated 16-03-2021
    // Production Issue: Report(Clickable) error while Loan is in Submitted Status
    /***if(this.getPymtSchedDtlGenerated(this.model)){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }***/
    // End by Zohaib Asim

    this.spinner.show();
    this.disbursementService.getClientInfoPdf().subscribe((response) => {
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
  printLPD() {
    this.spinner.show();
    this.disbursementService.getLPD().subscribe((response) => {
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
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  // Added by Zohaib Asim - Dated 16-03-2021
  // Production Issue: Report(Clickable) error while Loan is in Submitted Status
  // For Submitted/Approved button will be disable
  getPymtSchedDtlGenerated(parmVal){
    if(parmVal != undefined && parmVal !=null){
        if((parmVal.loanAppStatus == "0002" || parmVal.loanAppStatus == "0004")){ //&& this.psdCount == 0
          return true;
        }
    }
    return false;
  }
  // End by Zohaib Asim

  // Added by Areeba - Dated 14-10-2022
  printCombinedPaymentSchedule() {    
    this.spinner.show();
    this.disbursementService.getCombinedPaymentSchedulePdf().subscribe((response) => {
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
  // Ended by Areeba

  // Added by Areeba - Dated 31-10-2022
  printOneLinkSlip() {
    this.spinner.show();
    this.disbursementService.getOneLinkPdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }
  //Ended by Areeba
}
