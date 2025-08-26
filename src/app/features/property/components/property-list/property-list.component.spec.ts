import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListComponent } from './property-list.component';
import { provideHttpClient } from '@angular/common/http';

describe('PropertyListComponent', () => {
  let component: PropertyListComponent;
  let fixture: ComponentFixture<PropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyListComponent],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
