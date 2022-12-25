import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import { AppDto } from '../models/app-dto.model';
import { RecoveryClosingDto } from '../models/recovery-closing-dto.model';
import { DisbursementClosingDto } from '../models/disbursement-closing-dto.model';
import { ExpenseClosingDto } from '../models/expense-closing-dto.model';
import { InsuranceClaimClosingDto } from '../models/insurance-claim-closing-dto.model';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class RecoveryClosingService {
  auth:Auth=JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  token: string;
  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getRecoveryClosing(): Observable<RecoveryClosingDto[]> {
    return this.http.get<RecoveryClosingDto[]>(this.apiModel.host + '/setupservice/api/get-recovery-day-closing',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: RecoveryClosingDto[]) => console.log(p))
    );
  }

  getDisbursementClosing(): Observable<DisbursementClosingDto[]> {
    return this.http.get<DisbursementClosingDto[]>(this.apiModel.host + '/setupservice/api/get-disbursement-day-closing/'+this.auth.user.username,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: DisbursementClosingDto[]) => console.log(p))
    );
  }

  getExpenseClosing(): Observable<ExpenseClosingDto[]> {
    return this.http.get<ExpenseClosingDto[]>(this.apiModel.host + '/setupservice/api/get-expense-day-closing/'+this.auth.user.username,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: ExpenseClosingDto[]) => console.log(p))
    );
  }

  getInsuranceClaimClosing(): Observable<InsuranceClaimClosingDto[]> {
    return this.http.get<InsuranceClaimClosingDto[]>(this.apiModel.host + '/setupservice/api/get-insuranceclaim-day-closing',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: InsuranceClaimClosingDto[]) => console.log(p))
    );
  }

  postSingleRecovery(temp:RecoveryClosingDto)
  {
    return this.http.get<RecoveryClosingDto[]>(this.apiModel.host + '/recoverydisbursementservice/api/recovery-posting/'+temp.txId,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: RecoveryClosingDto[]) => console.log(p))
    );
  }



  postSingleDisbursement(temp:DisbursementClosingDto)
  {
    return this.http.get<DisbursementClosingDto[]>(this.apiModel.host + '/recoverydisbursementservice/api/disbursement-posting/'+temp.loanAppSeq+'/true/false',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: DisbursementClosingDto[]) => console.log(p))
    );
  }

  postSingleExpense(temp:ExpenseClosingDto)
  {
    return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/post-expense/'+temp.expenseId,{ headers: this.apiModel.httpHeaderGet });
    // if(temp.expenseType=="EXCESS RECOVERY PAYMENT")
    // {
    //   return this.http.get<any[]>(this.apiModel.host + '/recoverydisbursementservice/api/post-expense/'+temp.txId,httpOptions);
    // }
    // else if(temp.expenseType=="HEALTH INSURANCE")
    // {
    //   return this.http.get<ExpenseClosingDto[]>(this.apiModel.host + '/recoverydisbursementservice/api/post-health-insurance/'+temp.txId,httpOptions).pipe(
    //     tap((p: ExpenseClosingDto[]) => console.log(p))
    //   );  
    // }
  }
  postSingleDisabilityExpense(expnsId)
  {
    return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/post-expense/'+ expnsId,{ headers: this.apiModel.httpHeaderGet });
  }

  postSingleInsuranceClaim(temp:InsuranceClaimClosingDto)
  {
    return this.http.get<InsuranceClaimClosingDto[]>(this.apiModel.host + '/recoverydisbursementservice/api/insuranceclaim-posting/'+temp,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: InsuranceClaimClosingDto[]) => console.log(p))
    );
  }


  closeBranch(branchSeq)
  {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/close-branch/'+branchSeq,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any) => console.log(p))
    );
  }

  // Added by Zohaib Asim - Dated 24-12-2020
  // KSZB Claims - For KM Sale1 Report
  getHealthCardPdf(dsbrsmtClsngDto:DisbursementClosingDto) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-health-card/${dsbrsmtClsngDto.loanAppSeq}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // End by Zohaib Asim
}
