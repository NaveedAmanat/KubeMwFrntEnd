import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiModel } from '../models/Api.model';
import { PaymentType } from '../models/paymentType.model';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { City } from '../models/city.model';
import { UC } from '../models/UC.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService) {

    this.token = 'Bearer ' + sessionStorage.getItem('token');
    console.log('City Service Initiated');
  }

  getCities(pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{'cities': City[], 'count': Number}> {
    return this.http.get<City[]>(this.apiModel.host + '/setupservice/api/mw-cities?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: {'cities': City[], 'count': Number}) => console.log(p))
      ); 
  }


  addCity(city): Observable<City> {
    return this.http.post<City>(this.apiModel.host + '/setupservice/api/add-new-city', city, {headers:this.apiModel.httpHeaderPost})
      .pipe(tap((p: City) => console.log(p))
      );
  }


  editCity(city): Observable<City> {
    return this.http.put<City>(this.apiModel.host + '/setupservice/api/update-city', city, {headers:this.apiModel.httpHeaderPost})
      .pipe(tap((p: City) => console.log(p))
      );
  }


  deleteCity(id) {
    return this.http.delete(this.apiModel.host + '/setupservice/api/delete-city/' + id, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: City) => console.log(p))
      );
  }

  getAllUcs(citySeq, filter: string) : Observable<any[]>{
    return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/mw-ucs-combinations?citySeq=' + citySeq + '&filter=' + filter, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: any[]) => console.log(p))
      );
  }

  addCityUcRel(obj) : Observable<any>{
    return this.http.post<any>(this.apiModel.host + '/setupservice/api/add-new-city-uc-rel', obj, {headers:this.apiModel.httpHeaderPost})
      .pipe(tap((p: City) => console.log(p))
      );
  }
  deleteCityUcRel(id) : Observable<any>{
    return this.http.delete<any>(this.apiModel.host + '/setupservice/api/mw-city-uc-rel/'+id, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: City) => console.log(p))
      );
  }
  getUcsForCity(id) : Observable<UC[]>{
    return this.http.get<UC[]>(this.apiModel.host + '/setupservice/api/mw-city-uc-rel-by-city/'+id, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: UC[]) => console.log(p))
      );
  }

  //Added by Areeba
  getAllCities(): Observable<City[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<City[]>(this.apiModel.host + '/setupservice/api/all-mw-cities', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: City[]) => console.log(p))
    );
  }
  //Ended by Areeba
  public handleError<T>(operation = 'operation', result?: T) {
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
