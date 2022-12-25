import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
// Added by Areeba - Dated 1-2-2022 - Client Tag List
@Injectable({
  providedIn: 'root'
})
export class ClientTagListService {
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
    private router: Router) { 
      console.log('Tag Service Initiated');
    }  

    getTaggedClntList(pageIndex: number, pageSize: number, filter: string, isCount: boolean, tagType: string): Observable<any> {
      return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-tagged-clnt-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&tagType=' + tagType, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`Fetched Tagged Client List`)),
        catchError(this.handleError('getTaggedClntList'))
      );
    }
 
    changeClntTag (tagDtl: string, clntTagListSeq: number): Observable<any> {
      return this.http.put<any>(this.apiModel.host+"/adminservice/api/change-clnt-tag/" + tagDtl + '/' + clntTagListSeq, null, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap(heroes => console.log(`changeClntTag() executed`)),
        catchError(this.handleError('changeClntTag() error'))
      );
    }

    // Added by Zohaib Asim - Dated 16-02-2022
    exportClientList(fileType: string) {
      const url = `${this.apiModel.host}/reportservice/api/print-match-client?fileType=` + fileType + '&isMtchFound=' + true;
      return this.http.get<any>(url, {
        responseType: 'arraybuffer' as 'json',
        headers: this.apiModel.httpHeaderPost
      });
    }
    // End

  //   changeClntTag (tagDtl: string, clntTagListSeq: number): Observable<any> {
  //     return this.http.put<{ clientSeq: "" }>(this.url + "/loanservice/api/update-mw-clnt", object, { headers: this.apiModel.httpHeaderPost });
  // }
 
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
// Ended by Areeba
