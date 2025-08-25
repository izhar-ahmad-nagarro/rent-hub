import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenterQueriesComponent } from './renter-queries.component';

describe('RenterQueriesComponent', () => {
  let component: RenterQueriesComponent;
  let fixture: ComponentFixture<RenterQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenterQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenterQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
