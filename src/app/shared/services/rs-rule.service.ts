import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
}) 
export class RsRuleService {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;

  constructor(private http: HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  //get methods
  getRsRule(pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/setupservice/api/get-mw-rs-loan-rule?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Rs Rules`)),
      catchError(this.handleError('getRsRule'))
    );
  }

  //add methods
  addRsRule(rsRuleObj){
		return this.http.post<{ result: any }>(this.url + "/setupservice/api/add-mw-rs-loan-rule", rsRuleObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Added Rs Rule`)),
      catchError(this.handleError('addRsRule'))
    );
  }

  //delete methods
  deleteRsRule(ruleSeq){
		return this.http.put<{ result: any }>(this.url + "/setupservice/api/delete-mw-rs-loan-rule/" + ruleSeq, null, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Deleted Rs Rule`)),
      catchError(this.handleError('deleteRsRule'))
    );
  }
  //delete methods
  disableRsRule(ruleSeq){
		return this.http.put<{ result: any }>(this.url + "/setupservice/api/disable-mw-rs-loan-rule/" + ruleSeq, null, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Disabled Rs Rule`)),
      catchError(this.handleError('disableRsRule'))
    );
  }

  //update methods
  updateRsRule(rsRuleObj){
		return this.http.put<{ result: any }>(this.url + "/setupservice/api/update-mw-rs-loan-rule", rsRuleObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Updated Rs Rule`)),
      catchError(this.handleError('updateRsRule'))
    );
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
