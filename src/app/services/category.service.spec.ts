import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get the selected category', () => {
    const category = 'sports';
    service.setSelectedCategory(category);
    const selectedCategory = service.getSelectedCategory();
    expect(selectedCategory).toBe(category);
  });

  it('should set and get the selected country', () => {
    const country = 'us';
    service.setSelectedCountry(country);
    const selectedCountry = service.getSelectedCountry();
    expect(selectedCountry).toBe(country);
  });

  it('should set and get the search query', () => {
    const query = 'example';
    let searchQueryValue: string | undefined;
    service.setSearchQuery(query);
    service.searchQuery$.subscribe((value) => {
      searchQueryValue = value;
    });
    expect(searchQueryValue).toBe(query);
  });
  
  
  
});