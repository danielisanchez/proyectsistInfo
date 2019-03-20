import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArteComponent } from './arte.component';

describe('ArteComponent', () => {
  let component: ArteComponent;
  let fixture: ComponentFixture<ArteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
