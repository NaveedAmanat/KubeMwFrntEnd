import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';
import { Travelling } from '../models/travelling.model';

/*Authored by Areeba
HR Travelling SCR
Dated - 07-06-2022
*/

@Injectable({
  providedIn: 'root'
})
export class TravellingService {
 
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;
  constructor(private http: HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  getTravelling(refCdTrvlngRol:number) {
    return this.http.get<Travelling[]>(this.apiModel.host + '/setupservice/api/get-trvlng/' + refCdTrvlngRol, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Travelling[]) => console.log(p))
    );
  }
  getAllTravelling() {
    return this.http.get<Travelling[]>(this.apiModel.host + '/setupservice/api/get-all-trvlng', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Travelling[]) => console.log(p))
    );
  }
  addTravelling(trvlngObj){
		return this.http.post<{ result: any }>(this.url + "/setupservice/api/add-trvlng", trvlngObj, { headers: this.apiModel.httpHeaderPost });
  }
  deleteTravelling(hrTrvlngSeq){
		return this.http.put<{ result: any }>(this.url + "/setupservice/api/delete-trvlng/" + hrTrvlngSeq, null, { headers: this.apiModel.httpHeaderPost });
  }
}
