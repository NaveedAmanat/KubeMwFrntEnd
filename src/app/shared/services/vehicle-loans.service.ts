import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiModel } from '../models/Api.model';
import { vehicleLoan } from '../models/vehicleLoan.model';

/**
 * @Added, Naveed
 * @Date, 53-09-2022
 * @Description, SCR - Vehicle Loans
*/


@Injectable({
  providedIn: 'root'
})
export class VehicleLoansService {

  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient, private router: Router) { }

  getAllLists(branchSeq: string, pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{ 'lists': any[], 'count': Number }> {
    return this.http.get<{ 'lists': any[], 'count': Number }>(this.apiModel.host + `/adminservice/api/all-active-vehicle-loans?branchSeq=${branchSeq}&pageIndex=${pageIndex}` +
      `&pageSize=${pageSize}&filter=${filter}&isCount=${isCount}`, { headers: this.apiModel.httpHeaderGet });
  }

  addVehicleInsrForm(vehicleFormValue: vehicleLoan) {
		return this.http.post(this.apiModel.host + `/adminservice/api/add-vehicle-info`, vehicleFormValue , { headers: this.apiModel.httpHeaderPost });
	}
 
  updateVehicleInsrForm(vehicleFormValue: vehicleLoan) {
		return this.http.put(this.apiModel.host + `/adminservice/api/update-vehicle-info/${vehicleFormValue.loanAppSeq}`, vehicleFormValue , { headers: this.apiModel.httpHeaderPost });
	}

  uploadImage(uploadImageData) {
		return this.http.post(this.apiModel.host + `/adminservice/api/image/upload`, uploadImageData , { headers: this.apiModel.httpHeaderPostMultipart })
	}

  downloadImage(loanAppSeq, docSeq) {
		return this.http.get(this.apiModel.host + `/adminservice/api/image/download/${loanAppSeq}/${docSeq}` , { headers: this.apiModel.httpHeaderGet })
	}

  downloadImageByLoan(loanAppSeq) {
		return this.http.get(this.apiModel.host + `/adminservice/api/image/download/${loanAppSeq}` , { headers: this.apiModel.httpHeaderGet })
	}

  getVehicleInfoByLoan(loanAppSeq: any) {
		return this.http.get(this.apiModel.host + `/adminservice/api/get-vehicle-info-by-loan/${loanAppSeq}` , { headers: this.apiModel.httpHeaderGet });
	}
}