import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiModel} from '../models/Api.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Rule} from '../models/Rule.model';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private rulesUrl = '/api/rules';
  apiModel: ApiModel = new ApiModel();
  rule: Rule;

  constructor(public http: HttpClient,
              private router: Router) {
    console.log('Rules Service Initiated');
  }

  // getRules (): Observable<Rule[]> {
  //   return this.http.get<Rule[]>(this.apiModel.host+"/setupservice/api/mw-rul", { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap(heroes => console.log(`fetched rules`)),
  //     catchError(this.handleError('getRules', []))
  //   );
  // }

  getRules (pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/setupservice/api/mw-rul-paged?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`fetched rules`)),
      catchError(this.handleError('getRules'))
    );
  }
  
  getRule(id: number): Observable<Rule> {
    const url = `${this.rulesUrl}/${id}`;
    return this.http.get<Rule>(url).pipe(
      tap(_ => console.log(`fetched rule id=${id}`)),
      catchError(this.handleError<Rule>(`getRule id=${id}`))
    );
  }
  addRule (rule: Rule): Observable<Rule> {
    return this.http.post<Rule>(this.apiModel.host+"/setupservice/api/add-new-rul", rule, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(() => console.log(`added rule w/ id=${rule.id}`))
    );
  }
  updateRule (rule: Rule): Observable<Rule> {
    return this.http.put<Rule>(this.apiModel.host+"/setupservice/api/update-rul", rule, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(() => console.log(`added rule w/ id=${rule.id}`))
    );
  }
  deleteRule (id): Observable<Rule[]> {
    return this.http.delete<Rule[]>(this.apiModel.host+"/setupservice/api/mw-rul/"+ id, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`fetched rules`))
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
