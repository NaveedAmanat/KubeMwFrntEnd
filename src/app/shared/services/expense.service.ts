
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Expense } from '../models/expense.model';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../models/Auth.model';
import { ClientHealthInsuranceClaim } from '../models/client-health-insurance-claim.model';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    console.log(this.auth.emp_branch)
    console.log(this.auth.role)
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
  getPaymentModes() {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/6/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }));
  }
  
  //Added by Areeba
  getPaymentModeCashOnly() {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/6/' + 0, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }));
  }
  //Ended by Areeba

  getPaymentModesByBranches(seq) {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/6/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }));
  }

  getAllCatgoriesModes() {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/2/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }));
  }

  getAllCatgoriesModesByBranches(seq) {
    return this.http.get<any[]>
      (this.apiModel.host + '/recoverydisbursementservice/api/get-type-branch-catgry/2/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => { }));
  }s

  // getExpenses(username: string): Observable<Expense[]> {
  //   return this.http.get<Expense[]>(this.apiModel.host + '/setupservice/api/mw-exp-by-user/' + username, { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap((p: Expense[]) => console.log(p))
  //   );
  // }

  // getExpensesByBranchSeq(seq): Observable<Expense[]> {
  //   return this.http.get<Expense[]>(this.apiModel.host + '/setupservice/api/mw-exp-by-brnch-seq/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap((p: Expense[]) => console.log(p))
  //   );
  // }
  getExpensesByBranchSeq(seq, pageIndex, pageSize, filter, isCount): Observable<{"exp":Expense[], "count": Number}> {
    return this.http.get<Expense[]>(this.apiModel.host + '/setupservice/api/mw-exp-by-brnch-seq?seq=' + seq + '&filter=' + filter + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&isCount=' + isCount,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: {"exp":Expense[], "count": Number}) => console.log(p))
    );
  }
  addExpense(Expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiModel.host + '/setupservice/api/add-new-exp', Expense, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Expense) => this.toastr.success('Expense Added', 'Success!'))
    );
  }

  updateExpense(Expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(this.apiModel.host + '/setupservice/api/update-exp', Expense, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Expense) => this.toastr.success('Expense Updated', 'Success!'))
      );
  }
  reverseExpense(Expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(this.apiModel.host + '/setupservice/api/reverse-exp', Expense, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Expense) => console.log(p))
      );
  }

  deleteExpense(id: string) {
    return this.http.delete<Expense>(this.apiModel.host + '/setupservice/api/mw-exp/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Expense) => console.log(`Delete Expense`))
    );
  }
  deleteItExpense(id: string) {
    return this.http.delete<Expense>(this.apiModel.host + '/setupservice/api/mw-exp/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Expense) => console.log(`Delete Expense`))
    );
  }
  getItExpenses(username: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiModel.host + '/setupservice/api/mw-exp-by-user/' + username, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Expense[]) => console.log(p))
    );
  }


  getClntOdDays(clntSeq) {
    return this.http.get(this.apiModel.host + '/adminservice/api/get-clnt-od-days/' + clntSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p))
    );
  }
}

