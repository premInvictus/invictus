import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup/setup.component'
import { HrConfigureRoutingModule } from './hr-configure-routing.module';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
@NgModule({
  imports: [
    CommonModule,
    HrConfigureRoutingModule,
    HrSharedModule
  ],
  declarations: [SetupComponent]
})
export class HrConfigureModule { }
