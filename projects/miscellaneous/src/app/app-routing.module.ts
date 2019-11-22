import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards'
const routes: Routes = [
	{ path: 'misc', canActivate: [AuthGuard], loadChildren: './miscusertype/miscusertype.module#MiscusertypeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
