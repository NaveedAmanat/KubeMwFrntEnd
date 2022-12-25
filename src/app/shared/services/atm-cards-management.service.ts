import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { AtmCards } from '../models/atmCards.model';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class AtmCardsManagementService {
  
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  private rcvryTyp: number = 4;
  apiModel: ApiModel = new ApiModel();


  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }


  getAtmCardsListing(brnchSeq: number, pageIndex: number, pageSize: number, filter:string, isCount: boolean): Observable<{'atmCards': AtmCards[], 'count': Number}> {
    return this.http.get<AtmCards[]>(this.apiModel.host + '/recoverydisbursementservice/api/atm-cards-listing?brnchSeq=' + brnchSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: {'atmCards': AtmCards[], 'count': Number}) => console.log(p)));
  }
  
  EditAtmCard(AtmCards): Observable<AtmCards> {
    return this.http.put<AtmCards>(this.apiModel.host + '/recoverydisbursementservice/api/update-atm', AtmCards, {headers:this.apiModel.httpHeaderPost})
      .pipe(tap((p: AtmCards) => console.log(p))
      );
  }

  
  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
    return (error: any): Observable<T> => {
      if (error.error != undefined) {
        if (error.error.error) {
          this.toastr.error(error.error.error)
        }
      } else {
        this.toastr.error(error.message, `${operation} failed:`);
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
