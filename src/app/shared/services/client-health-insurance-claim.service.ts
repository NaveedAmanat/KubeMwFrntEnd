import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {ClientHealthInsuranceClaim} from '../models/client-health-insurance-claim.model';
import { Branch } from '../../shared/models/branch.model';
import { Expense } from '../models/expense.model';
import { PaymentTypesService } from './paymentTypes.service';
import { PaymentType } from '../models/paymentType.model';
import { Auth } from '../../shared/models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class ClientHealthInsuranceClaimService {
  auth:Auth=JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient, private paymentTypesService:PaymentTypesService) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  // getClientHealthInsuranceClaims(): Observable<ClientHealthInsuranceClaim[]> {
  //   return this.http.get<ClientHealthInsuranceClaim[]>(this.apiModel.host + '/setupservice/api/all-mw-hlth-insr-clm/'+this.auth.user.username , {headers:this.apiModel.httpHeaderGet}).pipe(
  //     tap((p: ClientHealthInsuranceClaim[]) => console.log(p))
  //   );
  // }

  // Modified by Zohaib Asim - Dated 16-12-2020 - Health Claim Type added as parameter
  getClientHealthInsuranceClaims(brnchSeq:number, hlthClmType : number, pageIndex: number, pageSize: number, filter: String, isCount: boolean): Observable<{'clnts': ClientHealthInsuranceClaim[], 'count': Number}> {
    return this.http.get<ClientHealthInsuranceClaim[]>(this.apiModel.host + '/setupservice/api/all-mw-hlth-insr-clm?userId='+this.auth.user.username + '&brnchSeq=' + brnchSeq + '&hlthClmType=' + hlthClmType + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount , {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: {'clnts': ClientHealthInsuranceClaim[], 'count': Number}) => console.log(p))
    );
  }


  addClientHealthInsuranceClaim (ClientHealthInsuranceClaim: ClientHealthInsuranceClaim): Observable<ClientHealthInsuranceClaim> {
    return this.http.post<ClientHealthInsuranceClaim>(this.apiModel.host + '/setupservice/api/add-new-hlth-insr-clm', ClientHealthInsuranceClaim, {headers:this.apiModel.httpHeaderPost}).pipe(
        tap((p: ClientHealthInsuranceClaim) => console.log(`Add ClientHealthInsuranceClaim`))
      );
  }
  
  isClaimPaid(seq:number) : Observable<any>{
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/is-claim-paid/'+seq, {headers:this.apiModel.httpHeaderGet})
  }

  updateClientHealthInsuranceClaim(ClientHealthInsuranceClaim: ClientHealthInsuranceClaim): Observable<ClientHealthInsuranceClaim> {
    this.addClientHealthInsuranceClaimRecordInExpense(ClientHealthInsuranceClaim);
    return this.http.put<ClientHealthInsuranceClaim>(this.apiModel.host + '/setupservice/api/update-hlth-insr-clm', ClientHealthInsuranceClaim, {headers:this.apiModel.httpHeaderPost} )
    .pipe(tap((p: ClientHealthInsuranceClaim) => console.log(p))
    );
  }
  exp:Expense= new Expense();
  temp:PaymentType= new PaymentType();
  addClientHealthInsuranceClaimRecordInExpense(ClientHealthInsuranceClaim: ClientHealthInsuranceClaim) {
    // Added by Zohaib Asim - Dated 23-12-2020
    // Type Id will be as per selection
    if(ClientHealthInsuranceClaim.hlthClmTyp == 1){
      // KSZB CLAIM PAYABLE
      this.temp.typId='0343';
    } else if(ClientHealthInsuranceClaim.hlthClmTyp == 2){
      // KSZB ISLAMIC CLAIM PAYABLE
      this.temp.typId='16227';
    } else if(ClientHealthInsuranceClaim.hlthClmTyp == 3){
      // KC CLAIM PAYABLE
      this.temp.typId='16226';
    }
    // End by Zohaib Asim
    
    this.temp.typCtgryKey=2;
    this.temp.brnchSeq = 0;
    return this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;
        this.exp.pymtTypSeq = parseInt(ClientHealthInsuranceClaim.paymentMode);
        this.exp.brnchSeq = ClientHealthInsuranceClaim.brnchSeq;
        this.exp.expnsDscr = this.temp.typStr;
        this.exp.instrNum = ClientHealthInsuranceClaim.insturmentNum;
        this.exp.expnsAmt = ClientHealthInsuranceClaim.clmAmt;
        this.exp.expnsStsKey = 200;
        this.exp.expnsTypSeq = this.temp.typSeq;
        this.exp.pymtRctFlg = 1;
        this.exp.expRef=ClientHealthInsuranceClaim.clntHlthClmSeq;
        this.http.post<any>(this.apiModel.host + '/setupservice/api/add-new-exp', this.exp, { headers: this.apiModel.httpHeaderPost }).subscribe(); 
    }
    );
  }

  deleteClientHealthInsuranceClaim(id: string) {
    return this.http.delete<ClientHealthInsuranceClaim>(this.apiModel.host + '/setupservice/api/mw-hlth-insr-clm/' + id, {headers:this.apiModel.httpHeaderGet}).pipe(
        tap((p: ClientHealthInsuranceClaim) => console.log(`Delete ClientHealthInsuranceClaim`))
    );
  } 
  
  getClientName(clntSeq): Observable<string> {
    console.log("called");
    return this.http.get<string>(this.apiModel.host + '/setupservice/api/get-client-name/'+clntSeq, {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: string) => console.log(p))
    );
  }

  getAllClientName(): Observable<string[]> {
    console.log("called");
    return this.http.get<string[]>(this.apiModel.host + '/setupservice/api/get-all-client-name/', {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: string[]) => console.log(p))
    );
  }
}

