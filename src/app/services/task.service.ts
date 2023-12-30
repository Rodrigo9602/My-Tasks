import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url: string = `http://localhost:3000/task/`;
  private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _http: HttpClient) { }


  find(id:string):Observable<any> {
    return this._http.get(this.url+id);
  };

  save(name:string, description:string, endingDate: Date ):Observable<any> {
    let params = JSON.stringify({name:name, description:description, endingDate:endingDate});
    let headers = this.headers;

    return this._http.post(this.url, params, { headers: headers });
  };

  updateTask(id:string, name:string, description:string, endingDate: Date):Observable<any> {
    let params = JSON.stringify({name:name, description:description, endingDate:endingDate});
    let headers = this.headers;

    return this._http.patch(this.url+`updateTask/${id}`, params, { headers: headers });
  };

  updateState(id:string, state:string):Observable<any> {
    let params = JSON.stringify({state:state});
    let headers = this.headers;

    return this._http.patch(this.url+`updateState/${id}`, params, { headers: headers });
  };

  delete(id:string):Observable<any> {
    return this._http.delete(this.url+id);
  };
}
