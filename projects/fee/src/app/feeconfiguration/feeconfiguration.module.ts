import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { FeeconfigurationRoutingModule } from './feeconfiguration-routing.module';
import { FeeHeadsComponent } from './fee-heads/fee-heads.component';
import { FeeGroupComponent } from './fee-group/fee-group.component';
import { FeeStructureComponent } from './fee-structure/fee-structure.component';
import { ConcessionCategoryComponent } from './concession-category/concession-category.component';
import { ConcessionGroupComponent } from './concession-group/concession-group.component';
import { FinesAndPenalitiesComponent } from './fines-and-penalities/fines-and-penalities.component';
import { SystemInfoComponent } from './system-info/system-info.component';
import { TransportSlabsComponent } from './transport-slabs/transport-slabs.component';
import { StopagesComponent } from './stopages/stopages.component';
import { RoutesComponent } from './routes/routes.component';
import { InvoiceDetailsModalComponent } from '../feemaster/invoice-details-modal/invoice-details-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FeeconfigurationRoutingModule,
		SharedmoduleModule
	],
	entryComponents: [InvoiceDetailsModalComponent],
	declarations: [
		FeeHeadsComponent, FeeGroupComponent, FeeStructureComponent, ConcessionCategoryComponent, ConcessionGroupComponent,
		FinesAndPenalitiesComponent, SystemInfoComponent, TransportSlabsComponent, StopagesComponent, RoutesComponent]
})
export class FeeconfigurationModule { }
