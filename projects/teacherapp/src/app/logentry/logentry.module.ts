import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogentryRoutingModule } from './logentry-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared-module/share-module.module';
import { ClassworkUpdateComponent } from './classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent } from './topicwise-update/topicwise-update.component';
import { ReviewClassworkComponent } from './classwork-update/review-classwork/review-classwork.component';
import { UpdateConfirmationComponent } from './topicwise-update/update-confirmation/update-confirmation.component';
import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { EditClassworkModalComponent } from './view-classwork/edit-classwork-modal/edit-classwork-modal.component';

@NgModule({
	imports: [
		CommonModule,
		LogentryRoutingModule,
		LoadingModule,
		SharedModule,
	],
	// tslint:disable-next-line:max-line-length
	declarations: [ClassworkUpdateComponent, TopicwiseUpdateComponent, ReviewClassworkComponent, UpdateConfirmationComponent, ViewClassworkComponent, EditClassworkModalComponent],
	entryComponents: [ReviewClassworkComponent, UpdateConfirmationComponent, EditClassworkModalComponent]
})
export class LogentryModule { }
