import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
		return this.http.get(environment.apiTransportUrl + '/transport-logs/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/transport-staff/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/transport-vehicle/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/vehicle-status/get/' + value.id);
	}
	insertRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/insert', value);
	}
	insertRouteStoppageMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-stoppage-mapping/insert', value);
	}
	updateRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/update', value);
	}
	updateRouteStoppageMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-stoppage-mapping/update', value);
	}
	getAllRouteManagement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/route-management/getAll', value);
	}
	getAllRouteStoppageMapping(value) {
		this.service.startLoading()
		return this.http.post(environment.apiTransportUrl + '/route-stoppage-mapping/getAll', value);
	}
	getRouteManagement(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/route-management/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/checklist/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/transport-setup/get/' + value.id);
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
		return this.http.get(environment.apiTransportUrl + '/transport-attendance/get/' + value.id);
	}
	insertVehicleChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-checklist/insert', value);
	}
	updateVehicleChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-checklist/update', value);
	}
	getAllVehicleChecklist(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/vehicle-checklist/getAll', value);
	}
	getVehicleChecklist(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/vehicle-checklist/get/' + value.id);
	}
	insertStartStopTrip(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/insert', value);
	}
	updateStartStopTrip(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/update', value);
	}
	getAllStartStopTrip(value) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/getAll', value);
	}
	getStartStopTrip(value) {
		this.service.startLoading();
		return this.http.get(environment.apiTransportUrl + '/startstop-trip/get/' + value.id);
	}
	getLastPositionData(value) {
		// this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/getLastPositionData', value);
	}
	getLiveLocationData(value) {
		// this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/getLiveLocationData', value);
	}
	getGoogleMapsAPIKey(value) {
		// this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/startstop-trip/getGoogleMapsAPIKey', value);
	}
	reverseGeoCoding(value, key) {
		let params = new HttpParams().set("latlng", value).set("key", key); //Create new HttpParams
		return this.http.get(environment.reverseGeoCoding, { params: params });
	}
	getSlabs(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportslab/getTransportSlab', value);
	}
	saveStoppage(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/insertTransportStoppages', value);
	}
	transportLog(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-logs/getAll', value);
	}
	transportRunningLog(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/trip-log/getAll', value);
	}
	transportTripLogInsert(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/trip-log/insert', value);
	}
	transportAllVehicles(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiTransportUrl + '/transport-vehicle/getAll', value);
	}
}
