import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup/setup.component';
import {BackupAndRestoreComponent } from './backup-and-restore/backup-and-restore.component';
import { MiscConfigureRoutingModule } from './misc-configure-routing.module';
import { MiscSharedModule } from '../misc-shared/misc-shared.module';
@NgModule({
  imports: [
    CommonModule,
    MiscConfigureRoutingModule,
    MiscSharedModule
  ],
  declarations: [SetupComponent,BackupAndRestoreComponent]
})
export class MiscConfigureModule { }
