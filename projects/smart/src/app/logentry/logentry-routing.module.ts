import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassworkUpdateComponent } from '../logentry/classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent } from '../logentry/topicwise-update/topicwise-update.component';
import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { ClasswiseUpdateComponent } from './classwise-update/classwise-update.component';

const routes: Routes = [
	{
		path: 'classwork-update', component: ClassworkUpdateComponent,
	},
	{
		path: 'topicwise-update', component: TopicwiseUpdateComponent,
	},
	{
		path: 'view-classwork', component: ViewClassworkComponent,
	},
	{
		path: 'classwise-update', component: ClasswiseUpdateComponent,
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LogentryRoutingModule { }
