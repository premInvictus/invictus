import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusRoutingModule } from './syllabus-routing.module';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { LoadingModule } from 'ngx-loading';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';
import { ReviewSyllabusComponent, EditSyllabus } from './review-syllabus/review-syllabus.component';
import { BrowseSyllabusComponent, UnpublishModal } from './browse-syllabus/browse-syllabus.component';
import { SyllabusManagementComponent } from './syllabus-management/syllabus-management.component';

@NgModule({
	imports: [
		CommonModule,
		SyllabusRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [AddSyllabusComponent, ReviewSyllabusComponent, BrowseSyllabusComponent, SyllabusManagementComponent, EditSyllabus, UnpublishModal],
	entryComponents: [EditSyllabus, UnpublishModal]
})
export class SyllabusModule { }
