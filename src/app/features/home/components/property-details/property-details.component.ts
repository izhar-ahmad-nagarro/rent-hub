import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { IProperty, LeaseType, PriceMode, PropertyType } from '../../interface';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../..';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-property-details',
  imports: [NgbCarouselModule, CommonModule, CommentSectionComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent implements OnInit {
  property?: IProperty;;

  // Assuming you have enums or mappings like this somewhere
  propertyTypeEnum = PropertyType;
  leaseTypeEnum = LeaseType;
  priceModeEnum = PriceMode;

  private propertyService = inject(PropertyService);
  private activatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    console.log('iniy')
    if (this.activatedRoute.snapshot.params['id']) {
        this.getPropertyDetails(Number(this.activatedRoute.snapshot.params['id']));
      // Load property by route param or fallback logic here
    }
  }

  sendEnquiry() {
    // Implement enquiry popup/modal or routing to contact form
  }

  private async getPropertyDetails(propertyId: number) {
    console.log(propertyId, '>>>>>>>>>>>>>>>..')
    const property = await this.propertyService.getById(propertyId);
    console.log(property, '>>>>>>>>>>>....')
    if(property){
      this.property = property;
    }
  }

}
