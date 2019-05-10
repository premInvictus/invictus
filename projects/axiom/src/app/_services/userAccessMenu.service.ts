import {Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable()
export class UserAccessMenuService {
		UserAccessMenu: any[] = [];
		constructor(
				private http: HttpClient
		) {}
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
				this.UserAccessMenu = value;
		}
		returnUserAccessMenu() {
				return of(this.UserAccessMenu);

		}
		isExistUserAccessMenu(mod_id) {
				for (const mitem of this.UserAccessMenu) {
						if (Number(mitem.menu_mod_id) === Number(mod_id)) {
								return true;
						}
				}
				return false;
		}

}
