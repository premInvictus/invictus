import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportConfigureRoutingModule } from './transport-configure-routing.module';
import { SetupComponent } from './setup/setup.component';
import { SlabsComponent } from './slabs/slabs.component';
import { StoppageComponent } from './stoppage/stoppage.component';
import { RouteComponent } from './route/route.component';
import { ChecklistComponent } from './checklist/checklist.component';

@NgModule({
  imports: [
    CommonModule,
    TransportConfigureRoutingModule
  ],
  declarations: [SetupComponent, SlabsComponent, StoppageComponent, RouteComponent, ChecklistComponent]
})
export class TransportConfigureModule { }
