import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/shared/services/loan.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';

@Component({
  selector: 'app-client-history',
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.css']
})
export class ClientHistoryComponent implements OnInit {

  /**
 * Added By Naveed - Date - 10-05-2022
 * SCR - Accounts -  NoOf Loan Tab History
 */
  noOfHistoryTab = 2;
  // End By Naveed

  constructor(private loanService: LoanService,
    private commonService: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private disbursementService: DisbursementService) { }
  modal: any = {}; loan;
  
  ngOnInit() {
    this.loan = JSON.parse(sessionStorage.getItem("historyLoan"));
    this.spinner.show();
    console.log(this.loan)
    this.loanService.getClientHistory(this.loan.clientId).subscribe(res => {
      this.modal = res;
      this.spinner.hide();

      // this.modal.loans.forEach(loan => {
      //   if (loan.loan.prdSeq) {
      //     this.loanService.getProductBySeq(loan.loan.prdSeq).subscribe(p => {
      //       loan.product = p;
      //     }, (error) => {
      //       console.log(error)
      //     })
      //   }
      // });

      // this.modal.loans.forEach((loan, x) => {
      //   loan.assocLoan = [];
      // });
      // let index = -1;
      // this.modal.loans.forEach((loan, x) => {
      //   this.modal.loans.forEach((loan2, y) => {
      //     if (loan2.loan.prntLoanAppSeq == loan.loan.prntLoanAppSeq && loan.loan.prntLoanAppSeq == loan.loan.loanAppSeq
      //       && loan2.loan.prntLoanAppSeq != loan2.loan.loanAppSeq) {
      //       loan.assocLoan.push(res.loans[y]);
      //       this.modal.loans.splice(y, 1);
      //       index = y;
      //     }
      //   })
      // })

      this.modal.loans2 = JSON.parse(JSON.stringify(this.modal.loans));
      console.log(this.modal)
      this.loanService.getInsurancePlans().subscribe((res) => {
        console.log(res);
        this.plans = res;
        if (this.modal.loans2 != null && this.modal.loans2 != undefined) {
          this.modal.loans2.forEach(obj => {
            if (obj != null && obj != undefined && obj.loan != null && obj.loan != undefined) {
                obj.loan.isHlthCardFlgInPlan = false;
                this.loanService.getSavedInsurancePlan(obj.loan.loanAppSeq).subscribe((res) => {
                  this.ins = res;
                  let plan = null;
                  if (this.ins != null && this.ins.healthInsrPlanSeq != undefined && this.ins.healthInsrPlanSeq != null) {
                    this.plans.forEach(pln => {
                      if (this.ins.healthInsrPlanSeq == pln.hlthInsrPlanSeq) {
                        plan = pln;
                      }
                    });
                    if(plan!=null && plan.hlthCardFlg!=undefined && plan.hlthCardFlg!=null && plan.hlthCardFlg!=undefined){
                      if(plan.hlthCardFlg==true){
                        obj.loan.isHlthCardFlgInPlan = true;
                      }
                    }
                  }
                  console.log(res);
                }, (error) => {
                  console.log('err In Loan Info Service');
                  console.log('err', error);
                });
            }
          });
        }
      }, (error) => {
        this.spinner.hide();
        console.log(error);
      });


    }, (error) => {
      console.log(error)
      this.spinner.hide();
    });


    /**
      * Added By Naveed - Date - 10-05-2022
      * SCR - Accounts -  NoOf Loan Tab History
    */
    this.commonService.getStpConfigValByGrpCd("0008").subscribe((response) => {
      this.noOfHistoryTab = +response[0].refCdValDscr;
    }, (error) => {
      //this.spinner.hide();
      console.log("Error")
    });
    // End by Naveed
    

    // Added by Zohaib Asim - Dated 16-03-2021
    this.disbursementService.setLoanApp(this.loan.loanAppSeq);

    // Payment Schedule Detail Generated or Not
    //console.log("LoanObject:", this.loan.loanAppSeq);
    /***this.disbursementService.pymtSchedDtlGenerated(this.loan.loanAppSeq).subscribe((response) => {
      this.psdCount = response.PSDCount;
      console.log("pymtSchedDtlGenerated" , response);
    }, (error) => {
      //this.spinner.hide();
      console.log("Error")
    });***/
    // End by Zohaib Asim

  }

