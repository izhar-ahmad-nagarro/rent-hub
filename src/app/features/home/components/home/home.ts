import { Component, inject, OnInit } from '@angular/core';
import { ApartmentCard } from '../../../../shared';
import { HomeAPIService } from '../../services/home';
import { IProperty } from '../../../../shared/interface/property.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApartmentCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private homeService = inject(HomeAPIService);
  properties:IProperty[] = [];
  featuredProperties : IProperty[]  = [];
  ngOnInit(): void {
    this.homeService.getProperties().subscribe(res=> {
      this.properties = res;
      this.featuredProperties = this.properties.filter(p=> p.featured);
    })
  }
}
