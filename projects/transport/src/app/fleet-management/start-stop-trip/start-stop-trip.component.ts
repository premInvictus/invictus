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
  selector: 'app-start-stop-trip',
  templateUrl: './start-stop-trip.component.html',
  styleUrls: ['./start-stop-trip.component.scss']
})
export class StartStopTripComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['route_name', 'stopage_name', 'trip_status', 'action'];
  dataSource = new MatTableDataSource<Element>();
  groupdataSource: any[] = [];
  bus_arr: any = [];
  type_arr: any = [];
  route_arr: any[] = [];
  transportstudent_arr: any = [];
  paramform: FormGroup;
  selection = new SelectionModel<Element>(true, []);
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
    this.getAllType();
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
      date: '',
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
  getStopages(list,route_id) {
    const stopages: any[] = [];
    list.forEach(item => {
      if (item.tr_id == route_id) {
        stopages.push({ tsp_id: item.tsp_id, tsp_name: item.tsp_name })
      }
    })
    return stopages;
  }
  markChecklist(cl_status, item) {
    console.log(cl_status, item);
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.type_id == this.paramform.value.type_id && e.cl_id == item.cl_id);
    if (findex != -1) {
      this.documentsArray[findex].cl_status = cl_status
    }
    console.log('this.documentsArray', this.documentsArray);
  }
  checkedChecklist(cl_status, item) {
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.type_id == this.paramform.value.type_id && e.cl_id == item.cl_id && e.cl_status == cl_status);
    if (findex != -1) {
      return true;
    } else {
      return false
    }
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
  getAllChecklist() {
    this.route_arr = [];
    this.transportService.getAllChecklist({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.route_arr = result;
      }
    });
  }
  async getAllStartStopTrip() {
    console.log('this.paramform.valid', this.paramform.valid);
    if (this.paramform.valid) {
      this.groupdataSource = [];
      this.route_arr = [];
      this.stopage_arr = [];
      this.vehiclecheclist_arr = [];
      this.startstoptrip_arr = [];
      await this.transportService.getStoppagesPerRoute({}).toPromise().then((result: any) => {
        if (result && result.status == 'ok') {
          this.stopage_arr = result.data;
        }
      });
      const param1: any = {};
      param1.checklist_type = 'startday';
      param1.date = new DatePipe('en-in').transform(this.paramform.value.date, 'yyyy-MM-dd');
      await this.transportService.getAllVehicleChecklist(param1).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.vehiclecheclist_arr = result;
        }
      });
      const param: any = {};
      param.type_id = this.paramform.value.type_id;
      param.date = new DatePipe('en-in').transform(this.paramform.value.date, 'yyyy-MM-dd');
      await this.transportService.getAllStartStopTrip(param).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.startstoptrip_arr = result;
        }
      });
      if (this.bus_arr.length > 0) {
        this.bus_arr.forEach(bus => {
          this.route_arr = bus.routes;
          this.ELEMENT_DATA = [];
          this.route_arr.forEach((element, index) => {
            const startstopdet = this.startstoptrip_arr.find(e => e.tv_id == bus.tv_id && e.route_id == element.route_id);
            const vc_det = this.vehiclecheclist_arr.find(e => e.tv_id == bus.tv_id)
            let stoppage_name_arr = '';
            const stopages = this.getStopages(this.stopage_arr,element.route_id)
            if(stopages){
              stoppage_name_arr =stopages.map(e => e.tsp_name).join(', ');
            }
            const tempelement: any = {};
            tempelement.position = index + 1;
            tempelement.tv_id = bus.tv_id;
            tempelement.route_id = element.route_id;
            tempelement.route_name = element.route_name;
            tempelement.stopage_name = stoppage_name_arr;
            tempelement.type_id = element.type_id;
            tempelement.trip_status = startstopdet ? startstopdet.trip_status : '';
            tempelement.sst_id = startstopdet ? startstopdet.sst_id : '';
            tempelement.button = {
              start:false,
              stop:false,
              breakdown:false
            }
            if(vc_det && vc_det.fit_status){
              tempelement.button.start = true;
              if(startstopdet){
                if(startstopdet.trip_status == 'start'){
                  tempelement.button.start = false;
                  tempelement.button.stop = true;
                  tempelement.button.breakdown = true;
                } else if(startstopdet.trip_status == 'stop'){
                  tempelement.button.start = true;
                  tempelement.button.stop = false;
                  tempelement.button.breakdown = false;
                } else if(startstopdet.trip_status == 'breakdown'){
                  tempelement.button.start = true;
                  tempelement.button.stop = true;
                  tempelement.button.breakdown = false;
                }
              }
            }
            tempelement.action = tempelement;
            this.ELEMENT_DATA.push(tempelement);
          });
          this.groupdataSource[bus.tv_id] = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          console.log('this.groupdataSource', this.groupdataSource)
        });
        this.tableDivFlag = true;
        console.log('console.log(this.selection.selected)', this.selection.selected);
      }
    }

  }
  submit(trip_status,item) {
    console.log('item', item);
    if (this.paramform.valid) {
      if (item) {
        const insertdata: any = {};
        insertdata.tv_id = item.tv_id;
        insertdata.route_id = item.route_id;
        insertdata.date = new DatePipe('en-in').transform(this.paramform.value.date, 'yyyy-MM-dd');
        insertdata.type_id = this.paramform.value.type_id;
        insertdata.trip_status = trip_status
        insertdata.sst_id = item.sst_id ? item.sst_id : '';
        insertdata.created_by = { login_id: this.currentUser.login_id, full_name: this.currentUser.full_name }
        if (insertdata.sst_id) {
          this.transportService.updateStartStopTrip([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Updated successfullt', 'success')
              this.getAllStartStopTrip();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while updating', 'success')
            }
          })
        } else {
          this.transportService.insertStartStopTrip([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Inserted successfullt', 'success')
              this.getAllStartStopTrip();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while inserting', 'success')
            }
          })
        }
      }
    }
  }

}
