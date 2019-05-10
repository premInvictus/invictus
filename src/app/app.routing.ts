import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AxiomSharedModule } from '../../projects/axiom/src/app/app.module';
import { SisSharedModule } from '../../projects/sis/src/app/app.module';
import { FeesSharedModule } from '../../projects/fee/src/app/app.module';
import { StudentAppSharedModule } from 'projects/student-app/src/app/app.module';
import { AuthGuard } from './_guards/auth.guard';
const appRoutes: Routes = [
		{path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path: 'axiom', canActivate: [AuthGuard], loadChildren: 'projects/axiom/src/app/app.module#AxiomSharedModule'},
		{path: 'sis', canActivate: [AuthGuard], loadChildren: 'projects/sis/src/app/app.module#SisSharedModule'},
		{path: 'fees', canActivate: [AuthGuard] , loadChildren: 'projects/fee/src/app/app.module#FeesSharedModule'},
		{path: 'student', canActivate: [AuthGuard], loadChildren: 'projects/student-app/src/app/app.module#StudentAppSharedModule'},
		{ path: '**', redirectTo: 'login'}
];

@NgModule({
		imports: [RouterModule.forRoot(appRoutes),
			AxiomSharedModule.forRoot(),
			SisSharedModule.forRoot(),
			FeesSharedModule.forRoot(),
			StudentAppSharedModule.forRoot()
		],
	})
	export class AppRoutingModule { }
