import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from '../library-configure/setup/setup.component';
import { SystemInfoComponent } from '../library-configure/system-info/system-info.component';

const routes: Routes = [
  {path: 'setup', component: SetupComponent},
  {path: 'system-info', component: SystemInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryConfigureRoutingModule { }
