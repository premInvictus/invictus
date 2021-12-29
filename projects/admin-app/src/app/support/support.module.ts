import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SupportRoutingModule } from './support-routing.module';
import { SchoolListingComponent } from './school-listing/school-listing.component';


@NgModule({
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [SchoolListingComponent]
})
export class SupportModule { }
