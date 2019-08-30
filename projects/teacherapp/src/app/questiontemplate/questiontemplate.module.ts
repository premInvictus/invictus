import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestiontemplateRoutingModule } from './questiontemplate-routing.module';
import { QtemplateComponent } from './qtemplate/qtemplate.component';
import { GenerictemplateComponent } from './generictemplate/generictemplate.component';
import { SpecifictemplateComponent } from './specifictemplate/specifictemplate.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { SpecificTemplateListComponent } from './specific-template-list/specific-template-list.component';
import { GenericTemplateListComponent } from './generic-template-list/generic-template-list.component';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
// tslint:disable-next-line:max-line-length
import { SpecificTemplateViewPrintComponent } from './specific-template-list/specific-template-view-print/specific-template-view-print.component';
// tslint:disable-next-line:max-line-length
import { GenericTemplateViewPrintComponent } from './generic-template-list/generic-template-view-print/generic-template-view-print.component';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		QuestiontemplateRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		ModalModule.forRoot(),
	],
	declarations: [
		QtemplateComponent,
		GenerictemplateComponent,
		SpecifictemplateComponent,
		TemplateListComponent,
		SpecificTemplateListComponent,
		GenericTemplateListComponent,
		TemplateDialogComponent,
		SpecificTemplateViewPrintComponent,
		GenericTemplateViewPrintComponent,
	],
	entryComponents: [
		GenericTemplateViewPrintComponent,
		TemplateDialogComponent,
		SpecificTemplateViewPrintComponent,
		SpecificTemplateListComponent,
	]
})
export class QuestiontemplateModule { }
