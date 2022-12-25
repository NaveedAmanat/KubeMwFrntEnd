import { Injectable } from '@angular/core';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})

export class LoanServicingService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }


  // getAllClnts(brnchSeq) {
  //   const url = `${this.apiModel.host}/adminservice/api/all-active-clnts/` + this.auth.user.username + '/' + brnchSeq;
  //   return this.http.get<LoanServicing[]>
  //     (url, { headers: this.apiModel.httpHeaderGet }).pipe(
  //       tap((data: any) => this.spinner.hide()),
  //       catchError(this.handleError('getAllPaymentSchedules')));
  // }

  getAllClnts(brnchSeq, pageIndex, pageSize, filter, isCount):Observable< {"clnts":any, "count": Number}> {
    const url = `${this.apiModel.host}/adminservice/api/all-active-clnts?userId=` + this.auth.user.username + '&brnchSeq=' + brnchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount;
    return this.http.get<LoanServicing[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data:  {"clnts":any, "count": Number}) => this.spinner.hide()),
        catchError(this.handleError('getAllPaymentSchedules')));
  }

  getClientBySeq(seq) {
    const url = `${this.apiModel.host}/loanservice/api/mw-clnts/` + seq;
    return this.http.get<LoanServicing[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => this.spinner.hide()),
        catchError(this.handleError('getAllPaymentSchedules')));
  }

  getClntTagForCnic(cnic) {
    const url = `${this.apiModel.host}/setupservice/api/get-clnt-tag/` + cnic;
    return this.http.get<LoanServicing[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => this.spinner.hide()),
        catchError(this.handleError('getAllPaymentSchedules')));
  }

  addClntTagForCnic(cnic, tagSeq) {
    const url = `${this.apiModel.host}/setupservice/api/add-clnt-to-tag-list/` + cnic + '/' + tagSeq;
    return this.http.get<LoanServicing[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => this.spinner.hide()),
        catchError(this.handleError('getAllPaymentSchedules')));
  }

  reportDeath(reportDeath: any) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/report-death',
      reportDeath, { headers: this.apiModel.httpHeaderPost });
  }

  // Added by Areeba - SCR - Disability Recoveries
  reportDisability(reportDisability: any) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/report-disability',
    reportDisability, { headers: this.apiModel.httpHeaderPost });
  }
  collectDisability(dsbltyRptSeq, rcvryTypsSeq){
    return this.http.put<any>(this.apiModel.host + '/adminservice/api/update-disability/' + dsbltyRptSeq + '/' + rcvryTypsSeq,
    null, { headers: this.apiModel.httpHeaderPost });
  }

  reverseReportDisability(dsbltyRptSeq: number, cmnt: string) {
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/revert-report-disability?dsbltyRptSeq=' + dsbltyRptSeq + '&cmnt=' + cmnt,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Disability Report Reversed ', 'Success!')),
        catchError(this.handleError('reportDisability')));
  }
  // Ended by Areeba

  reversReportDeath(dthRptSeq: number, cmnt: string) {
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/revert-report-death?dthRptSeq=' + dthRptSeq + '&cmnt=' + cmnt,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Death Reporte Reversed ', 'Success!')),
        catchError(this.handleError('reportDeath')));
  }

  //animal death reversal

  reversAnimalReportDeath(anmlRgstrSeq: string, cmnt: string) {
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/reverse-anml-death?anmlRgstrSeq=' + anmlRgstrSeq + '&cmnt=' + cmnt,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Death Report Reversed ', 'Success!')),
        catchError(this.handleError('reportDeath')));
  }
  printAnmlInsuClmForm(anmlRgstrSeq: string) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-anml-insur-claim-form/` + anmlRgstrSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  reschedule(method: number, clntSeq: number, months: number) {
    return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/genrate-repayment-schedule/' + method + '/' + clntSeq + '/' + months,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Payment Schedule Updated', 'Success!')),
        catchError(this.handleError('reschedule')));
  }



  // rescheduleForPosting(method:number, clntSeq: number, months: number) {
  //   return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/genrate-repayment-schedule/' + method + '/' + clntSeq + '/' + months,
  //     { headers: this.apiModel.httpHeaderPost }).pipe(
  //       tap((data: any) => this.toastr.success('Payment Schedule Updated', 'Success!')),
  //       catchError(this.handleError('reschedule')));
  // }

  rescheduleForPosting(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/recoverydisbursementservice/api/reshedule-loan', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => {
        console.log(p);
      }));
  }


  loanAdjustment(clntSeq: number) {
    return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/adjust-loan/' + clntSeq,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => ''),
        catchError(this.handleError('adjustment')));
  }

  payFuneralClaim(exp: Expense) {
    return this.http.post<any>(this.apiModel.host + '/setupservice/api/add-new-exp',
      exp, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => ''),
        catchError(this.handleError('reportDeath')));
  }

  // Zohaib Asim - Dated 29-09-2022 - KSWK 
  collectUpFrontCash( funeralFormData: any) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/collect-upfront-cash',
    funeralFormData, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => ''),
        catchError(this.handleError('reportDeath')));
  }
  //

  payReportDisability(exp: Expense) {
    if (exp.expnsAmt <= 0) {
      this.toastr.error('Invalid Amount', 'Error!')
      return null;
    }
    return this.http.post<any>(this.apiModel.host + '/recoverydisbursementservice/api/post-disability',
      exp, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => ''),
        catchError(this.handleError('payReportDisability')));
  }



  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      if (error.status == 400) {
        this.toastr.error(error.error.error, `${operation} failed:`)
      } else {
        this.toastr.error(error.message, `${operation} failed:`);
      }

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
export class LoanServicing {
  public clntId: string;
  public clntSeq: number;
  public frstNm: string;
  public lastNm: string;
  public loanAmt: number;
  public rcvdAmt: number;
  public dthRptSeq: number;
  public amt: number;

  // Added by Areeba
  public dsbltyRptSeq: number;
  public dsbltyAmt: number;

  // Added by Areeba
  public anmlDthSeq: number;
  public anmlDthAmt: number;

  public brnchSeq: number;
  public relTypFlg: number;
  public paid: boolean;
  public post: boolean;
  public expSeq: number;

  public rcvryCrntRecFlg: number;

  constructor() {
  }
}