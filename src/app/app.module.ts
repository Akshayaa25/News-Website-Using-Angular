import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { GraphQLModule } from './graphql.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';

import { NewsComponent } from './components/news/news.component';
import { CategoryService } from './services/category.service';
import { Newsservice } from './services/news.service';
import { RegisterComponent } from './components/news/register/register.component';
import { LoginComponent } from './components/news/login/login.component';
import { ProfileComponent } from './components/news/profile/profile.component';
import { SavedNewsComponent } from './components/saved-news/saved-news.component';
import { DashboardComponent } from './components/news/dashboard/dashboard.component';
import { UpdateProfileComponent } from './components/news/profile/update-profile/update-profile.component';
import { DeleteProfileComponent } from './components/news/profile/delete-profile/delete-profile.component';
import { ResetPasswordComponent } from './components/news/profile/reset-password/reset-password.component';
import { IndexComponent } from './index/index.component';
import { AllnewsComponent } from './components/allnews/allnews.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareiconsComponent } from './components/shareicons/shareicons.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    SavedNewsComponent,
    DashboardComponent,
    UpdateProfileComponent,
    ResetPasswordComponent,
    DeleteProfileComponent,
    IndexComponent,
    AllnewsComponent,
    ShareiconsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    GraphQLModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatNativeDateModule,
    ShareButtonsModule,
    ShareIconsModule
    
  ],
  providers: [CategoryService, Newsservice,{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
