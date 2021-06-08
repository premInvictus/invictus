import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards'
const routes: Routes = [
	{ path: 'transport', canActivate: [AuthGuard], loadChildren: './transportusertype/transportusertype.module#TransportusertypeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
