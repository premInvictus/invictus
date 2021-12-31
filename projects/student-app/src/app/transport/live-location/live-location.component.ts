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
  allDevicesLiveLocation: any;
  isLoading = true;
  loader_status = "";
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
    this.loader_status = "Fetching all transport vehicle";
    this.bus_arr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if (true) {
      this.loader_status = "Fetched all transport vehicle";
      const param2: any = {};
      param2.status = '1';
      param2.route_id = Number(this.transportDet.accd_tr_id);
      this.loader_status = "Fetching all routes";
      await this.transportService.getAllRouteManagement(param2).toPromise().then(async (result: any) => {
        console.log("route mgt >>>>>>", result);  
        
        if (result) {
          this.routeDet = result[0];
          const param: any = {};
          param.trip_status = 'start';
          param.date = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
          param.tv_id = this.routeDet.tv_id;
          this.loader_status = "Fetching all Trips";
          await this.transportService.getAllStartStopTrip(param).toPromise().then(async (result: any) => {
            if (result && result.length > 0) {
              this.startstoptrip_arr = result;
              const param1:any = {};
              param1.tv_id = this.routeDet.tv_id;
              param1.status = '1';
              this.loader_status = "Fetching all transport vehicle";
              await this.transportService.getAllTransportVehicle(param1).toPromise().then((result: any) => {
                if (result && result.length > 0) {
                  this.bus_arr = result;
                  if (this.bus_arr.length > 0) {
                    this.getLiveLocationData();
                    this.refreshIntervalId = setInterval(() => {
                      this.getLiveLocationData();
                    }, 30000);
                  }
                }
              });
            }
          });
        }
      },
      (error)=>{
        this.loader_status = "No Routes found";
      });
    }

  }

  
  async getLiveLocationData() {
    // this.bus_arr = [];
    this.loader_status = "Fetching Live location";
    await this.transportService.getLiveLocationData({}).toPromise().then(async (result: any) => {
      // this.isLoading = false;
      if (result && result.successful) {
          this.allDevicesLiveLocation = result.object;
          // await this.transportService.getAllTransportVehicle({ status: '1' }).toPromise().then((result: any) => {
          //   if (result && result.length > 0) {
              // this.bus_arr = result;
              this.prepareLiveLocationTable();
              console.log("live location data fetched >>>>>>>>>>>>>>.", this.allDevicesLiveLocation);
              //   }
              // });
      }
    });
  }

  prepareLiveLocationTable(){
    this.loader_status = "Preparing Data";
    this.ELEMENT_DATA = [];
    this.allDevicesLiveLocation.forEach((element,index) => {
      let locationName = "";
      this.bus_arr.forEach((item, indexer) => {
        if(element.deviceUniqueId == item.device_no){
          this.transportService.getGoogleMapsAPIKey({}).subscribe((res : any)=>{
            console.log("google maps >>>>>", res);
            const mapKey = res[0].gs_value;
            this.transportService.reverseGeoCoding(
              element.latitude+ "," + element.longitude, mapKey
            ).subscribe((result: any)=> {
              locationName = result.results ? result.results.formatted_address : '';
              console.log("rev geo code >>>>", result);            
            });
          });

          const tempElement: any = {};
          tempElement.position = index + 1;
          tempElement.companyName = element.companyName;
          tempElement.deviceTime = element.deviceTime;
          tempElement.deviceUniqueId = element.deviceUniqueId;
          tempElement.lastStatusUpdate =  new DatePipe('en-in').transform(element.lastStatusUpdate, 'yyyy-MM-dd H:M:ss');
          tempElement.latitude = element.latitude;
          tempElement.longitude = element.longitude;
          tempElement.lastLocation = element.latitude+ "," + element.longitude;
          tempElement.lastLocationName = locationName;
          tempElement.bus_number = item.bus_number;
          tempElement.registration_no = item.registration_no;
          tempElement.ignition = element.attributes.ignition;
          tempElement.todayDistance = Number(element.attributes.todayDistance)/1000;
          tempElement.motion = element.attributes.motion;
          tempElement.driver_name = item.driver && item.driver.user_det ? item.driver.user_det.au_full_name : '-';
          tempElement.name = element.name;
          
          this.ELEMENT_DATA.push(tempElement);

          this.markers.push(
            {
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              vehicle: item.registration_no,
              bus_number: item.bus_number,
            }
          )

        }
      });
    });
    console.log("element data new =>>>>>>", this.ELEMENT_DATA);
    if (this.markers.length > 0) {
      this.mapvalue.lat = this.markers[0].lat;
      this.mapvalue.long = this.markers[0].lng;
      this.mapvalue.zoom = 7;
      this.mapvalue.vehicle = this.markers[0].vehicle;
      this.mapvalue.markers = this.markers
    }
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.isLoading = false;
    this.tableDivFlag = true;
  }


  // async getLastPositionData() {
  //   let param: any = {};
  //   param.vehicleid = 'All';
  //   await this.transportService.getLastPositionData(param).toPromise().then((result: any) => {
  //     if (result) {
  //       this.location_arr = result;
  //     }
  //   });
  //   this.ELEMENT_DATA = [];
  //   this.bus_arr.forEach((item, index) => {
  //     const startstopdet = this.startstoptrip_arr.find(e => e.tv_id == item.tv_id);
  //     const buslocationdet = this.location_arr.find(e => e.vehicle == item.registration_no)
  //     let driver_name = item.driver && item.driver.user_det ? item.driver.user_det.au_full_name : '';
  //     const tempelement: any = {};
  //     tempelement.position = index + 1;
  //     tempelement.tv_id = item.tv_id;
  //     tempelement.route_id = '';
  //     tempelement.route_name = '';
  //     tempelement.bus_number = item.bus_number;
  //     tempelement.registration_no = item.registration_no;
  //     tempelement.driver_name = driver_name;
  //     tempelement.location = buslocationdet ? buslocationdet.location : '';
  //     tempelement.time = buslocationdet ? buslocationdet.gpsupdatedtime : '';
  //     tempelement.action = tempelement;
  //     this.ELEMENT_DATA.push(tempelement);
  //     if(buslocationdet){
  //       this.markers.push(
  //         {
  //           lat: buslocationdet.latitude,
  //           lng: buslocationdet.longitude,
  //           label: buslocationdet.location
  //         }
  //       )
  //     }
      
  //   });
  //   if(this.markers.length > 0){
  //     this.mapvalue.lat = this.markers[0].lat;
  //     this.mapvalue.long =this.markers[0].lng;
  //     this.mapvalue.zoom = 7;
  //     this.mapvalue.markers = this.markers
  //   }
  //   this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  //   console.log('this.groupdataSource', this.dataSource)
  //   console.log('this.markers', this.markers)
  //   this.tableDivFlag = true;

  // }
}
