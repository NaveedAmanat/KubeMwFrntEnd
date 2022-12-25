import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiModel } from '../models/Api.model';
import { PaymentType } from '../models/paymentType.model';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { Disbursement } from '../models/disbursement';
import { DisbursementVoucher } from '../models/disbursementVoucher.model';
import { DisbursementVoucherListItem } from '../models/disbursementVoucherListItem.model';
import { PaymentSchedule } from '../models/paymentSchedule.model';
import { MwPdcDtlDTOs, Pdc } from '../models/pdc.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignCheck } from '../models/assignCheck.model';
import { ApplyPayment } from '../models/recovery.model';
import { NgIf } from '@angular/common';
import { Auth } from '../../shared/models/Auth.model';
import { InsurancePlan } from '../models/InsurancePlan.model';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  model: Disbursement = new Disbursement();
  public loanAppSeq: number;
  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  // getAllDisbursements(pageNumber, pageSize, filterString) {
  //   this.spinner.show();
  //   return this.http.get<Disbursement[]>
  //     (this.apiModel.host + '/recoverydisbursementservice/api/disbursement?user=' + this.auth.user.username + '&role=' + this.auth.role + '&filter=' + filterString + '&sort=&direction=&pageNumber=' + pageNumber + '&pageSize=' + pageSize, { headers: this.apiModel.httpHeaderGet }).pipe(
  //       tap((data: any) => {
  //         this.spinner.hide();
  //       }),
  //       catchError(this.handleError('getAllDisbursements')));
  // }
  getAllDisbursements(brnchSeq: number, pageNumber, pageSize, filterString, isCount: boolean) {
    this.spinner.show();
    return this.http.get<Disbursement[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/disbursement?user=' + this.auth.user.username + '&brnchSeq=' + brnchSeq + '&role=' + this.auth.role + '&filter=' + filterString + '&sort=&direction=&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => {
          this.spinner.hide();
        }),
        catchError(this.handleError('getAllDisbursements')));
  }

  deleteApplication(app: any): any {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/delete-application/' + app.loanAppSeq + '/' + app.cmnt;
    return this.http.get(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Application Deleted.', 'Success!')),
      catchError(this.handleError('deleteApplication')));
  }
  revertApplication(app: any): any {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/revert-application/' + app.loanAppSeq + '/' + app.cmnt;
    return this.http.get(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Application Reverted To Submitted Status.', 'Success!')),
      catchError(this.handleError('revertApplication')));
  }
  addPdcHeader(pdc: Pdc): Observable<Pdc> {
    return this.http.post<Pdc>(this.apiModel.host + '/recoverydisbursementservice/api/add-pdc-header',
      pdc, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p => this.toastr.success('PDC Header Added.', 'Success!')),
        ));
  }
  addDisbursementVoucher(disb: DisbursementVoucherListItem, obj): Observable<DisbursementVoucherListItem> {
    let url = '';
    if (obj === 'add') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/add-disbursement-voucher';
    } else if (obj === 'update') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/update-disbursement-voucher';
    } else if (obj === 'delete') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/delete-disbursement-voucher';
    }
    return this.http.post<DisbursementVoucherListItem>(url,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p => this.toastr.success('Disbursement Voucher Added.', 'Success!')),
          catchError(this.handleError('addDisbursementVoucher'))));
  }
  addAgency(disb: DisbursementVoucherListItem, obj): Observable<DisbursementVoucherListItem> {
    let url = '';
    if (obj === 'add') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/add-agency';
    } else if (obj === 'update') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/update-agency';
    } else if (obj === 'delete') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/delete-agency';
    }
    return this.http.post<DisbursementVoucherListItem>(url,
      disb, { headers: this.apiModel.httpHeaderPost });
  }
  deleteAgency(disb: DisbursementVoucherListItem): Observable<DisbursementVoucherListItem> {
    console.log(disb);
    const url = this.apiModel.host + '/recoverydisbursementservice/api/delete-agency/' + disb.dsbmtDtlKey;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Disbursement Voucher deleted.', 'Success!')),
      catchError(this.handleError('deleteAgency')));
  }
  getPaymentModes() {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/3/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }),
        catchError(this.handleError('get Payment Modes')));
  }
  getClntPaymentTypes() {
    return this.http.get<any[]>
      (this.apiModel.host + `/recoverydisbursementservice/api/get-clnt-remit/` + this.loanAppSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('get Payment Modes')));
  }
  addPdc(pdcDetail: MwPdcDtlDTOs, obj): Observable<MwPdcDtlDTOs> {
    let url = '';
    if (obj === 'add') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/add-pdc-detail';
    } else if (obj === 'update') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/update-pdc-detail';
    } else if (obj === 'delete') {
      url = this.apiModel.host + '/recoverydisbursementservice/api/delete-pdc-detail';
    }
    return this.http.post<MwPdcDtlDTOs>(url,
      pdcDetail, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p => this.toastr.success('New PDC Added.', 'Success!')),
          catchError(this.handleError('applyPayment'))));
  }
  deletePdc(pdcDetail: MwPdcDtlDTOs): Observable<MwPdcDtlDTOs> {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/delete-pdc-detail/' + pdcDetail.pdcDtlSeq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('PDC Deleted.', 'Success!')),
      catchError(this.handleError('deletePdc')));
  }
  batchPostingPdc(hdr: number, pdcDetails: MwPdcDtlDTOs[]): Observable<MwPdcDtlDTOs> {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/batch-pdc-posting/' + hdr;
    return this.http.put(url, pdcDetails, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('PDC Details Changed', 'Success!')),
      catchError(this.handleError('deletePdc')));
  }


  getAllDisbursementVouchers(number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/disbursement-voucher/${number}`;
    return this.http.get<DisbursementVoucherListItem[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getAllDisbursementVouchers')));
  }
  getAllAgencies() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/agency/${this.loanAppSeq}`;
    return this.http.get<DisbursementVoucherListItem[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)));//,
    // catchError(this.handleError('getAllAgencies')));
  }
  getAllPaymentSchedules() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/payment-schedule/${this.loanAppSeq}`;
    return this.http.get<PaymentSchedule[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getAllPaymentSchedules')));
  }
  getPaymenrScheduleDetail(number) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/payment-schedule-detail/${number}`;
    return this.http.get<AssignCheck[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getPaymenrScheduleDetail')));
  }
  generatePaymentSchedule(date) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/genrate-payment-schedule/${this.loanAppSeq}/${date}`;
    return this.http.get<any[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => this.toastr.success('Payment Schedule Generated', 'Success!')));
  }
  
  // Added by Zohaib Asim - Dated 16-03-2021
  // Payment Schedule Detail Generated or Not
  /***pymtSchedDtlGenerated(loanAppSeq){
    this.loanAppSeq = loanAppSeq;
    return this.loanAppSeq;
    //console.log("LoanAppSeq", this.loanAppSeq);
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/pymt-sched-dtl-generated/${this.loanAppSeq}`;
    return this.http.get<any>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(tap(),
      catchError(this.handleError('pymtSchedDtlGenerated')));
      // (data: any) => this.toastr.success('Payment Schedule Generated', 'Success!')
  }***/

  setLoanApp(loanAppSeq){
    this.loanAppSeq = loanAppSeq;
  }
  // End by Zohaib Asim

  

  getAllPdcs() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/pdcs/${this.loanAppSeq}`;
    return this.http.get<Pdc>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(),
        catchError(this.handleError('getAllPdcs')));
  }
  getDisbursementVoucher() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/application/${this.loanAppSeq}`;
    return this.http.get<DisbursementVoucher>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => {
          console.log(data);
        }),
        catchError(this.handleError('getDisbursementVoucher')));
  }
  getPaymentSchedule(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + `/recoverydisbursementservice/api/expected-payment-schedule/${this.loanAppSeq}`, { headers: this.apiModel.httpHeaderPost })
      .pipe(
      );
  }
  delDisbursementVoucher(id) {
    return this.http.delete(this.apiModel.host + '//' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Disbursement Voucher Deleted', 'Success!')),
      catchError(this.handleError('delDisbursementVoucher')));
  }
  // delPdc(id: any) {
  //   return this.http.delete(this.apiModel.host + '//' + id , {headers:this.apiModel.httpHeaderGet} ).pipe(
  //     tap((data: any) => console.log(data)),
  //     catchError(this.handleError('delPdc')));
  // }
  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.toastr.error(error.message, `${operation} failed:`);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  disbursementPosting(post, amlChck) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/disbursement-posting/${this.loanAppSeq}/${post}/${amlChck}`;
    return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
  }
  genrateHelthCard(date) {
    const url = `${this.apiModel.host}/loanservice/api/add-health-card`;
    return this.http.post<any>(url, JSON.stringify({ loanAppSeq: `${this.loanAppSeq}`, cardExpiryDate: `${date}` }), { headers: this.apiModel.httpHeaderPost });
  }

  getPaymentSchedulePdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-payment-schedule/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getRepaymentInfoKSWKPdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-payment-schedule-kswk`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  // Added by Areeba
  getOneLinkPdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-one-link-slip/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Areeba

  getHealthCardPdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-health-card/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getUndertakingPdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-undertaking/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getPrintSomeFunckingShit() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-agency-info-report/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getLPD() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-lpd/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  
  getMfcibPdf(cnicNum, type) {
    const url = `${this.apiModel.host}/reportservice/api/print-mfcib/${this.loanAppSeq}/${cnicNum}/${type}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getAnimalPicture(loan) {
    const url = `${this.apiModel.host}/reportservice/api/print-animal-picture/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getClientVerisysReport() {
    const url = `${this.apiModel.host}/loanservice/api/print-verisys-report/${this.loanAppSeq}/CLIENT`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getNomineeVerisysReport() {
    const url = `${this.apiModel.host}/loanservice/api/print-verisys-report/${this.loanAppSeq}/NOMINEE`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getClientInfoPdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-client-info/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  saveVoucherErrorRectifications() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/save-vouchers/${this.loanAppSeq}`;
    return this.http.get<MwPdcDtlDTOs>(url,
      { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p => this.toastr.success('Vouchers are Save.', 'Success!')),
          catchError(this.handleError('applyPayment'))));
  }

  generatePdcs(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/recoverydisbursementservice/api/genrate-pdc', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getInsurancePlans(): Observable<InsurancePlan[]> {
    return this.http.get<InsurancePlan[]>(this.apiModel.host + '/loanservice/api/get-hlth-insr-plans', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: InsurancePlan[]) => console.log(p)),
        catchError(this.handleError<InsurancePlan[]>('Get Insurance-Plan'))
      );
  }

  checkForAml() {
    const url = `${this.apiModel.host}/loanservice/api/check-loan-for-aml/${this.loanAppSeq}`;
    return this.http.get<any>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)));
  }

  // Added By Naveed - Dated 23-01-2022
  // load all previous mobile wallet numbers for this client
  getPrevLoanWalletNo() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/get-mobile-wallet-history/${this.loanAppSeq}`;
    return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
  }
  // load all mobile wallet modes
  getMobileWalletTypes() {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-mobile-wallet-types/', { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }),
        catchError(this.handleError('get Payment Modes')));
  }
  // Ended by Naveed - Dated - 23-01-2022

  /**
 * Added By Naveed - Date - 10-05-2022
 * SCR - MCB Disbursement
 */
  disbursePostingCheckList(checkList): Observable<any> {
    return this.http.put<any>(this.apiModel.host + `/loanservice/api/disburse-posting-check-list/${this.loanAppSeq}`, checkList, { headers: this.apiModel.httpHeaderPost } );
  }

  getDisbursePostingCheckList(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + `/loanservice/api/get-disburse-posting-check-list/${this.loanAppSeq}`, { headers: this.apiModel.httpHeaderGet } );
  }

  // end by Naveed

  // Added by Areeba
  getCombinedPaymentSchedulePdf() {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-payment-schedule-ktk/${this.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended by Areeba
}
