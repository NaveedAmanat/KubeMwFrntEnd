import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ApiModel } from '../models/Api.model';
import { Auth } from '../models/Auth.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DonorTaggingService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  postFiltersDonorTagging(arr) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/filter-donor-list', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  taggingClients(arr) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/tag-clients', arr, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getDistrict(id) {
    return this.http.get(this.apiModel.host + "/setupservice/api/get-dists-by-state/" + 1, { headers: this.apiModel.httpHeaderGet });
  }

  // CR-Donor Tagging
  // Added By Naveed - 20-12-2021
  // tagged CLients uploader
  tagClientUploader(Clients) {
    return this.http.post<any>(this.apiModel.host + '/adminservice/api/tag-clients-uploader', Clients, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); }));
  }

  // add Filter frmDt for Report  
  printDonorTaggingReport( toDt, frmDt, donor, isXls) {
    const url = `${this.apiModel.host}/reportservice/api/donner-tagging-report/${toDt}/${frmDt}/${donor}/${isXls}`;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }
  // Ended By Naveed - 20-12-2021

}
