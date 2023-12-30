import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = 'http://localhost:3000/user/';
 
  private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private _http: HttpClient) { }

  find(id:string):Observable<any> {
    return this._http.get(this.url+id);
  };

  register(name:string, email:string, password:string):Observable<any> {
    let params = JSON.stringify({name:name, email:email, password:password});
    let headers = this.headers;

    return this._http.post(this.url, params, { headers: headers });
  };
  

  update(name:string):Observable<any> {
    let params = JSON.stringify({name:name});
    let headers = this.headers;

    return this._http.patch(this.url, params, { headers: headers });
  };

  addTask(id:string, taskId:string):Observable<any> {
    let params = JSON.stringify({taskId:taskId});
    let headers = this.headers;

    return this._http.patch(this.url+`addTask/${id}`, params, { headers: headers });
  };

  removeTask(id:string, taskId:string):Observable<any> {
    let params = JSON.stringify({taskId:taskId});
    let headers = this.headers;

    return this._http.patch(this.url+`removeTask/${id}`, params, {headers:headers});
  }
}
