import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {
  IAmenities,
  IProperty,
  IUser,
  LeaseType,
  PriceMode,
  PropertyType,
} from '../../interface';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../..';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { ButtonComponent } from '../../../../shared';
import { UserQueryService } from '../../services/user-query.service';
import { AuthService } from '../../../auth';
import { FormsModule } from '@angular/forms';
import { LandlordQueriesComponent } from '../landlord-queries/landlord-queries.component';
import { RenterQueriesComponent } from '../renter-queries/renter-queries.component';

@Component({
  selector: 'app-property-details',
  imports: [NgbCarouselModule, CommonModule, FormsModule, CommentSectionComponent, ButtonComponent,
    LandlordQueriesComponent, RenterQueriesComponent
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit {
  
  property?: IProperty;
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
      console.log(this.activeUser)
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
    console.log(property, 'propertypropertyproperty')
    if (property) {
      this.property = property;
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
        .sendEnquiryModal(this.property as IProperty, this.activeUser as IUser)
        .subscribe((res) => {});
  }
}
