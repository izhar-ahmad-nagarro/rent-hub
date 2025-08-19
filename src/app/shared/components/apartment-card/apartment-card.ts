import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { IProperty, PriceMode, PropertyType } from '../../../features/home/interface/property.interface';
import { Button } from '../button/button';

@Component({
  selector: 'app-apartment-card',
  imports: [CommonModule, Button],
  templateUrl: './apartment-card.html',
  styleUrls: ['./apartment-card.scss']
})
export class ApartmentCard {
  property = input.required<IProperty>();
  @Output() viewDetails = new EventEmitter<any>();
  propertyTypeEnum = PropertyType;
  priceModeEnum = PriceMode;
  isFavorited = false;

  ngOnInit() {
    // Initialize favorite state from some auth/user service if available
    // this.isFavorited = this.user?.favorites.includes(this.apartment.id) || false;
  }

  toggleFavorite(e: Event) {
    e.stopPropagation();
    // Add logic to check auth; otherwise prompt login
    this.isFavorited = !this.isFavorited;
    // Use a service to show toast notification
    this.viewDetails.emit(this.property); // or a separate favorite action
  }

  onViewDetails() {
    this.viewDetails.emit(this.property);
  }
}
