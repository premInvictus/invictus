import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'projects/teacherapp/src/app/_guards';

const routes: Routes = [
  { path: 'library', canActivate: [AuthGuard], loadChildren: './library-usertype/library-usertype.module#LibraryUsertypeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
