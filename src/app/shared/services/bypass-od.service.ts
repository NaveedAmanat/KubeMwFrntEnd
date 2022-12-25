import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';
import { BypassOD } from '../models/bypass-od.model';

@Injectable({
  providedIn: 'root'
})
export class BypassOdService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  //get all clients
  getAllClientsLoanAppOD(brnchSeq, pageIndex, pageSize, filter, isCount): Observable<{ "clnts": any, "count": Number }> {
    const url = `${this.apiModel.host}/adminservice/api/all-clnts-loan-app?userId=` + this.auth.user.username + '&brnchSeq=' + brnchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount;
    return this.http.get<BypassOD[]>
      (url, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: { "clnts": any, "count": Number }) => this.spinner.hide()),
        catchError(this.handleError('getAllClientsLoanAppOD')));
  }

  //get items to be checked
  getBypassClientsLoanAppOD(brnchSeq): Observable<{ "clnts": any, "count": Number }> {
    return this.http.get<BypassOD[]>(`${this.apiModel.host}/adminservice/api/od-clnts-loan-app?brnchSeq=` + brnchSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: { "clnts": any, "count": Number }) => console.log(p))
      );
  }

  //update check
  bypassOverdue(clntSeq: number, checked: boolean): Observable<any> {
    return this.http.put<any>(this.apiModel.host + '/adminservice/api/bypass-overdue/' + clntSeq + '/' + checked, null, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p)
      ));
  }

  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      if (error.status == 400) {
        this.toastr.error(error.error.error, `${operation} failed:`)
      } else {
        this.toastr.error(error.message, `${operation} failed:`);
      }

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
