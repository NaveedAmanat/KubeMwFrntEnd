
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {BranchRemit} from '../models/branch-remit.model';


@Injectable({
  providedIn: 'root'
})
export class BranchRemitService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getBranchRemitsbyBranchSeq(brnchSeq): Observable<BranchRemit[]> {
    return this.http.get<BranchRemit[]>(this.apiModel.host + '/setupservice/api/mw-brnch-remit-rel-by-brnch-seq/'+brnchSeq , {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: BranchRemit[]) => console.log(p))
    );
  }

  addBranchRemit (branchRemit: BranchRemit): Observable<BranchRemit> {
    return this.http.post<BranchRemit>(this.apiModel.host + '/setupservice/api/add-new-brnch-remit-rel', branchRemit,  {headers:this.apiModel.httpHeaderPost}).pipe(
        tap((p: BranchRemit) => console.log(`Add BranchRemit`))
      );
  }
  
  updateBranchRemit(BranchRemit: BranchRemit): Observable<BranchRemit> {
    return this.http.put<BranchRemit>(this.apiModel.host + '/setupservice/api/update-branch-remit-rel', BranchRemit,  {headers:this.apiModel.httpHeaderPost} )
    .pipe(tap((p: BranchRemit) => console.log(p))
    );
  }

  deleteBranchRemit(id: number) {
    return this.http.delete<BranchRemit>(this.apiModel.host + '/setupservice/api/mw-brnch-remit-rel/' + id,  {headers:this.apiModel.httpHeaderGet}).pipe(
        tap((p: BranchRemit) => console.log(`Delete BranchRemit`))
    );
  }  

  geterpGliAccounts(){
    return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/get-gl-accounts/' , {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p) => {})
    );
  }
}

