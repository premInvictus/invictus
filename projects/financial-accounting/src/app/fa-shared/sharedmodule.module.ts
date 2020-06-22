import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import {
	MatChipsModule,
	MatTooltipModule, MatMenuModule, MatCheckboxModule,
	MatSidenavModule, MatSlideToggleModule,
	MatExpansionModule, MatSelectModule,
	MatInputModule, MatFormFieldModule,
	MatButtonModule, MatIconModule, MatToolbarModule, MatPaginatorModule,
	MatCardModule, MatListModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatAutocompleteModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { EditRequestModalComponent } from './edit-request-modal/edit-request-modal.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import * as _moment from 'moment';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { CapitalizePipe, TruncatetextPipe } from '../_pipes';
import { SafePipe } from '../_pipes/safe.pipe';
import { InvictusSharedModule } from 'src/app/invictus-shared/invictus-shared.module';
import { SearchViaNameComponent } from './search-via-name/search-via-name.component';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { ChartOfAccountsCreateComponent } from './chart-of-accounts-create/chart-of-accounts-create.component';
import { LedgerEntryModelComponent } from './ledger-entry-model/ledger-entry-model.component';
import { IndianCurrency } from '../_pipes/ indianCurrency.pipe';
import { TrialBalanceModalComponent } from './trial-balance-modal/trial-balance-modal.component';
import { IncomeAndExpenditureModalComponent } from './income-and-expenditure-model/income-and-expenditure-model.component';
import { NoDataComponent } from './no-data/no-data.component';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { VoucherModalComponent } from './voucher-modal/voucher-modal.component';
import { BalanceSheetModalComponent} from './balance-sheet-modal/balance-sheet-modal.component';
import { VoucherRefModalComponent } from './voucher-ref-modal/voucher-ref-modal.component';
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
		ImageViewerModule,
		CKEditorModule,
		ImageCropperModule,
		NgxBarcodeModule,
		NgxDocViewerModule,
		NgxMaskModule.forRoot(),
		InvictusSharedModule,
		MatChipsModule
	],
	declarations: [CommonDynamicChartComponent,
		TruncatetextPipe,
		DeleteModalComponent,
		ImagecropComponent,
		EditRequestModalComponent,
		CapitalizePipe, SafePipe, 
		ImageViewerComponent, 
		SearchViaNameComponent,
		PreviewDocumentComponent,
		ChartOfAccountsCreateComponent,
		IndianCurrency,
		LedgerEntryModelComponent,
		TrialBalanceModalComponent,
		NoDataComponent,
		VoucherModalComponent,
		IncomeAndExpenditureModalComponent,
		BalanceSheetModalComponent,
		VoucherRefModalComponent

	],
	exports: [FormsModule, ReactiveFormsModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatFormFieldModule,
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
		NgxDocViewerModule,
		RouterModule, 
		DeleteModalComponent,
		ImagecropComponent,
		EditRequestModalComponent,
		NgxMaskModule,  CommonDynamicChartComponent,
		CapitalizePipe, SafePipe, ImageViewerComponent,
		TruncatetextPipe,
		MatChipsModule,
		PreviewDocumentComponent,
		ChartOfAccountsCreateComponent,
		IndianCurrency,
		LedgerEntryModelComponent,
		TrialBalanceModalComponent,
		NoDataComponent,
		VoucherModalComponent,
		IncomeAndExpenditureModalComponent,
		BalanceSheetModalComponent,
		VoucherRefModalComponent

	],
	entryComponents: [ DeleteModalComponent, ImagecropComponent, EditRequestModalComponent,
		ImageViewerComponent,
		SearchViaNameComponent,
		PreviewDocumentComponent,
		ChartOfAccountsCreateComponent,
		LedgerEntryModelComponent,
		TrialBalanceModalComponent,
		BalanceSheetModalComponent,
		VoucherModalComponent,
		IncomeAndExpenditureModalComponent,
		BalanceSheetModalComponent,
		VoucherRefModalComponent
	],
	providers: [
		{
			provide: MatDialogRef,
			useValue: {}
		},
		{
			provide: MAT_DIALOG_DATA,
			useValue: {}
		},
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})
export class FaSharedModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(CKEDITOR.type === '4')) {
			CKEDITOR.type = '4';
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
