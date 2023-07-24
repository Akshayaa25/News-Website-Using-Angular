import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Country, countries } from '../../model_classes/countries';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoggedIn: boolean = false;
  showFilters: boolean = true;

  categories: string[] = ['General', 'Business', 'Technology', 'Sports', 'Health', 'Science', 'Entertainment'];
  countries: Country[] = countries;
  searchQuery: string = '';
  selectedCountry: string = 'Country';
  selectedCategory: string = 'Category';
  userCountry!: string;
  apiKey = '3a1be8a602e141c4bd7ad01b6431cb92';

  constructor(
    public categoryService: CategoryService,
    private http: HttpClient,
    public router: Router,
	public authService: AuthService
  ) { }

  ngOnInit() {
    const loggedInUserId = sessionStorage.getItem('userEmail');
    this.isLoggedIn = loggedInUserId !== null;
  }

  selectCategory(selectedCategory: string) {
    this.selectedCategory = selectedCategory;
    this.categoryService.setSelectedCategory(selectedCategory);
    this.categoryService.setSearchQuery(this.searchQuery);
	this.showFilters = selectedCategory !== 'all';

  }

  selectCountry(selectedCountry: Country) {
    this.selectedCountry = selectedCountry.name;
    this.categoryService.setSelectedCountry(selectedCountry.code);
    this.categoryService.setSearchQuery(this.searchQuery);
	this.showFilters = !!selectedCountry?.name;


  }

  searchNews() {
    console.log(this.searchQuery);
    this.categoryService.setSearchQuery(this.searchQuery);
  }

  openMenu(event: Event): void {
    event.preventDefault();
    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
      sidebar.style.display = "block";
    }
  }

  closeMenu(event: Event): void {
    event.preventDefault();
    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
      sidebar.style.display = "none";
    }
  }

  logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
	this.authService.logout();
    this.router.navigate(['/login']);
  }
}