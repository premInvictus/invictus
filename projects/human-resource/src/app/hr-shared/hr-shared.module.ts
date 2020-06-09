import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import {
	MatTooltipModule, MatMenuModule, MatCheckboxModule,
	MatSidenavModule, MatSlideToggleModule,
	MatExpansionModule, MatSelectModule,
	MatInputModule, MatFormFieldModule,
	MatButtonModule, MatIconModule, MatToolbarModule, MatPaginatorModule,
	MatCardModule, MatListModule, MatStepperModule,
	MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatAutocompleteModule, MatSortModule
} from '@angular/material';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { CapitalizePipe, DateformatPipe, NumberToWordPipe, ZerodashPipe, SafePipe, TruncatetextPipe, IndianCurrency } from '../_pipes';
import { NgxMaskModule } from 'ngx-mask';
import * as _moment from 'moment';
import { InvictusSharedModule } from '../../../../../src/app/invictus-shared/invictus-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditRequestModalComponent } from './edit-request-modal/edit-request-modal.component';
import { LayoutModule } from '@angular/cdk/layout';
declare var CKEDITOR: any;
import { AssignmentAttachmentDialogComponent } from './assignment-attachment-dialog/assignment-attachment-dialog.component';
import { PublishModalComponent } from './publish-modal/publish-modal.component';
import { NoDataComponent } from './no-data/no-data.component';
import { UnpublishModalComponent } from './unpublish-modal/unpublish-modal.component';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { AngularCalendarYearViewComponent } from './angular-calendar-year-view/angular-calendar-year-view.component';
import { AdvancedSearchModalComponent } from './advanced-search-modal/advanced-search-modal.component';
import { EmployeeCommonComponent } from './../employee-master/employee-common/employee-common.component';
import { ColorPickerModule } from 'ngx-color-picker';
const moment = _moment;
import { PopoverModule } from 'ngx-bootstrap/popover';
//import { EmployeeDetailsComponent } from '../employee-master/employee-details/employee-details.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { MessagesAdvancedSearchModalComponent } from './messages-advanced-search-modal/messages-advanced-search-modal.component';
import { SearchViaNameComponent } from './search-via-name/search-via-name.component';
import { ProcessdateModalComponent } from './processdate-modal/processdate-modal.component';

export const MY_FORMATS = {
	parse: {
		dateInput: 'L',
	},
	display: {
		dateInput: 'DD-MMM-YYYY',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};
@NgModule({
	imports: [
		CommonModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		MatIconModule,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		MatCardModule,
		MatExpansionModule,
		LayoutModule,
		MatTooltipModule,
		MatMenuModule,
		MatTabsModule,
		MatTableModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,
		MatDialogModule,
		MatPaginatorModule,
		MatStepperModule,
		RouterModule,
		MatAutocompleteModule,
		MatSortModule,
		MatRadioModule,
		ImageViewerModule,
		CKEditorModule,
		ImageCropperModule,
		NgxMaskModule.forRoot(),
		InvictusSharedModule,
		PopoverModule.forRoot(),
		NgxBarcodeModule,
		ColorPickerModule,
	],
	declarations: [
		CommonDynamicChartComponent,
		ProcessdateModalComponent,
		DeleteModalComponent,
		ImagecropComponent,
		EditRequestModalComponent,
		CapitalizePipe,
		TruncatetextPipe,
		DateformatPipe,
		SafePipe,
		ImageViewerComponent,
		NumberToWordPipe,
		ZerodashPipe,
		AssignmentAttachmentDialogComponent,
		PublishModalComponent,
		NoDataComponent,
		UnpublishModalComponent,
		PreviewDocumentComponent,
		AngularCalendarYearViewComponent,
		AdvancedSearchModalComponent,
		EmployeeCommonComponent,
		ComposeMessageComponent,
		MessagesAdvancedSearchModalComponent,
		IndianCurrency,
		SearchViaNameComponent,
		//EmployeeDetailsComponent
	],
	entryComponents: [
		DeleteModalComponent,
		ImagecropComponent,
		ImageViewerComponent,
		EditRequestModalComponent,
		AssignmentAttachmentDialogComponent,
		PublishModalComponent,
		UnpublishModalComponent,
		PreviewDocumentComponent,
		AdvancedSearchModalComponent,
		EmployeeCommonComponent,
		ComposeMessageComponent,
		ProcessdateModalComponent,
		MessagesAdvancedSearchModalComponent,
		SearchViaNameComponent
	],
	exports: [
		FormsModule, ReactiveFormsModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatFormFieldModule,
		MatRadioModule,
		MatInputModule,
		ProcessdateModalComponent,
		MatCheckboxModule,
		MatSelectModule,
		MatIconModule,
		MatSidenavModule,
		MatToolbarModule,
		MatAutocompleteModule,
		MatListModule,
		MatCardModule,
		MatExpansionModule,
		LayoutModule,
		MatTooltipModule,
		MatMenuModule,
		MatTabsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatDialogModule,
		MatTableModule,
		MatPaginatorModule,
		MatStepperModule,
		ImageViewerModule,
		CKEditorModule,
		MatSortModule,
		RouterModule, DeleteModalComponent, ImagecropComponent, PublishModalComponent, UnpublishModalComponent,
		NgxMaskModule, CapitalizePipe, TruncatetextPipe, DateformatPipe, SafePipe, ImageViewerComponent,
		EditRequestModalComponent,
		NumberToWordPipe,
		ZerodashPipe,
		CommonDynamicChartComponent,
		AssignmentAttachmentDialogComponent,
		NoDataComponent, PreviewDocumentComponent,
		AngularCalendarYearViewComponent,
		AdvancedSearchModalComponent,
		EmployeeCommonComponent,
		NgxBarcodeModule,
		ColorPickerModule,
		ComposeMessageComponent,
		MessagesAdvancedSearchModalComponent,
		CKEditorModule,
		IndianCurrency
		//EmployeeDetailsComponent
	],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})

export class HrSharedModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '10')) {
			CKEDITOR.type = '10';
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
			CKEDITOR.plugins.addExternal('strinsert', '/assets/js/strinsert/', 'plugin.js');
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	}
} 
