import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {BusinessActivity} from '../models/business-activity.model';


@Injectable({
  providedIn: 'root'
})
export class BusinessActivityService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getBusinessActivities(bizSectSeq): Observable<BusinessActivity[]> {
    return this.http.get<BusinessActivity[]>(this.apiModel.host + '/setupservice/api/mw-biz-acty-sect/'+bizSectSeq,{headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: BusinessActivity[]) => console.log(p))
    );
  }

  addBusinessActivity (BusinessActivity: BusinessActivity): Observable<BusinessActivity> {
    return this.http.post<BusinessActivity>(this.apiModel.host + '/setupservice/api/add-new-biz-acty', BusinessActivity, {headers:this.apiModel.httpHeaderPost}).pipe(
        tap((p: BusinessActivity) => console.log(`Add BusinessActivity`))
      );
  }
  
  updateBusinessActivity(BusinessActivity: BusinessActivity): Observable<BusinessActivity> {
    return this.http.put<BusinessActivity>(this.apiModel.host + '/setupservice/api/update-biz-acty', BusinessActivity, {headers:this.apiModel.httpHeaderPost} )
    .pipe(tap((p: BusinessActivity) => console.log(p))
    );
  }

  deleteBusinessActivity(id: string) {
    return this.http.delete<BusinessActivity>(this.apiModel.host + '/setupservice/api/mw-biz-acty/' + id, {headers:this.apiModel.httpHeaderGet}).pipe(
        tap((p: BusinessActivity) => console.log(`Delete BusinessActivity`))
    );
  }  
}

