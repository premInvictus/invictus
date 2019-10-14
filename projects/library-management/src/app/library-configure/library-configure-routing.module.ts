import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from '../library-configure/setup/setup.component';

const routes: Routes = [
	{path: 'setup', component: SetupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryConfigureRoutingModule { }
