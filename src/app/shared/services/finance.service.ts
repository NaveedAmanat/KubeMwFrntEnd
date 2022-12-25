import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }


  printFundsReport(frmDt, toDt, branch, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-funds-report/` + frmDt + `/` + toDt + `/` + branch + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printDonorTaggingReport(frmDt, toDt, branch, donor) {
    const url = `${this.apiModel.host}/reportservice/api/donner-tagging-report/` + frmDt + `/` + toDt + `/` + branch + `/` + donor;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  printRecoveryReport(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-recovery-report/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printDisbursementReport(frmDt, toDt, branch, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-disbursement-report/` + frmDt + `/` + toDt + `/` + branch + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printFundManagmentTool(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-fund-management-report/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printOrganizationTaggingReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-organization-tagging-report/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printProductWiseDisbursement(frmDt, toDt, prd) {
    const url = `${this.apiModel.host}/reportservice/api/print-product-wise-disbursement-report/` + frmDt + `/` + toDt + `/` + prd;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printOrganizationTime(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-ogranization-time-report/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  
  printMcbRemitDisbFunds(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mcb-remittance-disbursement-funds/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMcbRemitDisbLoader(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mcb-remittance-disbursement-loader/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMcbRemitDisbLetter(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mcb-remittance-disbursement-letter/` + frmDt + `/` + toDt + `/` + isXls;;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printChequeDisbFunds(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-check-disbursement-funds/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

    // modified By Naveed - Date - 24-02-2022 
  // SCR - Upaisa and HBL Konnect Payment Mode 
  printMobileWalletFunds(frmDt, toDt,paymentMode, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mobile-wallet-Disburse-funds/${frmDt}/${toDt}/${paymentMode}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMobileWalletLoader(frmDt, toDt, paymentMode, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mobile-wallet-Disburse-loader/${frmDt}/${toDt}/${paymentMode}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMobileWalletLetter(frmDt, toDt, paymentMode, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mobile-wallet-Disburse-letter/${frmDt}/${toDt}/${paymentMode}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended BY Naveed
  printClntInfoJazzDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/clnt-info-jazz-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  printClntUploadJazzDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/clnt-upload-jazz-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  
  printEasyPaisaDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/easy-paisa-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printUblOmniDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/ubl-omni-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printHblConnectDues(toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/hbl-connect-dues/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAblLoanRecoveryDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/abl-loan-recovery-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMcbCollect(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/mcb-collect-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  
  printNadraDues(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/nadra-dues/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  //Added by Areeba - 20-12-2022
  printAdcDataSharingReport(reportNm, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/adc-data-sharing-reports/` + reportNm + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  
  printDateWiseDisb(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-date-wise-disb-funds/` + frmDt + `/` + toDt + `/` + isXls ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printChannelWiseDisb(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-channel-wise-disb/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printBranchWiseDisb(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-wise-disb/` + frmDt + `/` + toDt  + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printProductWiseDisb(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-product-wise-disb/` + frmDt + `/` + toDt  + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printBranchWiseReversal(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-wise-reversal/` + frmDt + `/` + toDt  + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printDateWiseRecovery(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-date-wise-recovery/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printChannelWiseRecovery(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-channel-wise-recovery/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printBranchWiseRecovery(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-wise-recovery/` + frmDt + `/` + toDt + `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printADCsPostedRecovery(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-ADCs-posted-recovery/` + frmDt + `/` + toDt  + '/' + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMcbRemiMapped(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mcb-remi-mapped-brnch/` + isXls; 
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  
  // Added By Naveed - Date - 24-02-2022 
  // SCR - Upaisa and HBL Konnect Payment Mode 
  printBankBrnchMapped(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mcb-bank-brnch-mapped/` + isXls; 
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMobileWalletMapped(walletMode, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-mobile-wallet-mapped/${walletMode}/${isXls}`; 
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  } // Ended By Naveed

  printUblOmniMapped(isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-ubl-omni-branch-mapped/` + isXls; 
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  // Added By Naveed - Date - 13-10-2021
  // Telenor Collection Report - SCR-EasyPaisa Integration
  // Modified By Naveed - Dated 23-01-2022
  // SCR - Munsalik Integration 
  //  added online collection channel like, easypaisa and muslink
  
  printTelenorReport(frmDt, toDt, brnchSeq,channelSeq, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-telenor-collection-report/${frmDt}/${toDt}/${brnchSeq}/${channelSeq}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
// Ended By Naveed - Date - 13-10-2021
// Ended By Naveed - Date - 23-01-2022


  // Added By Naveed - Date - 04-11-2021
  // Inquiries Telenor Collection Report - SCR-EasyPaisa Integration
  // Modified By Naveed - Dated 23-01-2022
  // SCR - Munsalik Integration 
  //  added online collection channel like, easypaisa and muslink
  printInquiriesTelenorReport(frmDt, toDt, brnchSeq, channelSeq, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-Inquiries-telenor-collection-report/${frmDt}/${toDt}/${brnchSeq}/${channelSeq}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
// Ended By Naveed - Date - 04-11-2021
// Ended By Naveed - Date - 23-01-2022

printMobileWalletTrend(frmDt, toDt, brnchSeq, type, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/mobile-wallet-trend/${frmDt}/${toDt}/${brnchSeq}/${type}/${isXls}`;
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
  });
}

printUPaisaDuesShring(walletMode, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/upaisa-dues-sharing/${walletMode}/${isXls}`; 
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
  });
}

printATMCardsManagement(frmDt, toDt, brnchSeq, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/atm-cards-report/${frmDt}/${toDt}/${brnchSeq}/${isXls}`;
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
  });
}
 /**
  * Added By Naveed - Date 10-05-2022
  * SCR - MCB Disbursement
  */
printMcbDisburseFunds(frmDt, toDt, branchSeq, type, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/get-mcb-disbursement-funds/${frmDt}/${toDt}/${branchSeq}/${type}/${isXls}` 
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
    });
  }
  
printMcbDisburseReversal(frmDt, toDt, branchSeq, type, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/get-mcb-disbursement-reversal/${frmDt}/${toDt}/${branchSeq}/${type}/${isXls}` 
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
    });
  }


printIbftAndIftReport(frmDt, toDt, type, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/print-ibft-ift-report/${frmDt}/${toDt}/${type}/${isXls}` 
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
    });
  }

printConsolidatedOfBankFunds(fromDate, toDate, isXls) {
  const url = `${this.apiModel.host}/reportservice/api/print-consolidated-bank-funds/${fromDate}/${toDate}/${isXls}` 
  return this.http.get<any>(url, {
    responseType: 'arraybuffer' as 'json',
    headers: this.apiModel.httpHeaderPost
    });
  }
  
consolidatedOfBankFundsLoader(fromDate, toDate) {
  return this.http.get<any>(`${this.apiModel.host}/reportservice/api/consolidated-bank-funds-loader/${fromDate}/${toDate}` , { headers: this.apiModel.httpHeaderGet });
  }

  printBankFundsRequestDataLoader(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-bank-funds-request-data-loader/${frmDt}/${toDt}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printKhushaliFundsLetter(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/print-khushali-funds-letter/${frmDt}/${toDt}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printSectorWisePortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-sector-wise-portfolio/`+ toDt ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printGenderWisePortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-gender-wise-portfolio/`+ toDt ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printBranchWisePortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-wise-portfolio` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printProductWisePortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-product-wise-portfolio` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printProductWisePar(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-product-wise-par` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printBranchWisePar(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-wise-par` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  // Added by Areeba - 15-11-2022
  printProvinceWiseOutstandingPortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-province-wise-ost-portfolio` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printLoanCycleWisePortfolio(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-loan-cycle-wise-portfolio` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printKMWKClientIncome(toDt, rate, currency) {
    const url = `${this.apiModel.host}/reportservice/api/print-kmwk-client-income` + `/` + toDt + `/` + rate + `/` + currency;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMonthlyDue(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-monthly-due` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printPortfolioMaturity(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-maturity` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printMonthlyRecovery(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-monthly-recovery` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printPortfolioSizeBreakup(toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-size-breakup` + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Areeba
}