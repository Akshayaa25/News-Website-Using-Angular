import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  news: any[] = [];
  counter = 1;

  userCountry: string ='';
  apiKey = '3a1be8a602e141c4bd7ad01b6431cb92';

  

  constructor(
    private http: HttpClient,
    ) {}

    ngOnInit(): void {
      setInterval(() => {
        const radioElement = document.getElementById('radio' + this.counter) as HTMLInputElement;
        if (radioElement) {
          radioElement.checked = true;
        }
  
        this.counter++;
        if (this.counter > 3) {
          this.counter = 1;
        }
      }, 5000);
    
  
      this.http.get<any>(`https://api.geoapify.com/v1/ipinfo?apiKey=${this.apiKey}`).subscribe(
        (response) => {
          this.userCountry = response.country.iso_code.toLowerCase();
          console.log('User Country ISO Code:', this.userCountry);
          sessionStorage.setItem('userCountry', this.userCountry);
          this.fetchNews(this.userCountry);
        },
        (error) => {
          console.error('Error retrieving user country:', error);
        }
      );
    }
    
  fetchNews(country:string) {
    const url = `https://newsapi.org/v2/top-headlines?category=general&country=${country}&apiKey=83de244909ac40ff9d878a9bb23ed4e5`;
    this.http.get(url).subscribe((data: any) => {
      this.news = data.articles;
    });
}
}