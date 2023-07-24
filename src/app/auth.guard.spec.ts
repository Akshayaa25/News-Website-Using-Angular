import { TestBed } from '@angular/core/testing';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AuthService, useValue: { isAuthenticated: () => true } }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access for authenticated user', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const canActivate = guard.canActivate(route, state);
    expect(canActivate).toBe(true);
  });

  it('should navigate to login for unauthenticated user', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/some-path' } as RouterStateSnapshot;
    const canActivate = guard.canActivate(route, state);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(canActivate).toBe(false);
  });

  it('should allow access to login page for unauthenticated user', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/login' } as RouterStateSnapshot;
    const canActivate = guard.canActivate(route, state);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(canActivate).toBe(false);
  });
  
  
});