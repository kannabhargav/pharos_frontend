import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BreadcrumbComponent} from './breadcrumb.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../../../shared/shared.module';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {TESTTARGET} from '../../../../../../../test/test-target';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ApolloTestingModule,
        RouterTestingModule
      ],
      declarations: [
        BreadcrumbComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    component.data = TESTTARGET;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
