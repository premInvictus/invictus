import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionpaperRoutingModule } from './questionpaper-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { QuesPaperReviewComponent } from './ques-paper-review/ques-paper-review.component';
import { QuestionPaperListComponent } from './question-paper-list/question-paper-list.component';
import { TeacherCopyComponent } from './teacher-copy/teacher-copy.component';
import { QuesPaperReviewViewComponent } from './ques-paper-review/ques-paper-review-view/ques-paper-review-view.component';
import { AddInstructionComponent } from '../shared-module/add-instruction/add-instruction.component';

@NgModule({
	imports: [
		CommonModule,
		QuestionpaperRoutingModule,
		SharedModuleModule,
		ReactiveFormsModule,
		FormsModule,
		ModalModule.forRoot(),
	],
	entryComponents: [
		QuesPaperReviewViewComponent,
		QuesPaperReviewComponent,
		AddInstructionComponent
	],
	declarations: [
		QuesPaperReviewComponent,
		QuestionPaperListComponent,
		TeacherCopyComponent,
		QuesPaperReviewViewComponent,
	]
})
export class QuestionpaperModule { }
