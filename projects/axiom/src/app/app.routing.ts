import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
const appRoutes: Routes = [
	{ path: 'axiom', canActivate: [AuthGuard] , loadChildren: './user-type/user-type.module#UserTypeModule' }
];

export const routing = RouterModule.forRoot(appRoutes);
