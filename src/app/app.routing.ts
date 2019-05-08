import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AxiomSharedModule } from '../../projects/axiom/src/app/app.module';
import { SisSharedModule } from '../../projects/sis/src/app/app.module';
import { FeesSharedModule } from '../../projects/fee/src/app/app.module';
import { LoginModule } from './login/login.module';
const appRoutes: Routes = [
		{path: 'login', loadChildren: () => LoginModule},
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path: 'axiom', loadChildren: () => AxiomSharedModule},
		{path: 'sis', loadChildren: () => SisSharedModule},
		{path: 'fees', loadChildren: () => FeesSharedModule},
		{ path: '**', redirectTo: 'login' }
];

@NgModule({
		imports: [RouterModule.forRoot(appRoutes),
			AxiomSharedModule.forRoot(),
			SisSharedModule.forRoot(),
			FeesSharedModule.forRoot()
		],
	})
	export class AppRoutingModule { }
