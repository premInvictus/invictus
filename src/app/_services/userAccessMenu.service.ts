import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserAccessMenuService {
	menus: any[] = [];
	UserAccessMenu: any[] = [];
	constructor(
		private http: HttpClient
	) {
		this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
			(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
	}
	getUserAccessMenu(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		if (value.pro_id) {
			param.pro_id = value.pro_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessMenu', param);
	}
	setUserAccessMenu(value) {
		this.UserAccessMenu = [];
		if (this.menus.length === 0) {
			this.UserAccessMenu = value;
		} else {
			this.UserAccessMenu = this.menus;
		}
	}
	returnUserAccessMenu() {
		return of(this.UserAccessMenu);

	}
	isExistUserAccessMenu(mod_id) {
		if (this.menus.length === 0) {
			for (const mitem of this.UserAccessMenu) {
				if (mitem.menu_mod_id === mod_id) {
					return true;
				}
			}
			return false;
		} else {
			for (const mitem of this.menus) {
				if (mitem.menu_mod_id === mod_id) {
					return true;
				}
			}
			return false;
		}
	}

}
