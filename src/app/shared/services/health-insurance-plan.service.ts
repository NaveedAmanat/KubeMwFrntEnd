import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {HealthInsurancePlan} from '../models/health-insurance-plan.model';


@Injectable({
  providedIn: 'root'
})
export class HealthInsurancePlanService {
  private _url: string = "ass";
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getHealthInsurancePlans(): Observable<HealthInsurancePlan[]> {
    return this.http.get<HealthInsurancePlan[]>(this.apiModel.host + '/setupservice/api/mw-hlth-insr-plan',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: HealthInsurancePlan[]) => console.log(p))
    );
  }

  addHealthInsurancePlan (HealthInsurancePlan: HealthInsurancePlan): Observable<HealthInsurancePlan> {
    return this.http.post<HealthInsurancePlan>(this.apiModel.host + '/setupservice/api/add-new-hlth-insr-plan', HealthInsurancePlan, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p: HealthInsurancePlan) => console.log(`Add HealthInsurancePlans`))
      );
  }
  
  updateHealthInsurancePlan(HealthInsurancePlan: HealthInsurancePlan): Observable<HealthInsurancePlan> {
    return this.http.put<HealthInsurancePlan>(this.apiModel.host + '/setupservice/api/update-hlth-insr-plan', HealthInsurancePlan, { headers: this.apiModel.httpHeaderPost })
    .pipe(tap((p: HealthInsurancePlan) => console.log(p))
    );
  }

  deleteHealthInsurancePlan(id: string) {
    return this.http.delete<HealthInsurancePlan>(this.apiModel.host + '/setupservice/api/mw-hlth-insr-plan/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: HealthInsurancePlan) => console.log(`Delete HealthInsurancePlans`))
    );
  }

  
}

