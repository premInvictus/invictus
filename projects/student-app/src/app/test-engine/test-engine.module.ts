import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JeeAdvancedComponent } from './jee-advanced/jee-advanced.component';
import { JeeMainsComponent } from './jee-mains/jee-mains.component';
import { StudentTestSummaryScreenComponent } from './student-test-summary-screen/student-test-summary-screen.component';
import { StudentTestConfirmationScreenComponent } from './student-test-confirmation-screen/student-test-confirmation-screen.component';
import { StudentOngoingTestScreenComponent } from './student-ongoing-test-screen/student-ongoing-test-screen.component';
import { StudentInstructionScreenComponent } from './student-instruction-screen/student-instruction-screen.component';
import { JeeMainsInstructionComponent } from './jee-mains-instruction/jee-mains-instruction.component';
import { JeeAdvancedInstructionComponent } from './jee-advanced-instruction/jee-advanced-instruction.component';
import { JeeAdvancedOtherInstructionComponent } from './jee-advanced-other-instruction/jee-advanced-other-instruction.component';
import { TestEngineRoutingModule } from './test-engine-routing.module';
// tslint:disable-next-line:max-line-length
import { JeeAdvancedInstructionscreenComponent } from './jee-advanced/jee-advanced-instructionscreen/jee-advanced-instructionscreen.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ChartsModule } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { KatexModule } from 'ng-katex';
import { EditorModule } from 'primeng/editor';
import { QuestionNoModalComponent } from '../test-engine/jee-mains/jee-mains.component';
import { QuestionNoAdvModalComponent } from '../test-engine/jee-advanced/jee-advanced.component';
import { QuestionNoOnGoingModalComponent } from '../test-engine/student-ongoing-test-screen/student-ongoing-test-screen.component';

@NgModule({
	imports: [
		CommonModule,
		TestEngineRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModuleModule,
		SimpleNotificationsModule.forRoot(),
		ChartsModule,
		NgxGaugeModule,
		ModalModule.forRoot(),
		TagInputModule,
		TimepickerModule.forRoot(),
		KatexModule,
		EditorModule
	],
	declarations: [
		JeeAdvancedComponent,
		JeeMainsComponent,
		JeeMainsInstructionComponent,
		JeeAdvancedInstructionscreenComponent,
		JeeAdvancedInstructionComponent,
		JeeAdvancedOtherInstructionComponent,
		StudentInstructionScreenComponent,
		StudentOngoingTestScreenComponent,
		StudentTestConfirmationScreenComponent,
		StudentTestSummaryScreenComponent,
		QuestionNoModalComponent,
		QuestionNoAdvModalComponent,
		QuestionNoOnGoingModalComponent
	],
	entryComponents: [JeeAdvancedInstructionscreenComponent,
		QuestionNoModalComponent,
		QuestionNoAdvModalComponent,
		QuestionNoOnGoingModalComponent]
})
export class TestEngineModule {}
