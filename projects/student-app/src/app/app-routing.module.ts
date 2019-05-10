import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';
const routes: Routes = [
	{ path: 'student',
	canActivate: [AuthGuard],
	loadChildren: './student-user-type/student-user-type.module#StudentUserTypeModule' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
