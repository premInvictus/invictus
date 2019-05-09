import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AxiomSharedModule } from '../../projects/axiom/src/app/app.module';
import { SisSharedModule } from '../../projects/sis/src/app/app.module';
import { FeesSharedModule } from '../../projects/fee/src/app/app.module';
import { StudentAppSharedModule } from 'projects/student-app/src/app/app.module';
const appRoutes: Routes = [
		{path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path: 'axiom', loadChildren: 'projects/axiom/src/app/app.module#AxiomSharedModule'},
		{path: 'sis', loadChildren: 'projects/sis/src/app/app.module#SisSharedModule'},
		{path: 'fees', loadChildren: 'projects/fee/src/app/app.module#FeesSharedModule'},
		{path: 'student', loadChildren: 'projects/student-app/src/app/app.module#StudentAppSharedModule'},
		{ path: '**', redirectTo: 'login', pathMatch: 'full' }
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
