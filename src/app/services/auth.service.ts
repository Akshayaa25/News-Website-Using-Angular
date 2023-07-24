import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isLoggedIn';

  constructor() {}

  login(email: string, password: string){
        if (email) {
          sessionStorage.setItem(this.AUTH_KEY, 'true');
        } else {
          sessionStorage.removeItem(this.AUTH_KEY);
        }
      }
  logout(): void {
    sessionStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }
}