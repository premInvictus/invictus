import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { HostelConfigComponent } from './hostel-config/hostel-config.component';
import { HostelMappingComponent } from './hostel-mapping/hostel-mapping.component';

const routes: Routes = [
	{ path: 'fee-heads', component: FeeHeadsComponent},
	{ path: 'fee-group', component: FeeGroupComponent},
	{ path: 'fee-structure', component: FeeStructureComponent},
	{ path: 'concession-category', component: ConcessionCategoryComponent},
	{ path: 'concession-group', component: ConcessionGroupComponent},
	{ path: 'fines-and-penalities', component: FinesAndPenalitiesComponent},
	{ path: 'system-info', component: SystemInfoComponent},
	{ path: 'transport-slabs', component: TransportSlabsComponent},
	{ path: 'stopages', component: StopagesComponent},
	{ path: 'route', component: RoutesComponent},
	{ path: 'hostel-config', component: HostelConfigComponent},
	{ path: 'hostel-mapping', component: HostelMappingComponent}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FeeconfigurationRoutingModule { }
