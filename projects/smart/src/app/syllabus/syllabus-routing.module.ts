import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';
import { ReviewSyllabusComponent } from './review-syllabus/review-syllabus.component';
import { BrowseSyllabusComponent } from './browse-syllabus/browse-syllabus.component';
import { SyllabusManagementComponent } from './syllabus-management/syllabus-management.component';
const routes: Routes = [
	{
		path: 'add', component: AddSyllabusComponent,
	},
	{
		path: 'review', component: ReviewSyllabusComponent
	},
	{
		path: 'browse', component: BrowseSyllabusComponent
	},
	{
		path: 'management', component: SyllabusManagementComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SyllabusRoutingModule { }
