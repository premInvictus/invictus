import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogentryRoutingModule } from './logentry-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ClassworkUpdateComponent } from './classwork-update/classwork-update.component';
import { TopicwiseUpdateComponent } from './topicwise-update/topicwise-update.component';
import { ReviewClassworkComponent } from './classwork-update/review-classwork/review-classwork.component';
import { UpdateConfirmationComponent } from './topicwise-update/update-confirmation/update-confirmation.component';
import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { EditClassworkModalComponent } from './view-classwork/edit-classwork-modal/edit-classwork-modal.component';
import { ClasswiseUpdateComponent } from './classwise-update/classwise-update.component';
import { ReviewClasswiseComponent } from './classwise-update/review-classwise/review-classwise.component';

@NgModule({
	imports: [
		CommonModule,
		LogentryRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [ClassworkUpdateComponent, TopicwiseUpdateComponent, ReviewClassworkComponent, UpdateConfirmationComponent, ViewClassworkComponent, EditClassworkModalComponent, ClasswiseUpdateComponent, ReviewClasswiseComponent],
	entryComponents: [ReviewClassworkComponent, UpdateConfirmationComponent, EditClassworkModalComponent,ReviewClasswiseComponent]
})
export class LogentryModule { }
