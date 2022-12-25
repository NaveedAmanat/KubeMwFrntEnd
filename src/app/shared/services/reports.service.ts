import { toDate } from '@angular/common/src/i18n/format_date';
import { Injectable } from '@angular/core';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  printOverDueReport(prdSeq, asDt, branch, type) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-overdue-loans/` + prdSeq + `/` + asDt + `/` + branch + `/` + type;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPortfolooReport(frmDt, toDt, branch, type) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-portfolio/` + frmDt + `/` + toDt + `/` + branch + `/` + type;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printDueReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio/` + frmDt + `/` + toDt + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printConsolidatedLoanReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio/` + frmDt + `/` + toDt + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printLoanCompilationReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio/` + frmDt + `/` + toDt + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printPortfolioSegmentationReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio/` + frmDt + `/` + toDt + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printFundStmntReport(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-fund-statment/` + frmDt + `/` + toDt + `/` + branch + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printInsuClmForm(clntSeq: number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-insu-clm-frm/` + clntSeq + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  //Added by Areeba
  printInsuClmFormForDsblty(clntSeq: number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-insu-clm-frm-dsblty/` + clntSeq + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  //Ended by Areeba
  
  getPostedReport(date: String, a: number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-posted-report/${date}` + `/` + a;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printAccountLedger(account: any) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-account-ledger/` + this.auth.user.username;
    return this.http.post<any>(url, account, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printBookDetails(account: any) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-book-details/` + this.auth.user.username;
    return this.http.post<any>(url, account, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printTransferredClients(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-transferred-clients/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printDueRecovery(account: any) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-due-recovery/` + this.auth.user.username;
    return this.http.post<any>(url, account, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printWomenParticipation(date: string, branch: number) {
    const url = `${this.apiModel.host}/reportservice/api/print-women-participation/` + date + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printClientHealthBeneficiery(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-clt-health-beneficiary/` + frmDt + `/` + toDt + `/` + branch + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printBranchTurnoverAnalysisAndPlaning(date: string, branch: number) {
    const url = `${this.apiModel.host}/reportservice/api/print-brnch-turnover-anlysis/` + date + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printInsuranceClaimReport(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-insurance-claim/` + frmDt + `/` + toDt + `/` + branch + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  parBranchWise(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/print-par-branch-wise/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPdcDetail(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/print-pdc-detail/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printBranchPerformanceReview(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/print-branch-performance-review/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printFiveDaysAdvanceRecoveryTrends(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-five-days-advance-recovery-trends/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printTopSheet(frmDt, toDt, branch, prd, flg) {
    const url = `${this.apiModel.host}/reportservice/api/print-top-sheet/` + frmDt + `/` + toDt + `/` + branch + `/` + prd + `/` + flg;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printRateOfRetention(branch: number) {
    const url = `${this.apiModel.host}/reportservice/api/rate-of-retention/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printProjectedClientsLoanCompletetion(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-projected-clients-loan-completetion/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPortfolioConcentration(prd, branch, asDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-concentration/` + prd + `/` + branch + `/` + asDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPendingClients(prd, branch, asDt, typ, portSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-pending-client/` + prd + `/` + branch + `/` + asDt + `/` + typ + `/` + portSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printTaggedClientClaim(prd, branch, asDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-tagged-client-claim/` + prd + `/` + branch + `/` + asDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printProductWiseAddition(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/print-product-wise-addition/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printAgenciesTargetTracking(branch: number) {
    const url = `${this.apiModel.host}/reportservice/api/agencies-target-tracking/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printAdcBranchWise(frmDt, toDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-region-wise-adc/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printTurnAroundTime(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-turn-around-time/` + frmDt + `/` + toDt
      + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + `/` + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printFemalearticipation(toDt, role, regSeq, areaSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-female-participation-time/${toDt}/${role}/${regSeq}/${areaSeq}/${brnchSeq}` ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printReversedEnteriesReprt(frmDt, toDt, brnch) {
    const url = `${this.apiModel.host}/reportservice/api/print-reversal-enteries-report/` + frmDt + `/` + toDt + `/` + brnch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printTrailBalanceReport(frmDt, toDt, brnch) {
    const url = `${this.apiModel.host}/reportservice/api/print-trail-balance-report/` + frmDt + `/` + toDt + `/` + brnch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printParMdReport(toDt) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-md-par_report/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printActiveClients() {
    const url = `${this.apiModel.host}/reportservice/api/print-active-clients`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  //Added By Naveed, Dated: 13/11/2020
  bmBdoRecoveryReport(frmDt, toDt) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/bm-bdo-recovery/` + frmDt + `/` + toDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  //end
//end
  printMobileWalletDisbursment(frmDt, toDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/mobile-wallet/` + frmDt + `/` + toDt +  `/` + isXls;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  } //end

    //start
    printMobileWalletDisbursmentDue(frmDt, toDt, isXls) {
      const url = `${this.apiModel.host}/reportservice/api/mobile-wallet-due/` + frmDt + `/` + toDt +  `/` + isXls;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    } //end

	//start
	printClientLoanMaturity(toDt, isXls) {
	const url = `${this.apiModel.host}/reportservice/api/client-loan-maturity/` + toDt + `/` + isXls;
	return this.http.get<any>(url, {
	responseType: 'arraybuffer' as 'json',
	headers: this.apiModel.httpHeaderPost
	});
	} //end
	  
	printPortfoloNewReport(frmDt, toDt, branch) {
		const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-portfolio-new/` + frmDt + `/` + toDt + `/` + branch;
		return this.http.get<any>(url, {
		  responseType: 'arraybuffer' as 'json',
		  headers: this.apiModel.httpHeaderPost
		});
	  }
	
	verisysReport(frmDt, toDt, brnchSeq, areaSeq, regSeq, type, isXls) {
      const url = `${this.apiModel.host}/reportservice/api/verisys-report/` + frmDt + `/` + toDt + '/' + brnchSeq + `/`  + areaSeq + `/` + regSeq +  `/` + type + `/` + isXls;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
	
	printAnimalMissingTag(toDt, brnchSeq) {
      const url = `${this.apiModel.host}/reportservice/api/print-missing-animal-tag/` + toDt + '/' + brnchSeq ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
	
    printRecoveryTrendAnalysis(frmDt, toDt, role, brnchSeq, areaSeq, regSeq, type) {
      const url = `${this.apiModel.host}/reportservice/api/print-recovery-trend-analysis/${frmDt}/${toDt}/${role}/${brnchSeq}/${areaSeq}/${regSeq}/${type}`;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }

    printPortfolioKM(frmDt, toDt, brnchSeq) {
      const url = `${this.apiModel.host}/reportservice/api/print-portfolio-km/` + frmDt + `/` + toDt + '/' + brnchSeq
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
	
	printBmMobileWalletDisbursment(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/bm-mobile-wallet/` + frmDt + `/` + toDt + `/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
	  });
	} 

    printBmMobileWalletDisbursmentDue(frmDt, toDt, branch) {
      const url = `${this.apiModel.host}/reportservice/api/bm-mobile-wallet-due/` + frmDt + `/` + toDt + `/` + branch;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    } 
	
    printBmClientLoanMaturity(toDt, branch) {
        const url = `${this.apiModel.host}/reportservice/api/bm-client-loan-maturity/` +  toDt + `/` + branch;
        return this.http.get<any>(url, {
          responseType: 'arraybuffer' as 'json',
          headers: this.apiModel.httpHeaderPost
        });
      } 

   // Added by Areeba Date - 22-01-2022
   // SCR - mobile Wallet
    printMobWalLoansReport( toDt, frmDt, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/mob-wal-loans-report/${toDt}/${frmDt}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
   // Ended by Areeba

    // Added by Areeba Date - 22-01-2022
   // SCR - Transfer Clients
    printTransferClientsDetails(frmDt, toDt, brnch, isXls){
      const url = `${this.apiModel.host}/reportservice/api/transfer-clients-details-report/` + frmDt + `/` + toDt + `/` + brnch + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    // Ended By Areeba

  // Added By Areeba
  // Dated 25-1-2022
  // Purpose: Top Sheet Transfer Clients Report
  printTopSheetTransferClients(frmDt, toDt, brnch, isXls){
    const url = `${this.apiModel.host}/reportservice/api/top-sheet-transfer-clients-report/` + frmDt + `/` + toDt + `/` + brnch + `/` + isXls ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended By Areeba


   // Added by Naveed - Date - 27-01-2022
   // SCR - RM Reports
   // Regional Risk Flagging Report
   // update by Naveed - add param for areaSeq
   printRegionalRiskFlgging(frmDt, toDt, regSeq, areaSeq){
    const url = `${this.apiModel.host}/reportservice/api/regional-risk-flagging-report/` + frmDt + `/` + toDt + `/` + regSeq + `/` + areaSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Naveed - Date - 27-01-2022

  // Added by Naveed - Date 27-01-2022
  // SCR - RM Reports
  // Regional Risk And Social KPIs Report
  // update by Naveed - add param for areaSeq
   printRegionalRiskAndSocialKpi(frmDt, toDt, regSeq, areaSeq){
    const url = `${this.apiModel.host}/reportservice/api/regional-risk-and-social-kpi/` + frmDt + `/` + toDt + `/` + regSeq + `/` + areaSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Naveed - Date - 27-01-2022

  // Added by Naveed - Date 27-01-2022
  // SCR - RM Reports
  // Regional Risk And Social KPIs Report
  // update by Naveed - add param for areaSeq
   printRegionalDisbursement(frmDt, toDt, regSeq, areaSeq){
    const url = `${this.apiModel.host}/reportservice/api/regional-disbursement/` + frmDt + `/` + toDt + `/` + regSeq + `/` + areaSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Naveed - Date - 27-01-2022

    // Added By Areeba- Date 15-02-2022 - Accounts Reports
    printPremiumData(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/premium-data-report/` + toDt + `/` + isXls;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printPremiumDataKM(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/premium-data-km-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printWORecovery(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/wo-recovery-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printWOClientData(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/wo-client-data-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printAccRecovery(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/acc-recovery-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printClientData(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/clnt-data-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    printKSZBClientData(toDt, isXls){
      const url = `${this.apiModel.host}/reportservice/api/kszb-clnt-data-report/` + toDt + `/` + isXls ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    // Ended by Areeba

    // Added by Naveed - Date - 15-03-2022
    // Accounts Monthly Report
    printAccountMonthlyReport(toDt, fileName,  type){
      const url = `${this.apiModel.host}/reportservice/api/account-monthly-report/` + toDt + `/` + fileName + `/` + type  ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }

    // Added by Naveed - Date 07-03-2022
    // SCR - RM Reports
    // Regional Recovery Trend
    // update by Naveed - add param for areaSeq
    printRegionalRecoveryTrend(frmDt, toDt, regSeq, areaSeq){
      const url = `${this.apiModel.host}/reportservice/api/regional-recoveries-trend/` + frmDt + `/` + toDt + `/` + regSeq + `/` + areaSeq;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    // End By Naveed

     // Added by Areeba - Date - 30-03-2022
    // Audit Reports
    printAuditReport(frmDt, toDt, fileName,  type){
      const url = `${this.apiModel.host}/reportservice/api/audit-report/` + frmDt + `/` + toDt + `/` + fileName + `/` + type  ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }

    /**
     * @Added, Naveed
     * @Date, 08-06-2022
     * @Description, NADRA Verisys Status Report
     */
    printNadraVerisysStausReport(frmDt, toDt){
      const url = `${this.apiModel.host}/reportservice/api/print-nadra-verisys/${frmDt}/${toDt}`  ;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }

    printExportBankBookCsv(fromDate, todate, type){
      const url = `${this.apiModel.host}/reportservice/api/print-export-csv/` + fromDate + `/` + todate + `/` + type;
      return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
    }

    // Added by Areeba - 9-9-2022
    printAdcFailedTransaction(logDt){
      const url = `${this.apiModel.host}/reportservice/api/print-adc-failed-transaction/` + logDt ;
      return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
    }
    //Ended by Areeba

    printAuditSampling(asofDt, brnchCd, type) {
      const url = `${this.apiModel.host}/reportservice/api/print-sampling-audit/${asofDt}/${brnchCd}/${type}`;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
}
