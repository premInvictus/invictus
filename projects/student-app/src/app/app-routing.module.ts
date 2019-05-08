import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentUserTypeModule } from './student-user-type/student-user-type.module';

const routes: Routes = [
	{ path: 'student', loadChildren: () => StudentUserTypeModule }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
