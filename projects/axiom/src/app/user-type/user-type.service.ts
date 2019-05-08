import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class UserTypeService {

	constructor(
		private http: HttpClient
	) { }

	getALeftNav() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const au_role_id = currentUser.au_role_id;

		return this.http.post('/dashboard/getAdminLeftMenu', {'role_id': au_role_id});
	}
}
