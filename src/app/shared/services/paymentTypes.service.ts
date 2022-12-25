import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ApiModel} from '../models/Api.model';
import {PaymentType} from '../models/paymentType.model';
import {Observable, of} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';
import {MwPdcDtlDTOs} from '../models/pdc.model';
import {PaymentSchedule} from '../models/paymentSchedule.model';
import {DisbursementVoucherListItem} from '../models/disbursementVoucherListItem.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypesService {
  apiModel: ApiModel = new ApiModel();
  paymentTypes: PaymentType;

  constructor(public http: HttpClient,
              private router: Router,
              private toastr: ToastrService) {
    console.log('Payment Types Service Initiated');
  }
  getTypeStatus() {
    return this.http.get<PaymentSchedule[]>
    (this.apiModel.host + '/setupservice/api/vals-by-group-name?groupName=Types' , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getTypeStatus')));
  }
  getAllTypes(number) {
    return this.http.get<PaymentType>
    (this.apiModel.host + '/setupservice/api/mw-typs/' + number , { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllTypes')));
  }

  getAllTypesByCategory(number: number, pageIndex: number, pageSize: number, filter: String, isCount: boolean, brnchSeq: number):Observable<{'typs': PaymentType[], 'count': Number}> {
    return this.http.get<PaymentType>
    (this.apiModel.host + '/setupservice/api/mw-typs?ctgryId=' + number + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' +  isCount + '&brnchSeq=' + brnchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: {'typs': PaymentType[], 'count': Number}) => console.log(data)),
      catchError(this.handleError('getAllTypes')));
  }
  getAllTypesByBrnch(number, brnch) {
    return this.http.get<PaymentType>
    (this.apiModel.host + '/setupservice/api/mw-typs-brnch-wise/' + number +"/"+brnch, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllTypes')));
  }

  getAllBrnches() {
    return this.http.get(this.apiModel.host + '/setupservice/api/mw-brnches'  , { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllTypes')));
  }
  addType(disb: PaymentType): Observable<PaymentType> {
    console.log(disb);
    return this.http.post<PaymentType>(this.apiModel.host + '/setupservice/api/add-new-typ' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => console.log(p)),
      catchError(this.handleError( 'addType'))
    ));
  }


  getTypeByIdAndCtgry(disb: PaymentType): Observable<PaymentType> {
    return this.http.post<PaymentType>(this.apiModel.host + '/setupservice/api/mw-typs-by-id-and-ctgry' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => console.log(p)),
      catchError(this.handleError( 'getType'))
    ));
  }


  updateType(disb: PaymentType): Observable<PaymentType> {
    return this.http.put<PaymentType>(this.apiModel.host + '/setupservice/api/update-typ' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => console.log(p)),
      catchError(this.handleError( 'updateType'))));
  }
  deleteType(seq): Observable<PaymentType> {
    const url = this.apiModel.host + '/setupservice/api/mw-typs/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet} ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('deleteType')));
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
