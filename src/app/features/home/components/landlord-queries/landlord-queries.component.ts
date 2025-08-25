import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUserQuery } from '../../interface';
import { ButtonComponent } from '../../../../shared';
import { UserQueryService } from '../../services/user-query.service';

@Component({
  selector: 'app-landlord-queries',
  imports: [FormsModule, CommonModule, ButtonComponent],
  templateUrl: './landlord-queries.component.html',
  styleUrl: './landlord-queries.component.scss',
})
export class LandlordQueriesComponent {
  @Input() propertyId: number | undefined;
  @Input() ownerId: number | undefined;
  @Input() currentUserId: number | undefined;
  queries: IUserQuery[] = [];

  private userQueryService = inject(UserQueryService);

  sendReply(query: any) {
    if (!query.replyText?.trim()) return;

    const reply: any = {
      message: query.replyText,
      timestamp: Date.now(),
    };

    query.replies.push(reply);
    query.replyText = '';

    // Save to IndexedDB or service
    this.updateQuery(query);
  }

  async updateQuery(query: IUserQuery) {
    if (query.id) {
      await this.userQueryService.update(query.id, {
        replies: query.replies,
      });
    }

    // Upsert the query to the database
  }

  ngOnInit() {
    this.loadQueriesForLandlord();
  }

  async loadQueriesForLandlord() {
    if (this.propertyId) {
      this.queries = await this.userQueryService.getUserQueryByProperty(
        this.propertyId
      );
    }
  }
}
