import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';
const routes: Routes = [
	{ path: 'smart', canActivate: [AuthGuard], loadChildren: './smartusertype/smartusertype.module#SmartusertypeModule' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
