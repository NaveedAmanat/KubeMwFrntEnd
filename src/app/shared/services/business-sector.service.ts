import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {BusinessSector} from '../models/business-sector.model';


@Injectable({
  providedIn: 'root'
})
export class BusinessSectorService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getBusinessSectors(): Observable<BusinessSector[]> {
    return this.http.get<BusinessSector[]>(this.apiModel.host + '/setupservice/api/mw-biz-sect', {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: BusinessSector[]) => console.log(p))
    );
  }

  addBusinessSector (BusinessSector: BusinessSector): Observable<BusinessSector> {
    return this.http.post<BusinessSector>(this.apiModel.host + '/setupservice/api/add-new-biz-sect', BusinessSector, {headers:this.apiModel.httpHeaderPost}).pipe(
        tap((p: BusinessSector) => console.log(`Add BusinessSector`))
      );
  }
  
  updateBusinessSector(BusinessSector: BusinessSector): Observable<BusinessSector> {
    return this.http.put<BusinessSector>(this.apiModel.host + '/setupservice/api/update-biz-sect', BusinessSector, {headers:this.apiModel.httpHeaderPost} )
    .pipe(tap((p: BusinessSector) => console.log(p))
    );
  }

  deleteBusinessSector(id: string) {
    return this.http.delete<BusinessSector>(this.apiModel.host + '/setupservice/api/mw-biz-sect/' + id, {headers:this.apiModel.httpHeaderGet}).pipe(
        tap((p: BusinessSector) => console.log(`Delete BusinessSector`))
    );
  }  
}

