import { inject, Injectable } from '@angular/core';
import { db } from '../../../db/app.db';
import { IProperty, IUser, IUserQuery } from '../interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendEnquiryComponent } from '../components';
import { map, Observable } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserQueryService {
  private modalService = inject(NgbModal);
  private alertService = inject(AlertService);
  adduserQuery(payload: IUserQuery){
    return db.userQueries.add(payload);
  }

  getUserQueryByUserId(userId: number){
    // return db.userQueries.
  }

  sendEnquiryModal(property: IProperty, user:IUser): Observable<unknown> {
    const modalRef = this.modalService.open(SendEnquiryComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.property = property;
    modalRef.componentInstance.activeUser = user;
    return modalRef.componentInstance.submitUserQuery.pipe(map(
      async (res: IUserQuery) => {
        await this.adduserQuery(res);
        this.alertService.success('Query submitted successfully');
        modalRef.close();
      }
    ));
  }
}
