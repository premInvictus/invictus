import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { TransportSharedModule } from '../transport-shared/transport-shared.module';
import { TransportConfigureRoutingModule } from './transport-configure-routing.module';
import { SetupComponent } from './setup/setup.component';
import { SlabsComponent } from './slabs/slabs.component';
import { StoppageComponent } from './stoppage/stoppage.component';
import { RouteComponent } from './route/route.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { SystemInfoComponent } from './system-info/system-info.component';

@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    TransportSharedModule,
    TransportConfigureRoutingModule
  ],
  declarations: [SetupComponent, SlabsComponent, StoppageComponent, RouteComponent, ChecklistComponent,SystemInfoComponent]
})
export class TransportConfigureModule { }
