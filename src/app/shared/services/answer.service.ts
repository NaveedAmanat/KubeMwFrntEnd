import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import { Answer } from '../models/Answer.model';


@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getAnswers(qstSeq): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.apiModel.host + '/setupservice/api/mw-answrs-by-qst-seq/'+ qstSeq,  {headers:this.apiModel.httpHeaderGet}).pipe(
      tap((p: Answer[]) => console.log(p))
    );
  }

  addAnswer (Answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(this.apiModel.host + '/setupservice/api/mw-answrs', Answer,  {headers:this.apiModel.httpHeaderPost}).pipe(
        tap((p: Answer) => console.log(`Add Answer`))
      );
  }
  
  updateAnswer(Answer: Answer): Observable<Answer> {
    return this.http.put<Answer>(this.apiModel.host + '/setupservice/api/mw-answrs', Answer,  {headers:this.apiModel.httpHeaderPost} )
    .pipe(tap((p: Answer) => console.log(p))
    );
  }

  deleteAnswer(id: string) {
    return this.http.delete<Answer>(this.apiModel.host + '/setupservice/api/mw-answrs/' + id,  {headers:this.apiModel.httpHeaderGet}).pipe(
        tap((p: Answer) => console.log(`Delete Answer`))
    );
  }  
}

