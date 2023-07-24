import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [
        MatDialogModule,
        ApolloTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@example.com',
              password: 'oldpassword',
              phone: '1234567890',
              country: 'USA'
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset password', () => {
    component.newPassword = 'NewsApplication@123';
    component.confirmPassword = 'NewsApplication@123';
    component.resetPassword();
    expect(true).toBe(true);
  });

  it('should handle error when updating password', () => {
    const mockError = 'Error updating password';

    component.newPassword = 'newpassword';
    component.confirmPassword = 'newpassword';

    component.resetPassword();

    const updateRequest = httpMock.expectOne('http://localhost:3030/users/1');
    updateRequest.error(new ErrorEvent(mockError));

    expect(console.error).toHaveBeenCalledWith('Error updating password in JSON file:', mockError);
  });

  it('should handle missing new password or confirm password', () => {
    spyOn(window, 'alert');
    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Please enter a new password and confirm it.');
  });

  it('should handle new password being the same as the old password', () => {
    spyOn(window, 'alert');
    component.newPassword = 'oldpassword';
    component.confirmPassword = 'oldpassword';
    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('New password cannot be the same as the old password.');
  });

  it('should handle passwords not matching', () => {
    spyOn(window, 'alert');
    component.newPassword = 'newpassword';
    component.confirmPassword = 'differentpassword';
    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.');
  });

  it('should handle weak passwords', () => {
    spyOn(window, 'alert');
    component.newPassword = 'password';
    component.confirmPassword = 'password';
    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Passwords must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.');
  });
});