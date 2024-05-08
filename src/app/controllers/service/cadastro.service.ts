import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private _http: HttpClient) { }

  cadastrar(email: string, password: string, favoriteactivity: string, username: string,): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ email, password, favoriteactivity, username });

    return this._http.post<any>('https://lds-backend.vercel.app/api/usuarios', body, { headers });
  }


  obterUsuarioLogado(email: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.get<any>(`https://lds-backend.vercel.app/api/usuarios/${email}`, { headers });
  }


  editarCadastro(email: any, favoriteactivity: string, username: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ favoriteactivity, username });

    return this._http.patch<any>(`https://lds-backend.vercel.app/api/usuarios/${email}`, body, { headers });
  }


  deletarCadastro(email: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.delete<any>(`https://lds-backend.vercel.app/api/usuarios/${email}`, { headers });
  }


  atualizarSenha(email: string, newPassword: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ password: newPassword });
    
    return this._http.patch<any>(`https://lds-backend.vercel.app/api/usuarios/${email}`, body, { headers });

  }

}
