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

@Component({
  selector: 'app-property-details',
  imports: [NgbCarouselModule, CommonModule, CommentSectionComponent, ButtonComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit {
  property?: IProperty;
  activeUser: IUser | null = null;
  // Assuming you have enums or mappings like this somewhere
  propertyTypeEnum = PropertyType;
  leaseTypeEnum = LeaseType;
  priceModeEnum = PriceMode;

  private propertyService = inject(PropertyService);
  private activatedRoute = inject(ActivatedRoute);
  private userQueryService = inject(UserQueryService);
  private authService = inject(AuthService);

  constructor() {
    effect(async () => {
      this.activeUser = this.authService.currentUser();
      console.log(this.activeUser)
    });
  }
  ngOnInit(): void {
    console.log('iniy');
    if (this.activatedRoute.snapshot.params['id']) {
      this.getPropertyDetails(
        Number(this.activatedRoute.snapshot.params['id'])
      );
      // Load property by route param or fallback logic here
    }
  }

  private async getPropertyDetails(propertyId: number) {
    console.log(propertyId, '>>>>>>>>>>>>>>>..');
    const property = await this.propertyService.getById(propertyId);
    console.log(property, '>>>>>>>>>>>....');
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

    // this.sendEnquiryClick.emit(this.property);
    // const modalRef = this.modalService.open(SendEnquiryComponent, {
    //   centered: true,
    //   backdrop: 'static',
    // });
    // modalRef.componentInstance.property = property;
    // modalRef.componentInstance.activeUser = this.activeUser;
    // modalRef.componentInstance.submitUserQuery.subscribe(
    //   async (res: IUserQuery) => {
    //     await this.userQueryService.adduserQuery(res);
    //     this.alertService.success('Query submitted successfully');
    //     modalRef.close();
    //   }
    // );
  }

  openUserQueryModal() {
    this.userQueryService
        .sendEnquiryModal(this.property as IProperty, this.activeUser as IUser)
        .subscribe((res) => {});
  }
}
