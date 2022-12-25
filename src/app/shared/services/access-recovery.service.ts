import { AccessRecovery } from '../models/access-recovery.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Expense } from '../models/expense.model';
import { PaymentType } from '../models/paymentType.model';
import { PaymentTypesService } from './paymentTypes.service';
import { Auth } from '../models/Auth.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AccessRecoveryService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  constructor(private http: HttpClient, private paymentTypesService: PaymentTypesService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  // getAccessRecoveries(): Observable<AccessRecovery[]> {
  //   return this.http.get<AccessRecovery[]>(this.apiModel.host + '/setupservice/api/get-access-rcvry/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap((p: AccessRecovery[]) => console.log(p))
  //   );
  // }

  // getAccessRecoveriesManually(branchSeq): Observable<AccessRecovery[]> {
  //   return this.http.get<AccessRecovery[]>(this.apiModel.host + '/setupservice/api/get-access-rcvry/' + branchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap((p: AccessRecovery[]) => console.log(p))
  //   );
  // }

  getAccessRecoveriesManually(branchSeq: number, pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{ 'accessrcvry': AccessRecovery[], 'count': Number, 'totAmt': Number  }> {
    return this.http.get<AccessRecovery[]>(this.apiModel.host + '/setupservice/api/get-access-rcvry?branchSeq=' + branchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: { 'accessrcvry': AccessRecovery[], 'count': Number, 'totAmt': Number }) => console.log(p))
    );
  }

  addExcessRecoveryManually(): Observable<AccessRecovery[]> {
    return this.http.get<AccessRecovery[]>(this.apiModel.host + '/setupservice/api/add-excess-manuly/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: AccessRecovery[]) => console.log(p))
    );
  }

  reverseExcessRecovery(seq, cmnt): Observable<AccessRecovery[]> {
    return this.http.get<AccessRecovery[]>(this.apiModel.host + '/recoverydisbursementservice/api/reverse-excess-recovery/' + seq + '/' + cmnt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: AccessRecovery[]) => console.log(p))
    );
  }
  validateClients(clntSeq): Observable<AccessRecovery[]> {
    return this.http.get<AccessRecovery[]>(this.apiModel.host + '/loanservice/api/get-clnt-for-brnch/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: AccessRecovery[]) => console.log(p))
    );
  }

  addNewExpense(exp) {
    console.log('exp', exp)
    return this.http.post<any>(this.apiModel.host + '/setupservice/api/add-new-exp', exp, { headers: this.apiModel.httpHeaderPost });
  }

  exp: Expense = new Expense();
  temp: PaymentType = new PaymentType();
  addAccessRecoveryRecordInExpense(accessRecovery: AccessRecovery) {
    this.temp.typId = '0005';
    this.temp.typCtgryKey = 2;
    this.temp.brnchSeq = 0;
    this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;
        console.log(this.temp);
        this.exp.pymtTypSeq = +accessRecovery.paymentMode['typSeq'];
        this.exp.brnchSeq = +accessRecovery.branchSeq;
        this.exp.expnsDscr = this.temp.typStr;
        this.exp.instrNum = accessRecovery.insturmentNum;
        this.exp.expnsAmt = accessRecovery.accessAmount;
        this.exp.expnsStsKey = 200;
        this.exp.expnsTypSeq = this.temp.typSeq;
        this.exp.expRef = accessRecovery.txId;
        this.exp.pymtRctFlg = 1;
        this.http.post<any>(this.apiModel.host + '/setupservice/api/add-new-exp', this.exp, { headers: this.apiModel.httpHeaderPost }).subscribe(res => {

          this.toaster.success('Excess Recovery Paid', 'Success');
        }, error => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
      }
    );
  }

}
