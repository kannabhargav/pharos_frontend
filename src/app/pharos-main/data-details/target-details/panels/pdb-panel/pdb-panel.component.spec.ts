import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdbPanelComponent } from './pdb-panel.component';

describe('PdbPanelComponent', () => {
  let component: PdbPanelComponent;
  let fixture: ComponentFixture<PdbPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdbPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdbPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
