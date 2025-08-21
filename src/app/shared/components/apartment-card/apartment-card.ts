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
} from '@angular/core';
import {
  IProperty,
  PriceMode,
  PropertyType,
} from '../../../features/home/interface/property.interface';
import { Button } from '../button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartment-card',
  imports: [CommonModule, Button],
  templateUrl: './apartment-card.html',
  styleUrls: ['./apartment-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentCard implements OnChanges {
  favorites = input.required<Map<unknown, unknown>>();
  property = input.required<IProperty>();
  @Output() viewDetails = new EventEmitter<any>();
  @Output() togglefavClick = new EventEmitter<any>();
  @Output() sendEnquiryClick = new EventEmitter<any>();

  private router = inject(Router);

  propertyTypeEnum = PropertyType;
  priceModeEnum = PriceMode;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['favorites']) {
      this.property().isFavorited = !!this.favorites().get(this.property().id);
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
