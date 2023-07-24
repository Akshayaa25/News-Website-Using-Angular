import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apollo: Apollo;
  let apolloController: ApolloTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ApolloTestingModule, HttpClientTestingModule, FormsModule],
      providers: [AuthService, Router], // Add the AuthService and Router providers
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    apollo = TestBed.inject(Apollo);
    apolloController = TestBed.inject(ApolloTestingController);
    authService = TestBed.inject(AuthService); // Inject the AuthService
    router = TestBed.inject(Router); // Inject the Router

    fixture.detectChanges();
  });

  afterEach(() => {
    apolloController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully', () => {
    const mockQueryResult = { data: { allUsers: [{ email: 'test@example.com' }] } };

    spyOn(component['apollo'], 'watchQuery').and.returnValue({
      valueChanges: of(mockQueryResult),
    } as any);

    spyOn(authService, 'login'); // Use the injected authService
    spyOn(router, 'navigate'); // Use the injected router

    const loginForm = { email: 'test@example.com', password: 'password' };
    component.login(loginForm);

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/news']);
  });

  it('should display an error message for invalid login', () => {
    const mockQueryResult = { data: { allUsers: [] } };

    spyOn(component['apollo'], 'watchQuery').and.returnValue({
      valueChanges: of(mockQueryResult),
    } as any);

    spyOn(window, 'alert');

    const loginForm = { email: 'invalid@example.com', password: 'password' };
    component.login(loginForm);

    expect(window.alert).toHaveBeenCalledWith('Invalid email or password');
  });

  it('should store user details in session storage upon successful login', () => {
    const mockQueryResult = { data: { allUsers: [{ email: 'test@example.com' }] } };

    spyOn(component['apollo'], 'watchQuery').and.returnValue({
      valueChanges: of(mockQueryResult),
    } as any);

    spyOn(sessionStorage, 'setItem');
    spyOn(authService, 'login');
    spyOn(router, 'navigate');

    const loginForm = { email: 'test@example.com', password: 'password' };
    component.login(loginForm);

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'userDetails',
      JSON.stringify({ email: 'test@example.com' })
    );
  });

  it('should navigate to the news page upon successful login', () => {
    const mockQueryResult = { data: { allUsers: [{ email: 'test@example.com' }] } };

    spyOn(component['apollo'], 'watchQuery').and.returnValue({
      valueChanges: of(mockQueryResult),
    } as any);

    spyOn(sessionStorage, 'setItem');
    spyOn(authService, 'login');
    spyOn(router, 'navigate');

    const loginForm = { email: 'test@example.com', password: 'password' };
    component.login(loginForm);

    expect(router.navigate).toHaveBeenCalledWith(['/news']);
  });

  
});
