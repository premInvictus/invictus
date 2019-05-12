import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExternalreviewquestionComponent } from './externalreviewquestion/externalreviewquestion.component';
import { ExternalreviewobjectiveComponent } from './externalreviewobjective/externalreviewobjective.component';
import { ExternalreviewsubjectiveComponent } from './externalreviewsubjective/externalreviewsubjective.component';
import { ExternalreviewessayComponent } from './externalreviewessay/externalreviewessay.component';
import { EditSubjectiveDialogExternal } from './externalreviewsubjective/externalreviewsubjective.component';
import { SecondaryReviewQuestionComponent } from './secondary-review-question/secondary-review-question.component';
import { SecondaryReviewObjectiveComponent } from './secondary-review-objective/secondary-review-objective.component';
import { SecondaryReviewSubjectiveComponent } from './secondary-review-subjective/secondary-review-subjective.component';
import { SecondaryReviewEssayComponent } from './secondary-review-essay/secondary-review-essay.component';
import { EditSubjectiveDialogSecondary } from './secondary-review-subjective/secondary-review-subjective.component';
import { EssayDialogsComponent } from '../questionbank/essay-dialogs/essay-dialogs.component';
import { SecondaryreviewRoutingModule } from './secondaryreview-routing.module';
import { EditobjectiveComponent } from '../questionbank/reviewo/editobjective/editobjective.component';
import { EditEssayComponent } from '../questionbank/review-essay/edit-essay/edit-essay.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
declare var CKEDITOR: any;
@NgModule({
	imports: [
		CommonModule,
		SecondaryreviewRoutingModule,
		CKEditorModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModuleModule
	],
	entryComponents: [
		EditSubjectiveDialogSecondary,
		EditSubjectiveDialogExternal,
		EssayDialogsComponent,
		EditobjectiveComponent,
		EditEssayComponent
	],
	declarations: [
		EditSubjectiveDialogSecondary,
		SecondaryReviewQuestionComponent,
		SecondaryReviewObjectiveComponent,
		SecondaryReviewSubjectiveComponent,
		SecondaryReviewEssayComponent,
		ExternalreviewquestionComponent,
		ExternalreviewobjectiveComponent,
		ExternalreviewsubjectiveComponent,
		ExternalreviewessayComponent,
		EditSubjectiveDialogExternal
	]
})
export class SecondaryreviewModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '2')) {
			CKEDITOR.type = '2';
			script.type = 'text/javascript';
			script[('innerHTML')] = CKEDITOR.plugins.addExternal('html5audio', '/assets/js/html5audio/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('html5video', '/assets/js/html5video/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('pramukhime', '/assets/js/pramukhime/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('pastefromword', '/assets/js/pastefromword/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('clipboard', '/assets/js/clipboard/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('uploadfile', '/assets/js/uploadfile/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('uploadimage', '/assets/js/uploadimage/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('uploadwidget', '/assets/js/uploadwidget/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('filetools', '/assets/js/filetools/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('notificationaggregator', '/assets/js/notificationaggregator/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('notification', '/assets/js/notification/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('simpleImageUpload', '/assets/js/simpleImageUpload/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('simpleVideoUpload', '/assets/js/simpleVideoUpload/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('simpleAudioUpload', '/assets/js/simpleAudioUpload/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('keystrokes', '/assets/js/keystrokes/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('eqneditor', '/assets/js/eqneditor/', 'plugin.js') +
				CKEDITOR.plugins.addExternal('videoembed', '/assets/js/videoembed/', 'plugin.js');
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	}
}
