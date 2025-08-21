import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interface';
import { db } from '../../../../db/app.db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit {
  @Input() propertyId!: number;
  comments: IComment[] = [];

  commentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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

    const newComment: IComment = {
      propertyId: this.propertyId,
      userId: 1, // Simulated logged-in user
      userName: 'John Doe',
      content: this.commentForm.value.message,
      createdAt: new Date(),
    };

    await db.comments.add(newComment);
    this.commentForm.reset();
    this.loadComments();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
