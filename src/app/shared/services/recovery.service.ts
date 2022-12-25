import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { PaymentType } from '../models/paymentType.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApplyPayment, AdjustPayment, Recovery, JVoucher, JVoucherDetials, AttendanceCheckOut, AttendanceCheckIn } from '../models/recovery.model';
import { RECOVRIES } from '../mocks/mock_common_codes';
import { LoanApplicant } from '../models/LoanApplicant.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from '../../shared/models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  private rcvryTyp: number = 4;
  apiModel: ApiModel = new ApiModel();
  recovery: Recovery;
  public recoveries = RECOVRIES;

  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }
  getAllRecoveries() {
    this.spinner.show();
    return this.http.get<Recovery[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/recovery?user=' + this.auth.user.username + '&filter=&sort=&direction=&pageNumber=1&pageSize=10', { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => {
          this.spinner.hide();
        }),
        catchError(this.handleError('getAllRecoveries')));
  }
  getPagedRecoveries(pageNumber, pageSize, filterString, brnchSeq, isCount) {
    this.spinner.show();
    return this.http.get<Recovery[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/recovery?user=' + this.auth.user.username + '&filter=' + filterString + '&sort=&direction=&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&brnchSeq=' + (brnchSeq == null ? '' : brnchSeq) + '&isCount=' +  isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => {
          this.spinner.hide();
        }),
        catchError(this.handleError('getAllRecoveries')));
  }
  getSingleRecovery(clntSeq, prntLoanAppSeq, prd) {
    return this.http.get<ApplyPayment>(this.apiModel.host + '/recoverydisbursementservice/api/recovery/' + clntSeq + '/' + prntLoanAppSeq + '/' + prd, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => this.spinner.hide()),
      catchError(this.handleError('applyPayment')));
  }

  //Added by Areeba
  getSingleRecoveryForDisability(clntSeq) {
    return this.http.get<Recovery>(this.apiModel.host + '/recoverydisbursementservice/api/dsblty-recovery/' + clntSeq , { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => this.spinner.hide()),
      catchError(this.handleError('disabilityRecovery')));
  }

  getReversedRecoveryForDisability(clntSeq) {
    return this.http.get<Recovery>(this.apiModel.host + '/recoverydisbursementservice/api/reversed-dsblty-recovery/' + clntSeq , { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => this.spinner.hide()),
      catchError(this.handleError('revDisabilityRecovery')));
  }
  //Ended by Areeba

  // journel vouchers

  // getJounrelVoucher(pageIndex, limit) {
  //   return this.http.get<JVoucher>(this.apiModel.host + '/recoverydisbursementservice/api/all-jv-vouchers/' + pageIndex + '/' + limit, { headers: this.apiModel.httpHeaderPost }).pipe(
  //     tap((data: any) => this.spinner.hide()),
  //     catchError(this.handleError('ALL JVoucher')));
  // }

  getJounrelVoucher(brnchSeq: number, pageIndex: number, pageSize: number, filter:string, isCount: boolean):Observable<{'jvHdr': any, 'count': Number}> {
    return this.http.get<JVoucher>(this.apiModel.host + '/recoverydisbursementservice/api/all-jv-vouchers?brnchSeq=' + brnchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: {'jvHdr': any, 'count': Number}) => this.spinner.hide()),
      catchError(this.handleError('ALL JVoucher')));
  }
  
  //journel vouchers filtered service 

  getJournelVoucherPaged(pageIndex, limit, filterString) {
    this.spinner.show();
    return this.http.get<JVoucher[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/all-jv-vouchers/' + pageIndex + '/' + limit + '/' + filterString, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => {
          this.spinner.hide();
        }),
        catchError(this.handleError('ALL JVoucher')));
  }

  // journel voucher details

  getJournelVoucherDetails(jvId: number) {
    return this.http.get<JVoucherDetials>(this.apiModel.host + '/recoverydisbursementservice/api/jv-vouchers-details/' + jvId, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => this.spinner.hide()),
      catchError(this.handleError('JVoucherDetials')));
  }



  // Attendance check in

  checkInAttendance(checkIn: AttendanceCheckIn) {
    return this.http.post<AttendanceCheckIn>(this.apiModel.host + '/adminservice/api/emp-att-checkin',
      checkIn,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Check In', 'Success!')),
        catchError(this.handleError('checkin')));
  }

  // Attendance check out

  checkOutAttendance(checkOut: AttendanceCheckOut) {
    return this.http.post<AttendanceCheckOut>(this.apiModel.host + '/adminservice/api/emp-att-checkout',
      checkOut, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Check Out', 'Success!')),
        catchError(this.handleError('checkout')));
  }






  applyPayment(applyPayment: ApplyPayment) {
    return this.http.post<ApplyPayment>(this.apiModel.host + '/recoverydisbursementservice/api/apply-payment',
      applyPayment, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Payment Received', 'Success!')),
        catchError(this.handleError('applyPayment')));
  }
  adjustPayment(adjustPayment: AdjustPayment) {
    return this.http.post<ApplyPayment>(this.apiModel.host + '/recoverydisbursementservice/api/adjust-payment',
      adjustPayment, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('adjustPayment')));
  }
  bulkPosting() {
    return this.http.post<any>(this.apiModel.host + '/recoverydisbursementservice/api/bulk-posting/' + this.auth.user.username, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => this.toastr.success('Bulk Posting', 'Success!')),
      catchError(this.handleError('applyPayment')));
  }
  deleteApplication(app: any): any {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/defered-application/' + app.loanAppSeq + '/' + app.cmnt + '/' + app.role;
    return this.http.get(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => {
        console.log('data', data)
          if(data.status == 'true'){
            this.toastr.success('Application Deleted.', 'Success!')
          }else {
            this.toastr.warning('Application Cannot be Deleted.', 'Warning!')
          }
      }),
      catchError(this.handleError('deleteApplication')));
  }
  defferApplicationLoanService(app: any): any {
    const url = this.apiModel.host + '/loanservice/api/deffer-application/' + app.loanAppSeq;
    return this.http.get(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Application Deleted.', 'Success!')),
      catchError(this.handleError('deleteApplication')));
  }
  getRecoveryTypes() {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-type-branch-catgry/` + this.rcvryTyp + `/` + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));
  }

  getTypesByBrnch(brnchSeq) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-type-branch/` +  `/` + brnchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));
  }
  getClntRecoveryTypes(clntSeq: number) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-clnt-pymnt/` + clntSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));
  }
  getWrtOfClntRecoveryTypes(clntSeq: number) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-wrt-of-clnt-pymnt/` + clntSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));
  }
  getPostedReport(trx: string, type: number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-kcr-report/${trx}/${this.auth.user.username}/${type}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  getJvHistory(clntSeq: number) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/recovery-vouchers-history/` + clntSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));

  }
  payExcessRecovery(applyPayment: ApplyPayment) {
    return this.http.post<ApplyPayment>(this.apiModel.host + '/recoverydisbursementservice/api/add-excess-manuly',
      applyPayment, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => this.toastr.success('Payment Received', 'Success!')),
        catchError(this.handleError('applyPayment')));
  }
  getWrtOffClients(brnchSeq: number) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/write-off-loans/` + brnchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));

  }
    /**
   * MOdified by Naveed - Date - 10-05-2022
   * SCR - Account - WriteOff 
   */
  revertWrtOffClient(trnxSeq, loanAppSeq) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/wrt-of-trx-reversal/${trnxSeq}/${loanAppSeq}`, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('Reversal Of Write Off Clients'))
      )
  }

  // getWrtOffClientsBranchWise(brnchSeq: number) {
  //   return this.http.get<any[]>
  //     (this.apiModel.host + `/recoverydisbursementservice/api/write-off-loans/` + brnchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
  //       tap((data: any) => console.log(data)),
  //       catchError(this.handleError('get Payment Modes')));

  // }
  getWrtOffClientsBranchWise(brnchSeq: number, pageIndex: number, pageSize: number, filter: string, isCount:boolean):Observable< {"clnts":any, "count": Number}> {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/write-off-loans?brnchSeq=` + brnchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter +  '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data:  {"clnts":any, "count": Number}) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));

  }
  getWrtOffTrxForClient(clntSeq: number) {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-wrt-trx-for-clnt/` + clntSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));

  }
  applyWrtOffClntPayment(applyPayment: ApplyPayment) {
    return this.http.post<ApplyPayment>(this.apiModel.host + '/recoverydisbursementservice/api/apply-wrt-off-payment',
      applyPayment, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('applyPayment')));
  }
  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
    return (error: any): Observable<T> => {
      if (error.error != undefined) {
        if (error.error.error) {
          this.toastr.error(error.error.error)
        }
      } else {
        this.toastr.error(error.message, `${operation} failed:`);
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
