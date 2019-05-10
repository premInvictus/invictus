import { Routes, RouterModule } from '@angular/router';
const appRoutes: Routes = [
		{ path: 'sis', loadChildren: './usertypesis/usertypesis.module#UsertypeSisModule'}
];

export const routing = RouterModule.forRoot(appRoutes);
export const theme: any = '2';
