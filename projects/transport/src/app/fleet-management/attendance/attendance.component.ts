import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { element } from '@angular/core/src/render3/instructions';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select', 'au_admission_no', 'au_full_name', 'class_name','ta_status_str', 'action'];
  dataSource = new MatTableDataSource<Element>();
  groupdataSource: any[] = [];
  bus_arr: any = [];
  route_arr: any = [];
  trip_arr: any = [];
  type_arr: any = [];
  transportstudent_arr: any = [];
  paramform: FormGroup;
  selection = new SelectionModel<Element>(true, []);
  stopages: any = [];
  attendance_arr: any = [];
  currentUser:any;
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.getAllTransportStaff();
    this.getAllTransportVehicle();
    this.getAllTrip();
    this.getAllType();
    this.buildForm();
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      bus_id: '',
      route_id: '',
      trip_id: '',
      type_id: ''
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
  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  createStopages(list) {
    const stopages: any[] = [];
    list.forEach(item => {
      if (stopages.findIndex(e => e.tsp_id == item.tsp_id) == -1) {
        stopages.push({ tsp_id: item.tsp_id, tsp_name: item.tsp_name })
      }
    })
    return stopages;
  }
  async getTransportStudent() {
    if (this.paramform.valid) {
      this.groupdataSource = [];
      this.transportstudent_arr = [];
      this.stopages = [];
      this.attendance_arr = [];
      const param: any = {};
      param.routeId = this.paramform.value.route_id;
      const param1: any = {};
      param1.bus_id = this.paramform.value.bus_id;
      param1.route_id = this.paramform.value.route_id;
      param1.trip_id = this.paramform.value.trip_id;
      param1.type_id = this.paramform.value.type_id;
      param1.date = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
      await this.transportService.getAllTransportAttendance(param1).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.attendance_arr = result;
        }
      });
      this.transportService.getTransportStudent(param).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.transportstudent_arr = result.data;
          let grouped = this.groupBy(this.transportstudent_arr, 'tsp_id');
          this.stopages = this.createStopages(this.transportstudent_arr);
          Object.keys(grouped).forEach(key => {
            this.ELEMENT_DATA = [];
            grouped[key].forEach((element, index) => {
              const tempelement: any = {};
              const attendance = this.attendance_arr.find(e => e.ta_login_id == element.au_login_id)
              tempelement.position = index + 1;
              tempelement.au_login_id = element.au_login_id;
              tempelement.au_full_name = element.au_full_name;
              tempelement.class_name = element.sec_name ? element.class_name + '-' + element.sec_name : element.class_name;
              tempelement.au_admission_no = element.au_admission_no;
              tempelement.tsp_id = element.tsp_id;
              tempelement.tsp_name = element.tsp_name;
              tempelement.ta_id = attendance ? attendance.ta_id : '';
              tempelement.ta_status = attendance ? attendance.ta_status : '';
              tempelement.ta_status_str = tempelement.ta_status == 'p' ? 'present' : (tempelement.ta_status == 'a' ? 'absent' : '')
              tempelement.action = tempelement;
              this.ELEMENT_DATA.push(tempelement);
            });
            this.groupdataSource[key] = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          });
          console.log('grouped', grouped);
          console.log('stopages', this.stopages);
          console.log('groupdataSource', this.groupdataSource);
          this.tableDivFlag = true;
        }
      });
    }

  }
  getRouteBasedOnBus() {
    this.route_arr = [];
    const bus_id = this.paramform.value.bus_id;
    if (this.bus_arr.length > 0) {
      const item = this.bus_arr.find(e => e.tv_id == bus_id);
      if (item) {
        this.route_arr = item.routes;
      }
    }
  }
  getAllTrip() {
    this.trip_arr = [];
    this.transportService.getAllTransportSetup({ status: '1', type: 'trip' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.trip_arr = result;
      }
    });
  }
  getAllType() {
    this.type_arr = [];
    this.transportService.getAllTransportSetup({ status: '1', type: 'type' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.type_arr = result;
      }
    });
  }
  getAllTransportVehicle() {
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
  markAttendance(ta_status, user = null) {
    console.log(ta_status);
    if (this.paramform.valid) {
      if (user) {
        const insertdata: any = {};
        insertdata.bus_id = this.paramform.value.bus_id;
        insertdata.route_id = this.paramform.value.route_id;
        insertdata.trip_id = this.paramform.value.trip_id;
        insertdata.type_id = this.paramform.value.type_id;
        insertdata.ta_status = ta_status;
        insertdata.ta_login_id = user.au_login_id;
        insertdata.ta_id = user.ta_id ? user.ta_id : '';
        insertdata.created_by = this.currentUser
        if (insertdata.ta_id) {
          this.transportService.updateTransportAttendance([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Updated successfullt', 'success')
              this.getTransportStudent();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while updating', 'success')
            }
          })
        } else {
          this.transportService.insertTransportAttendance([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Inserted successfullt', 'success')
              this.getTransportStudent();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while inserting', 'success')
            }
          })
        }

      } else {
        const insarr:any[] = [];
        const updarr:any[] = [];
        this.selection.selected.forEach(element => {
          const insertdata: any = {};
          insertdata.bus_id = this.paramform.value.bus_id;
          insertdata.route_id = this.paramform.value.route_id;
          insertdata.trip_id = this.paramform.value.trip_id;
          insertdata.type_id = this.paramform.value.type_id;
          insertdata.ta_status = ta_status;
          insertdata.ta_login_id = element.au_login_id;
          insertdata.ta_id = element.ta_id ? element.ta_id : '';
          insertdata.created_by = this.currentUser;
          if(element.ta_id){
            updarr.push(insertdata)
          } else {
            insarr.push(insertdata)
          } 
          if(insarr.length > 0){
            this.transportService.insertTransportAttendance([insertdata]).subscribe((result: any) => {
              if (result) {
                this.commonAPIService.showSuccessErrorMessage('Inserted successfullt', 'success')
                this.getTransportStudent();
              } else {
                this.commonAPIService.showSuccessErrorMessage('Error while inserting', 'success')
              }
            }) 
          }
          if(updarr.length > 0){
            this.transportService.updateTransportAttendance([insertdata]).subscribe((result: any) => {
              if (result) {
                this.commonAPIService.showSuccessErrorMessage('Updated successfullt', 'success')
                this.getTransportStudent();
              } else {
                this.commonAPIService.showSuccessErrorMessage('Error while updating', 'success')
              }
            })
          }                 
        });
      }
    }
  }

}
