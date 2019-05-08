import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JeeAdvancedComponent } from './jee-advanced/jee-advanced.component';
import { JeeMainsComponent } from './jee-mains/jee-mains.component';
import { JeeMainsInstructionComponent } from './jee-mains-instruction/jee-mains-instruction.component';
import { JeeAdvancedInstructionComponent } from './jee-advanced-instruction/jee-advanced-instruction.component';
import { JeeAdvancedOtherInstructionComponent } from './jee-advanced-other-instruction/jee-advanced-other-instruction.component';
import { StudentInstructionScreenComponent } from './student-instruction-screen/student-instruction-screen.component';
import { StudentOngoingTestScreenComponent } from './student-ongoing-test-screen/student-ongoing-test-screen.component';
import { StudentTestConfirmationScreenComponent } from './student-test-confirmation-screen/student-test-confirmation-screen.component';
import { StudentTestSummaryScreenComponent } from './student-test-summary-screen/student-test-summary-screen.component';

const routes: Routes = [
	{ path: 'instruction-screen/:id', component: StudentInstructionScreenComponent },
	{ path: 'ongoing-test/:id', component: StudentOngoingTestScreenComponent },
	{ path: 'test-confirmation/:id', component: StudentTestConfirmationScreenComponent },
	{ path: 'test-summary/:id', component: StudentTestSummaryScreenComponent },
	{ path: 'jee-mains/:id', component: JeeMainsComponent },
	{ path: 'jee-advanced/:id', component: JeeAdvancedComponent },
	{
		path: 'jee-mains-instruction/:id',
		component: JeeMainsInstructionComponent
	},
	{
		path: 'jee-advanced-instruction/:id',
		component: JeeAdvancedInstructionComponent
	},
	{
		path: 'jee-advanced-other-instruction/:id',
		component: JeeAdvancedOtherInstructionComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TestEngineRoutingModule {}
