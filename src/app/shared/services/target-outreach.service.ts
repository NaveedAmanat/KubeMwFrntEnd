import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/*Authored by Areeba
Target Outreach
Dated - 09-09-2022
*/

@Injectable({
  providedIn: 'root'
})
export class TargetOutreachService {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;
  
  constructor(private http: HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  //get methods
  getBrnchTrgt(pageIndex: number, pageSize: number, filter: string, isCount: boolean, monthDt: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-mw-brnch-trgt?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&monthDt=' + monthDt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Branch Targets`)),
      catchError(this.handleError('getBrnchTrgt'))
    );
  }

  getRegionWiseOutreach(pageIndex: number, pageSize: number, filter: string, isCount: boolean, monthDt: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-region-wise-outreach?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&monthDt=' + monthDt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Region Wise Outreach`)),
      catchError(this.handleError('getRegionWiseOutreach'))
    );
  }

  //add methods
  addBrnchTrgt(brnchTrgtObj){
		return this.http.post<{ result: any }>(this.url + "/adminservice/api/add-mw-brnch-trgt", brnchTrgtObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Added Branch Target`)),
      catchError(this.handleError('addBrnchTrgt'))
    );
  }

  addRegionWiseOutreach(outreachObj){
		return this.http.post<{ result: any }>(this.url + "/adminservice/api/add-region-wise-outreach", outreachObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Added Region Wise Outreach`)),
      catchError(this.handleError('addRegionWiseOutreach'))
    );
  }

  //delete methods
  deleteBrnchTrgt(brnchTargetsSeq){
		return this.http.put<{ result: any }>(this.url + "/adminservice/api/delete-mw-brnch-trgt/" + brnchTargetsSeq, null, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Deleted Branch Target`)),
      catchError(this.handleError('deleteBrnchTrgt'))
    );
  }

  //update methods
  updateBrnchTrgt(brnchTrgtObj){
		return this.http.put<{ result: any }>(this.url + "/adminservice/api/update-mw-brnch-trgt", brnchTrgtObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Updated Branch Target`)),
      catchError(this.handleError('updateBrnchTrgt'))
    );
  }

  updateRegionWiseOutreach(outreachObj){
		return this.http.put<{ result: any }>(this.url + "/adminservice/api/update-region-wise-outreach", outreachObj, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap(heroes => console.log(`Updated Region Wise Outreach`)),
      catchError(this.handleError('updateRegionWiseOutreach'))
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
