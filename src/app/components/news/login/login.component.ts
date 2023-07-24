import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Users } from 'src/app/users/users/users';
import { GET_Search } from 'src/app/users/users/gql/users-query';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  userCountry!: string;
  passwordFieldType: string = 'password';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  login(loginForm: any) {
    this.apollo
      .watchQuery<{ allUsers: Users[] }>({
        query: GET_Search,
        variables: { userFilter: { email: loginForm.email, password: loginForm.password } },
      })
      .valueChanges.subscribe(({ data }) => {
        const userByEmailAndPassword = data.allUsers[0];
        if (userByEmailAndPassword) {
          sessionStorage.setItem("userDetails", JSON.stringify(userByEmailAndPassword));
          sessionStorage.setItem("userEmail", userByEmailAndPassword.email);
          this.authService.login(loginForm.email,loginForm.password);
          this.router.navigate(['/news']);
        } else {
          alert("Invalid email or password");
        }
      });
  }

  showPassword: boolean = false;
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    showConfirmPassword: boolean = false;
    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}