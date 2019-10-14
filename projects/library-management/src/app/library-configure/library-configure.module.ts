import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryConfigureRoutingModule } from './library-configure-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { SetupComponent } from '../library-configure/setup/setup.component';
import { SystemInfoComponent } from '../library-configure/system-info/system-info.component';
@NgModule({
  imports: [
    CommonModule,
    LibraryConfigureRoutingModule,
    LibrarySharedModule

  ],
  declarations: [SetupComponent, SystemInfoComponent]
})
export class LibraryConfigureModule { }
