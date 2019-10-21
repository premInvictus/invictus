import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { AdminReturnComponent } from './admin-return/admin-return.component';

@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule
  ],
  declarations: [AdminReturnComponent]
})
export class AuxiliariesModule { }
