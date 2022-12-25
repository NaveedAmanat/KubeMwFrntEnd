import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { ProcessTime } from '../models/process-time.model';

// Authored by Areeba
// Dated 17-3-2022
// Monthly Accounts Reporting

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AccountsReportingService {

  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
    private router: Router) { 
      console.log('Monthly Accounts Processing Service Initiated');
    }

    getProcesses(pageIndex: number, pageSize: number, isCount: boolean): Observable<{ "Processes": ProcessTime[], "count": number }> {
      return this.http.get<{"Processes": ProcessTime[], "count": number}>(this.apiModel.host + "/adminservice/api/get-all-processes?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet });
        
    }

    callPrcMonProcesses (): Observable<any> {
      return this.http.get<any>(this.apiModel.host+"/adminservice/api/run-mon-processes", { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`callPrcMonProcesses() executed`)),
        catchError(this.handleError('callPrcMonProcesses() error'))
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
