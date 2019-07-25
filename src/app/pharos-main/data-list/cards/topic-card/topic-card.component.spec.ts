import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiCardComponent } from './topic-card.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from '../../../../app-routing.module';
import {SharedModule} from '../../../../shared/shared.module';
import {SuggestApiService} from '../../../../tools/search-component/suggest-api.service';
import {APP_BASE_HREF} from '@angular/common';
import {AboutPageComponent} from '../../../../about-page/about-page.component';
import {DataTypesPanelComponent} from '../../../../pharos-home/data-types-panel/data-types-panel.component';
import {AboutPanelComponent} from '../../../../pharos-home/about-panel/about-panel.component';
import {ApiPageComponent} from '../../../../api-page/api-page.component';
import {FaqPageComponent} from '../../../../faq-page/faq-page.component';
import {NewsPanelComponent} from '../../../../pharos-home/news-panel/news-panel.component';
import {ApiViewerComponent} from '../../../../tools/api-viewer/api-viewer.component';
import {Topic} from '../../../../models/topic';

describe('ToiCardComponent', () => {
  let component: ToiCardComponent;
  let fixture: ComponentFixture<ToiCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        AppRoutingModule
      ],
      declarations: [
        ToiCardComponent
      ],
      providers: [
        SuggestApiService,
        {provide: APP_BASE_HREF, useValue: '/index' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToiCardComponent);
    component = fixture.componentInstance;
    const top: Topic = new Topic();
    /*top = {
      name: 'Bromodomain Inhibitors',
      class: 'target',
      diseaseCt: 45,
      ligandCt: 43,
      targetCt: 0,
      publicationCt: 25
    }*/
    component.toi = top;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
