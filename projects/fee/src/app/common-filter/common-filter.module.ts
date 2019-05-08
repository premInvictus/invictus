import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    SharedmoduleModule,
    DragDropModule
  ],
  entryComponents: [FilterModalComponent],
  declarations: [FilterModalComponent]
})
export class CommonFilterModule { }
