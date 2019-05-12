import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecondaryReviewQuestionComponent } from './secondary-review-question/secondary-review-question.component';
import { SecondaryReviewObjectiveComponent } from './secondary-review-objective/secondary-review-objective.component';
import { SecondaryReviewSubjectiveComponent } from './secondary-review-subjective/secondary-review-subjective.component';
import { SecondaryReviewEssayComponent } from './secondary-review-essay/secondary-review-essay.component';
import { ExternalreviewquestionComponent } from './externalreviewquestion/externalreviewquestion.component';
import { ExternalreviewobjectiveComponent } from './externalreviewobjective/externalreviewobjective.component';
import { ExternalreviewsubjectiveComponent } from './externalreviewsubjective/externalreviewsubjective.component';
import { ExternalreviewessayComponent } from './externalreviewessay/externalreviewessay.component';

const routes: Routes = [
	{ path: 'secondary-review-question', component: SecondaryReviewQuestionComponent },
	{ path: 'secondary-review-objective', component: SecondaryReviewObjectiveComponent },
	{ path: 'secondary-review-subjective', component: SecondaryReviewSubjectiveComponent },
	{ path: 'secondary-review-essay', component: SecondaryReviewEssayComponent },
	{ path: 'external_review_question', component: ExternalreviewquestionComponent },
	{ path: 'externalreviewobjective', component: ExternalreviewobjectiveComponent },
	{ path: 'externalreviewsubjective', component: ExternalreviewsubjectiveComponent },
	{ path: 'externalreviewessay', component: ExternalreviewessayComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SecondaryreviewRoutingModule { }
