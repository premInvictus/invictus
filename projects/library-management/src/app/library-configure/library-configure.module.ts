import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryConfigureRoutingModule } from './library-configure-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';

@NgModule({
  imports: [
    CommonModule,
    LibraryConfigureRoutingModule,
    LibrarySharedModule

  ],
  declarations: []
})
export class LibraryConfigureModule { }
