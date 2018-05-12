import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

const tokenStorageKey = "currentToken";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public CurrentToken = new BehaviorSubject<string>(null)

  constructor(private httpClient: HttpClient) {
    this.CurrentToken.next(this.decode(localStorage.getItem(tokenStorageKey)));
  }

  public login({username, password}) {
    let body = (new HttpParams()).append("grant_type", "password")
      .append("username", username)
      .append("password", password)
      .toString()

    this.httpClient.post("http://localhost:3000/auth/token", body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe((data: {bearer}) => {
      localStorage.setItem(tokenStorageKey, data.bearer);
      this.CurrentToken.next(this.decode(data.bearer));
    });
  }

  public logout() {
    localStorage.clear();
    this.CurrentToken.next(null)
  }

  private decode(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
