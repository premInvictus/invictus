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
      }
    })
  }

}
