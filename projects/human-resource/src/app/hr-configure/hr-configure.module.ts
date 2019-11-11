import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup/setup.component'
import { SystemInfoComponent } from './system-info/system-info.component'
import { HrConfigureRoutingModule } from './hr-configure-routing.module';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
@NgModule({
  imports: [
    CommonModule,
    HrConfigureRoutingModule,
    HrSharedModule
  ],
  declarations: [SetupComponent, SystemInfoComponent]
})
export class HrConfigureModule { }
