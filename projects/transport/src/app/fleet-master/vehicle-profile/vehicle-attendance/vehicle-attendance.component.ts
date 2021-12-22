import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material'
import { ServiceLogItemsComponent } from '../../../transport-auxillaries/service-log-items/service-log-items.component';
import { MatDialog } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, TransportService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {DatePipe} from '@angular/common';
export interface Element {
  date: any,
  position: any,
  au_full_name: any,
  au_admission_no: any,
  class_name: any,
  stopage: any
  status: any
}


@Component({
  selector: 'app-vehicle-attendance',
  templateUrl: './vehicle-attendance.component.html',
  styleUrls: ['./vehicle-attendance.component.scss']
})
export class VehicleAttendanceComponent implements OnInit {

  @Input() vehicle: any = {};
  transportlogsArray: any[] = [];
  displayedColumns: string[] = ['position', 'au_admission_no', 'au_full_name', 'class_name', 'stopage','status'];
  ELEMENT_DATA: Element[] = [];
  datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

  stopages: any = [];
  attendance_arr: any = [];
  route_arr: any = [];
  transportstudent_arr: any[] = [];
  stopage_arr: any = [];
  selectedIndex = 0;
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('ngOnInit transport attendance', this.vehicle);
    this.getTransportStudent();
  }
  ngOnChanges() {
    console.log('ngOnChange transport attendance', this.vehicle);
    this.getTransportStudent();
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
  setIndex(event) {
    this.selectedIndex = event;
    this.getTransportStudent();

  }
  async getTransportStudent() {
    if (true) {
      this.transportstudent_arr = [];
      this.stopages = [];
      this.attendance_arr = [];
      const param1: any = {};
      param1.bus_id = this.vehicle.tv_id;
      param1.route_id = this.vehicle.routes[this.selectedIndex].route_id;
      // param1.trip_id = this.paramform.value.trip_id;
      // param1.type_id = this.paramform.value.type_id;
      param1.date = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
      await this.transportService.getAllTransportAttendance(param1).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.attendance_arr = result;
        }
      });
      this.stopage_arr = [];
      await this.transportService.getStoppagesPerRoute({}).toPromise().then((result: any) => {
        if (result && result.status == 'ok') {
          this.stopage_arr = result.data;
        }
      });
      const param: any = {};
      param.routeId = this.vehicle.routes[this.selectedIndex].route_id;
      await this.transportService.getTransportStudent(param).toPromise().then((result: any) => {
        if (result && result.status == 'ok') {
          this.transportstudent_arr = result.data;
          this.prepareDataSource();
        }
      });
    }
  }
  prepareDataSource() {
    this.ELEMENT_DATA = [];
    this.datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    let index = 0;
    for (const item of this.transportstudent_arr) {
      const attendance = this.attendance_arr.find(e => e.ta_login_id == item.au_login_id);
      let status = '';
      if(attendance && attendance.ta_status){
        if(attendance.ta_status == 'p'){
          status = 'present';
        }
      }
      const element = {
        date: new Date(),
        position: ++index,
        au_full_name: item.au_full_name,
        au_admission_no: item.au_admission_no,
        class_name: item.sec_name ? item.class_name + '-' + item.sec_name : item.class_name,
        stopage: item.tsp_name,
        status: status
      };
      this.ELEMENT_DATA.push(element);
    }
    this.datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  }
}
