import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup/setup.component'
import { SystemInfoComponent } from './system-info/system-info.component'
import { HrConfigureRoutingModule } from './hr-configure-routing.module';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { IdcardPrintingSetupComponent } from './idcard-printing-setup/idcard-printing-setup.component';
@NgModule({
  imports: [
    CommonModule,
    HrConfigureRoutingModule,
    HrSharedModule
  ],
  declarations: [SetupComponent, SystemInfoComponent, IdcardPrintingSetupComponent]
})
export class HrConfigureModule { }
