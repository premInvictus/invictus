import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassworkUpdateComponent } from '../logentry/classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent } from '../logentry/topicwise-update/topicwise-update.component';
const routes: Routes = [
	{
		path: 'classwork-update', component: ClassworkUpdateComponent,
	},
	{
		path: 'topicwise-update', component: TopicwiseUpdateComponent,
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LogentryRoutingModule { }
