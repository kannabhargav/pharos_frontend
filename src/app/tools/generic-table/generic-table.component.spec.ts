import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableComponent } from './generic-table.component';
import {MaterialModule} from '../../../assets/material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../shared/shared.module';
import {GenericTableModule} from './generic-table.module';
import {PropertyDisplayComponent} from './components/property-display/property-display.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('GenericTableComponent', () => {
  let component: GenericTableComponent;
  let fixture: ComponentFixture<GenericTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        GenericTableComponent,
        PropertyDisplayComponent
      ],
      providers: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTableComponent);
    component = fixture.componentInstance;
    component.data = [];
    component.fieldsConfig = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
