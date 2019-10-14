import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryConfigureRoutingModule } from './library-configure-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { SetupComponent } from '../library-configure/setup/setup.component';

@NgModule({
  imports: [
    CommonModule,
    LibraryConfigureRoutingModule,
    LibrarySharedModule

  ],
  declarations: [SetupComponent]
})
export class LibraryConfigureModule { }
