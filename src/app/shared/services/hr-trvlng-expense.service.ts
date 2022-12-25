import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { catchError, tap } from 'rxjs/operators';
import { Auth } from '../models/Auth.model';
import { HrTrvlngExpense } from '../models/hr-trvlng-expense.model';
import { Observable, of } from 'rxjs';

/*Authored by Areeba
HR Travelling SCR
Dated - 23-06-2022
*/

@Injectable({
  providedIn: 'root'
})
export class HrTrvlngExpenseService {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;
  
  constructor(private http: HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  } 

  getAllTravellingDtl() {
    return this.http.get<HrTrvlngExpense[]>(this.apiModel.host + '/adminservice/api/get-trvlng-dtl', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: HrTrvlngExpense[]) => console.log(p))
    );
  }

  exportTrvellingExpenseDetails(fileType: string) {
    const url = `${this.apiModel.host}/reportservice/api/print-match-client?fileType=` + fileType + '&isMtchFound=' + true;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getTravellingDtlList(pageIndex: number, pageSize: number, filter: string, isCount: boolean, monthDt: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-trvlng-dtl-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&monthDt=' + monthDt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Travelling Detail List`)),
      catchError(this.handleError('getTravellingDtlList'))
    );
  }

  callPrcTrvlngCalc (monthDt: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/run-trvlng-calc?monthDt=" + monthDt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`callPrcTrvlngCalc() executed`)),
      catchError(this.handleError('callPrcTrvlngCalc() error'))
    );
  }

  printExportTrvlngDtls(monthDt){
    const url = `${this.apiModel.host}/reportservice/api/print-trvlng_dtls/` + monthDt ;
    return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
  }

  printExportTrvlngHarmony(monthDt){
    const url = `${this.apiModel.host}/reportservice/api/print-trvlng_for_harmony/` + monthDt ;
    return this.http.get<any>(url, { headers: this.apiModel.httpHeaderGet });
  }

  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => { 

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
