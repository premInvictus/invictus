import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherLibraryRoutingModule } from './teacher-library-routing.module';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookSearchComponent } from 'projects/teacherapp/src/app/teacher-library/book-search/book-search.component';
import { BookLogsComponent } from 'projects/teacherapp/src/app/teacher-library/book-logs/book-logs.component';
import { IssueReturnComponent } from 'projects/teacherapp/src/app/teacher-library/issue-return/issue-return.component';
@NgModule({
  imports: [
    CommonModule,
    TeacherLibraryRoutingModule,
    SharedModule,
		ReactiveFormsModule,
		FormsModule,
  ],
  declarations: [BookSearchComponent, BookLogsComponent, IssueReturnComponent]
})
export class TeacherLibraryModule { }
