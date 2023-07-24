import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoggedIn to true when login is called with email', () => {
    const email = 'swapna@gmail.com';
    service.login(email, 'password');
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('should remove isLoggedIn when login is called without email', () => {
  
    service.login('', 'password');
    expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
  });

  it('should remove isLoggedIn when logout is called', () => {

    sessionStorage.setItem('isLoggedIn', 'true');
    service.logout();
    expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
  });

  it('should return true if isLoggedIn is set to true', () => {

    sessionStorage.setItem('isLoggedIn', 'true');
    const isAuthenticated = service.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  it('should return false if isLoggedIn is not set', () => {

    sessionStorage.removeItem('isLoggedIn');
    const isAuthenticated = service.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  it('should return false if isLoggedIn is set to false', () => {
    sessionStorage.setItem('isLoggedIn', 'false');
    const isAuthenticated = service.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });
});