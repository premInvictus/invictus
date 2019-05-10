import { Routes, RouterModule } from '@angular/router';
const appRoutes: Routes = [
		{ path: 'fees', loadChildren: './usertype/usertype.module#UsertypeModule'},
];

export const routing = RouterModule.forRoot(appRoutes);
