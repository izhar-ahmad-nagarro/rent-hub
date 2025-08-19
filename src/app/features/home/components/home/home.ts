import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ApartmentCard } from '../../../../shared';
import { HomeAPIService } from '../../services/home';
import { IProperty } from '../../interface/property.interface';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApartmentCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private homeService = inject(HomeAPIService);
  properties = signal<IProperty[]>([]);
  featuredProperties = signal<IProperty[]>([]);

  private searchService = inject(SearchService);

  constructor() {
    effect(() => {
       const term = this.searchService.debouncedSearch().trim().toLowerCase();
      this.homeService.getProperties(term).subscribe((res) => {
        this.properties.set(res);
        this.featuredProperties.set(res.filter((p) => p.featured));
      });
    });
    
  }
}
