import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdateProfileComponent } from './update-profile.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let apollo: Apollo;
  let http: HttpClient;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UpdateProfileComponent>>;

  beforeEach(waitForAsync(() => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UpdateProfileComponent],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { user: { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' } }, // Provide sample user data
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    apollo = TestBed.inject(Apollo);
    http = TestBed.inject(HttpClient);
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UpdateProfileComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when calling closeDialog()', () => {
    dialogRef.close.and.callThrough();

    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should update the user and close the dialog when calling updateUser() with changes', () => {
    const apolloMutateSpy = spyOn(apollo, 'mutate').and.returnValue(of({ data: { updateUser: {} }, loading: false }));
    const httpPutSpy = spyOn(http, 'put').and.returnValue(of({})); // Mock the HTTP response
    component.originalUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };
    component.updatedUser = { id: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', password: '', country: '' };

    component.updateUser();

    expect(apolloMutateSpy).toHaveBeenCalled();
    expect(httpPutSpy).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('updated');
  });

  it('should not update the user and close the dialog when calling updateUser() without changes', () => {
    const apolloMutateSpy = spyOn(apollo, 'mutate');
    const httpPutSpy = spyOn(http, 'put');
    component.originalUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };
    component.updatedUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };

    component.updateUser();

    expect(apolloMutateSpy).not.toHaveBeenCalled();
    expect(httpPutSpy).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should return true when calling hasChanges() with changes', () => {
    component.originalUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };
    component.updatedUser = { id: 1, firstName: 'John', lastName: '', email: '', phone: '', password: '', country: '' };

    const result = component.hasChanges();

    expect(result).toBe(true);
  });

  it('should return false when calling hasChanges() without changes', () => {
    component.originalUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };
    component.updatedUser = { id: 1, firstName: '', lastName: '', email: '', phone: '', password: '', country: '' };

    const result = component.hasChanges();

    expect(result).toBe(false);
  });
});
