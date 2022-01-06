import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService, TransportService } from '../../_services';

@Component({
  selector: 'app-vehicle-profile',
  templateUrl: './vehicle-profile.component.html',
  styleUrls: ['./vehicle-profile.component.scss']
})
export class VehicleProfileComponent implements OnInit {
  interval: any;
  selected = new FormControl(0);
  vehicleDetails: any = {};
  bus_number: number;
  mapvalue: any = {};
  vehicleDetailsFlag = false;
  allDevicesLiveLocation: any;
  ELEMENT_DATA_NEW: any[];
  markers: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
  ) { }

  ngOnInit() {
    this.bus_number = 1;
    this.getAllTransportVehicle();
    clearInterval(this.interval);
  }
  ngOnChanges(){
    this.getAllTransportVehicle();
  }
  ngOnDestroy(){
    clearInterval(this.interval);
  }

  getAllTransportVehicle(bus_number = null) {
    console.log('bus_number', bus_number);
    const param: any = {};
    if (bus_number) {
      param.bus_number = bus_number
    } else {
      param.last = true;
    }
    this.transportService.getAllTransportVehicle(param).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.vehicleDetails = result[0];
        console.log(">>>>>>>>>>>>>>>>>>>>>", this.vehicleDetails);

        // this.getLastPositionData();
        this.interval = setInterval(() => {
          // this.getLastPositionData();
          this.getLiveLocationData();
        }, 5000);
      }
    })
  }


  async getLiveLocationData() {
    // this.bus_arr = [];
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

  prepareLiveLocationTable() {
    this.mapvalue = {};
    this.markers = [];
    this.allDevicesLiveLocation.forEach((element, index) => {
      let locationName = "";
      if (element.deviceUniqueId == this.vehicleDetails.device_no) {
        console.log("bus >>>", element)
        console.log("bus >>>", this.vehicleDetails.bus_number);
        // this.transportService.getGoogleMapsAPIKey({}).subscribe((res: any) => {
        //   console.log("google maps >>>>>", res);
        //   const mapKey = res[0].gs_value;
        //   // this.transportService.reverseGeoCoding(
        //   //   element.latitude + "," + element.longitude, mapKey
        //   // ).subscribe((result: any) => {
        //   //   locationName = result.results ? result.results.formatted_address : '';
        //   //   console.log("rev geo code >>>>", result);
        //   // });
        // });

        this.markers.push(
          {
            lat: element.latitude,
            lng: element.longitude,
            label: element.name,
            vehicle: this.vehicleDetails.registration_no,
            bus_number: this.vehicleDetails.bus_number,
          }
        )

      }

    });
    console.log("markers data new =>>>>>>", this.markers);
    if (this.markers.length > 0) {
      this.mapvalue.lat = this.markers[0].lat;
      this.mapvalue.long = this.markers[0].lng;
      this.mapvalue.zoom = 17;
      this.mapvalue.vehicle = this.markers[0].vehicle;
      this.mapvalue.markers = this.markers
    }
      this.vehicleDetailsFlag = true;
  }





  // async getLastPositionData() {
  //   this.vehicleDetailsFlag = false;
  //   let param: any = {};
  //   param.vehicleid = 'All';
  //   await this.transportService.getLastPositionData(param).toPromise().then((result: any) => {
  //     if (result) {
  //       const location_arr = result;
  //       const buslocationdet = location_arr.find(e => e.vehicle == this.vehicleDetails.registration_no);
  //       if (buslocationdet) {
  //         this.mapvalue = {};
  //         const markers = [];
  //         console.log("bus loc det >>>>>>>>", buslocationdet);

  //         markers.push(
  //           {
  //             lat: buslocationdet.latitude,
  //             lng: buslocationdet.longitude,
  //             label: buslocationdet.location,
  //             vehicle: buslocationdet.vehicle,
  //             zoom: 19
  //           }
  //         );
  //         console.log("markers loc det >>>>>>>>", markers);

  //         if (markers.length > 0) {
  //           this.mapvalue.lat = markers[0].lat;
  //           this.mapvalue.long = markers[0].lng;
  //           this.mapvalue.zoom = 19;
  //           this.mapvalue.vehicle = markers[0].vehicle;
  //           this.mapvalue.markers = markers
  //         }
  //       }
  //     }
  //     console.log('this.mapvalue >>>>>>>', this.mapvalue);
  //     this.vehicleDetailsFlag = true;
  //   });
  // }

}
