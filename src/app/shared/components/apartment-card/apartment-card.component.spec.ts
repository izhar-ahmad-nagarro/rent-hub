import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentCardComponent } from './apartment-card.component';
import { InputSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IProperty } from '../../../features';
import { of } from 'rxjs';

describe('ApartmentCardComponent', () => {
  let component: ApartmentCardComponent;
  let fixture: ComponentFixture<ApartmentCardComponent>;
  let mockProperty =  {
    "id": 9,
    "title": "2BHK with Smart Home Features",
    "description": "Equipped with voice control, smart locks, and lighting.",
    "ownerName": "Linda Ray",
    "type": 4,
    "isShared": false,
    "location": "Smart Living Complex, Metro City",
    "size": "1000 sqft",
    "leaseType": 0,
    "expectedRent": 2100,
    "priceMode": 0,
    "isFurnished": true,
    "amenities": [1,2,3,4,5,6,7,8],
    "images": ["assets/images/apartment-first.jpg"],
    "ownerId": 1
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentCardComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(()=> {
    component.property = toSignal(of(mockProperty))  as InputSignal<IProperty>;
  });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
