import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private url: string = 'http://localhost:3000/auth/login';
  private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private router;
  
  
  constructor(private _http: HttpClient) {
    this.router = inject(Router);
   }
  
  login(email:string, password:string):Observable<any> {
    let params = JSON.stringify({email:email, password:password});
    let headers = this.headers;
    return this._http.post(this.url, params, { headers: headers });
  };

  setSession(id:string, token:string):void {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
  };

  logout():void {    
    localStorage.clear();
    this.router.navigate(['/']);
  };

}
