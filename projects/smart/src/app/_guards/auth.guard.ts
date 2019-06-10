﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
@Injectable()
export class AuthGuard implements CanActivate {

	userData = [];
	constructor(private router: Router, private _cookieService: CookieService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		if (this._cookieService && this._cookieService.get('userData')) {
			this.userData = JSON.parse(this._cookieService.get('userData'));
			if (this.userData) {
				return true;
			}
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}
