import { Injectable } from '@angular/core';
import { db } from '../../../db/app.db';
import { IUserQuery } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class UserQueryService {
  adduserQuery(payload: IUserQuery){
    return db.userQueries.add(payload);
  }

  getUserQueryByUserId(userId: number){
    // return db.userQueries.
  }
}
