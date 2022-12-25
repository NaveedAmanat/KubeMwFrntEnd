import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiModel } from '../models/Api.model';
import { Branch } from '../models/branch.model';
import { Product } from '../models/Product.model';

/* Authored by Areeba
   Branch Setup
   27-05-2022
*/

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService) {
      this.token = 'Bearer ' + sessionStorage.getItem('token');
    console.log('Branch Service Initiated');
    }

  getBranches(pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{'brnchs': Branch[], 'count': Number}> {
    return this.http.get<Branch[]>(this.apiModel.host + '/setupservice/api/mw-branches-stp?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&filter=' + filter + '&isCount=' + isCount, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: {'brnchs': Branch[], 'count': Number}) => console.log(p))
      );
  }

  getAllAreaNames() {
    return this.http.get<any[]>
        (this.apiModel.host + '/setupservice/api/mw-area-names', { headers: this.apiModel.httpHeaderGet }).pipe(
            tap((p: any) => console.log(p)));
  }

  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(this.apiModel.host + '/loanservice/api/create-mw-clnt', branch, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Branch) => console.log(`lOAN APPLICANT SUBMITTED`))
    );
  }

  getBranchInfo(brnchSeq: number): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiModel.host + '/setupservice/api/get-mw-brnch-data/' + brnchSeq, {headers:this.apiModel.httpHeaderGet})
      .pipe(tap((p: Branch[]) => console.log(p))
      );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiModel.host + '/loanservice/api/create-mw-clnt', product, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Product) => console.log(`lOAN APPLICANT SUBMITTED`))
    );
  }

  addAddressInfo(branch: Branch) {
    return this.http.post<Branch>(this.apiModel.host + '/setupservice/api/add-brnch-addr-info', branch, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Branch) => console.log(`Branch Address info added.`))
    );
  }

  // Added by Areeba - 1-12-2022
  addUcsToBrnch(branch: Branch) {
    return this.http.post<Branch>(this.apiModel.host + '/setupservice/api/add-uc-to-brnch', branch, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: Branch) => console.log(`Branch UCs added.`))
    );
  }
}
