import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { UPDATE_USER } from 'src/app/users/users/gql/users-mutation';
import { Users } from 'src/app/users/users/users';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  originalUser: Users | undefined;
  updatedUser: Users = { ...this.data.user };

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Users }
  ) {
    this.originalUser = { ...data.user };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateUser(): void {
    const userId = this.updatedUser?.id;

    if (this.hasChanges()) {
      this.apollo
        .mutate<{ updateUser: Users }>({
          mutation: UPDATE_USER,
          variables: {
            id: userId,
            firstName: this.updatedUser.firstName,
            lastName: this.updatedUser.lastName,
            email: this.updatedUser.email,
            password: this.updatedUser.password,
            phone: this.updatedUser.phone,
            country: this.updatedUser.country
          },
        })
        .subscribe(() => {
          this.http
            .put(`http://localhost:3030/users/${userId}`, this.updatedUser)
            .subscribe(
              () => {
                alert('User updated');
                this.dialogRef.close('updated');
              },
              error => {
                console.error('Error updating user:', error);
              }
            );
        });
    } else {
      this.dialogRef.close();
    }
  }

  hasChanges(): boolean {
    return JSON.stringify(this.originalUser) !== JSON.stringify(this.updatedUser);
  }
}
