import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AxiomSharedModule } from '../../projects/axiom/src/app/app.module';
import { SisSharedModule } from '../../projects/sis/src/app/app.module';
import { FeesSharedModule } from '../../projects/fee/src/app/app.module';
import { StudentAppSharedModule } from 'projects/student-app/src/app/app.module';
import { AuthGuard } from './_guards/auth.guard';
import { AdminAppSharedModule } from 'projects/admin-app/src/app/app.module';
import { SmartSharedAppModule } from 'projects/smart/src/app/app.module';
import { ExamSharedAppModule } from 'projects/examination/src/app/app.module';
import { TeacherAppSharedModule } from 'projects/teacherapp/src/app/app.module';
const appRoutes: Routes = [
		{path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path: 'axiom', canActivate: [AuthGuard], loadChildren: 'projects/axiom/src/app/app.module#AxiomSharedModule'},
		{path: 'sis', canActivate: [AuthGuard], loadChildren: 'projects/sis/src/app/app.module#SisSharedModule'},
		{path: 'fees', canActivate: [AuthGuard] , loadChildren: 'projects/fee/src/app/app.module#FeesSharedModule'},
		{path: 'smart', canActivate: [AuthGuard] , loadChildren: 'projects/smart/src/app/app.module#SmartSharedAppModule'},
		{path: 'exam', canActivate: [AuthGuard] , loadChildren: 'projects/examination/src/app/app.module#ExamSharedAppModule'},
		{path: 'student', canActivate: [AuthGuard], loadChildren: 'projects/student-app/src/app/app.module#StudentAppSharedModule'},
		{path: 'teacher', canActivate: [AuthGuard], loadChildren: 'projects/teacherapp/src/app/app.module#TeacherAppSharedModule'},
		{path: 'admin', canActivate: [AuthGuard], loadChildren: 'projects/admin-app/src/app/app.module#AdminAppSharedModule'},
		{ path: '**', redirectTo: 'login'}
];

@NgModule({
		imports: [RouterModule.forRoot(appRoutes),
			AxiomSharedModule.forRoot(),
			SisSharedModule.forRoot(),
			FeesSharedModule.forRoot(),
			StudentAppSharedModule.forRoot(),
			AdminAppSharedModule.forRoot(),
			SmartSharedAppModule.forRoot(),
			ExamSharedAppModule.forRoot(),
			TeacherAppSharedModule.forRoot()
		],
	})
	export class AppRoutingModule { }
