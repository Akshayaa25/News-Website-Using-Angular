import { Users } from './../../../../users/users/users';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { DELETE_USER } from 'src/app/users/users/gql/users-mutation';


@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.css']
})
export class DeleteProfileComponent implements OnInit {
  id:number=0;

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DeleteProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Users }
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`http://localhost:3030/savedArticles?email=${this.data.user?.email}`)
      .subscribe(
        (response: any[]) => {
          const data = response;
          this.id=data[0].id;
          console.log(this.id);
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteProfile(): void {
    const userId = this.data.user?.id;
  
    if (userId) {
      this.apollo
        .mutate<{ removeUser: Users }>({
          mutation: DELETE_USER,
          variables: { id: userId },
        })
        .subscribe(() => {
          this.http.delete(`http://localhost:3030/users/${userId}`)
            .subscribe(() => {
              alert('Profile deleted');
              this.dialogRef.close('deleted');
            }, error => {
              console.error('Error deleting user:', error);
            });
            this.http.delete(`http://localhost:3030/savedArticles/${this.id}`)
            .subscribe(()=>{
              console.log("entire profile with saved articles also deleted");
            });
        });
    }
  }
  
}