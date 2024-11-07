import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePointFormComponent } from './route-point-form.component';

describe('RoutePointFormComponent', () => {
  let component: RoutePointFormComponent;
  let fixture: ComponentFixture<RoutePointFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutePointFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
