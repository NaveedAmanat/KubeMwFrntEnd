import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ApiModel} from '../models/Api.model';
import {PaymentType} from '../models/paymentType.model';
import {Observable, of} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTypesService {
  apiModel: ApiModel = new ApiModel();
  paymentTypes: PaymentType;

  constructor(public http: HttpClient,
              private router: Router,
              private toastr: ToastrService) {
    console.log('Expense Types Service Initiated');
  }
  getAllExpenses() {
    return this.http.get<PaymentType>
    (this.apiModel.host + '/' , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllExpenses')));
  }
  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.toastr.error(error.message, `${operation} failed:`);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
