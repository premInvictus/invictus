import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select','au_admission_no','au_full_name', 'class_name','action'];
  dataSource = new MatTableDataSource<Element>();
  bus_arr:any=[];
  route_arr:any=[];
  trip_arr:any=[];
  type_arr:any=[];
  transportstudent_arr:any=[];
  paramform:FormGroup;
  selection = new SelectionModel<Element>(true, []);
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // this.getAllTransportStaff();
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getTransportStudent(){
    this.transportstudent_arr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const param:any = {};
    param.routeId = this.paramform.value.route_id;
    this.transportService.getTransportStudent(param).subscribe((result: any) => {
			if (result && result.status == 'ok') {
        this.transportstudent_arr = result.data;
        this.transportstudent_arr.forEach((element,index) => {
          const tempelement:any = {};
          tempelement.position = index + 1;
          tempelement.au_full_name=element.au_full_name;
          tempelement.class_name=element.sec_name ? element.class_name + '-' + element.sec_name: element.class_name;
          tempelement.au_admission_no=element.au_admission_no;
          tempelement.action = element;   
          this.ELEMENT_DATA.push(tempelement) ;    
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
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
  // getAllTransportStaff(){
  //   this.ELEMENT_DATA = [];
  //   this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  //   this.transportService.getAllTransportStaff({}).subscribe((result: any) => {
  //     if(result && result.length > 0) {
  //       const temp = result;
  //       temp.forEach((element,index) => {
  //         const tempelement:any = {};
  //         tempelement.position = index + 1;
  //         tempelement.au_full_name=element.au_full_name;
  //         tempelement.class_name=element.sec_name ? element.class_name + '-' + element.sec_name: element.class_name;
  //         tempelement.au_admission_no=element.au_admission_no;
  //         tempelement.action = element;   
  //         this.ELEMENT_DATA.push(tempelement) ;    
  //       });
  //       this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  //       this.tableDivFlag = true;
  //     }
  //   })

  // }

}
