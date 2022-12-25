import { Injectable } from '@angular/core';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})

export class ReschedulingReportsService {

  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();


  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

  }


  getClientRecoveryStatus(date: String, a: number) {
    const url = `${this.apiModel.host}/reportservice/api/print-client-recovery-status/${date}` + `/` + a;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getDueVsRecovery() {
    const url = `${this.apiModel.host}/reportservice/api/print-due-vs-recovery`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getManagmentDashboard() {
    const url = `${this.apiModel.host}/reportservice/api/print-management-dashboard`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getReschedulingPortfolio() {
    const url = `${this.apiModel.host}/reportservice/api/print-rescheduling-portfolio`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  getPortfolioQualityOldPortfolio() {
    const url = `${this.apiModel.host}/reportservice/api/print-portfolio-quality-old-portfolio`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

}
