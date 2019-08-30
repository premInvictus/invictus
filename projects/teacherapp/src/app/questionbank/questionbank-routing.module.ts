import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { ViewqComponent } from './viewq/viewq.component';

const routes: Routes = [
	{
		path: '', children: [
			{ path: 'view_questions', component: ViewqComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionbankRoutingModule { }
