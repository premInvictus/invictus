import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BulkuploadComponent } from './bulkupload/bulkupload.component';
import { IndividualentryComponent } from './individualentry/individualentry.component';
import { MatrixComponent } from './qtype/matrix/matrix.component';
import { McqComponent } from './qtype/mcq/mcq.component';
import { McqmrComponent } from './qtype/mcqmr/mcqmr.component';
import { MtfComponent } from './qtype/mtf/mtf.component';
import { TfComponent } from './qtype/tf/tf.component';
import { FillintheblanksComponent } from './qtype/fillintheblanks/fillintheblanks.component';
import { IdentifyComponent } from './qtype/identify/identify.component';
import { LonganswerComponent } from './qtype/longanswer/longanswer.component';
import { VerylonganswerComponent } from './qtype/verylonganswer/verylonganswer.component';
import { VeryshortanswerComponent } from './qtype/veryshortanswer/veryshortanswer.component';
import { ShortanswerComponent } from './qtype/shortanswer/shortanswer.component';
import { OnelineComponent } from './qtype/oneline/oneline.component';
import { Matrix4X5Component } from './qtype/matrix4-x5/matrix4-x5.component';
import { SingleintegerComponent } from './qtype/singleinteger/singleinteger.component';
import { DoubleintegerComponent } from './qtype/doubleinteger/doubleinteger.component';
import { EssayDialogsComponent } from '../questionbank/essay-dialogs/essay-dialogs.component';
import { QuestionRoutingModule } from './question-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
declare var CKEDITOR: any;
@NgModule({
	imports: [
		CommonModule,
		QuestionRoutingModule,
		CKEditorModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModuleModule
	],
	entryComponents: [
		IndividualentryComponent,
		EssayDialogsComponent
	],
	declarations: [
		BulkuploadComponent,
		IndividualentryComponent,
		MatrixComponent,
		McqComponent,
		McqmrComponent,
		MtfComponent,
		TfComponent,
		FillintheblanksComponent,
		IdentifyComponent,
		LonganswerComponent,
		VerylonganswerComponent,
		VeryshortanswerComponent,
		ShortanswerComponent,
		OnelineComponent,
		Matrix4X5Component,
		SingleintegerComponent,
		DoubleintegerComponent
	]
})
export class QuestionModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '1')) {
			CKEDITOR.type = '1';
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
