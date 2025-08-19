import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProperty } from '../interface/property.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeAPIService {
  private readonly http = inject(HttpClient);

  getAmenities() {
    const amenitiesUrl = 'assets/data/amenities.json';
    return this.http.get<Array<string>>(amenitiesUrl);
  }
  getProperties(
    search: string = '',
    sort: 'asc' | 'desc' = 'asc'
  ): Observable<IProperty[]> {
    const propertiesUrl = 'assets/data/properties.json';
    return this.http.get<IProperty[]>(propertiesUrl).pipe(
      map((properties: IProperty[]) => {
        if (search) {
          const term = search.toLowerCase();
          properties = properties.filter(
            (p) =>
              p.title.toLowerCase().includes(term) 
          );
        }

        properties = properties.sort((a, b) => {
          return sort === 'asc'
            ? a.expectedRent - b.expectedRent
            : b.expectedRent - a.expectedRent;
        });

        return properties;
      })
    );
  }

  addProperties(payload: IProperty) {
    const properties = this.getPropertiesFromStorage();
    properties.push(payload);
    this.setPropertiesInStorage(properties);
  }

  private getPropertiesFromStorage() {
    const storageKey = 'properties';
    return JSON.parse(localStorage.getItem(storageKey) || '[]')
  }
  private setPropertiesInStorage(properties: IProperty[]) {
    const storageKey = 'properties';
    localStorage.setItem(storageKey, JSON.stringify(properties));
  }
}
