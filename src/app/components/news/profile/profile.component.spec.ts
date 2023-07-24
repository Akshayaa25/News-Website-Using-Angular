import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { GET_Search } from 'src/app/users/users/gql/users-query';
import { Users } from 'src/app/users/users/users';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let matDialog: MatDialog;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        DeleteProfileComponent,
        UpdateProfileComponent,
        ResetPasswordComponent,
        DashboardComponent
      ],
      imports: [
        MatDialogModule,
        ApolloTestingModule,
        HttpClientTestingModule,
        FormsModule,
      ],
      providers: [MatDialog, AuthService, Router],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the delete profile dialog', () => {
    const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: () => {} };
      },
    } as any);

    component.openDeleteDialog();

    expect(dialogOpenSpy).toHaveBeenCalledWith(DeleteProfileComponent, {
      width: '400px',
      height: '130px',
      data: { user: component.user },
      panelClass: 'custom-dialog-container',
    });
  });

  it('should open the update profile dialog', () => {
    const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: () => {} };
      },
    } as any);
  
    component.openUpdateDialog();
  
    expect(dialogOpenSpy).toHaveBeenCalledWith(UpdateProfileComponent, {
      width: '400px',
      data: { user: component.user },
      // height: '130px',
      panelClass: 'custom-dialog-container',
    });
  });
  

  it('should open the reset profile dialog', () => {
    const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: () => {} };
      },
    } as any);

    component.openResetDialog();

    expect(dialogOpenSpy).toHaveBeenCalledWith(ResetPasswordComponent, {
      width: '320px',
      height: '430px',
      data: { user: component.user },
      panelClass: 'custom-dialog-container',
    });
  });

  it('should clear session data and logout when the delete profile dialog is closed with "deleted" result', () => {
    spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: (callback: (result: string) => void) => callback('deleted') };
      },
    } as any);

    const sessionStorageSpy = spyOn(sessionStorage, 'removeItem');
    const authServiceLogoutSpy = spyOn(authService, 'logout');
    const routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl');

    component.openDeleteDialog();

    expect(sessionStorageSpy).toHaveBeenCalledWith('userId');
    expect(sessionStorageSpy).toHaveBeenCalledWith('userEmail');
    expect(authServiceLogoutSpy).toHaveBeenCalled();
    expect(routerNavigateByUrlSpy).toHaveBeenCalledWith('');
  });


  
  
  
  
  
  it('should navigate to /profile and reload user data when the update profile dialog is closed with "updated" result', () => {
    const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: (callback: (result: string) => void) => callback('updated') };
      },
    } as any);
    const routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl');
    spyOn(component, 'loadUserData');
  
    component.openUpdateDialog();
  
    expect(dialogOpenSpy).toHaveBeenCalledWith(UpdateProfileComponent, {
      width: '400px',
      data: { user: component.user },
      panelClass: 'custom-dialog-container',
    });
    expect(routerNavigateByUrlSpy).toHaveBeenCalledWith('/profile');
    expect(component.loadUserData).toHaveBeenCalled();
  });
  
  it('should navigate to /profile and reload user data when the reset password dialog is closed with "updated" result', () => {
    const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
      afterClosed: () => {
        return { subscribe: (callback: (result: string) => void) => callback('updated') };
      },
    } as any);
    const routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl');
    spyOn(component, 'loadUserData');
  
    component.openResetDialog();
  
    expect(dialogOpenSpy).toHaveBeenCalledWith(ResetPasswordComponent, {
      width: '320px',
      height: '430px',
      data: { user: component.user },
      panelClass: 'custom-dialog-container',
    });
    expect(routerNavigateByUrlSpy).toHaveBeenCalledWith('/profile');
    expect(component.loadUserData).toHaveBeenCalled();
  });
  

  // Add more test cases here

});
