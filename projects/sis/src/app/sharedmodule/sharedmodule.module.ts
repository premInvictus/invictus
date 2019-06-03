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
	MatCardModule, MatListModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatAutocompleteModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonDynamicChartComponent } from './common-dynamic-chart/common-dynamic-chart.component';
import { DynamicContentComponent } from './dynamic-content/dynamic-content.component';
import { ChildDetailsComponent } from '../student-master/child-details/child-details.component';
import { ParentDetailsComponent } from '../student-master/parent-details/parent-details.component';
import { EducationDetailsComponent } from '../student-master/education-details/education-details.component';
import { AccountsComponent } from '../student-master/accounts/accounts.component';
import { MedicalInformationComponent } from '../student-master/medical-information/medical-information.component';
import { SkillsAwardsComponent } from '../student-master/skills-awards/skills-awards.component';
import { DocumentsComponent } from '../student-master/documents/documents.component';
import { ParentGeneralRemarksComponent } from '../student-master/parent-general-remarks/parent-general-remarks.component';
import { AdmissionConcessionComponent } from '../student-master/admission-concession/admission-concession.component';
import { AdmissionRemarksComponent } from '../student-master/admission-remarks/admission-remarks.component';
import { StudentFormConfigService } from './dynamic-content/student-form-config.service';
import { FormEnabledService } from './dynamic-content/formEnabled.service';
import { FormEnabledTwoService } from './dynamic-content-theme-two/formEnabledTwo.service';
import { StudentFormConfigTwoService } from './dynamic-content-theme-two/student-form-config-two.service';
import { ImageViewerModule } from 'ngx-image-viewer';
import { CKEditorModule } from 'ng2-ckeditor';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagecropComponent } from './imagecrop/imagecrop.component';
import { EditRequestModalComponent } from './edit-request-modal/edit-request-modal.component';
import { PreviewDocumentComponent } from '../student-master/documents/preview-document/preview-document.component';
import { ViewDocumentsComponent } from '../student-master/documents/view-documents/view-documents.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import * as _moment from 'moment';
import { ManageUsersService } from '../manage-users/service/manage-users.service';
import { DynamicContentThemeTwoComponent } from './dynamic-content-theme-two/dynamic-content-theme-two.component';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabOneContainerComponent } from '../student-master-theme-two/theme-two-tab-one-container/theme-two-tab-one-container.component';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabTwoContainerComponent } from '../student-master-theme-two/theme-two-tab-two-container/theme-two-tab-two-container.component';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabThreeContainerComponent } from '../student-master-theme-two/theme-two-tab-three-container/theme-two-tab-three-container.component';
import { StudentDetailsThemeTwoComponent } from '../student-master-theme-two/student-details-theme-two/student-details-theme-two.component';
import { ChildDetailsThemeTwoComponent } from '../student-master-theme-two/child-details-theme-two/child-details-theme-two.component';
import { ParentDetailsThemeTwoComponent } from '../student-master-theme-two/parent-details-theme-two/parent-details-theme-two.component';
// tslint:disable-next-line: max-line-length
import { MedicalInformationThemeTwoComponent } from '../student-master-theme-two/medical-information-theme-two/medical-information-theme-two.component';
// tslint:disable-next-line: max-line-length
import { EducationDetailsThemeTwoComponent } from '../student-master-theme-two/education-details-theme-two/education-details-theme-two.component';
import { SkillsAwardsThemeTwoComponent } from '../student-master-theme-two/skills-awards-theme-two/skills-awards-theme-two.component';
import { DocumentsThemeTwoComponent } from '../student-master-theme-two/documents-theme-two/documents-theme-two.component';
import { GeneralRemarksThemeTwoComponent } from '../student-master-theme-two/general-remarks-theme-two/general-remarks-theme-two.component';
// tslint:disable-next-line: max-line-length
import { ManagementRemarksThemeTwoComponent } from '../student-master-theme-two/management-remarks-theme-two/management-remarks-theme-two.component';
// tslint:disable-next-line: max-line-length
import { AdmissionRemarksThemeTwoComponent } from '../student-master-theme-two/admission-remarks-theme-two/admission-remarks-theme-two.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { CapitalizePipe } from '../_pipes';
import { SafePipe } from '../_pipes/safe.pipe';
import { AccountDetailsThemeTwoComponent } from '../student-master-theme-two/account-details-theme-two/account-details-theme-two.component';
import { InvictusSharedModule } from 'src/app/invictus-shared/invictus-shared.module';
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
	],
	declarations: [CommonDynamicChartComponent, DynamicContentComponent,
		ChildDetailsComponent, ParentDetailsComponent, EducationDetailsComponent, AccountsComponent,
		MedicalInformationComponent, SkillsAwardsComponent, DocumentsComponent, ParentGeneralRemarksComponent, AdmissionConcessionComponent,
		AdmissionRemarksComponent, ThemeTwoTabOneContainerComponent, ThemeTwoTabTwoContainerComponent, ThemeTwoTabThreeContainerComponent,
		DeleteModalComponent,
		ImagecropComponent,
		EditRequestModalComponent, ViewDocumentsComponent, PreviewDocumentComponent, DynamicContentThemeTwoComponent,
		StudentDetailsThemeTwoComponent, ChildDetailsThemeTwoComponent, ParentDetailsThemeTwoComponent,
		MedicalInformationThemeTwoComponent, EducationDetailsThemeTwoComponent, AccountDetailsThemeTwoComponent,
		SkillsAwardsThemeTwoComponent, DocumentsThemeTwoComponent, GeneralRemarksThemeTwoComponent,
		ManagementRemarksThemeTwoComponent, AdmissionRemarksThemeTwoComponent, CapitalizePipe, SafePipe, ImageViewerComponent],
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
		RouterModule, ChildDetailsComponent, ParentDetailsComponent, EducationDetailsComponent, AccountsComponent,
		MedicalInformationComponent, SkillsAwardsComponent, DocumentsComponent, ParentGeneralRemarksComponent,
		AdmissionConcessionComponent,
		AdmissionRemarksComponent, DynamicContentComponent, DeleteModalComponent, ImagecropComponent, EditRequestModalComponent,
		ViewDocumentsComponent, PreviewDocumentComponent, DynamicContentThemeTwoComponent,
		NgxMaskModule, ThemeTwoTabOneContainerComponent, ThemeTwoTabTwoContainerComponent, ThemeTwoTabThreeContainerComponent,
		StudentDetailsThemeTwoComponent, ChildDetailsThemeTwoComponent, ParentDetailsThemeTwoComponent,
		MedicalInformationThemeTwoComponent, EducationDetailsThemeTwoComponent,
		SkillsAwardsThemeTwoComponent, DocumentsThemeTwoComponent, GeneralRemarksThemeTwoComponent,
		ManagementRemarksThemeTwoComponent,
		AccountDetailsThemeTwoComponent, AdmissionRemarksThemeTwoComponent, CapitalizePipe, SafePipe, ImageViewerComponent
	],
	entryComponents: [ChildDetailsComponent, ParentDetailsComponent, EducationDetailsComponent, AccountsComponent,
		MedicalInformationComponent, SkillsAwardsComponent, DocumentsComponent, ParentGeneralRemarksComponent,
		AdmissionConcessionComponent,
		AdmissionRemarksComponent, DeleteModalComponent, ImagecropComponent, EditRequestModalComponent,
		ViewDocumentsComponent, PreviewDocumentComponent, ThemeTwoTabOneContainerComponent,
		ThemeTwoTabTwoContainerComponent, ThemeTwoTabThreeContainerComponent,
		StudentDetailsThemeTwoComponent, ChildDetailsThemeTwoComponent, ParentDetailsThemeTwoComponent,
		MedicalInformationThemeTwoComponent, EducationDetailsThemeTwoComponent,
		SkillsAwardsThemeTwoComponent, DocumentsThemeTwoComponent, GeneralRemarksThemeTwoComponent,
		ManagementRemarksThemeTwoComponent, AccountDetailsThemeTwoComponent,
		AdmissionRemarksThemeTwoComponent, ImageViewerComponent],
	providers: [StudentFormConfigService, FormEnabledService, StudentFormConfigTwoService, FormEnabledTwoService, ManageUsersService,
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})
export class SharedmoduleModule {
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
