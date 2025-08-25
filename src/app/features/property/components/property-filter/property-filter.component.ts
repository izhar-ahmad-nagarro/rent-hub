import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services';
import { IPropertyFilter, PriceMode, PropertyType } from '../../interface';

@Component({
  selector: 'app-property-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-filter.component.html',
  styleUrl: './property-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyFilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<IPropertyFilter>();
  private propertyService = inject(PropertyService);
  propertyTypes: Array<{ label: string; value: PropertyType }> = [];
  PriceModeArr: Array<{ label: string; value: PriceMode }> = [];
  filters = {
    isFurnished: null,
    priceMode: null,
    type: null,
  };
  showFilters = true;

  ngOnInit(): void {
    this.propertyTypes = this.propertyService.propertyTypes;
    this.PriceModeArr = this.propertyService.priceModeArr;
  }

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }

  clearFilters() {
    this.filters = {
      isFurnished: null,
      priceMode: null,
      type: null,
    };
    this.applyFilters();
  }
}
