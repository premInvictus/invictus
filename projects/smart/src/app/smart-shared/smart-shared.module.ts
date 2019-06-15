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
	MatCardModule, MatListModule,
	MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatAutocompleteModule, MatSortModule
} from '@angular/material';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { CapitalizePipe, DateformatPipe, NumberToWordPipe, ZerodashPipe, SafePipe } from '../_pipes';
import { NgxMaskModule } from 'ngx-mask';
import * as _moment from 'moment';
import { InvictusSharedModule } from '../../../../../src/app/invictus-shared/invictus-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditRequestModalComponent } from './edit-request-modal/edit-request-modal.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AssignmentAttachmentDialogComponent } from './assignment-attachment-dialog/assignment-attachment-dialog.component';
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
		NgxMaskModule.forRoot(),
		InvictusSharedModule
	],
	declarations: [
		CommonDynamicChartComponent,
		DeleteModalComponent,
		ImagecropComponent,
		EditRequestModalComponent,
		CapitalizePipe,
		DateformatPipe,
		SafePipe,
		ImageViewerComponent,
		NumberToWordPipe,
		ZerodashPipe,
		AssignmentAttachmentDialogComponent,
	],
	entryComponents: [
		DeleteModalComponent,
		ImagecropComponent,
		ImageViewerComponent,
		EditRequestModalComponent,
		AssignmentAttachmentDialogComponent
	],
	exports: [
		FormsModule, ReactiveFormsModule,
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
		CKEditorModule,
		MatSortModule,
		RouterModule, DeleteModalComponent, ImagecropComponent,
		NgxMaskModule, CapitalizePipe, DateformatPipe, SafePipe, ImageViewerComponent,
		EditRequestModalComponent,
		NumberToWordPipe,
		ZerodashPipe,
		CommonDynamicChartComponent,
		AssignmentAttachmentDialogComponent
	],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})
export class SmartSharedModule { }
