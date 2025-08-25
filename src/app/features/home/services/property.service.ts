import { Injectable, signal } from '@angular/core';
import { db } from '../../../db/app.db';
import {
  IAmenities,
  IProperty,
  IPropertyFilter,
  LeaseType,
  PriceMode,
  PropertyType,
} from '../interface';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  constructor() {
    this.getEnumData();
  }
  priceModeArr: Array<{
    label: string;
    value: PriceMode;
  }> = [];

  leaseType: Array<{
    label: string;
    value: LeaseType;
  }> = [];

  propertyTypes: Array<{ label: string; value: PropertyType }> = [];

  getAll(
    search: string = '',
    sort: 'asc' | 'desc' = 'asc',
    filter: IPropertyFilter = {}
  ) {
    const pattern = new RegExp(search, 'i'); // Case-insensitive regex

    let collection = db.properties.toCollection();
    collection = collection.filter((property) => {
      if (search && !pattern.test(property.title)) {
        return false;
      }

      for (const key in filter || {}) {
        const filterValue = filter[key as keyof typeof filter];
        console.log(filterValue, 'filterValue')
        // Skip undefined/null filters
        if (filterValue != null) {
          const propertyValue = property[key as keyof typeof filter];
          if (propertyValue !== filterValue) {
            return false;
          }
        }
      }

      return true;

      // for (const key in filter) {
      //   console.log(key, filter,  '>>>')
      //   if (filter[key as keyof typeof filter] !== undefined) {
      //     console.log(property[key as keyof typeof filter], filter[key as keyof typeof filter])
      //     if (
      //       property[key as keyof typeof filter] !==
      //       filter[key as keyof typeof filter]
      //     ) {
      //       return false;
      //     }
      //   }
      // }
      // return true;
    });

    if (sort === 'asc') {
      return collection.sortBy('expectedRent');
    } else {
      return collection.sortBy('expectedRent').then((arr) => arr.reverse());
    }
  }

  getById(id: number) {
    return db.properties.get(id);
  }

  add(property: IProperty) {
    return db.properties.add(property);
  }

  update(id: number, changes: Partial<IProperty>) {
    return db.properties.update(id, changes);
  }

  put(property: IProperty) {
    return db.properties.put(property);
  }

  delete(id: number) {
    return db.properties.delete(id);
  }

  async getByOwner(ownerId: number) {
    return db.properties.where('ownerId').equals(ownerId).toArray();
  }

  getAmenities() {
    return db.amenities.toArray();
  }

  async getAmenitiesMap() {
    const amenityMap = new Map<number, IAmenities>(
      (await this.getAmenities()).map((a) => [a.id, a])
    );
    return amenityMap;
  }

  getEnumData() {
    //get price mode
    this.priceModeArr = Object.keys(PriceMode)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PriceMode[key as keyof typeof PriceMode],
      }));
    //get lease type
    this.leaseType = Object.keys(LeaseType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: LeaseType[key as keyof typeof LeaseType],
      }));

    //get property types
    this.propertyTypes = Object.keys(PropertyType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PropertyType[key as keyof typeof PropertyType],
      }));
  }
}
