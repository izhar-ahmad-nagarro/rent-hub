import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  inject,
  Input,
} from '@angular/core';
import {
  IProperty,
  PriceMode,
  PropertyType,
} from '../../../features/home/interface/property.interface';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { IAmenities, IUser } from '../../../features';

@Component({
  selector: 'app-apartment-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './apartment-card.component.html',
  styleUrls: ['./apartment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentCardComponent implements OnChanges {
  favorites = input<Map<unknown, unknown>>();
  property = input.required<IProperty>();

  activeUser = input<IUser | null>();
  @Output() viewDetails = new EventEmitter<any>();
  @Output() togglefavClick = new EventEmitter<any>();
  @Output() sendEnquiryClick = new EventEmitter<any>();

  @Input() amenitiesMap: Map<number, IAmenities> = new Map();

  private router = inject(Router);
  propertyTypeEnum = PropertyType;
  priceModeEnum = PriceMode;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['favorites']) {
      this.property().isFavorited = !!this.favorites()?.get(this.property().id);
    }
  }

  toggleFavorite(e: Event) {
    e.stopPropagation();
    this.togglefavClick.emit(this.property());
  }

  sendEnquiry(e: Event) {
    e.stopPropagation();
    this.sendEnquiryClick.emit(this.property());
  }

  cardClick() {
    this.router.navigate(['/property/details', this.property().id])
  }
}
