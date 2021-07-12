import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../shared-module/shared-module.module';


import { TransportRoutingModule } from './transport-routing.module';
import { LiveLocationComponent } from './live-location/live-location.component';

@NgModule({
  imports: [
    CommonModule,
    TransportRoutingModule,
    SharedModuleModule
  ],
  declarations: [LiveLocationComponent]
})
export class TransportModule { }
