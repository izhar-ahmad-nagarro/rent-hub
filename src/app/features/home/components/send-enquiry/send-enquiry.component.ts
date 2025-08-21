import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Button } from '../../../../shared';

@Component({
  selector: 'app-send-enquiry',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './send-enquiry.component.html',
  styleUrl: './send-enquiry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendEnquiryComponent {
  enquiryForm: FormGroup;
  private activeModal = inject(NgbActiveModal);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.enquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.enquiryForm.valid) {
      // this.http.post('/api/enquiry', this.enquiryForm.value).subscribe({
      //   next: () => {
      //     alert('Enquiry sent successfully!');
      //     this.enquiryForm.reset();
      //   },
      //   error: () => {
      //     alert('Error sending enquiry.');
      //   }
      // });
    }
  }

  close() {
    this.activeModal.close();
  }
}
