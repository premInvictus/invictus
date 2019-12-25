import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemCodeGenerationComponent } from './item-code-generation/item-code-generation.component';
import { LocationMasterComponent } from './location-master/location-master.component';
const routes: Routes = [
	{ path: 'categories', component: CategoriesComponent },
	{ path: 'item-code-generation', component: ItemCodeGenerationComponent },
	{ path: 'location-master', component: LocationMasterComponent },
	{ path: 'setup', component: SetupComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
