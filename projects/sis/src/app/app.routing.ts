import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
const appRoutes: Routes = [
		{ path: 'sis', canActivate: [AuthGuard] , loadChildren: './usertypesis/usertypesis.module#UsertypeSisModule'}
];

export const routing = RouterModule.forRoot(appRoutes);
export const theme: any = '2';
