import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareiconsComponent } from '../shareicons/shareicons.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { FormsModule } from '@angular/forms';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let dialog: MatDialog;
  let categoryService: CategoryService;

  beforeEach(
    waitForAsync(() => {
      categoryService = jasmine.createSpyObj('CategoryService', [
        'getSelectedCategory',
        'getSelectedCountry',
        'setSelectedCountry',
      ]);

      TestBed.configureTestingModule({
        declarations: [NewsComponent, DashboardComponent, ShareiconsComponent],
        imports: [
          HttpClientTestingModule,
          ApolloTestingModule,
          MatDialogModule,
          BrowserAnimationsModule,
          FormsModule,
        ],
        providers: [
          MatDialog,
          { provide: CategoryService, useValue: categoryService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.news).toEqual([]);
    expect(component.filteredNews).toEqual([]);
    expect(component.selectedCategory).toEqual('');
    expect(component.currentUser).toBeUndefined();
  });

  it('should fetch news for selected category and country', () => {
    spyOn(component.newsService, 'fetchNews').and.returnValue(of({ articles: [] }));
    spyOn(categoryService, 'getSelectedCategory').and.returnValue('technology');
    spyOn(categoryService, 'getSelectedCountry').and.returnValue('us');
    component.ngOnInit();
    expect(component.newsService.fetchNews).toHaveBeenCalledWith('technology', 'us');
    expect(categoryService.getSelectedCategory).toHaveBeenCalled();
    expect(categoryService.getSelectedCountry).toHaveBeenCalled();
  });
  
  it('should fetch news for default category and country', () => {
    spyOn(component.newsService, 'fetchNews').and.returnValue(of({ articles: [] }));
    spyOn(categoryService, 'getSelectedCountry').and.returnValue('');
    component.ngOnInit();
    expect(component.newsService.fetchNews).toHaveBeenCalledWith('general', '');
    expect(categoryService.getSelectedCountry).toHaveBeenCalled();
    expect(categoryService.setSelectedCountry).toHaveBeenCalledWith('');
  });
  

  it('should update filteredNews when filterNews is called', () => {
    component.news = [
      { title: 'News 1', description: 'Description 1' },
      { title: 'News 2', description: 'Description 2' },
      { title: 'News 3', description: 'Description 3' },
    ];
    component.filterNews('News');
    expect(component.filteredNews).toEqual(component.news);
    component.filterNews('Description 2');
    expect(component.filteredNews).toEqual([component.news[1]]);
    component.filterNews('Invalid');
    expect(component.filteredNews).toEqual([]);
  });

  it('should return the display name for the selected category', () => {
    expect(component.getCategoryDisplayName()).toEqual('General News');
    component.selectedCategory = 'health';
    expect(component.getCategoryDisplayName()).toEqual('Health News');
    component.selectedCategory = 'sports';
    expect(component.getCategoryDisplayName()).toEqual('Sports News');
    component.selectedCategory = 'business';
    expect(component.getCategoryDisplayName()).toEqual('Business News');
    component.selectedCategory = 'entertainment';
    expect(component.getCategoryDisplayName()).toEqual('Entertainment News');
    component.selectedCategory = 'science';
    expect(component.getCategoryDisplayName()).toEqual('Science News');
    component.selectedCategory = 'technology';
    expect(component.getCategoryDisplayName()).toEqual('Technology News');
    component.selectedCategory = 'unknown';
    expect(component.getCategoryDisplayName()).toEqual('General News');
  });

  it('should save an article', async () => {
    const article = { title: 'Test Article' };
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: new Headers(),
        })
      )
    );
    spyOn(window, 'alert'); // Spy on window.alert

    component.saveArticle(article);
    await fixture.whenStable(); // Wait for promises to resolve

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:3030/savedArticles'
    );

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Article saved successfully!');
  });

  it('should open the share dialog', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of());
    spyOn(dialog, 'open').and.returnValue(dialogRef);
    const article = { title: 'Test Article' };
    component.openShareDialog(article);
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open).toHaveBeenCalledWith(ShareiconsComponent, {
      width: '500px',
      height: '200px',
      data: {
        article: article,
      },
    });
  });
});
