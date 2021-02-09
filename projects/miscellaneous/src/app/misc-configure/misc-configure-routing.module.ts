import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import {BackupAndRestoreComponent } from './backup-and-restore/backup-and-restore.component';
const routes: Routes = [
  { path: 'setup', component: SetupComponent },
  { path: 'backup-and-restore', component: BackupAndRestoreComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscConfigureRoutingModule { }
