import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusRoutingModule } from './syllabus-routing.module';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { LoadingModule } from 'ngx-loading';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';
import { ReviewSyllabusComponent } from './review-syllabus/review-syllabus.component';
import { BrowseSyllabusComponent } from './browse-syllabus/browse-syllabus.component';
import { SyllabusManagementComponent } from './syllabus-management/syllabus-management.component';

@NgModule({
	imports: [
		CommonModule,
		SyllabusRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [AddSyllabusComponent, ReviewSyllabusComponent, BrowseSyllabusComponent, SyllabusManagementComponent]
})
export class SyllabusModule { }
