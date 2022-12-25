import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NumberFormat } from 'xlsx/types';
import { ApiModel } from '../models/Api.model';
import { holidaysExemption } from '../models/holidaysExcemption.model';


@Injectable({
  providedIn: 'root'
})
export class HolidaysExcemptionService {

  apiModel: ApiModel = new ApiModel();

  constructor(public http: HttpClient, private router: Router) { }

  getAllLists( pageIndex: number, pageSize: number, filter: string, isCount: boolean): Observable<{ 'lists': any[], 'count': Number }> {
    return this.http.get<{ 'lists': any[], 'count': Number }>(this.apiModel.host + `/setupservice/api/holidays-exemption/all?pageIndex=${pageIndex}` +
      `&pageSize=${pageSize}&filter=${filter}&isCount=${isCount}`, { headers: this.apiModel.httpHeaderGet });
  }

  
  addHolidaysExemptionForm(value: holidaysExemption) {
		return this.http.post(this.apiModel.host + `/setupservice/api/holidays-exemption/save`, value , { headers: this.apiModel.httpHeaderPost });
	}
 
  updateHolidaysExemptionForm(value: holidaysExemption) {
		return this.http.put(this.apiModel.host + `/setupservice/api/holidays-exemption/${value.holidaySeq}`, value , { headers: this.apiModel.httpHeaderPost });
	}
 
  uploadHolidays(value: any[]) {
		return this.http.post<any[]>(this.apiModel.host + `/setupservice/api/holidays-exemption/upload`, value , { headers: this.apiModel.httpHeaderPost });
	}


  deleteHoliday(id) {
    return this.http.delete<any>(this.apiModel.host + '/setupservice/api/holidays-exemption/delete/' + id, { headers: this.apiModel.httpHeaderGet });
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