import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';

const routes: Routes = [
	{ path: 'exam', canActivate: [AuthGuard], loadChildren: './exam-user-type/exam-user-type.module#ExamUserTypeModule' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
