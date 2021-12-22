import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QpapersetupComponent } from './qpapersetup/qpapersetup.component';
import { QpsfullyComponent } from './qpsfully/qpsfully.component';
import { QpspartialComponent } from './qpspartial/qpspartial.component';
import { QuestionPaperSetupRoutingModule } from './question-paper-setup-routing.module';
import { ExpressPaperSetupComponent } from './express-paper-setup/express-paper-setup.component';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { ViewTemplateComponent } from '../questionpaper/view-template/view-template.component';
import { ViewTemplatePartialComponent } from '../questionpaper/view-template-partial/view-template-partial.component';
import { AddInstructionComponent } from '../shared-module/add-instruction/add-instruction.component';
@NgModule({
	imports: [
		CommonModule,
		QuestionPaperSetupRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		ModalModule.forRoot(),
	],
	declarations: [
		QpapersetupComponent,
		QpsfullyComponent,
		QpspartialComponent,
		ExpressPaperSetupComponent,
		ViewTemplateComponent,
		ViewTemplatePartialComponent
	],
	entryComponents: [ViewTemplateComponent, ViewTemplatePartialComponent, AddInstructionComponent]
})
export class QuestionPaperSetupModule { }
