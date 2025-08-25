import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import {
  ApartmentCardComponent,
} from '../../../../shared';
import { AuthService, IUser, UserRole } from '../../../auth';
import { IAmenities, SearchService, UserFavoritesService } from '../../../home';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../property/services';
import { IProperty } from '../../../property/interface';

@Component({
  selector: 'app-my-listings',
  imports: [ApartmentCardComponent, CommonModule, RouterModule],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.scss',
})
export class MyListingsComponent {
  properties = signal<IProperty[]>([]);
  favorites = signal<Map<number, number>>(new Map());
  amenities: Map<number, IAmenities> = new Map();
  
  private authService = inject(AuthService);
  private propertyService = inject(PropertyService);
  private searchService = inject(SearchService);
  private userFavoriteService = inject(UserFavoritesService);
  private router = inject(Router);
  activeUser: IUser | null = null;
  search = '';

  constructor() {
    this.activeUser = this.authService.currentUser();
    if (!this.activeUser || !(this.activeUser.role === UserRole.LandLord)) {
      this.router.navigate(['/home']);
      return;
    }
    effect(async () => {
      this.search = this.searchService.debouncedSearch().trim().toLowerCase();
      this.loadProperties(this.search);
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
    this.getAmenitiesMap();
  }

  async loadProperties(term: string) {
    const resp = await this.propertyService.getAll(term, 'asc', {
      ownerId: this.activeUser?.id,
    });
    this.properties.set(resp);
  }

  editProperty(property: IProperty) {
    this.router.navigate(['property', property.id, 'edit'])
  }

  deleteProperty(property: IProperty) {
    this.propertyService.delete(property.id);
    this.loadProperties(this.search);
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

  private async getAmenitiesMap() {
    this.amenities = await this.propertyService.getAmenitiesMap();
  }
}
