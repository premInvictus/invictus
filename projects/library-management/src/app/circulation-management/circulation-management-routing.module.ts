import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IssueReturnComponent} from './issue-return/issue-return.component';
import { BookReservationComponent } from './book-reservation/book-reservation.component';
import { ChangeBookStatusComponent } from './change-book-status/change-book-status.component';
import { IssueToClassLibraryComponent } from './issue-to-class-library/issue-to-class-library.component';
import { BookDetailComponent } from '../library-shared/book-detail/book-detail.component';
const routes: Routes = [
  {path: 'issue-return', component: IssueReturnComponent},
  {path: 'book-reservation', component: BookReservationComponent},
  {path: 'change-book-status', component: ChangeBookStatusComponent},
  {path: 'issue-to-library', component: IssueToClassLibraryComponent},
  {path: 'book-detail', component: BookDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CirculationManagementRoutingModule { }
