import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from '../_guards/index';
import { QuestionbankRoutingModule } from './questionbank-routing.module';
import { QbankService } from './service/qbank.service';
import { QelementService } from './service/qelement.service';
import { ReviewqComponent } from './reviewq/reviewq.component';
import { ViewqComponent } from './viewq/viewq.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewoComponent } from './reviewo/reviewo.component';
import { PrintDirective } from './printdirective/print.directive';
import { CKEditorModule } from 'ng2-ckeditor';
import { ModalModule } from 'ngx-bootstrap';
import { GaugeModule } from 'angular-gauge';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from 'ngx-loading';
import { NgxGaugeModule } from 'ngx-gauge';
import { TooltipModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { TagInputModule } from 'ngx-chips';
import { TimepickerModule } from 'ngx-bootstrap';
import { EditorModule } from 'primeng/editor';
import { KatexModule } from 'ng-katex';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { EditSubjectiveDialog } from './reviews/reviews.component';
import { EssayDialogsComponent } from './essay-dialogs/essay-dialogs.component';
import { EditobjectiveComponent } from './reviewo/editobjective/editobjective.component';
import { QuestionPaperDialogComponent } from './question-paper-dialog/question-paper-dialog.component';
import { ReviewEssayComponent } from './review-essay/review-essay.component';
import { EditEssayComponent } from './review-essay/edit-essay/edit-essay.component';
import { DbsyncComponent } from './dbsync/dbsync.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { TopicwiseReportOverviewComponent } from './topicwise-report-overview/topicwise-report-overview.component';
declare var CKEDITOR: any;
@NgModule({
	imports: [
		CommonModule,
		QuestionbankRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		CKEditorModule,
		GaugeModule.forRoot(),
		LoadingModule,
		NgxGaugeModule,
		TooltipModule.forRoot(),
		TabsModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
		ChartsModule,
		ModalModule.forRoot(),
		TagInputModule,
		TimepickerModule.forRoot(),
		KatexModule,
		EditorModule,
		SharedModuleModule
	],

	// tslint:disable-next-line:max-line-length
	entryComponents: [EditSubjectiveDialog, ReviewsComponent, EditobjectiveComponent, ReviewoComponent, EssayDialogsComponent, QuestionPaperDialogComponent, EditEssayComponent],

	// tslint:disable-next-line:max-line-length
	declarations: [ReviewqComponent, ViewqComponent, ReviewsComponent, ReviewoComponent, PrintDirective, EditSubjectiveDialog, ReviewEssayComponent, DbsyncComponent, TopicwiseReportOverviewComponent],

	// tslint:disable-next-line:max-line-length
	providers: [QbankService, QelementService, AuthGuard, NotificationsService, { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }]
})
export class QuestionbankModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '3')) {
			CKEDITOR.type = '3';
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

