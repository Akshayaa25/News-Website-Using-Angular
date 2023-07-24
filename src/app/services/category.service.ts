import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategory = new BehaviorSubject<string>('general');
  selectedCategory$ = this.selectedCategory.asObservable();

  private selectedCountry = new BehaviorSubject<string>('');
  selectedCountry$ = this.selectedCountry.asObservable();

  public searchQuery = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuery.asObservable();

  setSelectedCategory(category: string) {
    this.selectedCategory.next(category);
  }

  getSelectedCategory(): string {
    return this.selectedCategory.getValue();
  }

  setSelectedCountry(country: string) {
    this.selectedCountry.next(country);
  }

  getSelectedCountry(): string {
    return this.selectedCountry.getValue();
  }

  setSearchQuery(query: string) {
    console.log(query);
    this.searchQuery.next(query);
  }
}