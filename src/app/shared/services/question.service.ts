import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import { Question } from '../models/Question.model';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getQuestions(qstnrSeq): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiModel.host + '/setupservice/api/mw-qsts-by-qstnr-seq/' + qstnrSeq,{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Question[]) => console.log(p))
    );
  }

  addQuestion (Question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiModel.host + '/setupservice/api/mw-qsts', Question, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p: Question) => console.log(`Add Question`))
      );
  }
  
  updateQuestion(Question: Question): Observable<Question> {
    return this.http.put<Question>(this.apiModel.host + '/setupservice/api/mw-qsts', Question, { headers: this.apiModel.httpHeaderPost } )
    .pipe(tap((p: Question) => console.log(p))
    );
  }

  deleteQuestion(id: string) {
    return this.http.delete<Question>(this.apiModel.host + '/setupservice/api/mw-qsts/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: Question) => console.log(`Delete Question`))
    );
  }  
}

