import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { ViewqComponent } from './viewq/viewq.component';
import { ReviewqComponent} from './reviewq/reviewq.component';
import { ReviewoComponent } from './reviewo/reviewo.component';
import { ReviewsComponent} from './reviews/reviews.component';
import {ReviewEssayComponent} from './review-essay/review-essay.component'

const routes: Routes = [
	{
		path: '', children: [
			{ path: 'view_questions', component: ViewqComponent },
			{ path: 'review_question', component: ReviewqComponent },
			{ path: 'review_subjective', component: ReviewsComponent },
			{ path: 'review_objective', component: ReviewoComponent },
			{ path: 'review_essay', component: ReviewEssayComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionbankRoutingModule { }
