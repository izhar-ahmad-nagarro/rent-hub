import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private activeModal = inject(NgbActiveModal);
  loginForm: FormGroup;
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.activeModal.close(formData);
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
