import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiModel} from '../models/Api.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Rule} from '../models/Rule.model';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { NactaManagemnt } from '../models/Nacta-Management.model';
import { SanctionList } from '../models/sanction-list.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class NactaManagemntService {
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
              private router: Router) {
    console.log('Rules Service Initiated');
  }

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  // Parameter added File Type
  getNactaList (pageIndex: number, pageSize: number, filter: string, isCount: boolean, fileType: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-nacta-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&fileType=' + fileType, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Nacta/Sanction List`)),
      catchError(this.handleError('getNactaLits'))
    );
  }

  // Added by Zohaib Asim - Dated 19-07-2021 - CR: Sanction List
  getInValidList (pageIndex: number, pageSize: number, filter: string, isCount: boolean, fileType: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-invalid-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&fileType=' + fileType, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched InValid Data List`)),
      catchError(this.handleError('getInValidList'))
    );
  }

  deleteAllInValidList (fileType: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/delete-all-invalid-list?fileType=" + fileType, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`InValid Data Deleted`)),
      catchError(this.handleError('deleteAllInValidList'))
    );
  }

  getTaggedClntList(pageIndex: number, pageSize: number, filter: string, isCount: boolean, fileType: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-tagged-clnt-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount + '&fileType=' + fileType, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Tagged Client List`)),
      catchError(this.handleError('getTaggedClntList'))
    );
  }
  // End by Zohaib Asim

  addNacta (sancList: SanctionList): Observable<any> {
    return this.http.post<any>(this.apiModel.host+"/adminservice/api/add-nacta", sancList, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(() => console.log(`added rule w/ id=${sancList.sancSeq}`))
    );
  }

  updateNacta (sancList: SanctionList): Observable<any> {
    return this.http.put<any>(this.apiModel.host+"/adminservice/api/update-nacta", sancList, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(() => console.log(`added nacta w/ id=${sancList.sancSeq}`))
    );
  }

  deleteNacta (id): Observable<any> {
    return this.http.delete<any>(this.apiModel.host+"/adminservice/api/delete-nacta/"+ id, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Deleted Nacta`))
    );
  }

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  // Nacta -> Sanction
  uploadNacta (sancList: SanctionList[]): Observable<any> {
    return this.http.post<any>(this.apiModel.host+"/adminservice/api/upload-nacta", sancList , { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Uploaded Sanction List`))
    );
  }

  updateRepository():Observable<any>{
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/update-repository/", { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`update repository`))
      );
  }

  // Modified by Zohaib Asim - Dated 26-07-2021 - CR: Sanction List
  // Rewrote
  exportInValidList(fileType: string ) {
    const url = `${this.apiModel.host}/reportservice/api/print-invalid-list?fileType=` + fileType + '&inValidCnic=' + true;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  // Rewrote
  exportMatchingClients(fileType: string) {
    const url = `${this.apiModel.host}/reportservice/api/print-match-client?fileType=` + fileType + '&isMtchFound=' + true;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  findMatchingClients(fileType: string ):Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/find-match-clients?fileType=" + fileType, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`Fetched Matched Clients List`)),
      catchError(this.handleError('matchingClients')));
  }

  // Sanction List - Phase 2 - Tag/UnTag
  markClntTag (tagDtl: string, cnic: number): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/find-mtch-and-tag-clnt?tagDtl=" + tagDtl + '&cnic=' + cnic, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`markClntTag() executed`)),
      catchError(this.handleError('markClntTag() error'))
    );
  }

  // Sanction List - Phase 2 - Countries
  getSancCountriesList(): Observable<any> {
    return this.http.get<any>(this.apiModel.host+"/adminservice/api/get-sanc-countries-list", { headers: this.apiModel.httpHeaderGet }).pipe(
      tap(heroes => console.log(`getSancCountriesList() executed`)),
      catchError(this.handleError('getSancCountriesList() error'))
    );
  }

  // End by Zohaib Asim 

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
