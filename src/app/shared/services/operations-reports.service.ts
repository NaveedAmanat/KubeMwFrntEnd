import { Injectable } from '@angular/core';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class OperationsReportsService {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  printDuesReport(frmDt, toDt, branch, type) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-dues/` + frmDt + `/` + toDt + `/` + branch + `/` + type;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPortfolioSegmentation(toDt, role, regSeq, areaSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-segmentation/${toDt}/${role}/${brnchSeq}/${areaSeq}/${regSeq}` ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printBranchTargetManagment(frmDt) {
    const url = `${this.apiModel.host}/reportservice/api/print-barnch-target-management/` + frmDt;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPortfolioAtRiskReport(toDt, role, regSeq, areaSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-at-risk/${toDt}/${role}/${brnchSeq}/${areaSeq}/${regSeq}` ;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printRiskFlagging(toDt, frmDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-risk-flagging/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printPortfolioStatus(toDt, role, regSeq, areaSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-status/${toDt}/${role}/${brnchSeq}/${areaSeq}/${regSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  printConsolidatedLoanReport(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-consolidated-loan/` + frmDt + `/` + toDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printRateOfRenewalReport(toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-ror/` + toDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printMonthlyStatus(frmDt, toDt, reptFlag) {
    const url = `${this.apiModel.host}/reportservice/api/print-monthly-status/` + frmDt + `/` + toDt + `/` + reptFlag;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printLoaprintLoanUtlizationnU(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-loan_utlization/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  printPortfolioAtRiskTimeSerise(dt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-at-risk-time/` + dt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printFemaleParticipationRatio(dt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-female-participation-ratio/` + dt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printportfolioStatusDuration(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-status-fromdt/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAdvanceRecoveryOverallReport(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-advance-recovery-report/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAdvanceClientReport(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-advance-client-report/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAdvanceMaturityReport(asDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-advance-maturity-report/` + asDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printWeeklyTargetReport(asDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-weekly-target-report/` + asDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAreaDisbursementReport(asDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-area-disb-report/` + asDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printPendingLoanUtilizationReport(frmDt, toDt, reptFlag) {
    const url = `${this.apiModel.host}/reportservice/api/print-pending-loan-utilization/` + frmDt + `/` + toDt + `/` + reptFlag;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printLateClosingReportForAllArea(frmDt, toDt, rpt_flg, areaSeq, regSeq, brnchSeq) {
    const url = `${this.apiModel.host}/reportservice/api/print-late-closing/` + toDt + `/` + frmDt + `/` + rpt_flg + `/` + areaSeq + `/` + regSeq + '/' + brnchSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAttendanceMonitoring(frmDt, toDt, reptFlag) {
    const url = `${this.apiModel.host}/reportservice/api/leave-and-attendance-monitoring-report/` + frmDt + `/` + toDt + `/` + reptFlag;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printAgenciesTargetTracking(branch) {
    const url = `${this.apiModel.host}/reportservice/api/agencies-target-tracking/` + branch;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }



  printSales2Pending(frmDt, toDt, branch) {
    const url = `${this.apiModel.host}/reportservice/api/print-sale-2-pending-report/` + frmDt + `/` + toDt + `/` + branch + `/` + this.auth.user.username;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

}
