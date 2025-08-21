import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProperty } from '../interface/property.interface';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeAPIService {
  private readonly http = inject(HttpClient);

  getAmenities() {
    const amenitiesUrl = 'assets/data/amenities.json';
    return this.http.get<Array<string>>(amenitiesUrl);
  }

  getuserFavorites(): Map<number, number> {
    const storageKey = 'favorite';
    return this.loadMap(storageKey)
  }

  getProperties(
    search: string = '',
    sort: 'asc' | 'desc' = 'asc'
  ): Observable<IProperty[]> {
    const propertiesFromStorage = this.getPropertiesFromStorage();
    console.log(propertiesFromStorage);
    const propertiesUrl = 'assets/data/properties.json';
    return this.http.get<IProperty[]>(propertiesUrl).pipe(
      map((properties: IProperty[]) => {
        let mergedProperties = [...properties, ...propertiesFromStorage];
        if (search) {
          const term = search.toLowerCase();
          mergedProperties = mergedProperties.filter((p) =>
            p.title.toLowerCase().includes(term)
          );
        }

        mergedProperties = mergedProperties.sort((a, b) => {
          return sort === 'asc'
            ? a.expectedRent - b.expectedRent
            : b.expectedRent - a.expectedRent;
        });

        return mergedProperties;
      })
    );
  }

  addProperties(payload: IProperty) {
    const properties = this.getPropertiesFromStorage();
    // Auto-increment ID
    const lastId = properties.length
      ? Math.max(...properties.map((p: IProperty) => p.id || 0))
      : 0;
    const newProperty = { ...payload, id: lastId + 1 };
    properties.push(newProperty);
    this.setPropertiesInStorage(properties);
  }

  addUserFavorite(payload: IProperty) {
    const storageKey = 'favorite';
    let favorite = this.loadMap(storageKey);
    if (payload.isFavorited) {
      favorite.set(payload.id, payload.id);
    } else {
      favorite.delete(payload.id);
    }
    this.saveMap(storageKey, favorite);
  }

  private getPropertiesFromStorage() {
    const storageKey = 'properties';
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }
  private setPropertiesInStorage(properties: IProperty[]) {
    const storageKey = 'properties';
    localStorage.setItem(storageKey, JSON.stringify(properties));
  }

  saveMap(storageKey: string, map: Map<number, number>) {
    const mapString = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(storageKey, mapString);
  }

  loadMap(storageKey: string){
    const mapString = localStorage.getItem(storageKey);
    if (!mapString) return new Map();
    return new Map(JSON.parse(mapString));
  }
}
