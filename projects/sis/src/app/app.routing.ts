import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';
import { UsertypeSisModule } from './usertypesis/usertypesis.module';

const appRoutes: Routes = [
		{ path: 'sis', loadChildren: () => UsertypeSisModule}
];

export const routing = RouterModule.forRoot(appRoutes);
export const theme: any = '2';
