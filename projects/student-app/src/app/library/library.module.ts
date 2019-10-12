import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './library-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookSearchComponent } from 'projects/student-app/src/app/library/book-search/book-search.component';
import { BookLogsComponent } from './book-logs/book-logs.component';

@NgModule({
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SharedModuleModule,
		ReactiveFormsModule,
		FormsModule,
  ],
  declarations: [BookSearchComponent, BookLogsComponent]
})
export class LibraryModule { }
