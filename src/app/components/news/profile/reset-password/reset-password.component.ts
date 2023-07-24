import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Users } from 'src/app/users/users/users';
import { Apollo } from 'apollo-angular';
import { UPDATE_USER } from 'src/app/users/users/gql/users-mutation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  updatedUser: Users = { ...this.data.user };
  showOldPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Users },
    private apollo: Apollo,
    private http: HttpClient
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      alert('Please enter a new password and confirm it.');
      return;
    }
    
    if (this.newPassword === this.updatedUser.password) {
      alert('New password cannot be the same as the old password.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!this.isPasswordComplex(this.newPassword)) {
      alert('Passwords must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.');
      return;
    }

    const userId = this.data.user.id;

    this.apollo
      .mutate<{ updateUser: Users }>({
        mutation: UPDATE_USER,
        variables: {
          id: userId,
          firstName: this.data.user.firstName,
          lastName: this.data.user.lastName,
          email: this.data.user.email,
          password: this.newPassword,
          phone: this.data.user.phone,
          country: this.data.user.country
        }
      })
      .subscribe(() => {
        console.log('Password updated');
        this.http
          .put(`http://localhost:3030/users/${userId}`, this.updatedUser)
          .subscribe(
            () => {
              alert('Password updated');
              this.dialogRef.close('updated');
            },
            error => {
              console.error('Error updating password in JSON file:', error);
            }
          );
      });
  }

  isPasswordComplex(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
