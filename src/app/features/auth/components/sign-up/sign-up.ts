import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Button, UserRole } from '../../../../shared';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, Button, NgbDropdownModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  signupForm: FormGroup;
  userRoles = UserRole;
  private readonly activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  @Output() signupUser = new EventEmitter();
  constructor() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [this.userRoles.Renter, Validators.required],
    });
  }

  signup() {
    if (this.signupForm.valid) {
      this.signupUser.emit(this.signupForm.value)
    }
  }

  close() {
    this.activeModal.dismiss(); // dismiss modal
  }
}
