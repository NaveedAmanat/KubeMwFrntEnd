import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export class ApiModel {
  public token: string;
  public host: string;
  public liveHost: string;
  public httpOptions: any;
  public httpOptionsPdf: any;
  public httpHeaderGet: HttpHeaders;
  public httpHeaderPost: HttpHeaders;
  public httpHeaderPostMultipart: HttpHeaders;


  constructor() {
    //----- PROD  ------//
    //  this.host = 'https://apps.kashf.org:8443/';
    //----- STAGING ----//
    // this.host = 'http://221.120.209.181:8080/'
    //  this.host = 'http://localhost:8080';
    // this.host = 'http://192.168.7.49:8080';
    // this.host = 'http://192.168.7.83:8080';
    // this.host = 'http://192.168.7.83:8080';
    this.host = 'http://192.168.7.84:8080';
    //  ----- KASHF PROD  ------//
    // this.host = 'http://221.120.209.185:8080';
    //  ----- KASHF QA  ------- //
    // this.host = 'http://221.120.209.189:8080';
    // this.host ='http://192.168.7.151:8080';
    //'http://192.168.100.17:8080';//'http://103.31.82.14:8080';//'http://192.168.9.40:8080';
    this.liveHost = 'http://103.31.82.14:8080';
    this.token = 'Bearer ' + sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': this.token,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };



    this.httpOptionsPdf = {
      'responseType': 'arraybuffer' as 'json',
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': this.token,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };

    this.httpHeaderGet = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': this.token,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    this.httpHeaderPost = new HttpHeaders({
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Authorization': this.token,
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    this.httpHeaderPostMultipart = new HttpHeaders({
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Authorization': this.token,
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

  }
}

