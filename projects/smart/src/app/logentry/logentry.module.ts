import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogentryRoutingModule } from './logentry-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ClassworkUpdateComponent } from './classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent, UpdateConfirmation } from './topicwise-update/topicwise-update.component';
import { ReviewClassworkComponent } from './classwork-update/review-classwork/review-classwork.component';

@NgModule({
	imports: [
		CommonModule,
		LogentryRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [ClassworkUpdateComponent, TopicwiseUpdateComponent, UpdateConfirmation, ReviewClassworkComponent],
	entryComponents: [ReviewClassworkComponent, UpdateConfirmation]
})
export class LogentryModule { }
