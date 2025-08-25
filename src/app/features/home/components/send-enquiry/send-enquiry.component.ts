import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '../../../../shared';
import { CommonModule } from '@angular/common';
import { IProperty } from '../../../property/interface';
import { IUser } from '../../../auth';

@Component({
  selector: 'app-send-enquiry',
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule],
  templateUrl: './send-enquiry.component.html',
  styleUrl: './send-enquiry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEnquiryComponent implements OnInit {
  enquiryForm: FormGroup = new FormGroup({});
  private activeModal = inject(NgbActiveModal);
  @Output() submitUserQuery = new EventEmitter();
  property?: IProperty;
  activeUser?: IUser;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.enquiryForm = this.fb.group({
      userName: [this.activeUser?.name, Validators.required],
      email: [this.activeUser?.email, [Validators.required, Validators.email]],
      message: ['', Validators.required],
      propertyId: [this.property?.id],
      userId: [this.activeUser?.id],
      createdAt: [Date.now()],
    });
    if (this.activeUser) {
      this.enquiryForm.controls['userName'].disable();
      this.enquiryForm.controls['email'].disable();
    }
  }

  onSubmit() {
    if (this.enquiryForm?.valid) {
      this.submitUserQuery.emit({
        ...this.enquiryForm.getRawValue(),
        replies: [],
      });
    }
  }

  close() {
    this.activeModal.close();
  }
}
