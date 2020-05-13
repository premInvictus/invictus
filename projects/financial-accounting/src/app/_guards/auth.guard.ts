﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
import { SisService, CommonAPIService, ProcesstypeService } from '../_services/index';
@Injectable()
export class AuthGuard implements CanActivate {

	userData = [];
	returnUrl;
	constructor(private router: Router, private route: ActivatedRoute,
		private _cookieService: CookieService, private sisService: SisService) { }

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
