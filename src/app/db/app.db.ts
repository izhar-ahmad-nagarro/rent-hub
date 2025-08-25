// db/app.db.ts
import Dexie, { Table } from 'dexie';
import { IUser, IProperty, IComment, IUserQuery, IUserFavourite, IAmenities } from '../features';
import propertiesData from '../../assets/data/properties.json';
import usersData from '../../assets/data/users.json';
import amenitiesData from '../../assets/data/amenities.json';

export class AppDB extends Dexie {
  users!: Table<IUser, number>;
  properties!: Table<IProperty, number>;
  comments!: Table<IComment, number>;
  userQueries!: Table<IUserQuery, number>;
  userFavourites!: Table<IUserFavourite, number>;
  amenities!: Table <IAmenities, number>;

  constructor() {
    super('RentHubDB');
    this.version(1).stores({
      users: '++id, email, role',
      properties: '++id, title, ownerId, location, leaseType',
      comments: '++id, propertyId, userId, createdAt',
      userQueries: '++id, [userId+propertyId], propertyId, userId, createdAt',
      userFavourites: '++id, userId, propertyId',
      amenities: "++id"
    });

    this.on('populate', async () => {
      await this.seedInitialData();
    });
  }

   private async seedInitialData() {
    this.properties.bulkAdd(propertiesData);
    this.users.bulkAdd(usersData);
    this.amenities.bulkAdd(amenitiesData);
   }
}

export const db = new AppDB();
