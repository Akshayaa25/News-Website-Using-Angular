import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Newsservice } from 'src/app/services/news.service';
import { CategoryService } from 'src/app/services/category.service';
import { Apollo } from 'apollo-angular';
import { ShareiconsComponent } from '../shareicons/shareicons.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-allnews',
  templateUrl: './allnews.component.html',
  styleUrls: ['./allnews.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AllnewsComponent implements OnInit {
  news: any[] = [];
  paginatedNews: any[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  query: string = 'apple';
  sortBy: string = 'popularity';
  pageSize: number = 20;
  pageSizeOptions: number[] = [20, 40, 80];
  maxDate: Date;
  maxFromDate: Date;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private newsService: Newsservice,
    public categoryService: CategoryService,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-US');
    this.maxDate = new Date();
    this.maxFromDate = new Date(this.fromDate.setDate(this.fromDate.getDate() - 1));
  }

  ngOnInit() {
    this.fromDate.setDate(this.fromDate.getDate() - 1);
    this.categoryService.searchQuery$.subscribe((query) => {
      if (query) {
        this.query = query;
        this.fetchEverythingNews(query, this.fromDate, this.toDate, this.sortBy);
      } else {
        this.fetchEverythingNews(this.query, this.fromDate, this.toDate, this.sortBy);
      }
    });
  }

  fromDateChange(date: Date) {
    this.fromDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    this.fetchEverythingNews(this.query, this.fromDate, this.toDate, this.sortBy);
  }

  toDateChange(date: Date) {
    this.toDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    this.fetchEverythingNews(this.query, this.fromDate, this.toDate, this.sortBy);
  }

  selectSortBy(sortBy: string) {
    this.sortBy = sortBy;
    this.fetchEverythingNews(this.query, this.fromDate, this.toDate, this.sortBy);
  }

  fetchEverythingNews(query: string, fromDate: Date, toDate: Date, sortBy: string) {
    this.newsService.fetchEverythingNews(query, fromDate, toDate, sortBy).subscribe(
      (data: any) => {
        this.news = data.articles;
        this.paginatedNews = this.news.slice(0, this.pageSize);
        this.paginator.pageIndex = 0;
        this.paginator.length = this.news.length;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveArticle(article: any) {
    const userEmail = sessionStorage.getItem('userEmail');

    fetch('http://localhost:3030/savedArticles')
      .then((response) => response.json())
      .then((users) => {
        console.log('Fetched data:', users);
        const user = users.find((user: any) => user.email === userEmail);
        console.log('User:', user);

        if (user) {
          if (!user.savedArticles) {
            user.savedArticles = [];
          }

           const isArticleSaved = user.savedArticles.some(
          (savedArticle: any) => savedArticle.title === article.title
        );

        if (isArticleSaved) {
          alert('Article is already saved!');
          return;
        }
          user.savedArticles.push(article);
          fetch(`http://localhost:3030/savedArticles/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          })
            .then((response) => response.json())
            .then((updatedData) => {
              console.log('Updated data:', updatedData);
              alert('Article saved successfully!');
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        } else {
          const newUser = {
            email: userEmail,
            savedArticles: [article],
          };
          fetch('http://localhost:3030/savedArticles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          })
            .then((response) => response.json())
            .then((createdData) => {
              console.log('Created data:', createdData);
              alert('Article saved successfully!');
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  openShareDialog(article: any): void {
    const dialogRef = this.dialog.open(ShareiconsComponent, {
      width: '500px',
      height: '220px',
      data: {
        article: article
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedNews = this.news.slice(startIndex, endIndex);
  }
}