import { Injectable } from '@angular/core';
import { Auth } from '../models/Auth.model';
import { ApiModel } from '../models/Api.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  token: string;

  constructor(private http: HttpClient, private toaster: ToastrService) {
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  getAllTrainingTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-all-training-types', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  updateTrainingTypes(seq) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/update-training-types', seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => this.toaster.success('Training Type Updated', 'Success!'))
      );
  }

  getAllTrainings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-all-training', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getTrainingTypeSeq(seq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-training-type-seq' + '/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  getallParticipants(seq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-all-participants-seq/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }



  getallParticipantsWithDates(seq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-participants-atnd/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }


  setTrainings(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-setup-training', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  addTrainingTypes(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-types-training', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  editTrainigTypes(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/update-training-types', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteTrainigTypes(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/delete-types-training', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteTraining(seq): Observable<any> {
    return this.http.delete<any>(this.apiModel.host + '/trainingservice/api/delete-training' + '/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  deleteParticipants(seq): Observable<any> {
    return this.http.delete<any>(this.apiModel.host + '/trainingservice/api/delete-participants' + '/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  validateClient(cnic): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/loanservice/api/mw-tags-validation-for-clnt-nom-cob', cnic, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  submitParticipant(obj): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-participants', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }


  getAllTypesTraining() {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-all-training-types', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  addTrainings(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-training', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  editTrainings(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/update-training', obj, { headers: this.apiModel.httpHeaderPost })
      ;
  }


  getAllBrnches() {
    return this.http.get(this.apiModel.host + '/setupservice/api/mw-brnches', { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => console.log(data)))
  }

  addParticipantsAgainstTraining(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-participants', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  updateParticipantsAgainstTraining(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/update-participant', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  //compliance Reports

  printGESAReport(seq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-gesa-report/` + seq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  printAICGReport(seq) {
    const url = `${this.apiModel.host}/recoverydisbursementservice/api/print-aicg-report/` + seq;
    return this.http.get<any>(url, {
      responseType: 'arraybuffer' as 'json',
      headers: this.apiModel.httpHeaderPost
    });
  }


  // Staff 


  getAllStaff(seq) {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/get-participants-staff/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }

  addStaffForParticipants(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/save-participants-staff', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  // Add Training attendance

  addTrainingForPartAndStaff(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/save-tenges-atndnc', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  getAllTrainingAttendance(seq) {
    return this.http.get<any[]>(this.apiModel.host + '/trainingservice/api/add-participants-atnd/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: any[]) => console.log(p))
    );
  }


  attendanceForTraining(obj) {
    return this.http.post<any>(this.apiModel.host + '/trainingservice/api/add-participants-atnd', obj, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

}

