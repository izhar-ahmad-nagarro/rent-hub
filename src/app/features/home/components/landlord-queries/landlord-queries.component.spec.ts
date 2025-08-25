import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordQueriesComponent } from './landlord-queries.component';

describe('LandlordQueriesComponent', () => {
  let component: LandlordQueriesComponent;
  let fixture: ComponentFixture<LandlordQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandlordQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
