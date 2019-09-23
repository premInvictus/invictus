import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueManagementRoutingModule } from './catalogue-management-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';

@NgModule({
  imports: [
    CommonModule,
    CatalogueManagementRoutingModule,
    LibrarySharedModule
  ],
  declarations: []
})
export class CatalogueManagementModule { }
