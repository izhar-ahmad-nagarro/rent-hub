import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApartmentCardComponent, IAmenities, IUser } from '../../../../shared';
import { IProperty, IPropertyFilter } from '../../interface/property.interface';
import { CommonModule } from '@angular/common';
import {
  PropertyService,
  SearchService,
  UserFavoritesService,
} from '../../services';
import { AuthService } from '../../../auth';
import { UserQueryService } from '../../services/user-query.service';
import { FormsModule } from '@angular/forms';
import { PropertyFilterComponent } from '../property-filter/property-filter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApartmentCardComponent, CommonModule, FormsModule, PropertyFilterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  properties = signal<IProperty[]>([]);
  featuredProperties = signal<IProperty[]>([]);
  favorites = signal<Map<number, number>>(new Map());
  amenities: Map<number, IAmenities> = new Map();
  private userFavoriteService = inject(UserFavoritesService);
  private authService = inject(AuthService);
  private propertyService = inject(PropertyService);
  private searchService = inject(SearchService);
  private userQueryService = inject(UserQueryService);

  activeUser: IUser | null = null;

  ngOnInit(): void {
    this.getAmenitiesMap();
  }

  constructor() {
    effect(async () => {
      const resp = await this.getAndSetProperties();
      if(!this.featuredProperties().length){
        this.featuredProperties.set(resp.filter((p) => p.featured));
      }
    });

    effect(async () => {
      this.activeUser = this.authService.currentUser();
      if (this.activeUser) {
        const ids = new Map(
          (
            await this.userFavoriteService.getUserFavorites(this.activeUser.id)
          ).map((f) => [f.propertyId, f.propertyId])
        );
        this.favorites.set(ids as Map<number, number>);
      } else {
        this.favorites.set(new Map());
      }
    });
  }

  async getAmenitiesMap() {
    this.amenities = await this.propertyService.getAmenitiesMap();
  }

  async togglefavClick(payload: IProperty) {
    if (this.activeUser?.id) {
      payload.isFavorited = !payload.isFavorited;
      await this.userFavoriteService.updateUserFavorite(payload.isFavorited, {
        userId: this.activeUser?.id,
        propertyId: payload.id,
      });
    }
  }

  async sendEnquiry(property: IProperty) {
    if (!this.activeUser) {
      this.authService.loginSubmit();
    } else {
      this.userQueryService
        .sendEnquiryModal(property, this.activeUser as IUser)
        .subscribe();
    }
  }

  async filtersChanged(filters: IPropertyFilter){
    const term = this.searchService.debouncedSearch().trim().toLowerCase();
    const resp = await this.propertyService.getAll(term, 'asc', filters);
    this.properties.set(resp);
  }

 async  getAndSetProperties() {
    const term = this.searchService.debouncedSearch().trim().toLowerCase();
      const resp = await this.propertyService.getAll(term,);
      this.properties.set(resp);
      return resp;
  }
}
