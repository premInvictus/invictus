import { Routes, RouterModule } from '@angular/router';
const appRoutes: Routes = [
	{ path: 'axiom', loadChildren: './user-type/user-type.module#UserTypeModule' }
];

export const routing = RouterModule.forRoot(appRoutes);
