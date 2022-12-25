import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from 'src/app/shared/models/Api.model';
import { Auth } from 'src/app/shared/models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class CnicExpiryService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;

  constructor(private http: HttpClient, private toaster: ToastrService) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  getAllCnicUpdate(): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/get-cnic-upd', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  };

  //Updated by Areeba
  getApproveCnic(loanAppSeq, cmnt, cnicNum, relTyp): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/approve-cnic-upd/' + loanAppSeq + '/' + cmnt + '/' + cnicNum + '/' + relTyp, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  };

  getRejectCnic(loanAppSeq, cmnt): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/reject-cnic-upd/' + loanAppSeq + '/' + cmnt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  };

  getSendBackCnic(loanAppSeq, cmnt): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/send-back-cnic-upd/' + loanAppSeq + '/' + cmnt, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  };


}
