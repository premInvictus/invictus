import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards'
const routes: Routes = [
	{ path: 'hr', canActivate: [AuthGuard], loadChildren: './hrusertype/hrusertype.module#HrusertypeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
