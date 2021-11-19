import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
const appRoutes: Routes = [
		{ path: 'financial-accounting', canActivate: [AuthGuard] , loadChildren: './fausertype/usertype.module#UsertypeModule'}
];

export const routing = RouterModule.forRoot(appRoutes);
