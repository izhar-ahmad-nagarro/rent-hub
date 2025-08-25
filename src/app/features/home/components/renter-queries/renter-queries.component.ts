import { Component, inject, Input, OnInit } from '@angular/core';
import { IUserQuery } from '../../interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserQueryService } from '../../services/user-query.service';

@Component({
  selector: 'app-renter-queries',
  imports: [CommonModule, FormsModule],
  templateUrl: './renter-queries.component.html',
  styleUrl: './renter-queries.component.scss'
})
export class RenterQueriesComponent implements OnInit {
  queries: IUserQuery[] = [];
  @Input() propertyId : number | undefined;
  @Input() currentUserId: number | undefined;
  private userQueriesService = inject(UserQueryService);
  ngOnInit() {
    this.loadQueriesForRenter();
  }

  async loadQueriesForRenter() {
    if(this.currentUserId && this.propertyId){
     this.queries =  await this.userQueriesService.getUserQueryByUserId(this.currentUserId , this.propertyId)
    }
  }
}