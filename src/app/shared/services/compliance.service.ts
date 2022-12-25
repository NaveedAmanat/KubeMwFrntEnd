import { AccessRecovery } from '../models/access-recovery.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/Auth.model';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Expense } from '../models/expense.model';
import { PaymentType } from '../models/paymentType.model';
import { PaymentTypesService } from './paymentTypes.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ComplianceService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;


  constructor(private http: HttpClient, private toaster: ToastrService) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  getADTTarget(): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-adt-trgt-listing', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }
  getADTVsts(seq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-adt-trgt-listing/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getADTVstsByTyp(brnchSeq,vstTyp): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-adt-trgt-listing/' + brnchSeq+"/"+vstTyp, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getClientVstData(vstSeq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-vstd-clnts-info/' + vstSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getExceptionVstData(vstSeq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-vsts-excptns-info/' + vstSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  
  getBranchVstData(vstSeq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-vsts-brnch-info/' + vstSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }
  
  getAdcVstData(vstSeq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/complianceservice/api/get-vsts-adc-info/' + vstSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }


  //device registration

  // getEmployees() {
  //   return this.http.get<{ result: any }>(this.apiModel.host + "/setupservice/api/mw-emps/0/3", { headers: this.apiModel.httpHeaderGet });
  // }
  
  getEmployees() {
    return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/mw-emps/0/3', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getRegistrationDevices() {
    return this.http.get<{ result: any }>(this.apiModel.host + "/setupservice/api/registered-devices/", { headers: this.apiModel.httpHeaderGet });
  }

  registerComplianceDevice(obj) {
    return this.http.post(this.url + "/setupservice/api/register-dvc", obj, { headers: this.apiModel.httpHeaderGet });
  }

  unregisterComplianceDevice(obj) {
    return this.http.put(this.url + "/setupservice/api/unregister-dvc", obj, { headers: this.apiModel.httpHeaderGet });
  }

  addADTTarget(body) {
    return this.http.post<{ result: any }>(this.apiModel.host + "/complianceservice/api/add-brnch-vst", body, { headers: this.apiModel.httpHeaderPost });
  }

  updateADTTarget(body) {
    return this.http.post<{ result: any }>(this.apiModel.host + "/complianceservice/api/update-brnch-vst", body, { headers: this.apiModel.httpHeaderPost });
  }

  deleteADTTarget(body) {
    return this.http.delete<{ result: any }>(this.apiModel.host + "/complianceservice/api/delete-brnch-vst/" + body, { headers: this.apiModel.httpHeaderGet });
  }

  getValues(groupName: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/ref-cd-vals-by-group-key/' + groupName, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any[]) => console.log(p)));
  }


  updateStatus(seq) {
    return this.http.get<any>(this.apiModel.host + "/complianceservice/api/update-vst-status/" + seq, { headers: this.apiModel.httpHeaderGet });
  }


  deleteVst(seq) {
    return this.http.delete<any>(this.apiModel.host + "/complianceservice/api/delete-adt-vst/" + seq, { headers: this.apiModel.httpHeaderGet });
  }

  updateAdtVst(body) {
    return this.http.post<{ result: any }>(this.apiModel.host + "/complianceservice/api/update-adt-vst", body, { headers: this.apiModel.httpHeaderPost });
  }

  getVstSrvy(seq) {
    return this.http.get<any>(this.apiModel.host + "/complianceservice/api/get-vst-srvy/" + seq, { headers: this.apiModel.httpHeaderGet });
  }


  // Target Managment

  getTargetManagment(trgtYr): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/complianceservice/api/mw-trgts/' + trgtYr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  postingTargetManagment(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/complianceservice/api/add-adt-trgt', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteTargetManagment(seq) {
    return this.http.delete<any>(this.apiModel.host + '/complianceservice/api/mw-trgt/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any) => console.log(`Target Managment Deleted`))
    );
  }


  // Categories

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/complianceservice/api/mw-ctgry/', { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  postingCategories(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/complianceservice/api/add-adt-ctgry', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteCategory(seq) {
    return this.http.delete<any>(this.apiModel.host + '/complianceservice/api/mw-ctgry/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any) => console.log(`Target Managment Deleted`))
    );
  }

  slabsSubmission(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/complianceservice/api/add-adt-ctgry-slb', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  gettingSlabs(seq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/complianceservice/api/get-adt-ctgry-slb/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }


  // Action Sub Categories

  getSubCategories(seq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/complianceservice/api/mw-ctgry/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  postingSubCategories(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/complianceservice/api/add-adt-sub-ctgry', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteSubCategory(seq) {
    return this.http.delete<any>(this.apiModel.host + '/complianceservice/api/mw-sub-ctgry/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any) => console.log(`Target Managment Deleted`))
    );
  }

  //Issues

  getAllIssues(seq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/complianceservice/api/get-mw-isu/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  postingIssues(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/complianceservice/api/add-adt-isu', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteIssue(seq) {
    return this.http.delete<any>(this.apiModel.host + '/complianceservice/api/mw-adt-isu/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any) => console.log(`Target Managment Deleted`))
    );
  }

  //compliance Reports

  printBranchRankingReport(adtVstSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-barch-ranking/` + adtVstSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printCPCReport(adtVstSeq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-cpc-report/` + adtVstSeq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printAmlCompliaanceReport(frmDt, toDt, brnchSeq, isXlx) {
    const url = `${this.apiModel.host}/reportservice/api/print-aml-matches/` + frmDt + `/` + toDt + '/' + brnchSeq + '/' + isXlx;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }

  printCnicExpiryReport() {
    const url = `${this.apiModel.host}/reportservice/api/cnic_expiry_detail`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


}
