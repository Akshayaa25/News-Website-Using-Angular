import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AllnewsComponent, MY_DATE_FORMATS } from './allnews.component';
import { DashboardComponent } from '../news/dashboard/dashboard.component';
import { Newsservice } from 'src/app/services/news.service';
import { CategoryService } from 'src/app/services/category.service';
import { ShareiconsComponent } from '../shareicons/shareicons.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

describe('AllnewsComponent', () => {
  let component: AllnewsComponent;
  let fixture: ComponentFixture<AllnewsComponent>;
  let newsService: Newsservice;
  let categoryService: CategoryService;
  let dialog: MatDialog;
  let dateAdapter: DateAdapter<Date>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllnewsComponent, DashboardComponent],
      imports: [
        HttpClientTestingModule,
        ApolloTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatPaginatorModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule
      ],
      providers: [
        Newsservice,
        CategoryService,
        MatDialog,
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllnewsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(Newsservice);
    categoryService = TestBed.inject(CategoryService);
    dialog = TestBed.inject(MatDialog);
    dateAdapter = TestBed.inject(DateAdapter);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.news).toEqual([]);
    expect(component.paginatedNews).toEqual([]);
    expect(component.fromDate).toBeInstanceOf(Date);
    expect(component.toDate).toBeInstanceOf(Date);
    expect(component.query).toEqual('apple');
    expect(component.sortBy).toEqual('popularity');
    expect(component.pageSize).toEqual(20);
    expect(component.pageSizeOptions).toEqual([20, 40, 80]);
    expect(component.maxDate).toBeInstanceOf(Date);
    expect(component.maxFromDate).toBeInstanceOf(Date);
    expect(component.paginator).toBeDefined();
  });

  it('should set the maxDate and maxFromDate', () => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    component.maxDate.setHours(0, 0, 0, 0);
    expect(component.maxDate).toEqual(maxDate);
  
    const maxFromDate = new Date(maxDate);
    maxFromDate.setDate(maxFromDate.getDate() - 1);
    maxFromDate.setHours(0, 0, 0, 0);
    component.maxFromDate.setHours(0, 0, 0, 0);
    expect(component.maxFromDate).toEqual(maxFromDate);
  });

  it('should fetch news when query is present', () => {
    spyOn(component, 'fetchEverythingNews');
    const query = 'test query';
    component.ngOnInit();
    component.categoryService.searchQuery.next(query);
    expect(component.query).toEqual(query);
    expect(component.fetchEverythingNews).toHaveBeenCalledWith(query, component.fromDate, component.toDate, component.sortBy);
  });

  it('should fetch news when query is not present', () => {
    spyOn(component, 'fetchEverythingNews');
    component.ngOnInit();
    component.categoryService.searchQuery.next('');
    expect(component.query).toEqual('apple');
    expect(component.fetchEverythingNews).toHaveBeenCalledWith(component.query, component.fromDate, component.toDate, component.sortBy);
  });

  it('should update fromDate and fetch news', () => {
    spyOn(component, 'fetchEverythingNews');
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    component.fromDateChange(date);
    const expectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    expect(component.fromDate.getFullYear()).toEqual(expectedDate.getFullYear());
    expect(component.fromDate.getMonth()).toEqual(expectedDate.getMonth());
    expect(component.fromDate.getDate()).toEqual(expectedDate.getDate());
    expect(component.fetchEverythingNews).toHaveBeenCalledWith(component.query, component.fromDate, component.toDate, component.sortBy);
  });
  

  it('should update toDate and fetch news', () => {
    spyOn(component, 'fetchEverythingNews');
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    component.toDateChange(date);
    const expectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    expect(component.toDate.getFullYear()).toEqual(expectedDate.getFullYear());
    expect(component.toDate.getMonth()).toEqual(expectedDate.getMonth());
    expect(component.toDate.getDate()).toEqual(expectedDate.getDate());
    expect(component.fetchEverythingNews).toHaveBeenCalledWith(component.query, component.fromDate, component.toDate, component.sortBy);
  });
  

  it('should update sortBy and fetch news', () => {
    spyOn(component, 'fetchEverythingNews');
    const sortBy = 'newest';
    component.selectSortBy(sortBy);
    expect(component.sortBy).toEqual(sortBy);
    expect(component.fetchEverythingNews).toHaveBeenCalledWith(component.query, component.fromDate, component.toDate, sortBy);
  });

  it('should fetch news and update pagination when fetchEverythingNews is called', () => {
    const articles = [{ title: 'News 1' }, { title: 'News 2' }, { title: 'News 3' }];
    spyOn(newsService, 'fetchEverythingNews').and.returnValue(of({ articles }));
    const pageSize = 20;
    component.fetchEverythingNews(component.query, component.fromDate, component.toDate, component.sortBy);
    expect(newsService.fetchEverythingNews).toHaveBeenCalledWith(component.query, component.fromDate, component.toDate, component.sortBy);
    expect(component.news).toEqual(articles);
    expect(component.paginatedNews).toEqual(articles.slice(0, pageSize));
    expect(component.paginator.pageIndex).toEqual(0);
    expect(component.paginator.length).toEqual(articles.length);
  });

  it('should open the share dialog', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of());
    spyOn(dialog, 'open').and.returnValue(dialogRef);
    const article = { title: 'Test Article' };
    component.openShareDialog(article);
    expect(dialog.open).toHaveBeenCalledWith(ShareiconsComponent, {
      width: '500px',
      height: '200px',
      data: {
        article: article
      }
    });
  });
  

  it('should update the paginatedNews based on the page event', () => {
    const news = [{ title: 'News 1' }, { title: 'News 2' }, { title: 'News 3' }];
    component.news = news;
    const pageSize = 20;
    const pageIndex = 1;
    const event = { pageIndex, pageSize, length: news.length };
    component.onPageChange(event);
    expect(component.paginatedNews).toEqual(news.slice(pageIndex * pageSize, (pageIndex * pageSize) + pageSize));
  });
});