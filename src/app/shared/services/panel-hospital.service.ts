import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Hospitals } from '../models/hospitals.model';
import { PanelHospital } from '../models/panel-hospital.model';

/*
Authored by Areeba
Dated 24-2-2022 
Jubliee Panel Hospital List for KSZB clients
*/ 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PanelHospitalService {

  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
    private router: Router) { 
      console.log('Panel Hospital Service Initiated');
    }

    getHospitals(): Observable<Hospitals[]> {
      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Authorization': this.token
      //   })
      // };
      return this.http.get<Hospitals[]>(this.apiModel.host + '/adminservice/api/get-all-hospitals', { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: Hospitals[]) => console.log(p))
      );
    }

    getNBlacklistHospitals(): Observable<Hospitals[]> {
      return this.http.get<Hospitals[]>(this.apiModel.host + '/adminservice/api/get-not-blacklisted-hospitals', { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: Hospitals[]) => console.log(p))
      );
    }

    getPanelHospitalList(pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{ "Hospitals": PanelHospital[], "count": number }> {
      return this.http.get<{ "Hospitals": PanelHospital[], "count": number }>(this.apiModel.host+"/adminservice/api/get-panel-hospital-list?pageIndex=" + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet });
    } 

    addPanelHospital (panelHospital: PanelHospital): Observable<any> {
      return this.http.post<any>(this.apiModel.host+"/adminservice/api/add-panel-hospital", panelHospital, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(() => console.log(`addedPanelHospital`))
      );
    }

    addHospital (panelHospital: PanelHospital): Observable<any> {
      return this.http.post<any>(this.apiModel.host+"/adminservice/api/add-hospital", panelHospital, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(() => console.log(`addedPanelHospital`))
      );
    }

    updatePanelHospital (panelHospital: PanelHospital): Observable<any> {
      return this.http.put<any>(this.apiModel.host+"/adminservice/api/update-panel-hospital", panelHospital, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(() => console.log(`updated rel w/ id=${panelHospital.relId}`))
      );
    }

    updateHospital (hospitals: Hospitals): Observable<any> {
      return this.http.put<any>(this.apiModel.host+"/adminservice/api/update-panel-hospital", hospitals, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(() => console.log(`updated hsp w/ id=${hospitals.id}`))
      );
    }

    uploadPanelHospital (panelHospital: PanelHospital[]): Observable<any> {
      return this.http.post<any>(this.apiModel.host+"/adminservice/api/upload-panel-hospital", panelHospital , { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`Uploaded Panel Hospital List`))
      );
    }

    // updateNacta (panelHospital: PanelHospital): Observable<any> {
    //   return this.http.put<any>(this.apiModel.host+"/adminservice/api/update-panel-hospital", panelHospital, { headers: this.apiModel.httpHeaderGet }).pipe(
    //     tap(() => console.log(`added nacta w/ id=${panelHospital.sancSeq}`))
    //   );
    // }

    deletePanelHospital (id): Observable<any> {
      return this.http.delete<any>(this.apiModel.host+"/adminservice/api/delete-panel-hospital/"+ id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`Deleted Panel Hospital`))
      );
    }

    deleteHospital (id): Observable<any> {
      return this.http.delete<any>(this.apiModel.host+"/adminservice/api/delete-hospital/"+ id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`Deleted Hospital`))
      );
    }

    deleteAllPanelHospitals(): Observable<any> {
      return this.http.delete<any>(this.apiModel.host+"/adminservice/api/delete-all-panel-hospitals", { headers: this.apiModel.httpHeaderGet }).pipe(
        tap(heroes => console.log(`Deleted All Panel Hospitals`)),
        catchError(this.handleError('deleteAllPanelHospitals'))
      );
    }

    // deletePanelHospital (id): Observable<any> {
    //   return this.http.delete<any>(this.apiModel.host+"/adminservice/api/delete-panel-hospital/"+ id, { headers: this.apiModel.httpHeaderGet }).pipe(
    //     tap(heroes => console.log(`Deleted Panel Hospital`))
    //   );
    // }

    public handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => { 
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
}
