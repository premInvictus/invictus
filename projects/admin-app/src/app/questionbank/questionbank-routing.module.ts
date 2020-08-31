import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { ReviewqComponent } from './reviewq/reviewq.component';
import { ViewqComponent } from './viewq/viewq.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewoComponent } from './reviewo/reviewo.component';
import { ReviewEssayComponent } from './review-essay/review-essay.component';
import { DbsyncComponent } from './dbsync/dbsync.component';
import { TopicwiseReportOverviewComponent } from './topicwise-report-overview/topicwise-report-overview.component';

const routes: Routes = [
	{
		path: '', children: [
			{ path: 'db_sync', component: DbsyncComponent },
			{ path: 'review_question', component: ReviewqComponent },
			{ path: 'view_questions', component: ViewqComponent },
			{ path: 'review_subjective', component: ReviewsComponent },
			{ path: 'review_objective', component: ReviewoComponent },
			{ path: 'review_essay', component: ReviewEssayComponent },
			{ path: 'topicwise-report-overview', component: TopicwiseReportOverviewComponent}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionbankRoutingModule { }
