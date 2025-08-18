import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Button } from '../../../../shared';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, Button],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp {
  signupForm: FormGroup;
  private readonly activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  constructor(){
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signup() {
    if (this.signupForm.valid) {
      this.activeModal.close(this.signupForm.value); // return form data
    }
  }

  close() {
    this.activeModal.dismiss(); // dismiss modal
  }
}
