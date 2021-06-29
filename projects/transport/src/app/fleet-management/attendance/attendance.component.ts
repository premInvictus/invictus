import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['au_full_name', 'au_mobile', 'whatsapp_no', 'au_dob','valid_upto',
  'au_email','batch_licence_no','driver_id','licence_type','licence_no','action'];
  dataSource = new MatTableDataSource<Element>();
  bus_arr:any=[];
  route_arr:any=[];
  trip_arr:any=[];
  type_arr:any=[];
  transportstudent_arr:any=[];
  paramform:FormGroup;
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllTransportStaff();
    this.getAllTransportVehicle();
    this.getAllTrip();
    this.getAllType();
    this.buildForm();
  }
  buildForm(){
    this.paramform = this.fbuild.group({
      bus_id:'',
      route_id:'',
      trip_id:'',
      type_id:''
    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getTransportStudent(){
    this.transportstudent_arr = [];
    const param:any = {};
    param.routeId = this.paramform.value.route_id;
    this.sisService.getTransportStudent(param).subscribe((result: any) => {
			if (result && result.status == 'ok') {
        this.transportstudent_arr = result.data;
      }
    });
  }
  getRouteBasedOnBus(){
    this.route_arr = [];
    const bus_id = this.paramform.value.bus_id;
    if(this.bus_arr.length > 0){
      const item = this.bus_arr.find(e => e.tv_id == bus_id);
      if(item){
        this.route_arr = item.routes;
      }
    }
  }
  getAllTrip(){
    this.trip_arr = [];
    this.transportService.getAllTransportSetup({ status: '1', type : 'trip' }).subscribe((result: any) => {
			if (result && result.length > 0) {
        this.trip_arr = result;
      }
    });
  }
  getAllType(){
    this.type_arr = [];
    this.transportService.getAllTransportSetup({ status: '1', type : 'type' }).subscribe((result: any) => {
			if (result && result.length > 0) {
        this.type_arr = result;
      }
    });
  }
  getAllTransportVehicle(){
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
			if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
  getAllTransportStaff(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.transportService.getAllTransportStaff({}).subscribe((result: any) => {
      if(result && result.length > 0) {
        const temp = result;
        temp.forEach(element => {
          const tempelement:any = {};
          tempelement.au_profileimage=element.users_det ? element.users_det.au_profileimage : '';
          tempelement.au_full_name=element.users_det ? element.users_det.au_full_name : '';
          tempelement.au_mobile=element.users_det ? element.users_det.au_mobile : '';
          tempelement.au_email=element.users_det ? element.users_det.au_email : '';
          tempelement.au_dob=element.users_det ? element.users_det.au_dob : '';

          tempelement.ts_au_login_id=element.users_det ? element.users_det.ts_au_login_id : '';
          tempelement.p_address=element.p_address;
          tempelement.whatsapp_no=element.whatsapp_no;
          tempelement.batch_licence_no=element.batch_licence_no;
          tempelement.driver_id=element.driver_id;
          tempelement.licence_type=element.licence_type;
          tempelement.licence_no=element.licence_no;
          tempelement.valid_upto=element.valid_upto;
          tempelement.status=element.status;  
          tempelement.action = element;   
          this.ELEMENT_DATA.push(tempelement) ;    
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }

}
