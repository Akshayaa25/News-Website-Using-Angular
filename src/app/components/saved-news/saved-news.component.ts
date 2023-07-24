import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ShareiconsComponent } from '../shareicons/shareicons.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-saved-news',
  templateUrl: './saved-news.component.html',
  styleUrls: ['./saved-news.component.css'],
})
export class SavedNewsComponent {
  savedNews: any[] = [];
  constructor(private router:Router,
    private authService:AuthService,private dialog:MatDialog){}
  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    const userEmail = sessionStorage.getItem('userEmail');
    const url = `http://localhost:3030/savedArticles?email=${userEmail}`;
    console.log(url);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('API response:', data[0].savedArticles);
        this.savedNews = data[0].savedArticles;
        console.log(this.savedNews);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  openArticle(url: string): void {
    window.open(url, '_blank');
  }

  removeArticle(article: any): void {
    const userEmail = sessionStorage.getItem('userEmail');
    const url = `http://localhost:3030/savedArticles?email=${userEmail}`;
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then((data: any) => {
        console.log(data);
        if (data[0].savedArticles && Array.isArray(data[0].savedArticles)) {
          const updatedArticles = data[0].savedArticles.filter(
            (savedArticle: any) => savedArticle.title !== article.title
          );
          data[0].savedArticles = updatedArticles;
          console.log(data[0].savedArticles);
          
          fetch(`http://localhost:3030/savedArticles/${data[0].id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data[0])
          })
            .then(response => response.json())
            .then((updatedUser: any) => {
              console.log('Updated User:', updatedUser);
              
              //this.router.navigateByUrl('/savedarticle');
              location.reload();
              alert('Article removed successfully!');
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      })
      .catch(error => {
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