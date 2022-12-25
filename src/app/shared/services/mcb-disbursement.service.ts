import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AdcDisburse } from '../models/adcDisburse.model';
import { ApiModel } from '../models/Api.model';


/**
 * Added By Naveed - Date - 10-05-2022
 * SCR - MCB Disbursement
 */

@Injectable({
  providedIn: 'root'
})
export class McbDisbursementService {
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient, private router: Router) {
  }

  getAllClient (branchSeq: number, pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{'clients': AdcDisburse[], 'count': Number }> {
    return this.http.get<{'clients': AdcDisburse[], 'count': Number }>(this.apiModel.host + '/adminservice/api/get-all?branchSeq=' + branchSeq + '&pageIndex=' + pageIndex 
    + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet });
  }

  dsbmtReversalReason(dsbmtDtlKey: number, remarks: string): Observable<any>{
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/upd-dsbmt-rvrsl-reason?dsbmtDtlKey=' + dsbmtDtlKey + '&remarks=' + remarks, 
    { headers: this.apiModel.httpHeaderGet });
  }

  discardReversalReason(dsbmtDtlKey: number): Observable<any>{
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/discard-dsbmt-rvrsl-reason?dsbmtDtlKey=' + dsbmtDtlKey, 
    { headers: this.apiModel.httpHeaderGet });
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
