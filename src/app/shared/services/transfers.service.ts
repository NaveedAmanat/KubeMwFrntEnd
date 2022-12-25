
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDto } from '../models/app-dto.model';
import { Portfolio } from '../models/portfolio.model';
import { Region } from '../models/region.model';
import { Area } from '../models/area.model';
import { Branch } from '../models/branch.model';
import { branchPortfolio } from '../models/branchPortfolio.model';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  token: string;
  constructor(private http: HttpClient) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  // getTransfers(): Observable<AppDto[]> {
  //   return this.http.get<AppDto[]>(this.apiModel.host + '/setupservice/api/all-transfers/' + this.auth.user.username, { headers: this.apiModel.httpHeaderGet }).pipe(
  //     tap((p: AppDto[]) => console.log(p))
  //   );
  // }

  // modified by Naveed - Date - 23-01-2022
  // added portSeq as paremeter
  getTransfers(brnchSeq: number, portSeq: number, pageIndex, pageSize, filter, isCount): Observable<{"apps": any, "count" : Number}> {
    return this.http.get<AppDto[]>(this.apiModel.host + '/setupservice/api/all-transfers?userId=' + this.auth.user.username + '&brnchSeq=' + brnchSeq + '&portSeq=' + portSeq + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: {"apps": any, "count" : Number}) => console.log(p))
    );
  }
  // Ended By Naveed - Date 23-01-2022

  getPortfoliosByBranch(branchSeq): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.apiModel.host + '/setupservice/api/mw-ports-by-branch/' + branchSeq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Portfolio[]) => console.log(p))
    );
  }

  //teting Data for umair
  hello() {
    return this.http.get(this.apiModel.host + '/loanservice/api/get-test/', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p))
    );
  }
  //end testing data for umair

  getRegions(): Observable<Region[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<Region[]>(this.apiModel.host + '/setupservice/api/mw-regs', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Region[]) => console.log(p))
    );
  }

  getAreas(): Observable<Area[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<Area[]>(this.apiModel.host + '/setupservice/api/mw-areas', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Area[]) => console.log(p))
    );
  }
  getBranches(): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<Branch[]>(this.apiModel.host + '/setupservice/api/mw-brnches', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Branch[]) => console.log(p))
    );
  }

  getBranchesByUser(): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<Branch[]>(this.apiModel.host + '/setupservice/api/mw-brnches-by-user', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Branch[]) => console.log(p))
    );
  }

  // update by Naveed - Dated - 23-01-2022 
  updatePort(appDtos: AppDto[]): Observable<AppDto> {
    return this.http.put<AppDto>(this.apiModel.host + '/loanservice/api/update-client-port', appDtos, { headers: this.apiModel.httpHeaderPost });
  }
  // Ended by Naveed - Dated - 23-01-2022

  // Added by Naveed - Dated - 23-01-2022
  // to transfer complete portfolio or branch 
  updateAllPort(fromPort, fromBranch, toPort, toBrnch): Observable<any> {
    console.log('params', fromPort, fromBranch, toPort)
    return this.http.get<any>(`${this.apiModel.host}/loanservice/api/transfer-all-port/${fromPort}/${fromBranch}/${toPort}/${toBrnch}`, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)));
  }
  // Ended by Naveed - Dated - 23-01-2022

  getAllProductsForBranch(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-prd-grp-fr-brnch/' + this.auth.emp_branch, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  //product groups
  getAllProductsByBrnchSeq(brnchSeq: number): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-prd-grp-fr-brnch/' + brnchSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  //products
  //Added by Areeba
  getAllPrdsByBrnchSeq(brnchSeq: number): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-prd-fr-brnch/' + brnchSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }
  //Ended by Areeba

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-prd/' , { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getAllActivitiesForDonnorTagging(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-biz-acty/' , { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getAllSectorsForDonnorTagging(): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-biz-sect/' , { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getAllPeriodsOfBranchPortfolio(prdGrpSeq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/brnch-perd-by-prd-grp/' + this.auth.emp_branch + '/' + prdGrpSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getListingsForBranchPortfolio(brnchTrgtSeq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/brnch-trgt-by-prd-grp/' + this.auth.emp_branch + '/' + brnchTrgtSeq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  savingAllBranchPortfolios(arr): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/setupservice/api/add-port-trgt' , arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }
    //Added by Areeba - Dated 24-2-2022
  //Jubliee Panel Hospital List for KSZB clients
  getBrnchSeqByNm(brnchNm): Observable<any>{
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/brnch-seq-by-nm/' + brnchNm, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getBrnchNmBySeq(brnchSeq): Observable<String>{
    return this.http.get<String>(this.apiModel.host + '/setupservice/api/brnch-nm-by-seq/' + brnchSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: String) => { console.log(p); })
      );
  }
  //Ended by Areeba

  getAllBranchByRegion(regSeq): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    return this.http.get<Branch[]>(this.apiModel.host + `/setupservice/api/get-branch-by-region/${regSeq}`, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Branch[]) => console.log(p))
    );
  }
}
