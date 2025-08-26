import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { IAmenities, IReply, IUserQuery } from '../../../home/interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { ButtonComponent } from '../../../../shared';
import { UserQueryService } from '../../../home/services/user-query.service';
import { AuthService, IUser } from '../../../auth';
import { FormsModule } from '@angular/forms';
import { LandlordQueriesComponent } from '../../../landlord/components/landlord-queries/landlord-queries.component';
import { RenterQueriesComponent } from '../../../home/components/renter-queries/renter-queries.component';
import { PropertyService } from '../../services';
import { IProperty, LeaseType, PriceMode, PropertyType } from '../../interface';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-property-details',
  imports: [
    NgbCarouselModule,
    CommonModule,
    FormsModule,
    CommentSectionComponent,
    ButtonComponent,
    LandlordQueriesComponent,
    RenterQueriesComponent,
    RouterModule,
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetailsComponent implements OnInit {
  property = signal<IProperty | null>(null);
  queries: IUserQuery[] = [];

  activeUser: IUser | null = null;
  propertyTypeEnum = PropertyType;
  leaseTypeEnum = LeaseType;
  priceModeEnum = PriceMode;
  amenitiesMap = signal<Map<number, IAmenities>>(new Map());
  private propertyService = inject(PropertyService);
  private activatedRoute = inject(ActivatedRoute);
  private userQueryService = inject(UserQueryService);
  authService = inject(AuthService);

  constructor() {
    effect(async () => {
      this.activeUser = this.authService.currentUser();
      this.loadQueriesForRenter();
    });
  }

  async loadQueriesForRenter() {
    if (
      this.activeUser?.id &&
      !this.authService.isLandLord() &&
      Number(this.activatedRoute.snapshot.params['id'])
    ) {
      this.queries = await this.userQueryService.getUserQueryByUserId(
        this.activeUser.id,
        Number(this.activatedRoute.snapshot.params['id'])
      );
    }
  }

  async loadQueriesForLandlord() {
    if (
      Number(this.activatedRoute.snapshot.params['id']) &&
      this.authService.isLandLord()
    ) {
      this.queries = await this.userQueryService.getUserQueryByProperty(
        Number(this.activatedRoute.snapshot.params['id'])
      );
    }
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.getPropertyDetails(
        Number(this.activatedRoute.snapshot.params['id'])
      );
      this.getAmenitiesMap();
      this.loadQueriesForLandlord();
    }
  }

  private async getPropertyDetails(propertyId: number) {
    const property = await this.propertyService.getById(propertyId);
    if (property) {
      this.property.set(property);
    }
  }

  async sendEnquiry(e?: Event) {
    e?.stopPropagation();
    if (!this.activeUser) {
      const user = await this.authService.loginSubmit();
      if (user) {
        setTimeout(() => this.openUserQueryModal());
      }
    } else {
      this.openUserQueryModal();
    }
  }

  private async getAmenitiesMap() {
    this.amenitiesMap.set(await this.propertyService.getAmenitiesMap());
  }

  openUserQueryModal() {
    this.userQueryService
      .sendEnquiryModal(this.property() as IProperty, this.activeUser as IUser)
      .pipe()
      .subscribe((res) => {
        if (res) {
          if (!this.authService.isLandLord()) {
            this.loadQueriesForRenter();
          } else {
            this.loadQueriesForLandlord();
          }
        }
      });
  }

  sendReply(query: IUserQuery) {
    if (!query.replyText?.trim()) return;

    const reply: IReply = {
      message: query.replyText,
      createdAt: Date.now(),
    };

    query.replies.push(reply);
    query.replyText = '';

    // Save to IndexedDB or service
    this.updateQuery(query);
  }

  async updateQuery(query: IUserQuery) {
    if (query.id) {
      await this.userQueryService.update(query.id, {
        replies: query.replies,
      });
      this.loadQueriesForLandlord();
    }
  }
}
