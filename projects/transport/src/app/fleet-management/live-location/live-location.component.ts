import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import { MatTableDataSource } from '@angular/material/table';
import { element } from '@angular/core/src/render3/instructions';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-live-location',
  templateUrl: './live-location.component.html',
  styleUrls: ['./live-location.component.scss']
})
export class LiveLocationComponent implements OnInit, OnDestroy {
  // lat = 22.4064172;
  // long = 69.0750171;
  // zoom = 7;

  markers = [];
  mapvalue: any = {}
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['bus_number', 'registration_no', 'driver_name', 'time', 'location'];
  newDisplayedColumns: string[] = ['bus_number', 'registration_no', 'driver_name', 'lastStatusUpdate', 'lastLocation','ignition','motion','todayDistance'];
  dataSource = new MatTableDataSource<Element>();
  groupdataSource: any[] = [];
  bus_arr: any = [];
  type_arr: any = [];
  route_arr: any[] = [];
  transportstudent_arr: any = [];
  paramform: FormGroup;
  stopages: any = [];
  stopage_arr: any = [];
  vehiclecheclist_arr: any = [];
  startstoptrip_arr: any = [];
  currentUser: any;

  imageArray = [];
  viewOnly = false;
  documentsArray: any[] = [];
  currentFileChangeEvent: any;
  multipleFileArray: any[] = [];
  counter: any = 0;
  currentImage: any;
  isLoading: boolean = true;
  location_arr: any = [];
  refreshIntervalId: any;
  loader_status: string;
  allDevicesLiveLocation: any;
  ELEMENT_DATA_NEW: any[];
  newDataSource: MatTableDataSource<Element>;

  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllTransportVehicle();
    this.buildForm();
    // this.getLiveLocationData();
  }
  ngOnDestroy() {
    clearInterval(this.refreshIntervalId);
  }
  addCheckList(item) {
    if (item) {
      this.documentsArray.push({
        tv_id: item.tv_id,
        type_id: item.type_id,
        cl_id: item.cl_id,
        cl_status: item.cl_status,
        document: item.document
      })
    }
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      date: new Date(),
    })
  }

  getStopages(list, route_id) {
    const stopages: any[] = [];
    list.forEach(item => {
      if (item.tr_id == route_id) {
        stopages.push({ tsp_id: item.tsp_id, tsp_name: item.tsp_name })
      }
    })
    return stopages;
  }
  getAllChecklist() {
    this.route_arr = [];
    this.transportService.getAllChecklist({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.route_arr = result;
      }
    });
  }
  async getAllTransportVehicle() {
    this.loader_status = "Fetching all Vehicle";
    this.bus_arr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if (true) {
      const param: any = {};
      param.trip_status = 'start';
      param.date = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
      this.loader_status = "Fetching all Trips";
      await this.transportService.getAllStartStopTrip(param).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.startstoptrip_arr = result;
        }
      });
      this.loader_status = "Fetching all Vehicle";
      await this.transportService.getAllTransportVehicle({ status: '1' }).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.bus_arr = result;
          if (this.bus_arr.length > 0) {
            // this.getLastPositionData();
            this.getLiveLocationData();
            this.refreshIntervalId = setInterval(() => {
              // this.getLastPositionData();
              this.getLiveLocationData();
            }, 5000);
          } else {
            this.isLoading = false;
            this.tableDivFlag = false;
          }
        }
      });
      
    }

  }

  async getLiveLocationData() {
    // this.bus_arr = [];
    this.loader_status = "Fetching Vehicle Location";
    await this.transportService.getLiveLocationData({}).toPromise().then(async (result: any) => {
      // this.isLoading = false;
      if (result && result.successful) {
          this.allDevicesLiveLocation = result.object;
          this.loader_status = "Preparing Vehicle Locations";
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
    this.ELEMENT_DATA_NEW = [];
    this.allDevicesLiveLocation.forEach((element,index) => {

      this.bus_arr.forEach((item, indexer) => {
        if(element.deviceUniqueId == item.device_no){
          const tempElement: any = {};
          tempElement.position = index + 1;
          tempElement.companyName = element.companyName;
          tempElement.deviceTime = element.deviceTime;
          tempElement.deviceUniqueId = element.deviceUniqueId;
          tempElement.lastStatusUpdate =  new DatePipe('en-in').transform(element.lastStatusUpdate, 'yyyy-MM-dd H:M:ss');
          tempElement.latitude = element.latitude;
          tempElement.longitude = element.longitude;
          tempElement.lastLocation = element.latitude+ "," + element.longitude;
          tempElement.bus_number = item.bus_number;
          tempElement.registration_no = item.registration_no;
          tempElement.ignition = element.attributes.ignition;
          tempElement.todayDistance = Number(element.attributes.todayDistance)/1000;
          tempElement.motion = element.attributes.motion;
          tempElement.driver_name = item.driver && item.driver.user_det ? item.driver.user_det.au_full_name : '-';
          tempElement.name = element.name;
          
          this.ELEMENT_DATA_NEW.push(tempElement);
          this.loader_status = "Plotting Maps";

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
    console.log("element data new =>>>>>>", this.ELEMENT_DATA_NEW);
    if (this.markers.length > 0) {
      this.mapvalue.lat = this.markers[0].lat;
      this.mapvalue.long = this.markers[0].lng;
      this.mapvalue.zoom = 7;
      this.mapvalue.vehicle = this.markers[0].vehicle;
      this.mapvalue.markers = this.markers
    }
    this.newDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA_NEW);
    this.isLoading = false;
    this.tableDivFlag = true;
  }

  // async getLastPositionData() {
  //   let param: any = {};
  //   param.vehicleid = 'All';
  //   this.loader_status = "Fetching Vehicle Location";
  //   await this.transportService.getLastPositionData(param).toPromise().then((result: any) => {
  //     this.isLoading = false;
  //     if (result) {
  //       this.location_arr = result;
  //       console.log("bus array >>>>", this.bus_arr);
  //       console.log("location_arr array >>>>", this.location_arr);

  //       this.ELEMENT_DATA = [];
  //       this.bus_arr.forEach((item, index) => {
  //         const startstopdet = this.startstoptrip_arr.find(e => e.tv_id == item.tv_id);
  //         const buslocationdet = this.location_arr.find(e => e.vehicle == item.registration_no);
  //         console.log("bus location det >>>>>>>", buslocationdet);

  //         let driver_name = item.driver && item.driver.user_det ? item.driver.user_det.au_full_name : '-';
  //         const tempelement: any = {};
  //         tempelement.position = index + 1;
  //         tempelement.tv_id = item.tv_id;
  //         tempelement.route_id = '';
  //         tempelement.route_name = '';
  //         tempelement.bus_number = item.bus_number;
  //         tempelement.registration_no = item.registration_no;
  //         tempelement.driver_name = driver_name;
  //         tempelement.location = buslocationdet ? buslocationdet.location : '';
  //         tempelement.time = buslocationdet ? buslocationdet.gpsupdatedtime : '';
  //         tempelement.action = tempelement;
  //         this.ELEMENT_DATA.push(tempelement);
  //         if (buslocationdet) {
  //           this.markers.push(
  //             {
  //               lat: buslocationdet.latitude,
  //               lng: buslocationdet.longitude,
  //               label: buslocationdet.location,
  //               vehicle: buslocationdet.vehicle,
  //               bus_number: item.bus_number,
  //             }
  //           )
  //         }

  //       });
  //       // this.markers.push(
  //       //   {
  //       //     lat: "23.295048753529088",
  //       //     lng: "85.32076792616921",
  //       //     label: "Don Bosco School",
  //       //     vehicle: "JH 01 ER 7752",
  //       //   }
  //       // );
  //       if (this.markers.length > 0) {
  //         this.mapvalue.lat = this.markers[0].lat;
  //         this.mapvalue.long = this.markers[0].lng;
  //         this.mapvalue.zoom = 6;
  //         this.mapvalue.vehicle = this.markers[0].vehicle;
  //         this.mapvalue.markers = this.markers
  //       }
  //       this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  //       console.log('this.groupdataSource', this.dataSource)
  //       console.log('this.markers', this.markers)
  //       this.tableDivFlag = true;
  //     }
  //   });
  // }

}
