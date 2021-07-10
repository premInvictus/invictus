import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransportService } from 'projects/transport/src/app/_services/index';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';

import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import { MatTableDataSource } from '@angular/material/table';
import { element } from '@angular/core/src/render3/instructions';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-live-location',
  templateUrl: './live-location.component.html',
  styleUrls: ['./live-location.component.css']
})
export class LiveLocationComponent implements OnInit, OnDestroy {
  
  currentUser:any;
  transportDet:any;
  transportFlag= false;
  routeDet:any;
  markers = [];
  mapvalue:any = {}
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['bus_number', 'registration_no', 'driver_name', 'time','location'];
  dataSource = new MatTableDataSource<Element>();
  groupdataSource: any[] = [];
  bus_arr: any = [];
  type_arr: any = [];
  route_arr: any[] = [];
  transportstudent_arr: any = [];
  paramform: FormGroup;
  vehiclecheclist_arr: any = [];
  startstoptrip_arr: any = [];
  location_arr: any = [];
  refreshIntervalId:any;
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private commonAPIService: CommonAPIService,
    private erp: ErpCommonService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getFeeAccount();
  }
  ngOnDestroy(){
  }
  getFeeAccount() {
    const param: any = {};
    param.au_process_type = this.currentUser.au_process_type
    param.accd_login_id = this.currentUser.login_id
    this.erp.getFeeAccount(param).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.transportDet=res.data[0];
        if(this.transportDet.accd_is_transport == 'Y'){
          this.transportFlag = true;
          this.getAllTransportVehicle();

        }
      }
    });
  }
  async getAllTransportVehicle() {
    this.bus_arr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if (true) {
      const param2: any = {};
      param2.status = '1';
      param2.route_id = Number(this.transportDet.accd_tr_id);
      await this.transportService.getAllRouteManagement(param2).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.routeDet = result[0];
        }
      });
      const param: any = {};
      param.trip_status = 'start';
      param.date = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
      param.tv_id = this.routeDet.tv_id
      await this.transportService.getAllStartStopTrip(param).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.startstoptrip_arr = result;
        }
      });
      const param1:any = {};
      param1.tv_id = this.routeDet.tv_id;
      param1.status = '1';
      await this.transportService.getAllTransportVehicle(param1).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.bus_arr = result;
        }
      });
      if (this.bus_arr.length > 0) {
        this.getLastPositionData();
        this.refreshIntervalId = setInterval(() => {
          this.getLastPositionData();
        }, 30000);
      }
    }

  }
  async getLastPositionData() {
    let param: any = {};
    param.vehicleid = 'All';
    await this.transportService.getLastPositionData(param).toPromise().then((result: any) => {
      if (result) {
        this.location_arr = result;
      }
    });
    this.ELEMENT_DATA = [];
    this.bus_arr.forEach((item, index) => {
      const startstopdet = this.startstoptrip_arr.find(e => e.tv_id == item.tv_id);
      const buslocationdet = this.location_arr.find(e => e.vehicle == item.registration_no)
      let driver_name = item.driver && item.driver.user_det ? item.driver.user_det.au_full_name : '';
      const tempelement: any = {};
      tempelement.position = index + 1;
      tempelement.tv_id = item.tv_id;
      tempelement.route_id = '';
      tempelement.route_name = '';
      tempelement.bus_number = item.bus_number;
      tempelement.registration_no = item.registration_no;
      tempelement.driver_name = driver_name;
      tempelement.location = buslocationdet ? buslocationdet.location : '';
      tempelement.time = buslocationdet ? buslocationdet.gpsupdatedtime : '';
      tempelement.action = tempelement;
      this.ELEMENT_DATA.push(tempelement);
      if(buslocationdet){
        this.markers.push(
          {
            lat: buslocationdet.latitude,
            lng: buslocationdet.longitude,
            label: buslocationdet.location
          }
        )
      }
      
    });
    if(this.markers.length > 0){
      this.mapvalue.lat = this.markers[0].lat;
      this.mapvalue.long =this.markers[0].lng;
      this.mapvalue.zoom = 7;
      this.mapvalue.markers = this.markers
    }
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    console.log('this.groupdataSource', this.dataSource)
    console.log('this.markers', this.markers)
    this.tableDivFlag = true;

  }
}
