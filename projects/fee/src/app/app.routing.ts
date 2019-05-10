import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
const appRoutes: Routes = [
		{ path: 'fees', canActivate: [AuthGuard] , loadChildren: './usertype/usertype.module#UsertypeModule'},
];

export const routing = RouterModule.forRoot(appRoutes);
