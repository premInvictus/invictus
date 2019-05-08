import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';
import { UsertypeModule } from './usertype/usertype.module';

const appRoutes: Routes = [
		{ path: 'fees', loadChildren: () => UsertypeModule},
];

export const routing = RouterModule.forRoot(appRoutes);
