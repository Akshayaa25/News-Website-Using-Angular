import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { MatCardModule } from '@angular/material/card';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexComponent],
      imports: [MatCardModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  afterAll(() => {
    httpMock.verify();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should handle error while fetching news', () => {
  //   spyOn(console, 'error');
  
  //   const mockErrorResponse = new ErrorEvent('error', {
  //     error: new HttpErrorResponse({
  //       error: 'Network error',
  //       status: 0,
  //       statusText: 'Unknown Error',
  //     }),
  //     message: 'Network error',
  //   });
  
  //   component.userCountry = 'us';
  //   component.fetchNews('us');
  
  //   const newsRequest = httpMock.expectOne(
  //     'https://newsapi.org/v2/top-headlines?category=general&country=us&apiKey=83de244909ac40ff9d878a9bb23ed4e5'
  //   );
  //   newsRequest.error(mockErrorResponse);
  
  //   expect(console.error).toHaveBeenCalledWith(
  //     'Error fetching news:',
  //     mockErrorResponse
  //   );
  //   expect(component.news).toEqual([]);
  // });
  
  

  it('should handle error while fetching user country', () => {
    spyOn(console, 'error');
    const mockErrorResponse = new ErrorEvent('API Error', {
      error: new Error('Not Found'),
      message: 'Not Found',
    });
  
    component.ngOnInit();
  
    const countryRequest = httpMock.expectOne('https://api.geoapify.com/v1/ipinfo?apiKey=3a1be8a602e141c4bd7ad01b6431cb92');
    countryRequest.error(mockErrorResponse);
  
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching user country:',
      mockErrorResponse
    );
    expect(component.userCountry).toBeNull(); // or expect(component.userCountry).toBeUndefined();
  });
  
  

  // it('should handle error while fetching news', () => {
  //   spyOn(console, 'error');
  //   const mockErrorResponse = new ErrorEvent('API Error', {
  //     error: new Error('Unknown Error'),
  //     message: 'Http failure response for https://newsapi.org/v2/top-headlines?category=general&country=us&apiKey=83de244909ac40ff9d878a9bb23ed4e5: 0',
  //   });
  
  //   component.userCountry = 'us';
  //   component.fetchNews('us');
  
  //   const newsRequest = httpMock.expectOne('https://newsapi.org/v2/top-headlines?category=general&country=us&apiKey=83de244909ac40ff9d878a9bb23ed4e5');
  //   newsRequest.error(mockErrorResponse);
  
  //   expect(console.error).toHaveBeenCalledWith(
  //     'Error fetching news:',
  //     mockErrorResponse
  //   );
  //   expect(component.news).toEqual([]);
  // });
  
  
});
