import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import {
  IProperty,
  PriceMode,
  PropertyType,
} from '../../../features/home/interface/property.interface';
import { Button } from '../button/button';

@Component({
  selector: 'app-apartment-card',
  imports: [CommonModule, Button],
  templateUrl: './apartment-card.html',
  styleUrls: ['./apartment-card.scss'],
})
export class ApartmentCard {
  property = input.required<IProperty>();
  @Input() favorites: Map<number, number> = new Map();
  @Output() viewDetails = new EventEmitter<any>();
  @Output() markAsFavorite = new EventEmitter<any>();
  @Output() sendEnquiryClick = new EventEmitter<any>();

  propertyTypeEnum = PropertyType;
  priceModeEnum = PriceMode;

  ngOnInit() {
    this.property().isFavorited = !!this.favorites?.get(this.property().id)
  }

  toggleFavorite(e: Event) {
    e.stopPropagation();
    this.markAsFavorite.emit(this.property());
  }

  sendEnquiry(e: Event) {
    e.stopPropagation();
    this.sendEnquiryClick.emit(this.property());
  }
}
