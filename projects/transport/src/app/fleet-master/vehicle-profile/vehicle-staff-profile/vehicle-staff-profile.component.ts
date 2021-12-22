import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ServiceLogItemsComponent } from '../../../transport-auxillaries/service-log-items/service-log-items.component';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms'
 
@Component({
  selector: 'app-vehicle-staff-profile',
  templateUrl: './vehicle-staff-profile.component.html',
  styleUrls: ['./vehicle-staff-profile.component.scss']
})
export class VehicleStaffProfileComponent implements OnInit {
  @Input() vehicle: any = {};
  driver_au_profileimage:string;
  conductor_au_profileimage:string;
  supervisor_au_profileimage:string;
  driver_det:any = {};
  conductor_det:any = {};
  supervisor_det:any = {};
  constructor() { }

  ngOnInit() {
    console.log('ngOnInit fuel_logs', this.vehicle);
    this.prepareDataSource();
  }
  ngOnChanges(){
    console.log('ngOnChange fuel_logs', this.vehicle);
    this.prepareDataSource();
  }
  prepareDataSource() {
    if(this.vehicle.driver){
      this.driver_au_profileimage = this.vehicle.driver.user_det.au_profileimage;
      this.driver_det = this.vehicle.driver;
    }
    if(this.vehicle.conductor){
      this.conductor_au_profileimage = this.vehicle.conductor.user_det.au_profileimage;
      this.conductor_det = this.vehicle.conductor;
    }
    if(this.vehicle.supervisor){
      this.supervisor_au_profileimage = this.vehicle.supervisor.user_det.au_profileimage;
      this.supervisor_det = this.vehicle.supervisor;
    }

  }

}
