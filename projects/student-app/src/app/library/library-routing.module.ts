import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookSearchComponent } from 'projects/student-app/src/app/library/book-search/book-search.component';
import { BookDetailComponent } from 'projects/student-app/src/app/shared-module/book-detail/book-detail.component';
import { BookLogsComponent } from 'projects/student-app/src/app/library/book-logs/book-logs.component';

const routes: Routes = [
  {path: 'book-search', component: BookSearchComponent},
  {path: 'book-detail', component: BookDetailComponent},
  {path: 'book-logs', component: BookLogsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
