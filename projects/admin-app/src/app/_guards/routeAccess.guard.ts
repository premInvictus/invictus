import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';

@Injectable()
export class RouteAccessGuard implements CanActivate {
		activeUrl: any;
		currentUser = localStorage.getItem('currentUser');
		routeAccessList = ['/admin', '/admin/schoolsetup'];
		constructor(private router: Router) {

		}

		canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
				if (this.routeAccessList.indexOf(state.url) !== -1) {
						return true;
				} else {
						// alert("you dont have access");
						return true;
				}

		}

}
