import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../_services';

@Component({
  selector: 'app-vehicle-profile',
  templateUrl: './vehicle-profile.component.html',
  styleUrls: ['./vehicle-profile.component.scss']
})
export class VehicleProfileComponent implements OnInit {

  selected = new FormControl(0);
  vehicleDetails:any = {};
  bus_number:number;
  mapvalue:any;
  vehicleDetailsFlag = false;
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
  }

  getAllTransportVehicle(bus_number=null){
    console.log('bus_number',bus_number);
    const param:any = {};
    if(bus_number) {
      param.bus_number = bus_number
    } else {
      param.last = true;
    }
    this.transportService.getAllTransportVehicle(param).subscribe((result: any) => {
      if(result && result.length > 0) {
        this.vehicleDetails = result[0];
        this.getLastPositionData();
      }
    })
  }
  async getLastPositionData() {
    this.vehicleDetailsFlag = false;
    let param: any = {};
    param.vehicleid = 'All';
    await this.transportService.getLastPositionData(param).toPromise().then((result: any) => {
      if (result) {
        const location_arr = result;
        const buslocationdet = location_arr.find(e => e.vehicle == this.vehicleDetails.registration_no);
        if(buslocationdet){
          this.mapvalue = {};
          const markers = [];
          markers.push(
            {
              lat: buslocationdet.latitude,
              lng: buslocationdet.longitude,
              label: buslocationdet.location
            }
          );
          if(markers.length > 0){
            this.mapvalue.lat = markers[0].lat;
            this.mapvalue.long =markers[0].lng;
            this.mapvalue.markers = markers
          }
        }
      }
      console.log('this.mapvalue',this.mapvalue);
      this.vehicleDetailsFlag = true;
    });
  }

}
