import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';

const routes: Routes = [
	{ path: 'teacher', canActivate: [AuthGuard], loadChildren: './user-type-teacher/user-type-teacher.module#TeacherUserTypeModule' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
