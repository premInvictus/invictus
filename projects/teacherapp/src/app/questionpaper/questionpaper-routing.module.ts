import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionPaperListComponent } from './question-paper-list/question-paper-list.component';
import { QuesPaperReviewComponent } from './ques-paper-review/ques-paper-review.component';
import { TeacherCopyComponent } from './teacher-copy/teacher-copy.component';

const routes: Routes = [
	{ path: 'question_paper_list', component: QuestionPaperListComponent },
	{ path: 'teacher_copy/:id', component: TeacherCopyComponent },
	{ path: 'question_paper_review', component: QuesPaperReviewComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionpaperRoutingModule { }
