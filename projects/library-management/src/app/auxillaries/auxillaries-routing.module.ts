import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookSearchComponent } from './book-search/book-search.component';
import { PhysicalVerificationComponent } from './physical-verification/physical-verification.component';
import { BarcodePrintingComponent } from './barcode-printing/barcode-printing.component';
import { RfidPrintingComponent } from './rfid-printing/rfid-printing.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BookDetailComponent } from '../library-shared/book-detail/book-detail.component';
import { PeriodicalAttendanceComponent } from './periodical-attendance/periodical-attendance.component';



const routes: Routes = [
  { path: 'book-search', component: BookSearchComponent },
  { path: 'verification', component: PhysicalVerificationComponent },
  { path: 'bar-code-printing', component: BarcodePrintingComponent },
  { path: 'rfid-mapping', component: RfidPrintingComponent },
  { path: 'bulk-upload', component: BulkUploadComponent },
  { path: 'book-detail', component: BookDetailComponent },
  { path: 'periodical-attendance', component: PeriodicalAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxillariesRoutingModule { }
