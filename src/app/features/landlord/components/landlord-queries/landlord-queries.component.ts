import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUserQuery } from '../../../home/interface';
import { ButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-landlord-queries',
  imports: [FormsModule, CommonModule, ButtonComponent],
  templateUrl: './landlord-queries.component.html',
  styleUrl: './landlord-queries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandlordQueriesComponent {
  queries = input<IUserQuery[]>([]);
  @Output() sendReplyEvent = new EventEmitter<IUserQuery>();

  sendReply(query: IUserQuery) {
    this.sendReplyEvent.emit(query);
  }
}
