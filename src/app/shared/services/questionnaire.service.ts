import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import {Questionnaire} from '../models/questionnaire.model';


@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getQuestionnaires(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(this.apiModel.host + '/setupservice/api/mw-qstnr',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Questionnaire[]) => console.log(p))
    );
  }

  addQuestionnaire (Questionnaire: Questionnaire): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(this.apiModel.host + '/setupservice/api/add-new-qstnr', Questionnaire, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p: Questionnaire) => console.log(`Add Questionnaire`))
      );
  }
  
  updateQuestionnaire(Questionnaire: Questionnaire): Observable<Questionnaire> {
    return this.http.put<Questionnaire>(this.apiModel.host + '/setupservice/api/update-qstnr', Questionnaire, { headers: this.apiModel.httpHeaderPost } )
    .pipe(tap((p: Questionnaire) => console.log(p))
    );
  }

  deleteQuestionnaire(id: string) {
    return this.http.delete<Questionnaire>(this.apiModel.host + '/setupservice/api/mw-qstnr/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: Questionnaire) => console.log(`Delete Questionnaire`))
    );
  }  
}

