import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentCard } from './apartment-card';

describe('ApartmentCard', () => {
  let component: ApartmentCard;
  let fixture: ComponentFixture<ApartmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
