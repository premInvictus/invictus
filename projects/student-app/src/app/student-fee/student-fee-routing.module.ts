import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';
import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept/familywise-fee-reciept.component';
import { FamilyInformationComponent } from './family-information/family-information.component';


const routes: Routes = [
	{ path: 'student-fee-detail', component: StudentFeeDetailComponent },
	{ path: 'student-familywise-fee-receipt', component: FamilywiseFeeRecieptComponent },
	{ path: 'family-information', component: FamilyInformationComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentFeeRoutingModule {}
