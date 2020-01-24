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
import { HrSharedAppModule } from 'projects/human-resource/src/app/app.module';
import { LibrarySharedAppModule } from 'projects/library-management/src/app/app.module';
import { MiscellaneousSharedAppModule } from 'projects/miscellaneous/src/app/app.module';
import { InventorySharedAppModule } from 'projects/inventory/src/app/app.module';
const appRoutes: Routes = [
		{path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path: 'axiom', canActivate: [AuthGuard], loadChildren: 'projects/axiom/src/app/app.module#AxiomSharedModule'},
		{path: 'sis', canActivate: [AuthGuard], loadChildren: 'projects/sis/src/app/app.module#SisSharedModule'},
		{path: 'fees', canActivate: [AuthGuard] , loadChildren: 'projects/fee/src/app/app.module#FeesSharedModule'},
		{path: 'smart', canActivate: [AuthGuard] , loadChildren: 'projects/smart/src/app/app.module#SmartSharedAppModule'},
		{path: 'exam', canActivate: [AuthGuard] , loadChildren: 'projects/examination/src/app/app.module#ExamSharedAppModule'},
		{path: 'library', canActivate: [AuthGuard], loadChildren: 'projects/library-management/src/app/app.module#LibrarySharedAppModule'},
		{path: 'student', canActivate: [AuthGuard], loadChildren: 'projects/student-app/src/app/app.module#StudentAppSharedModule'},
		{path: 'teacher', canActivate: [AuthGuard], loadChildren: 'projects/teacherapp/src/app/app.module#TeacherAppSharedModule'},
		{path: 'admin', canActivate: [AuthGuard], loadChildren: 'projects/admin-app/src/app/app.module#AdminAppSharedModule'},
		{path: 'hr', canActivate: [AuthGuard], loadChildren: 'projects/human-resource/src/app/app.module#HrSharedAppModule'},
		{path: 'misc', canActivate: [AuthGuard], loadChildren: 'projects/miscellaneous/src/app/app.module#MiscellaneousSharedAppModule'},
		{path: 'inventory', canActivate: [AuthGuard], loadChildren: 'projects/inventory/src/app/app.module#InventorySharedAppModule'},
		{ path: '**', redirectTo: 'login'},
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
			TeacherAppSharedModule.forRoot(),
			HrSharedAppModule.forRoot(),
			LibrarySharedAppModule.forRoot(),
			MiscellaneousSharedAppModule.forRoot(),
			InventorySharedAppModule.forRoot()
		],
	})
	export class AppRoutingModule { }
