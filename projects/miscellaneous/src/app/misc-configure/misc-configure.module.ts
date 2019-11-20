import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup/setup.component'
import { SystemInfoComponent } from './system-info/system-info.component'
import { MiscConfigureRoutingModule } from './misc-configure-routing.module';
import { MiscSharedModule } from '../misc-shared/misc-shared.module';
@NgModule({
  imports: [
    CommonModule,
    MiscConfigureRoutingModule,
    MiscSharedModule
  ],
  declarations: [SetupComponent, SystemInfoComponent]
})
export class MiscConfigureModule { }
