import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface TokenResponse {
  user: User;
  access_token: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: string;
  email: string;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);

  get user(): User {
    return this.user$.getValue();
  }

  get isAuthenticated(): boolean {
    return this.user != null;
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(user: Partial<User>) {
    return this.http.post(`${api}/auth/login`, user).pipe(
      mergeMap((response) => {
        return this.setTokens(response['token']);
      })
    );
  }

  register(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/register`, user)
      .pipe(mergeMap((response) => this.setTokens(response)));
  }

  getProfile() {
    return this.http
      .get<User>(`${api}/auth/me`)
      .pipe(tap((user) => this.user$.next(user)));
  }

  logoutFromAllDevices() {
    return this.http
      .delete<TokenResponse>(`${api}/auth/logout`)
      .pipe(mergeMap((tokens) => this.setTokens(tokens)));
  }

  async setTokens(response: any) {
    return this.setToken(response);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  async setToken(token: string) {
    localStorage.setItem('accessToken', token);

    return this.getProfile().toPromise();
  }

  logout() {
    const callback = () => {
      sessionStorage.clear();

      localStorage.clear();

      this.user$.next(null);
    };
  }
}
