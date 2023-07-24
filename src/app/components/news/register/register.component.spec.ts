import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Apollo } from 'apollo-angular';
import { GET_USERS } from 'src/app/users/users/gql/users-query';
import { Operator, Observable } from 'rxjs';
import { CREATE_User } from 'src/app/users/users/gql/users-mutation';
import { ApolloError, ApolloQueryResult ,FetchMoreQueryOptions,SubscribeToMoreOptions,UpdateQueryOptions,WatchQueryOptions} from '@apollo/client/core';
import { QueryRef } from 'apollo-angular';
import { of } from 'rxjs';
import { EmptyObject } from 'apollo-angular/types';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let controller: ApolloTestingController;
  let apollo: Apollo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    controller = TestBed.inject(ApolloTestingController);
    apollo = TestBed.inject(Apollo);
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate countries', () => {
    const countries = [{ name: 'Country 1' }, { name: 'Country 2' }];
    spyOn(component['http'], 'get').and.returnValue({
      subscribe: (fn: any) => fn(countries),
      source: undefined,
      operator: undefined,
      lift: function <R>(operator?: Operator<unknown, R> | undefined): Observable<R> {
        throw new Error('Function not implemented.');
      },
      forEach: function (next: (value: unknown) => void): Promise<void> {
        throw new Error('Function not implemented.');
      },
      pipe: function (): Observable<unknown> {
        throw new Error('Function not implemented.');
      },
      toPromise: function (): Promise<unknown> {
        throw new Error('Function not implemented.');
      }
    });

    component.ngOnInit();

    expect(component.countries).toEqual(countries);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.togglePasswordVisibility();

    expect(component.showPassword).toBeTrue();
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword).toBeFalse();

    component.toggleConfirmPasswordVisibility();

    expect(component.showConfirmPassword).toBeTrue();
  });

  it('should validate password match', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
  
    passwordControl?.setValue('password1');
    confirmPasswordControl?.setValue('password2');
  
    expect(component.form.valid).toBeFalse();
    expect(confirmPasswordControl?.hasError('match')).toBeTrue();
  
    confirmPasswordControl?.setValue('password1');
  
    expect(component.form.valid).toBeFalse();
    expect(confirmPasswordControl?.hasError('match')).toBeFalse();
  });
  
  

  it('should create user', () => {
    const formValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      country: 'Country 1',
    };
  
    const createUserResponse = {
      data: {
        createUser: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          phone: formValues.phone,
          country: formValues.country,
        },
      },
    };
  
    const saveUserDataSpy = spyOn(component['http'], 'post').and.returnValue(
      new Observable<void>() // Return an empty Observable
    );
  
    const routerNavigateSpy = spyOn(component['router'], 'navigate');
  
    // Set form values
    component.form.patchValue(formValues);
  
    // Create a query and return mock response
    const query = apollo.watchQuery({
      query: GET_USERS,
    }).valueChanges;
    spyOn(query, 'subscribe').and.callFake((fn: any) => {
      return fn({ data: { allUsers: [] } });
    });
  
    // Create a mutation and return mock response
    const mutation = apollo.mutate({
      mutation: CREATE_User,
      variables: formValues,
    });
    spyOn(mutation, 'subscribe').and.callFake((fn: any) => {
      return fn({ data: createUserResponse });
    });
  
    component.create();
  
    expect(query.subscribe).toHaveBeenCalled();
    expect(mutation.subscribe).toHaveBeenCalled();
    expect(saveUserDataSpy).toHaveBeenCalledWith(
      'http://localhost:3030/users',
      createUserResponse.data.createUser
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
  

  it('should show error if user with email already exists', () => {
    const formValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      country: 'Country 1',
    };
  
    const queryResponse = {
      data: {
        allUsers: [{ email: formValues.email }],
      },
    };
  
    const alertSpy = spyOn(window, 'alert');
    const routerNavigateSpy = spyOn(component['router'], 'navigate');
  
    // Set form values
    component.form.patchValue(formValues);
  
    // Create a query and return mock response
    const queryRef = {
      valueChanges: of(queryResponse as ApolloQueryResult<unknown>),
      queryId: '',
      options: {
        query: GET_USERS,
      },
      variables: {},
    } as QueryRef<unknown, EmptyObject>;
    
    spyOn(apollo, 'watchQuery').and.returnValue(queryRef);
  
    component.create();

    expect(apollo.watchQuery).toHaveBeenCalledWith(
      jasmine.objectContaining({
        query: jasmine.objectContaining({ 
          query:GET_USERS/* Specify the expected query properties here */ }),
      })
    );
    
    expect(apollo.watchQuery).toHaveBeenCalledWith({
      query: GET_USERS,
    });
  
    expect(alertSpy).toHaveBeenCalledWith(
      'An account with this email already exists. Please login.'
    );
    expect(routerNavigateSpy).not.toHaveBeenCalledWith(['/login']);

  });
});
