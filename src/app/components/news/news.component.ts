import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Newsservice } from 'src/app/services/news.service';
import { CategoryService } from 'src/app/services/category.service';
import { GET_USERS } from 'src/app/users/users/gql/users-query';
import { ShareiconsComponent } from '../shareicons/shareicons.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: any[] = [];
  filteredNews: any[] = [];
  country:string = '';
  selectedCategory: string = '';
  currentUser: any;

  constructor(
    public newsService: Newsservice,
    public categoryService: CategoryService,
    private apollo: Apollo,
    private dialog: MatDialog,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    const userCountry=sessionStorage.getItem("userCountry");

    if (userCountry) {
      const defaultCategory = 'general';
      this.fetchNews(defaultCategory, userCountry);
      this.categoryService.setSelectedCountry(userCountry);
    } else {
      const selectedCountry = this.categoryService.getSelectedCountry();
      const selectedCategory = this.categoryService.getSelectedCategory();
      this.fetchNews(selectedCategory, selectedCountry);
    }

      this.categoryService.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category;
      const selectedCountry = this.categoryService.getSelectedCountry();
      this.fetchNews(category, selectedCountry);
    }); 

    this.categoryService.selectedCountry$.subscribe((country) => {
      console.log(country);
      const selectedCategory = this.categoryService.getSelectedCategory();
      this.fetchNews(selectedCategory, country);
    });

    this.categoryService.searchQuery$.subscribe((query) => {
      console.log(query);
      this.filterNews(query);
    });
  }

  fetchNews(category: string, country: string) {
    this.newsService.fetchNews(category, country).subscribe(
      (data: any) => {
        this.news = data.articles;
        this.filterNews();
      },
      (error: any) => {
        console.error('Error fetching news:', error);
      }
    );
  }


  filterNews(query: string = '') {
    console.log('Filtering news with query:', query);
    const lowerCaseQuery = query.toLowerCase();
    this.filteredNews = this.news.filter((article) => {
      if (article) {
        const articleProperties = Object.values(article).map((property) => {
          return String(property).toLowerCase();
        });
        return articleProperties.some((property) =>
          property.includes(lowerCaseQuery)
        );
      }
      return false;
    });
  }

  getCategoryDisplayName(): string {
    switch (this.selectedCategory) {
      case 'health':
        return 'Health News';
      case 'sports':
        return 'Sports News';
      case 'business':
        return 'Business News';
      case 'entertainment':
        return 'Entertainment News';
      case 'science':
        return 'Science News';
      case 'technology':
        return 'Technology News';
      default:
        return 'General News';
    }
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
}