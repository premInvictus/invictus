import {Injectable} from '@angular/core';
@Injectable()
export class BreadCrumbService {

		constructor(

		) {}

		homeUrl: string;
		public role_id: any;


getUrl() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const role_id = currentUser.role_id;
		if (role_id === 2) {
			this.homeUrl = '/school';
		} else if (role_id === 3) {
			this.homeUrl = '/teacher';
		} else if (role_id === 4) {
			this.homeUrl = '/student';
		}
		//
		return this.homeUrl;
}
}
