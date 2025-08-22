import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ApartmentCardComponent, IUser } from '../../../../shared';
import { IProperty } from '../../interface/property.interface';
import { CommonModule } from '@angular/common';
import {
  PropertyService,
  SearchService,
  UserFavoritesService,
} from '../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../auth';
import { UserQueryService } from '../../services/user-query.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApartmentCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  properties = signal<IProperty[]>([]);
  featuredProperties = signal<IProperty[]>([]);
  favorites = signal<Map<number, number>>(new Map());

  private userFavoriteService = inject(UserFavoritesService);
  private authService = inject(AuthService);
  private propertyService = inject(PropertyService);
  private searchService = inject(SearchService);
  private userQueryService = inject(UserQueryService);

  activeUser: IUser | null = null;

  private readonly modalService = inject(NgbModal);

  constructor() {
    effect(async () => {
      const term = this.searchService.debouncedSearch().trim().toLowerCase();
      const resp = await this.propertyService.getAll(term);
      this.properties.set(resp);
      this.featuredProperties.set(resp.filter((p) => p.featured));
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
}
