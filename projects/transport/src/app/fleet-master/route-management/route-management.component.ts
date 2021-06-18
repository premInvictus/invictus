import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, TransportService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './element.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-route-management',
  templateUrl: './route-management.component.html',
  styleUrls: ['./route-management.component.scss']
})
export class RouteManagementComponent implements OnInit {

  displayedColumns: string[] = ['route_no', 'route_name', 'tv_id', 'driver_id', 'conductor_id', 'supervisor_id', 'start_time','end_time', 'stoppages','status', 'modify'];
  @ViewChild('deleteModal') deleteModal;
  subExamForm: FormGroup;
  currentUser: any;
  session: any;
  disableApiCall = false;
  ckeConfig: any = {};
  routemanagementArray: any[] = [];
  ELEMENT_DATA: Element[] = [];
  UpdateFlag = false;
  viewOnly = true;
  param: any = {};
  subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  multipleFileArray: any[] = [];
  imageArray: any[] = [];
  finalDocumentArray: any[] = [];
  counter: any = 0;
  currentFileChangeEvent: any;
  currentImage: any;
  bus_arr = [];
  userDataArr = [];
  stoppage_arr = [];
  route_arr = [];
  route_no_arr = ['petrol', 'diesel', 'cng'];
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public transportService: TransportService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }
  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.buildForm();
    this.getRouteManagement();
    this.getAllTransportVehicle();
    this.getUser();
    this.getRoutes();
    this.getStoppages();
  }
  buildForm() {
    this.subExamForm = this.fbuild.group({
      'rm_id': '',
      'date': '',
      'tv_id': '',
      'route_id': '',
      'route_no': '',
      'route_name': '',
      'driver_id': '',
      'conductor_id': '',
      'supervisor_id': '',
      'start_time': '',
      'end_time': '',
      'stoppages': [],
      'status': ''
    });
  }
  // delete dialog open modal function
  openDeleteModal(value) {
    this.param.rm_id = value;
    this.param.text = 'Delete';
    this.deleteModal.openModal(this.param);
  }
  resetForm() {
    this.subExamForm.patchValue({
      'rm_id': '',
      'date': '',
      'tv_id': '',
      'route_id': '',
      'route_no': '',
      'route_name': '',
      'driver_id': '',
      'conductor_id': '',
      'supervisor_id': '',
      'start_time': '',
      'end_time': '',
      'stoppages': [],
      'status': ''
    });
    this.imageArray = [];
    this.UpdateFlag = false;
    this.viewOnly = true;
  }
  submit() {
    if (this.subExamForm.valid) {
      this.disableApiCall = true;
      const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
      inputJson.status = '1';
      inputJson.created_by = { login_id: this.currentUser.login_id, full_name: this.currentUser.full_name };
      const selectedRoute = this.route_arr.find(e => e.tr_id == this.subExamForm.value.route_id);
      if(selectedRoute){
        inputJson.route_no = selectedRoute.tr_route_no;
        inputJson.route_name = selectedRoute.tr_route_name;
      }
      this.transportService.insertRouteManagement(inputJson).subscribe((result_i: any) => {
        if (result_i) {
          this.getRouteManagement();
          this.resetForm();
          this.disableApiCall = false;
          this.commonService.showSuccessErrorMessage('Route Added Successfully', 'success');
        } else {
          this.commonService.showSuccessErrorMessage('Insert failed', 'error');
          this.disableApiCall = false;
        }
      });
    } else {
      this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
    }
  }
  getAllTransportVehicle() {
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
  getUser() {
    this.userDataArr = [];
    const inputJson : any = {};
    inputJson['role_id'] = '2';
			inputJson['status'] = '1';
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
          this.userDataArr = result.data;
				}
			});
  }
  getRoutes() {
    this.route_arr = [];
    this.transportService.getRoutes({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.route_arr = result.data;
      }
    });
  }
  getStoppagesPerRoute(value) {
		this.stoppage_arr = [];
		this.transportService.getStoppagesPerRoute({ tr_id: this.subExamForm.value.route_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.stoppage_arr = result.data;
			}
		});
	}
  getStoppages() {
    this.stoppage_arr = [];
    this.transportService.getStoppages({ tsp_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.stoppage_arr = result.data;
      }
    });
  }
  getRouteManagement() {
    this.ELEMENT_DATA = [];
    this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.transportService.getAllRouteManagement({}).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.routemanagementArray = result;
        for (const item of this.routemanagementArray) {
          let stoppage_name_arr = '';
          if(item.stoppages_det){
            stoppage_name_arr = item.stoppages_det.map(e => e.tsp_name).join(', ');
          }
          this.ELEMENT_DATA.push({
            rm_id: item.rm_id,
            tv_id: item.transport_vehicle.bus_number,
            route_id: item.route_id,
            route_no: item.route_no,
            route_name: item.route_name,
            driver_id: item.driver_det ? item.driver_det.au_full_name:'',
            conductor_id: item.conductor_det ? item.conductor_det.au_full_name:'',
            supervisor_id: item.supervisor_det ? item.supervisor_det.au_full_name:'',
            start_time: item.start_time,
            end_time: item.end_time,
            stoppages: stoppage_name_arr,
            status: item.status,
            modify: item.rm_id,
            action: item
          });
        }
        this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
      }
    });
  }
  getActiveStatus(value: any) {
    if (value.status === '1') {
      return true;
    }
  }
  toggleStatus(value: any) {
    if (value.status === '1') {
      value.status = '0';
    } else {
      value.status = '1';
    }
    this.transportService.updateRouteManagement(value).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.commonService.showSuccessErrorMessage('Status Changed', 'success');
        this.getRouteManagement();
      }
    });
  }
  formEdit(value: any) {
    this.UpdateFlag = true;
    this.viewOnly = false;
    this.subExamForm.patchValue({
      rm_id: value.rm_id,
      tv_id: value.tv_id,
      route_id: value.route_id.toString(),
      route_no: value.route_no,
      route_name: value.route_name,
      driver_id: value.driver_id.toString(),
      conductor_id: value.conductor_id.toString(),
      supervisor_id: value.supervisor_id.toString(),
      start_time: value.start_time,
      end_time: value.end_time,
      stoppages: value.stoppages,
      status: value.status
    });

  }
  updateRouteManagement() {
    if (this.subExamForm.valid) {
      const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
      const selectedRoute = this.route_arr.find(e => e.tr_id == this.subExamForm.value.route_id);
      if(selectedRoute){
        inputJson.route_no = selectedRoute.tr_route_no;
        inputJson.route_name = selectedRoute.tr_route_name;
      }
      this.transportService.updateRouteManagement(inputJson).subscribe((result: any) => {
        if (result) {
          this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
          this.getRouteManagement();
          this.resetForm();
        }
      });
    } else {
      this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
    }

  }
  deleteTransportLogs($event) {
    const deleteJson = {
      rm_id: $event.rm_id,
      status: '5'
    };
    this.transportService.updateRouteManagement(deleteJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
        this.getRouteManagement();
        this.resetForm();
      }
    });
  }

}
