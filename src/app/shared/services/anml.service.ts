import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnmlList } from '../models/anml-list.module';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnmlService {


  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http: HttpClient) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  getAnmlList(clntSeq): Observable<AnmlList[]> {
    return this.http.get<AnmlList[]>(this.apiModel.host + '/adminservice/api/clnts-anml-list/' + clntSeq, { headers: this.apiModel.httpHeaderGet });
  }

  addAnmlDeath(data: any): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/report-anml-death', data, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap()
    );
  }

  getAnmlInsuranceClaims(): Observable<AnmlList[]> {
    return this.http.get<AnmlList[]>(this.apiModel.host + '/adminservice/api/anml-dth-rpt', { headers: this.apiModel.httpHeaderGet });
  }

  updateAnmlInsuranceClaims(seq, sts, rmrks): Observable<AnmlList[]> {
    return this.http.get<AnmlList[]>(this.apiModel.host + '/adminservice/api/mark-dth-rpt-sts/' + seq + '/' + sts + '/' + rmrks , { headers: this.apiModel.httpHeaderGet });
  }

  postAnimalLoanAdjust(anmlRgstrSeq , sts, amt): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/mark-dth-rpt-adj/' + anmlRgstrSeq + '/' + sts + '/' + amt, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  //Added by Areeba
  checkAnmlAdjAmt(seq , amount): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/adminservice/api/check-loan-adj/' + seq + '/' + amount , { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }
  //Ended by Areeba
}