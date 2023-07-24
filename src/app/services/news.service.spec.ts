import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Newsservice } from './news.service';

describe('NewsService', () => {
  let service: Newsservice;
  let httpMock: HttpTestingController;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Newsservice],
    });

    service = TestBed.inject(Newsservice);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch news', () => {
    const mockResponse = { articles: [{ title: 'Article 1' }, { title: 'Article 2' }] };
    const category = 'business';
    const country = 'us';
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${service.API_KEY}`;

    service.fetchNews(category, country).subscribe((data: any) => {
      expect(data.articles.length).toBe(2);
      expect(data.articles[0].title).toBe('Article 1');
      expect(data.articles[1].title).toBe('Article 2');
    });

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should fetch everything news', () => {
    const mockResponse = { articles: [{ title: 'Article 1' }, { title: 'Article 2' }] };
    const q = 'test';
    const fromDate = new Date('2022-01-01');
    const toDate = new Date('2022-02-01');
    const sortBy = 'publishedAt';
    const url = `https://newsapi.org/v2/everything?q=${q}&from=${fromDate.toISOString().split('T')[0]}&to=${toDate.toISOString().split('T')[0]}&sortBy=${sortBy}&apiKey=${service.API_KEY}`;

    service.fetchEverythingNews(q, fromDate, toDate, sortBy).subscribe((data: any) => {
      expect(data.articles.length).toBe(2);
      expect(data.articles[0].title).toBe('Article 1');
      expect(data.articles[1].title).toBe('Article 2');
    });

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
