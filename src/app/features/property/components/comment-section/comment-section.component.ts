import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IComment } from '../../../home/interface';
import { db } from '../../../../db/app.db';
import { CommonModule } from '@angular/common';
import { AuthService, IUser } from '../../../auth';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentSectionComponent implements OnInit {
  @Input() propertyId: number | undefined;
  comments = signal<IComment[]>([]);
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
    if (this.propertyId) {
      const comments = (await db.comments
        .where('propertyId')
        .equals(this.propertyId)
        .sortBy('createdAt')) as IComment[];
      this.comments.set(comments);
    }
  }

  async submitComment() {
    if (this.commentForm.invalid || !this.propertyId) return;

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
