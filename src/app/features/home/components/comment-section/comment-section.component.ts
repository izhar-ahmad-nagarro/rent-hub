import { Component, effect, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IComment, IUser } from '../../interface';
import { db } from '../../../../db/app.db';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit {
  @Input() propertyId!: number;
  comments: IComment[] = [];
  activeUser: IUser | null = null;
  commentForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  constructor() {
    effect(async () => {
      this.activeUser = this.authService.currentUser();
    });
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.loadComments();
  }

  async loadComments() {
    this.comments = (await db.comments
      .where('propertyId')
      .equals(this.propertyId)
      .sortBy('createdAt')) as IComment[];
  }

  async submitComment() {
    if (this.commentForm.invalid) return;

    if (!this.activeUser) {
      this.authService.loginSubmit();
    } else {
      const newComment: IComment = {
        propertyId: this.propertyId,
        userId: this.activeUser!.id,
        userName: this.activeUser!.name,
        content: this.commentForm.value.content,
        createdAt: new Date(),
      };
      await db.comments.add(newComment);
      this.commentForm.reset();
      this.loadComments();
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
