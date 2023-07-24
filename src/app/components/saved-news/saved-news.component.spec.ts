import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SavedNewsComponent } from './saved-news.component';
import { DashboardComponent } from '../news/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SavedNewsComponent', () => {
  let component: SavedNewsComponent;
  let fixture: ComponentFixture<SavedNewsComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SavedNewsComponent, DashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AuthService, useValue: { isAuthenticated: () => true } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedNewsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    component.ngOnInit();
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
  

  it('should fetch saved articles for authenticated user', async () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve([{ savedArticles: [{ title: 'Article 1' }] }]),
        ok: true,
      } as Response)
    );
  
    await component.ngOnInit();
  
    expect(window.fetch).toHaveBeenCalled();
    expect(component.savedNews.length).toBe(1);
    expect(component.savedNews[0].title).toBe('Article 1');
  });
  
  

  it('should open the article in a new tab', () => {
    const url = 'https://example.com/article';
    spyOn(window, 'open');

    component.openArticle(url);

    expect(window.open).toHaveBeenCalledWith(url, '_blank');
  });

  it('should remove the article from saved articles', async () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve([{ savedArticles: [{ title: 'Article 2' }] }]),
        ok: true,
      } as Response)
    );
  
    component.savedNews = [{ title: 'Article 1' }, { title: 'Article 2' }];
    const reloadSpy = spyOn(window.location, 'reload');
  
    await component.removeArticle({ title: 'Article 1' });
  
    expect(window.fetch).toHaveBeenCalled();
    expect(component.savedNews).toEqual([{ title: 'Article 2' }]);
    expect(window.location.reload).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Article removed successfully!');
  });
  
});