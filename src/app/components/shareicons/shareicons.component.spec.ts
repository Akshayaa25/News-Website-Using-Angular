import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareiconsComponent } from './shareicons.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ShareiconsComponent', () => {
  let component: ShareiconsComponent;
  let fixture: ComponentFixture<ShareiconsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, ShareButtonModule, ShareIconsModule],
      declarations: [ShareiconsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            article: {
              url: 'https://example.com/article',
              title: 'Example Article',
              description: 'This is an example article',
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareiconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct article data', () => {
    expect(component.article).toBeDefined();
    expect(component.article.url).toEqual('https://example.com/article');
    expect(component.article.title).toEqual('Example Article');
    expect(component.article.description).toEqual('This is an example article');
  });
});