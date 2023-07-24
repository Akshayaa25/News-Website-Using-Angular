import { Component } from '@angular/core';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Registrationform';
  searchQuery: string = '';
  selectedCountry: string = 'us';
  

  constructor(private categoryService: CategoryService) {}

  selectCategory(selectedCategory: string) {
    this.categoryService.setSelectedCategory(selectedCategory);
    this.categoryService.setSearchQuery(this.searchQuery);
  }

  selectCountry(selectedCountry: string) {
    this.selectedCountry = selectedCountry;
    this.categoryService.setSelectedCountry(selectedCountry);
    this.categoryService.setSearchQuery(this.searchQuery);
  }

  searchNews() {
    console.log(this.searchQuery);
    this.categoryService.setSearchQuery(this.searchQuery);
  }

  logout() {
    console.log("logout");
    //sessionStorage.getItem("userId");
    sessionStorage.removeItem("userId"); 
    // sessionStorage.removeItem("userDetails");
   
    //this.router.navigate(['/login']);
  }
}

