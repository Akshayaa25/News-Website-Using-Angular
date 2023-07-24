import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeleteProfileComponent } from './delete-profile.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DELETE_USER } from 'src/app/users/users/gql/users-mutation';

describe('DeleteProfileComponent', () => {
  let component: DeleteProfileComponent;
  let fixture: ComponentFixture<DeleteProfileComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteProfileComponent>>;

  beforeEach(waitForAsync(() => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [DeleteProfileComponent],
      imports: [ApolloTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: { id: 1, email: 'test@example.com' },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProfileComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<DeleteProfileComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when cancel is clicked', () => {
    component.closeDialog();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
