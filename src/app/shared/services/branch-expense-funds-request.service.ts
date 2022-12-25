import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiModel } from '../models/Api.model';

/**
 * @Added, Naveed
 * @Date, 14-06-2022
 * @Description, SCR - systemization Funds Request
*/

@Injectable({
  providedIn: 'root'
})
export class BranchExpenseFundsRequestService {
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient, private router: Router) {
  }

  getAllLists(toDate:string, pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{'lists': any[], 'count': Number }> {
    return this.http.get<{'lists': any[], 'count': Number }>(this.apiModel.host + `/adminservice/api/get-all-branch-funds-request?toDate=${toDate}&pageIndex=${pageIndex}` +
   `&pageSize=${pageSize}&filter=${filter}&isCount=${isCount}`, { headers: this.apiModel.httpHeaderGet });
  }

  addBranchFund(branchFund):Observable<any> {
		return this.http.post<any>(this.apiModel.host  + "/adminservice/api/add-branch-funds-request", branchFund, { headers: this.apiModel.httpHeaderPost });
	}

  updateBrnchFund(branchFund):Observable<any> {
		return this.http.put<any>(this.apiModel.host  + "/adminservice/api/update-branch-funds-request", branchFund, { headers: this.apiModel.httpHeaderPost });
	}

  getFundDetailByAccoutnNum(acctNum:string, toDate:string): Observable<{'lists': any[] }> {
    return this.http.get<{'lists': any[]}>(this.apiModel.host + `/adminservice/api/get-branch-funds-request-detail/${acctNum}/${toDate}`, { headers: this.apiModel.httpHeaderGet });
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
