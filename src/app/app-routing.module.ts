import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './components/news/news.component';
import { LoginComponent } from './components/news/login/login.component';
import { RegisterComponent } from './components/news/register/register.component';
import { ProfileComponent } from './components/news/profile/profile.component';
import { DashboardComponent } from './components/news/dashboard/dashboard.component';
import { SavedNewsComponent } from './components/saved-news/saved-news.component';
import { IndexComponent } from './index/index.component';
import { AllnewsComponent } from './components/allnews/allnews.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'savedarticle',
    component: SavedNewsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'allnews',
    component: AllnewsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
