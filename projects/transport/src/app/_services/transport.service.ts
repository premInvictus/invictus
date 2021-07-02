import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class TransportService {
 
	constructor(private http: HttpClient, private service: CommonAPIService) { }
	
	insertTransportLogs(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-logs/insert', value);
    }
    updateTransportLogs(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-logs/update', value);
    }
    getAllTransportLogs(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-logs/getAll', value);
    }
    getTransportLogs(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/transport-logs/get/'+value.id);
    }
    insertTransportStaff(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-staff/insert', value);
    }
    updateTransportStaff(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-staff/update', value);
    }
    getAllTransportStaff(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-staff/getAll', value);
    }
    getTransportStaff(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/transport-staff/get/'+value.id);
    }
    insertTransportVehicle(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-vehicle/insert', value);
    }
    updateTransportVehicle(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-vehicle/update', value);
    }
    getAllTransportVehicle(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-vehicle/getAll', value);
    }
    getTransportVehicle(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/transport-vehicle/get/'+value.id);
    }
    insertVehicleStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-status/insert', value);
    }
    updateVehicleStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-status/update', value);
    }
    getAllVehicleStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-status/getAll', value);
    }
    getVehicleStatus(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/vehicle-status/get/'+value.id);
    }
    insertRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/insert', value);
    }
    updateRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/update', value);
    }
    getAllRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/getAll', value);
    }
    getRouteManagement(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/route-management/get/'+value.id);
    }
    insertChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/checklist/insert', value);
    }
    updateChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/checklist/update', value);
    }
    getAllChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/checklist/getAll', value);
    }
    getChecklist(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/checklist/get/'+value.id);
	}
	getRoutes(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getTransportRoutes', value);
	}
	getStoppages(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/getTransportStoppages', value);
	}
	getStoppagesPerRoute(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getStoppagesPerRoute', value);
	}
	insertTransportSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-setup/insert', value);
    }
    updateTransportSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-setup/update', value);
    }
    getAllTransportSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-setup/getAll', value);
    }
    getTransportSetup(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/transport-setup/get/'+value.id);
	}
	getTransportStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transport/getTransportStudent', value);
	}
	insertTransportAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-attendance/insert', value);
    }
    updateTransportAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-attendance/update', value);
    }
    getAllTransportAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-attendance/getAll', value);
    }
    getTransportAttendance(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/transport-attendance/get/'+value.id);
	}
}
