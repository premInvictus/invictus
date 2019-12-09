import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchTransferComponent } from './branch-transfer/branch-transfer.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemCodeGenerationComponent } from './item-code-generation/item-code-generation.component';
import { LocationMasterComponent } from './location-master/location-master.component';
const routes: Routes = [
	{ path: 'branch-transfer', component: BranchTransferComponent },
	{ path: 'categories', component: CategoriesComponent },
	{ path: 'item-code-generation', component: ItemCodeGenerationComponent },
	{ path: 'location-master', component: LocationMasterComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
