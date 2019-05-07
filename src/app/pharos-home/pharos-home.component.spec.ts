import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PharosDashboardComponent } from './pharos-home.component';
import {SharedModule} from '../shared/shared.module';
import {LoadingService} from '../pharos-services/loading.service';
import {PathResolverService} from '../pharos-services/path-resolver.service';
import {FacetRetrieverService} from '../pharos-main/data-list/filter-panel/facet-retriever.service';
import {PharosApiService} from '../pharos-services/pharos-api.service';
import {ResponseParserService} from '../pharos-services/response-parser.service';
import {SuggestApiService} from '../tools/search-component/suggest-api.service';
import {AppRoutingModule} from '../app-routing.module';
import {APP_BASE_HREF} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AboutPageComponent} from '../about-page/about-page.component';
import {ApiPageComponent} from '../api-page/api-page.component';
import {FaqPageComponent} from '../faq-page/faq-page.component';
import {DataTypesPanelComponent} from './data-types-panel/data-types-panel.component';
import {NewsPanelComponent} from './news-panel/news-panel.component';
import {AboutPanelComponent} from './about-panel/about-panel.component';
import {ApiViewerComponent} from '../tools/api-viewer/api-viewer.component';

describe('PharosDashboardComponent', () => {
  let component: PharosDashboardComponent;
  let fixture: ComponentFixture<PharosDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        AppRoutingModule
      ],
      declarations: [
        PharosDashboardComponent,
        ApiPageComponent,
        AboutPageComponent,
        FaqPageComponent,
        DataTypesPanelComponent,
        NewsPanelComponent,
        AboutPanelComponent,
        ApiViewerComponent
      ],
      providers: [
        PharosApiService,
        PathResolverService,
        ResponseParserService,
        LoadingService,
        FacetRetrieverService,
        SuggestApiService,
        {provide: APP_BASE_HREF, useValue: '/index' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});