import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookSearchComponent } from 'projects/teacherapp/src/app/teacher-library/book-search/book-search.component';
import { BookDetailComponent } from 'projects/teacherapp/src/app/shared-module/book-detail/book-detail.component';
import { BookLogsComponent } from 'projects/teacherapp/src/app/teacher-library/book-logs/book-logs.component';
import { IssueReturnComponent } from 'projects/teacherapp/src/app/teacher-library/issue-return/issue-return.component';
import { ViewAllDueComponent } from 'projects/teacherapp/src/app/teacher-library/view-all-due/view-all-due.component';
const routes: Routes = [
  {path: 'book-search', component: BookSearchComponent},
  {path: 'book-detail', component: BookDetailComponent},
  {path: 'book-logs', component: BookLogsComponent},
  {path: 'issue-return', component: IssueReturnComponent},
  {path: 'books-issued', component: ViewAllDueComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherLibraryRoutingModule { }
