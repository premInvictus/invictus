import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StudentRouteMoveStoreService {
	routeStore: RouteStore = new RouteStore();
	processType: any = '';
	constructor() {}
	setRouteStore(adm_no, login_id) {
		return new Promise(resolve => {
			this.routeStore.adm_no = adm_no;
			this.routeStore.login_id = login_id;
			console.log(this.routeStore);
			resolve();
		});
	}
	getRouteStore() {
		return new Promise(resolve => {
			console.log(this.routeStore);
			resolve(this.routeStore);
		});
	}
	setProcessRouteType(process_type) {
		this.processType = process_type;
	}
	getProcesRouteType() {
		return this.processType;
	}
}

export class RouteStore {
	public adm_no = null;
	public login_id = null;
}
