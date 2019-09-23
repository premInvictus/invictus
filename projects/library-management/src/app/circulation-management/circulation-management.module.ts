import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CirculationManagementRoutingModule } from './circulation-management-routing.module';
import { IssueReturnComponent } from './issue-return/issue-return.component';
import { BookReservationComponent } from './book-reservation/book-reservation.component';
import { ChangeBookStatusComponent } from './change-book-status/change-book-status.component';
import { IssueToClassLibraryComponent } from './issue-to-class-library/issue-to-class-library.component';
import { LibrarySharedModule } from '../library-shared/library-shared.module';

@NgModule({
  imports: [
    CommonModule,
    CirculationManagementRoutingModule,
    LibrarySharedModule
  ],
  declarations: [IssueReturnComponent, BookReservationComponent, ChangeBookStatusComponent, IssueToClassLibraryComponent]
})
export class CirculationManagementModule { }