  // this.loanService.getSavedInsurancePlan(loan.loanAppSeq).subscribe((res) => {
  //   this.obj = res;
  //   let plan = null;
  //   if (this.obj != null && this.obj.healthInsrPlanSeq != null) {
  //     this.plans.forEach(pln => {
  //       if (this.obj.healthInsrPlanSeq == pln.hlthInsrPlanSeq) {
  //         plan = pln;
  //       }
  //     });
  //     if(plan!=null && plan.hlthCardFlg!=undefined && plan.hlthCardFlg!=null && plan.hlthCardFlg!=undefined){
  //       if(plan.hlthCardFlg==true){
  //         this.isHlthCardFlgInPlan = true;
  //       }
  //     }
  //   }
  //   console.log(res);
  // }, (error) => {
  //   console.log('err In Loan Info Service');
  //   console.log('err', error);
  // });
  isHlthCardFlgInPlan = false;
  plans = [];
  ins = null;
  getlabelledby(ind) {
    return ind + "-tab-header";
  }


  printHealthCard(loan) {
    // Added by Zohaib Asim - Dated 16-03-2021
    // Production Issue: Report(Clickable) error while Loan is in Submitted Status
    if(this.getPymtSchedDtlGenerated(loan)){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }  
    // End by Zohaib Asim

    console.log(loan)
    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getHealthCardPdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }
  currPrd: any;
  printPaymentSchedule(loan) {
    // Added by Zohaib Asim - Dated 16-03-2021
    // Production Issue: Report(Clickable) error while Loan is in Submitted Status
    if(( loan.loanAppSts == 700 )){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }
    // End by Zohaib Asim

    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getPaymentSchedulePdf().subscribe((response) => {

      if(response.byteLength == 0){
        this.toaster.info('Required data not available', 'Information');
        this.spinner.hide();
        return;
      }else{
        var binaryData = [];
        binaryData.push(response);
        var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        window.open(fileURL, '_blank');
        this.spinner.hide();
      }

      // Added by Areeba - 3-11-2022 - KSWK Information
      this.loanService.getProductBySeq(this.loan.prdSeq).subscribe(p => {
        this.currPrd = p;
        if (this.currPrd.prdGrpSeq == 22) {
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
      });
      // Ended by Areeba
    }, error => {
      this.spinner.hide();
    });
  }
  isKskNot(loan) {
    // console.log(loan)
    let v = false;
    if (loan.assocLoans != undefined && loan.assocLoans != null) {
      if (loan.assocLoans.length > 0) {
        for (let i = 0; i < loan.assocLoans.length; i++) {
          if (loan.assocLoans[i].product.prdId == "0019") {
            v = true
          }
        }
      }
    }
    return v;
  }

  isMurhaba(loan) {
    console.log(loan);
    let healthCard = false;
    if (loan.product.prdId == "0010") {
      healthCard = false;
    } else {
      healthCard = true;
    }
    return healthCard;
  }

  printUndertaking(loan) {
    console.log(loan);
    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getUndertakingPdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }
  showHlthCard = false;
  showHealthCard(data) {
    this.showHlthCard = data.prdSeq === '2657' || data.prdSeq === '0010' || data.prdSeq === '0019' ? false : true;
  }
  printClientInfo(loan) {
    // Added by Zohaib Asim - Dated 16-03-2021
    // Production Issue: Report(Clickable) error while Loan is in Submitted Status
    if(( loan.loanAppSts == 700 )){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }
    // End by Zohaib Asim

    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getClientInfoPdf().subscribe((response) => {
      this.spinner.hide();
      if(response.byteLength == 0){
        this.toaster.info('Required data not available', 'Information');
      }else{
        var binaryData = [];
        binaryData.push(response);
        var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        window.open(fileURL, '_blank');
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      this.toaster.info('Required data not available.', 'Info!');
    });
  }
  
  printMfcib(loan, type) {
    this.spinner.show();
    this.disbursementService.getMfcibPdf(this.modal.client.cnicNum, type).subscribe((response) => {
      this.spinner.hide();
      if(response.byteLength == 0){
        this.toaster.info('No Data Found', 'Information');
      }else{
        var binaryData = [];
        binaryData.push(response);
        var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        window.open(fileURL, '_blank');
      }
    }, error => {
      this.spinner.hide();
    });
  }


  printAnimalInfo(loan) {
    this.spinner.show();
    this.disbursementService.getAnimalPicture(loan).subscribe((response) => {
      this.spinner.hide();
      if(response.byteLength == 0){
        this.toaster.info('No Data Found', 'Information');
      }else{
        var binaryData = [];
        binaryData.push(response);
        var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        window.open(fileURL, '_blank');
      }
    }, error => {
      this.spinner.hide();
    });
  }
  isKmwk(loan){
    let kmwkPrd = [25, 26, 38, 30, 31, 32, 52, 53]
      return kmwkPrd.includes(this.loan.prdSeq);
  }
  
  printClientVerisys(loan) {
    this.spinner.show();
    this.disbursementService.getClientVerisysReport().subscribe((response) => {
      this.spinner.hide();
      var mediaType = 'image/jpeg';
      var blob = new Blob([response], { type: mediaType });
      if(blob.size>0){
        var fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      }else this.toaster.info('No record found for Verisys');
    }, error => {
      this.spinner.hide();
    });
  }

  printNomineeVerisys(loan) {
    this.spinner.show();
    this.disbursementService.getNomineeVerisysReport().subscribe((response) => {
      this.spinner.hide();
      var mediaType = 'image/jpeg';
      var blob = new Blob([response], { type: mediaType });
      if(blob.size>0){
        var fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      }else this.toaster.info('No record found for Verisys');
    }, error => {
      this.spinner.hide();
    });
  }
  
  printLPD(loan) {
    console.log(loan)
    let seq = 0;
    if (loan.assocLoans != undefined && loan.assocLoans != null) {
      if (loan.assocLoans.length > 0) {
        for (let i = 0; i < loan.assocLoans.length; i++) {
          if (loan.assocLoans[i].product.prdId == "0019") {
            seq = loan.assocLoans[i].loan.loanAppSeq;
          }
        }
      }
    }
    if (seq == 0) {
      return;
    }
    this.spinner.show();
    this.disbursementService.loanAppSeq = seq;
    console.log(seq)
    this.spinner.show();
    this.disbursementService.getLPD().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }

  // Added by Zohaib Asim - Dated 16-03-2021
  // Production Issue: Report(Clickable) error while Loan is in Submitted Status
  // For Submitted/Approved button will be disable
  getPymtSchedDtlGenerated(parmVal){    
    if(parmVal != undefined && parmVal !=null){
      if((parmVal.loanAppSts == 700 || parmVal.loanAppSts == 702)){
        return true;
      }
    }
    return false;
  }
  // End by Zohaib Asim

  // Added by Areeba - Dated 14-10-2022
  printCombinedPaymentSchedule(loan) {
    if(( loan.loanAppSts == 700 )){
      this.toaster.info('Required data not available.', 'Info!')
      return;
    }

    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getCombinedPaymentSchedulePdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      this.spinner.hide();
    });
  }

  isKtk(loan){
    let v = false;
    if (loan.product != undefined && loan.product != null) {
      if (loan.product.prdId == "51") {
            v = true
      }
    }
    return v;
  }
  // Ended by Areeba

  // Added by Areeba - Dated 31-10-2022
  printOneLinkSlip(loan) {
    if(( loan.loanAppSts == 700 )){
      this.toaster.info('Required data not available.', 'Info!');
      return;
    }
    console.log(loan)
    this.spinner.show();
    this.disbursementService.loanAppSeq = loan.loanAppSeq;
    this.disbursementService.getOneLinkPdf().subscribe((response) => {
      this.spinner.hide();
      var binaryData = [];
      binaryData.push(response);
      var fileURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      window.open(fileURL, '_blank');
    }, error => {
      if (error.status == 500) {
        this.toaster.info('Required data not available.', 'Info!')
      }
      this.spinner.hide();
    });
  }
  //Ended by Areeba
}
