import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {
  IAmenities,
} from '../../../home/interface';
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

@Component({
  selector: 'app-property-details',
  imports: [NgbCarouselModule, CommonModule, FormsModule, CommentSectionComponent, ButtonComponent,
    LandlordQueriesComponent, RenterQueriesComponent, RouterModule
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyDetailsComponent implements OnInit {
  
  property = signal<IProperty | null>(null);;
  activeUser: IUser | null = null;
  propertyTypeEnum = PropertyType;
  leaseTypeEnum = LeaseType;
  priceModeEnum = PriceMode;
  amenitiesMap: Map<number, IAmenities> = new Map();
  private propertyService = inject(PropertyService);
  private activatedRoute = inject(ActivatedRoute);
  private userQueryService = inject(UserQueryService);
  authService = inject(AuthService);

  constructor() {
    effect(async () => {
      this.activeUser = this.authService.currentUser();
    });
  }
   
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.getPropertyDetails(
        Number(this.activatedRoute.snapshot.params['id'])
      );
      this.getAmenitiesMap();
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
      if(user){
        setTimeout(()=>this.openUserQueryModal());
      }
    } else {
        this.openUserQueryModal();
    }
  }

  private async getAmenitiesMap(){
    this.amenitiesMap = await this.propertyService.getAmenitiesMap();
  }

  openUserQueryModal() {
    this.userQueryService
        .sendEnquiryModal(this.property() as IProperty, this.activeUser as IUser)
        .subscribe((res) => {});
  }
}
