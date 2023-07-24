import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [CategoryService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(console, 'error'); // Add this line to spy on console.error
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user country', () => {
    const mockResponse = { country: { iso_code: 'us' } };
    const request = httpMock.expectOne(`https://api.geoapify.com/v1/ipinfo?apiKey=${component.apiKey}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
    expect(component.userCountry).toBe('us');
  });

  it('should handle error when retrieving user country', () => {
    const errorMessage = 'Error retrieving user country';
    const request = httpMock.expectOne(`https://api.geoapify.com/v1/ipinfo?apiKey=${component.apiKey}`);
    expect(request.request.method).toBe('GET');
    request.error(new ErrorEvent('error', { message: errorMessage }));
    expect(console.error).toHaveBeenCalledWith('Error retrieving user country:', errorMessage);
  });

  it('should select category', () => {
    const selectedCategory = 'Business';
    spyOn(component.categoryService, 'setSelectedCategory');
    spyOn(component.categoryService, 'setSearchQuery');
    component.selectCategory(selectedCategory);
    expect(component.selectedCategory).toBe(selectedCategory);
    expect(component.categoryService.setSelectedCategory).toHaveBeenCalledWith(selectedCategory);
    expect(component.categoryService.setSearchQuery).toHaveBeenCalledWith(component.searchQuery);
    expect(component.showFilters).toBe(true);
  });

  it('should select country', () => {
    const selectedCountry = { name: 'Country 1', code: 'code1' };
    spyOn(component.categoryService, 'setSelectedCountry');
    spyOn(component.categoryService, 'setSearchQuery');
    component.selectCountry(selectedCountry);
    expect(component.selectedCountry).toBe(selectedCountry.name);
    expect(component.categoryService.setSelectedCountry).toHaveBeenCalledWith(selectedCountry.code);
    expect(component.categoryService.setSearchQuery).toHaveBeenCalledWith(component.searchQuery);
    expect(component.showFilters).toBe(true);
  });

  it('should search news', () => {
    const searchQuery = 'test query';
    spyOn(component.categoryService, 'setSearchQuery');
    component.searchQuery = searchQuery;
    component.searchNews();
    expect(component.categoryService.setSearchQuery).toHaveBeenCalledWith(searchQuery);
  });

  it('should open menu', () => {
    const event = new Event('click');
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    spyOn(document, 'getElementById').and.returnValue(sidebar);
    component.openMenu(event);
    expect(sidebar.style.display).toBe('block');
  });

  it('should close menu', () => {
    const event = new Event('click');
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    spyOn(document, 'getElementById').and.returnValue(sidebar);
    component.closeMenu(event);
    expect(sidebar.style.display).toBe('none');
  });

  it('should logout', () => {
    spyOn(sessionStorage, 'removeItem');
    spyOn(component.authService, 'logout');
    spyOn(component.router, 'navigate');
    component.logout();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userId');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userEmail');
    expect(component.authService.logout).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
