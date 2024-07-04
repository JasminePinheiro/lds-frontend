import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private _http: HttpClient) { }

  login(email: string, password: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ email, password });

    return this._http.post<any>('https://lds-backend.vercel.app/api/login', body, { headers })
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('email');
  }

}
