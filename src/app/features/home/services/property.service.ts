import { Injectable } from '@angular/core';
import { db } from '../../../db/app.db';
import { IAmenities, IProperty } from '../interface';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  getAll(
    search: string = '',
    sort: 'asc' | 'desc' = 'asc',
    filter: Partial<
      Pick<IProperty, 'type' | 'isFurnished' | 'location' | 'ownerId'>
    > = {}
  ) {
    const pattern = new RegExp(search, 'i'); // Case-insensitive regex

    let collection = db.properties.toCollection();
    collection = collection.filter((property) => {
      if (search && !pattern.test(property.title)) {
        return false;
      }

      for (const key in filter) {
        if (filter[key as keyof typeof filter] !== undefined) {
          if (
            property[key as keyof typeof filter] !==
            filter[key as keyof typeof filter]
          ) {
            return false;
          }
        }
      }
      return true;
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
}
