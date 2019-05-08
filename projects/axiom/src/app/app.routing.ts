import { Routes, RouterModule } from '@angular/router';
import { FpasswordComponent } from './fpassword/fpassword.component';
import { AuthGuard } from './_guards/index';
import { UserRedirectComponent } from './user-type/user-redirect/user-redirect.component';
import { ResolverService } from './_services/resolver.service';
import { UserTypeModule } from './user-type/user-type.module';
import { TestEngineModule } from './test-engine/test-engine.module';
const appRoutes: Routes = [
		{ path: 'axiom',  loadChildren: () => UserTypeModule },
		{ path: 'forgot_password', component: FpasswordComponent },
		{ path: 'test', loadChildren: () => TestEngineModule}
];

export const routing = RouterModule.forRoot(appRoutes);
