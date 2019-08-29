import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionPaperListComponent } from './question-paper-list/question-paper-list.component';
import { TeacherCopyComponent } from './teacher-copy/teacher-copy.component';

const routes: Routes = [
	{ path: 'question_paper_list', component: QuestionPaperListComponent },
	{ path: 'teacher_copy/:id', component: TeacherCopyComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionpaperRoutingModule { }
