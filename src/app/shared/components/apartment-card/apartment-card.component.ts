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
} from '../../../features/property/interface/property.interface';
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
  isLandLord = input<boolean>(false);
  activeUser = input<IUser | null>();
  @Output() togglefavClick = new EventEmitter<IProperty>();
  @Output() sendEnquiryClick = new EventEmitter<IProperty>();

  @Input() amenitiesMap: Map<number, IAmenities> = new Map();

  private router = inject(Router);
  propertyTypeEnum = PropertyType;
  priceModeEnum = PriceMode;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['favorites']) {
      const fav = !!this.favorites()?.get(this.property()?.id);
      (this.property() as IProperty)['isFavorited'] = fav;
    }
    console.log(this.isLandLord(), 'isLandlord')
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
    this.router.navigate(['/property', this.property()?.id, 'details'])
  }
}
