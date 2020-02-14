import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import {
	MatTooltipModule, MatMenuModule, MatCheckboxModule,
	MatSidenavModule, MatSlideToggleModule,
	MatExpansionModule, MatSelectModule,
	MatInputModule, MatFormFieldModule,
	MatButtonModule, MatIconModule, MatToolbarModule, MatPaginatorModule,
	MatCardModule, MatListModule,
	MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatAutocompleteModule, MatSortModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { TransactionModalComponent } from './transaction-modal/transaction-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import * as _moment from 'moment';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { CapitalizePipe, DateformatPipe, TruncatetextPipe } from '../_pipes';
import { SafePipe } from '../_pipes/safe.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditRequestModalComponent } from './edit-request-modal/edit-request-modal.component';
import { InvoiceDetailsModalComponent } from '../feemaster/invoice-details-modal/invoice-details-modal.component';
import { NumberToWordPipe } from '../_pipes/number-to-word.pipe';
import { ZerodashPipe } from '../_pipes/zerodash.pipe';
import { IndianCurrency } from '../_pipes/ indianCurrency.pipe';
import { ReceiptDetailsModalComponent } from './receipt-details-modal/receipt-details-modal.component';
import { InvictusSharedModule } from 'src/app/invictus-shared/invictus-shared.module';
import { SearchViaStudentComponent } from './search-via-student/search-via-student.component';
import { DeleteWithReasonComponent } from './delete-with-reason/delete-with-reason.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { FeeCommunicationModalComponent } from './fee-communication-modal/fee-communication-modal.component';
declare var CKEDITOR: any;
const moment = _moment;

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
		RouterModule,
		MatAutocompleteModule,
		MatSortModule,
		MatRadioModule,
		ImageViewerModule,
		CKEditorModule,
		ImageCropperModule,
		NgxBarcodeModule,
		NgxDocViewerModule,
		NgxMaskModule.forRoot(),
		DragDropModule,
		InvictusSharedModule
	],
	declarations: [
		CommonDynamicChartComponent,
		DeleteModalComponent,
		TransactionModalComponent,
		ImagecropComponent,
		EditRequestModalComponent,
		CapitalizePipe,
		DateformatPipe,
		IndianCurrency,
		SafePipe,
		ImageViewerComponent,
		InvoiceDetailsModalComponent,
		NumberToWordPipe,
		ZerodashPipe,
		ReceiptDetailsModalComponent,
		SearchViaStudentComponent,
		DeleteWithReasonComponent,
		CreateInvoiceModalComponent,
		SearchDialogComponent,
		TruncatetextPipe,
		FeeCommunicationModalComponent
	],
	exports: [FormsModule, ReactiveFormsModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatFormFieldModule,
		MatRadioModule,
		MatInputModule,
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
		ImageViewerModule,
		NgxBarcodeModule,
		CKEditorModule,
		MatSortModule,
		NgxDocViewerModule,
		RouterModule, DeleteModalComponent, ImagecropComponent,
		NgxMaskModule, CapitalizePipe, DateformatPipe, SafePipe, ImageViewerComponent,
		DragDropModule,
		EditRequestModalComponent,
		InvoiceDetailsModalComponent,
		NumberToWordPipe,
		ZerodashPipe,
		ReceiptDetailsModalComponent,
		CommonDynamicChartComponent,
		DeleteWithReasonComponent,
		CreateInvoiceModalComponent,
		SearchDialogComponent,
		IndianCurrency,
		TruncatetextPipe,
		TransactionModalComponent,
		FeeCommunicationModalComponent
	],
	entryComponents: [
		DeleteModalComponent,
		TransactionModalComponent,
		ImagecropComponent,
		ImageViewerComponent,
		EditRequestModalComponent,
		InvoiceDetailsModalComponent,
		ReceiptDetailsModalComponent,
		SearchViaStudentComponent,
		DeleteWithReasonComponent,
		CreateInvoiceModalComponent,
		SearchDialogComponent,
		FeeCommunicationModalComponent
	],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})
export class SharedmoduleModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '8')) {
			CKEDITOR.type = '8';
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
