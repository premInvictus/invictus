import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';


const routes: Routes = [
	{ path: 'student-fee-detail', component: StudentFeeDetailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentFeeRoutingModule {}
