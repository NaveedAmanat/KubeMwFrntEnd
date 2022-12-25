import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { RecoveryStaging } from '../models/recovery-staging.model';
import { PaymentType } from '../models/paymentType.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class FileLoaderService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  //  object

  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  loadFilePath(filePath) {
    // this.httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': this.token,
    //   }),
    //   responseType: "text/plain"
    // };
    return this.http.get<String>(this.apiModel.host + filePath, {
      'responseType': "text/plain" as 'json',
      headers: this.apiModel.httpHeaderGet
    }).pipe(
      tap((p: String) => console.log(p))
    );
  }


  uploadFile(type) {
    if (type == "Recovery") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-recovery-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet });

    }
    else if (type == "Budget") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-budget-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: String) => console.log(p))
      );
    }
    else if (type == "Target") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-target-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: String) => console.log(p))
      );
    }

    else if (type == "Tagging") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-tagging-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: String) => console.log(p))
      );
    }
    else if (type == "InsuranceClaim") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-insurance-claim-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: String) => console.log(p))
      );
    }
    else if (type == "WriteOff") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-write-off-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: String) => console.log(p))
      );
    }
    else if (type == "Funds") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-funds-file', { headers: this.apiModel.httpHeaderGet }).pipe();
    }else if (type == "Aml") {
      return this.http.get<any>(this.apiModel.host + '/setupservice/api/process-aml-list', { headers: this.apiModel.httpHeaderGet }).pipe();
    }else if (type == "defer") {
      return this.http.get<any>(this.apiModel.host + '/setupservice/api/post-defer-file', { headers: this.apiModel.httpHeaderGet }).pipe();
    }else if(type == 'outreach'){
      return this.http.get<any>(this.apiModel.host + '/setupservice/api/load-outreach-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet });
    }else if(type == 'BranchFundsRequest'){
      return this.http.get<any>(this.apiModel.host + '/setupservice/api/load-branch-fund-request-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet });
    }else if(type == 'lifeInsuranceClaim'){
      return this.http.get<any>(this.apiModel.host + '/setupservice/api/load-life-insurance-claim-file', { 'responseType': "text/plain" as 'json', headers: this.apiModel.httpHeaderGet });
    } else if (type == "branchWiseCMSFundsTransfer") {
      return this.http.get<String>(this.apiModel.host + '/setupservice/api/load-branch-cms-funds-transfer-file', { headers: this.apiModel.httpHeaderGet }).pipe();
    }
  }


  getClientAndBranchName(clntId): Observable<string> {
    return this.http.get<string>(this.apiModel.host + '/setupservice/api/get-client-and-branch-name/' + clntId, { headers: this.apiModel.httpHeaderGet, 'responseType': "text/plain" as 'json', }).pipe(
      tap((p: string) => console.log(p)));

  }


  getAgent(agentId): Observable<PaymentType> {
    return this.http.get<PaymentType>(this.apiModel.host + '/setupservice/api/mw-typs-by-seq/' + agentId, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: PaymentType) => console.log(p)));
  }

  getFileData(type): Observable<RecoveryStaging[]> {
    if (type == "Recovery") {
      return this.http.get<RecoveryStaging[]>(this.apiModel.host + '/setupservice/api/get-file-data/' + type, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: RecoveryStaging[]) => console.log(p))
      );
    }
  }

  postData() {
    console.log("))))")
    return this.http.get(this.apiModel.host + '/setupservice/api/process-recovery-file', { headers: this.apiModel.httpHeaderGet });
  }

  postFundsData() {
    return this.http.get(this.apiModel.host + '/setupservice/api/post-funds-file', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)),//this.toastr.success('Fund Posted', 'Success!')),
      catchError(this.handleError('adjustment')));

  }

  postBranchCMSFundsData(CmsFunds) {
    return this.http.post(this.apiModel.host + '/setupservice/api/post-branch-cms-funds-transfer-file',CmsFunds , { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('adjustment')));

  }

  postDeferData() {
    return this.http.get(this.apiModel.host + '/setupservice/api/post-defer-file', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)),//this.toastr.success('Fund Posted', 'Success!')),
      catchError(this.handleError('adjustment')));

  }

  validateBudgetFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-budget-file', { headers: this.apiModel.httpHeaderGet });
  }
  validateTargetFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-target-file', { headers: this.apiModel.httpHeaderGet });
  }
  validateTaggingFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-tagging-file', { headers: this.apiModel.httpHeaderGet });
  }
  validateClaimsFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-insurance-claim-file', { headers: this.apiModel.httpHeaderGet });
  }
  validateWriteOffFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-write-off-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateFundsFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-funds-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateDeferFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-defer-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateRecoveryFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-recovery-file', { headers: this.apiModel.httpHeaderGet });
  }
  
  validateOutreachFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-outreach-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateBranchFundsRequestFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-branch-fund-request-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateLifeInsuranceClaimFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-life-insurance-claim-file', { headers: this.apiModel.httpHeaderGet });
  }

  validateBranchCMSFundsTransferFile() {
    return this.http.get(this.apiModel.host + '/setupservice/api/validate-branch-cms-funds-transfer-file', { headers: this.apiModel.httpHeaderGet });
  }
  public handleError<T>(operation = 'operation', result?: T) {
    this.spinner.hide();
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



