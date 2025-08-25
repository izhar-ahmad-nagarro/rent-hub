import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { PropertyListComponent } from '../../../property/components/property-list/property-list.component';

@Component({
  selector: 'app-home',
  imports: [PropertyListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}
