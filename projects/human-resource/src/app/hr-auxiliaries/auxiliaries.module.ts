import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { AdminReturnComponent } from './admin-return/admin-return.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule,
    HrSharedModule 
  ],
  declarations: [AdminReturnComponent]
})
export class AuxiliariesModule { }
