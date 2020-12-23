import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserAccessMenuService {
	UserAccessMenu: any[] = [];
	menus: any[] = [];
	constructor(
		private http: HttpClient
	) {
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
		if (value.mor_type) {
			param.mor_type = value.mor_type
		}
		if(value.mapped_prefix) {
			param.mapped_prefix = value.mapped_prefix;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessMenu', param);
	}
	getAllUser(value) {
		return this.http.post(environment.apiHRUrl + '/employee/getAllEmployee', value);
	}
	isExistUserAccessMenu(mod_id) {
		if (this.menus.length === 0) {
			this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
				(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
		} else {
			for (const mitem of this.menus) {
				if (Number(mitem.menu_mod_id) === Number(mod_id)) {
					return true;
				}
			}
			return false;
		}
	}

}
