import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEnquiryComponent } from './send-enquiry.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('SendEnquiryComponent', () => {
  let component: SendEnquiryComponent;
  let fixture: ComponentFixture<SendEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendEnquiryComponent],
      providers: [NgbActiveModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
