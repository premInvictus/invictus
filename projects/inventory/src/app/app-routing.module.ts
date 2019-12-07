import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards'
const routes: Routes = [
	{ path: 'inventory', canActivate: [AuthGuard], loadChildren: './inventoryusertype/inventoryusertype.module#InventoryusertypeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
