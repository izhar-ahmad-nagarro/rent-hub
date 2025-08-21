import { Injectable } from '@angular/core';
import { db } from '../../../db/app.db';
import { IUserFavourite } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class UserFavoritesService {
  getUserFavorites(userId: number) {
    return db.userFavourites.where('userId').equals(userId).toArray();
  }

  async updateUserFavorite(isFavorite: boolean, favorite: IUserFavourite) {
    const match = await db.userFavourites
        .where({ userId: favorite.userId, propertyId: favorite.propertyId })
        .first();

    if (!isFavorite) {
      if (match?.id) {
        return  db.userFavourites.delete(match.id);
      }
    }else{
      if(!match){
        return db.userFavourites.add(favorite);
      }
    }
  }
}
