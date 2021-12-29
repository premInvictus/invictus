import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxillariesRoutingModule } from './auxillaries-routing.module';
import { BookSearchComponent } from './book-search/book-search.component';
import { PhysicalVerificationComponent } from './physical-verification/physical-verification.component';
import { BarcodePrintingComponent } from './barcode-printing/barcode-printing.component';
import { RfidPrintingComponent } from './rfid-printing/rfid-printing.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { PeriodicalAttendanceComponent } from './periodical-attendance/periodical-attendance.component';

@NgModule({
  imports: [
    CommonModule,
    AuxillariesRoutingModule,
    LibrarySharedModule
  ],
  declarations: [BookSearchComponent, PhysicalVerificationComponent, BarcodePrintingComponent, RfidPrintingComponent, BulkUploadComponent, PeriodicalAttendanceComponent]
})
export class AuxillariesModule { }
