import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ApartmentCard } from '../../../../shared';
import { HomeAPIService } from '../../services/home-api.service';
import { IProperty } from '../../interface/property.interface';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendEnquiryComponent } from '../send-enquiry/send-enquiry.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApartmentCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private homeService = inject(HomeAPIService);
  properties = signal<IProperty[]>([]);
  featuredProperties = signal<IProperty[]>([]);
  private readonly modalService = inject(NgbModal);
  private searchService = inject(SearchService);
  favorites : Map<number, number> = new Map();
  constructor() {
    this.favorites = this.homeService.getuserFavorites();
    console.log(this.favorites)
    effect(() => {
      const term = this.searchService.debouncedSearch().trim().toLowerCase();
      this.homeService.getProperties(term).subscribe((res) => {
        this.properties.set(res);
        this.featuredProperties.set(res.filter((p) => p.featured));
      });
    });
  }

  markAsFavorite(payload: IProperty) {
    payload.isFavorited = !payload.isFavorited;
    this.homeService.addUserFavorite(payload);
  }

  sendEnquiry(property: IProperty) {
    this.modalService.open(SendEnquiryComponent, {
      centered: true,
      backdrop: 'static'
    })
  }
}
