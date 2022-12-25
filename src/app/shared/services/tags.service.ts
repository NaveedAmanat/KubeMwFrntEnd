import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, of} from 'rxjs';  
import {catchError, tap} from 'rxjs/operators';
import {ApiModel} from '../models/Api.model';
import { Tag } from '../models/tag.model';


@Injectable({
  providedIn: 'root'
})
export class TagsService {
  apiModel: ApiModel = new ApiModel();
  token: string;

  constructor(private http:HttpClient) { 
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }
    
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiModel.host + '/setupservice/api/mw-tags',{ headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p: Tag[]) => console.log(p))
    );
  }

  addTag (Tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiModel.host + '/setupservice/api/add-new-tags', Tag, { headers: this.apiModel.httpHeaderPost }).pipe(
        tap((p: Tag) => console.log(`Add Tags`))
      );
  }
  
  updateTag(Tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(this.apiModel.host + '/setupservice/api/update-tags', Tag, { headers: this.apiModel.httpHeaderPost } )
    .pipe(tap((p: Tag) => console.log(p))
    );
  }

  deleteTag(id: string) {
    return this.http.delete<Tag>(this.apiModel.host + '/setupservice/api/mw-tags/' + id, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((p: Tag) => console.log(`Delete Tags`))
    );
  }  
}

