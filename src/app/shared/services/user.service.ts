import { Injectable } from '@angular/core';
import { Product } from '../models/Product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModel } from '../models/Api.model';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User.model';
import { Auth } from '../models/Auth.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiModel: ApiModel = new ApiModel();
  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    console.log("User service initiated");
  }



  loginUser(user: User): Observable<Auth> {

    // prod
    return this.http.post<Auth>(this.apiModel.host + '/kashaf/api/authenticate-ad', user, { headers: this.apiModel.httpHeaderPost }).pipe(
      //  return this.http.post<Auth>(this.apiModel.host+ '/api/authenticate-ad', user, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Auth) => {console.log(p)}));
  }

  getRoles() {
    return this.http.get(this.apiModel.host + '/setupservice/api/get-user-role', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p)));
  }

  getMods() {
    return this.http.get(this.apiModel.host + '/setupservice/api/mw-mods', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p)));
  }

  getAuth(seq) {
    return this.http.get(this.apiModel.host + '/setupservice/api/mw-auth/'+seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p)));
  }


  updateAppAuth(auth) {
    return this.http.post<Auth>(this.apiModel.host + '/setupservice/api/update-app-auth', auth, { headers: this.apiModel.httpHeaderPost }).pipe();
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.spinner.hide();

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.toastr.error(error.error.error, `${operation} failed:`);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
