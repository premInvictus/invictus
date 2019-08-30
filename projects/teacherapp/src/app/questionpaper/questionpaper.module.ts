import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionpaperRoutingModule } from './questionpaper-routing.module';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { QuestionPaperListComponent } from './question-paper-list/question-paper-list.component';
import { TeacherCopyComponent } from './teacher-copy/teacher-copy.component';
@NgModule({
	imports: [
		CommonModule,
		QuestionpaperRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		ModalModule.forRoot(),
	],
	declarations: [
		QuestionPaperListComponent,
		TeacherCopyComponent,
	]
})
export class QuestionpaperModule { }
