import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
	{ path: 'admin',
	canActivate: [AuthGuard],
	loadChildren: './admin-user-type/admin-user-type.module#AdminUserTypeModule' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
