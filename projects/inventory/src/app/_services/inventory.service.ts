import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private processType;
  private tabIndex;
  constructor(private http: HttpClient, private service: CommonAPIService) { }
  getItemRecordMaster(value) {
    this.service.startLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/getItemRecordMaster', value);
    /*return of({
      status: 'ok', data: [
        { position: 1, item_code: '123456', item_name: 'black board chalk1', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '150' }, { location_id: '2', location_name: 'class X - Almirah 02', item_stocks: '250' }, { location_id: '3', location_name: 'class X - Almirah 03', item_stocks: '350' }] },
        { position: 2, item_code: '123457', item_name: 'black board chalk2', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '150' }, { location_id: '2', location_name: 'class X - Almirah 02', item_stocks: '250' }, { location_id: '3', location_name: 'class X - Almirah 03', item_stocks: '350' }] },
        { position: 3, item_code: '123458', item_name: 'black board chalk3', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '350' }, { location_id: '2', location_name: 'class X - Almirah 02', item_stocks: '550' }] },
        { position: 4, item_code: '123459', item_name: 'black board chalk4', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '450' }] },
        { position: 5, item_code: '1234510', item_name: 'black board chalk5', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '450' }] },
        { position: 6, item_code: '1234511', item_name: 'black board chalk6', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '150' }, { location_id: '2', location_name: 'class X - Almirah 02', item_stocks: '250' }, { location_id: '3', location_name: 'class X - Almirah 03', item_stocks: '350' }] },
        { position: 7, item_code: '1234512', item_name: 'black board chalk7', item_units_name: 'boxes', item_desc: 'One of the most used school stationery is Dustless Chalk. It does not crowd the room with the dust and', item_location: [{ location_id: '1', location_name: 'class X - Almirah 01', item_stocks: '450' }] },
      ]
    });*/
  }
  getDroppableFromMaster(value) {
    this.service.startLoading();
    return this.http.post(environment.apiInvUrl + '/common/findAll', value);
  }
  getAllItemsFromMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/getItemsFromMaster', value);
  }
  searchItemsFromMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/searchItemsFromMaster', value);
  }
  filterItemsFromMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/filterItemsFromMaster', value);
  }
  insertItemsMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/insert', value);
  }
  getBranch(value) {
    this.service.startLoading();
    return this.http.post(environment.apiSisUrl + '/setup/getBranch', value);
  }
  getItemLogs(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/getItemLogs', value);
  }
  updateItemsMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/update', value);
  }
  updateMultiple(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/configuration/updateMultiple', value);
  }
  getAllRequistionMaster() {
    return this.http.get(environment.apiInvUrl + '/requistion-master/getAllRequistionMaster');
  }
  updateRequistionMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/requistion-master/updateRequistionMaster', value);
  }
  getRequistionMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/requistion-master/getRequistionMaster', value);
  }
  setrequisitionArray(value) {
    this.processType = value;
  }
  getrequisitionArray() {
    if (this.processType) {
      return this.processType;
    }
  }
  getOrderMaster(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/requistion-master/getOrderMaster', value);
  }
  getBranchTransfer(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/branch-transfer/findAll', value);
  }
  itemChangeStatus(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/change-status/itemChangeStatus', value);
  }
  updateBranchTransfer(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/branch-transfer/update', value);
  }
  createBranchTransfer(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/branch-transfer/insert', value);
  }
  branchInsert(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/branch-transfer/branchInsert', value);
  }
  generatePdfOfBarcode(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/change-status/generatePdfOfBarcode', value);
  }
  setTabIndex(value) {
    this.tabIndex = value;
  }
  getTabIndex() {
    if (this.tabIndex) {
      return this.tabIndex;
    }
  }
  updateItemQuantity(value) {
    this.service.stopLoading();
    return this.http.post(environment.apiInvUrl + '/requistion-master/updateItemQuantity', value);
  }
}
