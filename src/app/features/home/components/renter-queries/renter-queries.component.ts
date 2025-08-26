import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IUserQuery } from '../../interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-renter-queries',
  imports: [CommonModule],
  templateUrl: './renter-queries.component.html',
  styleUrl: './renter-queries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenterQueriesComponent {
  queries = input<IUserQuery[]>([]);
}
