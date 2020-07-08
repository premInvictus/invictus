
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { AdmitCodeConfirmationModalComponent } from './admit-code-confirmation-modal/admit-code-confirmation-modal.component';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddInstructionComponent } from './add-instruction/add-instruction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublishUnpublishDialogComponent } from './publish-unpublish-dialog/publish-unpublish-dialog.component';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { MathJaxDirective } from './../mathjax.directive';
import { OngoingTestInstructionComponent } from './ongoing-test-instruction/ongoing-test-instruction.component';
import { EssayDialogsComponent } from '../questionbank/essay-dialogs/essay-dialogs.component';
import { EditobjectiveComponent } from '../questionbank/reviewo/editobjective/editobjective.component';
import { EditEssayComponent } from '../questionbank/review-essay/edit-essay/edit-essay.component';
import { QuestionPaperDialogComponent } from '../questionbank/question-paper-dialog/question-paper-dialog.component';
import { InvictusSharedModule } from 'src/app/invictus-shared/invictus-shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { AssignRightsMultipleComponent } from './assign-rights-multiple/assign-rights-multiple.component';
import { TreeviewModule } from 'ngx-treeview';
@NgModule({
	imports: [
		CommonModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatSlideToggleModule,
		TreeviewModule,
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
		AccordionModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		InvictusSharedModule,
		ImageCropperModule,

	],
	declarations: [
		DeleteModalComponent,
		AddInstructionComponent,
		CommonDynamicChartComponent,
		PublishUnpublishDialogComponent,
		MathJaxDirective,
		OngoingTestInstructionComponent,
		EssayDialogsComponent,
		EditobjectiveComponent,
		EditEssayComponent,
		QuestionPaperDialogComponent,
		ImagecropComponent,
		AssignRightsMultipleComponent,
		AdmitCodeConfirmationModalComponent
	],
	exports: [
		DeleteModalComponent,
		MatProgressBarModule,
		MatSlideToggleModule,
		MatDialogModule,
		MatDatepickerModule,
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
		EssayDialogsComponent,
		EditobjectiveComponent,
		EditEssayComponent,
		QuestionPaperDialogComponent,
		AddInstructionComponent,
		ImageCropperModule,
		AssignRightsMultipleComponent,
		ImagecropComponent,
		AdmitCodeConfirmationModalComponent
	],
	entryComponents: [ImagecropComponent, AssignRightsMultipleComponent]
})
export class SharedModule {
	constructor() {
		const script: any = document.createElement('script');
		if (!(script.type === 'text/x-mathjax-config'
		&& script.src === 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML')) {
			script.type = 'text/x-mathjax-config';
			script[('innerHTML')] =
				'MathJax.Hub.Config({\n' +
				' tex2jax: { inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']] }\n' +
				'});';
			script.type = 'text/javascript';
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML';
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	}
}
