import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogentryRoutingModule } from './logentry-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ClassworkUpdateComponent, ReviewClassworkComponent} from './classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent, UpdateConfirmation } from './topicwise-update/topicwise-update.component';

@NgModule({
	imports: [
		CommonModule,
		LogentryRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [ClassworkUpdateComponent, ReviewClassworkComponent , TopicwiseUpdateComponent, UpdateConfirmation],
	entryComponents: [UpdateConfirmation, ReviewClassworkComponent]
})
export class LogentryModule { }
