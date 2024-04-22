import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private _http: HttpClient) { }

  cadastrar(email: string, password: string, favoriteactivity: string, username: string,): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ email, password, favoriteactivity, username,});

    return this._http.post<any>('https://lds-backend.vercel.app/api/usuarios', body, { headers });
  }
}
