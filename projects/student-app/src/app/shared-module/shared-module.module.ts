import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { MathJaxDirective } from '../mathjax.directive';
import { OngoingTestInstructionComponent } from './ongoing-test-instruction/ongoing-test-instruction.component';
import { InvictusSharedModule } from 'src/app/invictus-shared/invictus-shared.module';
import { PaymentOrderModalComponent } from './payment-order-modal/payment-order-modal.component';
import { MakePaymentComponent } from '../student-fee/make-payment/make-payment.component';
import { NumberToWordPipe } from '../_pipes/number-to-word.pipe';
import { ZerodashPipe } from '../_pipes/zerodash.pipe';
import { CapitalizePipe, DateformatPipe, TruncatetextPipe } from '../_pipes';
import { SafePipe } from '../_pipes/safe.pipe';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { NoDataComponent } from './no-data/no-data.component';
import { AdvancedSearchModalComponent } from './advanced-search-modal/advanced-search-modal.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookReserveRequestConfirmationComponent } from './book-reserve-request-confirmation/book-reserve-request-confirmation.component';
import { BookDetailsModalComponent } from './book-details-modal/book-details-modal.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { MessagesAdvancedSearchModalComponent } from './messages-advanced-search-modal/messages-advanced-search-modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { MakePaymentBasedonproviderComponent } from '../student-fee/make-payment-basedonprovider/make-payment-basedonprovider.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MakePaymentViaEazypayComponent } from '../student-fee/make-payment-via-eazypay/make-payment-via-eazypay.component';
//import { NotificationPageComponent } from 'src/app/login/notification-page/notification-page.component';
@NgModule({
	imports: [
		CommonModule,
		CommonModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatSlideToggleModule,
		MatDialogModule,
		MatDatepickerModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatButtonModule,
		MatTooltipModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		MatCardModule,
		MatExpansionModule,
		MatMenuModule,
		MatRadioModule,
		MatChipsModule,
		MatCheckboxModule,
		MatTabsModule,
		CKEditorModule,
		LayoutModule,
		RouterModule,
		BsDropdownModule,
		MatStepperModule,
		AccordionModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		InvictusSharedModule,
		ImageViewerModule,
		InfiniteScrollModule
	],
	declarations: [
		CommonDynamicChartComponent,
		MathJaxDirective,
		OngoingTestInstructionComponent,
		PaymentOrderModalComponent,
		MakePaymentComponent,
		MakePaymentViaEazypayComponent,
		MakePaymentBasedonproviderComponent,
		CapitalizePipe, DateformatPipe, SafePipe,
		NumberToWordPipe,
		ZerodashPipe,
		TruncatetextPipe,
		PreviewDocumentComponent,
		ImageViewerComponent,
		NoDataComponent,
		AdvancedSearchModalComponent,
		BookDetailComponent,
		BookReserveRequestConfirmationComponent,
		BookDetailsModalComponent,
		ComposeMessageComponent,
		MessagesAdvancedSearchModalComponent,
		DeleteModalComponent,
		//NotificationPageComponent
	],
	exports: [
		MatProgressBarModule,
		MatSlideToggleModule,
		MatDialogModule,
		MatDatepickerModule,
		TruncatetextPipe,
		MatNativeDateModule,
		MatRadioModule,
		MatChipsModule,
		MatCheckboxModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatTabsModule,
		MatProgressSpinnerModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
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
		CommonDynamicChartComponent,
		MathJaxDirective,
		PaymentOrderModalComponent,
		MakePaymentComponent,
		MakePaymentBasedonproviderComponent,
		CapitalizePipe, DateformatPipe, SafePipe,
		NumberToWordPipe,
		ZerodashPipe,
		PreviewDocumentComponent,
		ImageViewerComponent,
		ImageViewerModule,
		NoDataComponent,
		AdvancedSearchModalComponent,
		MakePaymentViaEazypayComponent,
		BookDetailComponent,
		BookReserveRequestConfirmationComponent,
		BookDetailsModalComponent,
		ComposeMessageComponent,
		MessagesAdvancedSearchModalComponent,
		DeleteModalComponent,
		CKEditorModule,
		InfiniteScrollModule
	],
	entryComponents: [OngoingTestInstructionComponent, PaymentOrderModalComponent, PreviewDocumentComponent, ImageViewerComponent,
		AdvancedSearchModalComponent,
		BookReserveRequestConfirmationComponent,
		BookDetailsModalComponent,
		ComposeMessageComponent,
		MessagesAdvancedSearchModalComponent,
		DeleteModalComponent
	]
})
export class SharedModuleModule {
	constructor() {
		const script: any = document.createElement('script');
		if (
			!(
				script.type === 'text/x-mathjax-config' &&
				script.src ===
				'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML'
			)
		) {
			script.type = 'text/x-mathjax-config';
			script['innerHTML'] =
				'MathJax.Hub.Config({\n' +
				' tex2jax: { inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']] }\n' +
				'});';
			script.type = 'text/javascript';
			script.src =
				'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML';
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	}
}
