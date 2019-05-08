import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { CommonAPIService, SisService, FeeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
	selector: 'app-routes',
	templateUrl: './routes.component.html',
	styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit, AfterViewInit {
	stoppagesData = [];
	transportRoutes: FormGroup;
	displayedColumns: string[] = [
		'counter',
		'route_name',
		'route_no',
		'vec_reg_no',
		'drvr_name',
		'drvr_contact_no',
		'stoppages_name',
		'status',
		'action'
	];
	transportRoutesData: any[] = [];
	transportStoppagesData: any[] = [];
	routeStatus = '0';
	currentIndex = 0;
	TRANSPORT_ROUTE_ELEMENT_DATA: any[] = [];
	current_tr_id = 0;
	selectedStoppageData: any[] = [];
	routeDataSource = new MatTableDataSource<Element>(this.TRANSPORT_ROUTE_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;

	constructor(private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService, private sisService: SisService,
		private feeService: FeeService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.routeDataSource.sort = this.sort;
		this.buildForm();
	}

	ngAfterViewInit() {
		this.routeDataSource.paginator = this.paginator;
		this.routeDataSource.sort = this.sort;
	}

	buildForm() {
		this.prepareForm();
		this.getRoutes();
		this.getStoppages();
	}

	getRoutes() {
		this.transportRoutesData = [];
		this.TRANSPORT_ROUTE_ELEMENT_DATA = [];
		this.routeDataSource = new MatTableDataSource(this.TRANSPORT_ROUTE_ELEMENT_DATA);
		this.feeService.getRoutes({}).subscribe((result: any) => {

			if (result && result.status === 'ok') {
				this.transportRoutesData = result.data;
				this.prepareDataSource();
			} else {
				this.TRANSPORT_ROUTE_ELEMENT_DATA = [];
				this.routeDataSource = new MatTableDataSource(this.TRANSPORT_ROUTE_ELEMENT_DATA);
			}
		}, (error) => {
			this.TRANSPORT_ROUTE_ELEMENT_DATA = [];
			this.routeDataSource = new MatTableDataSource(this.TRANSPORT_ROUTE_ELEMENT_DATA);
		});
	}

	getStoppages() {
		this.selectedStoppageData = [];
		this.feeService.getStoppages({ tsp_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.transportStoppagesData = result.data;
			} else {
				this.transportStoppagesData = [];
			}
		}, (error) => {
			this.transportStoppagesData = [];
		});
	}

	prepareForm() {
		this.transportRoutes = this.fbuild.group({
			route_no: '',
			route_name: '',
			route_vehicle_reg_no: '',
			route_driver_name: '',
			route_driver_contact_no: '',
			route_attendant_name: '',
			route_attendant_contact_no: '',
			route_stoppages: ''
		});
	}

	patchFormValues() {
		const formData = this.transportRoutesData[this.currentIndex];
		this.transportRoutes.patchValue({
			route_no: formData && formData['tr_route_no'] ? formData['tr_route_no'] : '',
			route_name: formData && formData['tr_route_name'] ? formData['tr_route_name'] : '',
			route_vehicle_reg_no: formData && formData['tr_vec_reg_no'] ? formData['tr_vec_reg_no'] : '',
			route_driver_name: formData && formData['tr_drvr_name'] ? formData['tr_drvr_name'] : '',
			route_driver_contact_no: formData && formData['tr_drvr_contact_no'] ? formData['tr_drvr_contact_no'] : '',
			route_attendant_name: formData && formData['tr_attndt_name'] ? formData['tr_attndt_name'] : '',
			route_attendant_contact_no: formData && formData['tr_attndt_contact_no'] ? formData['tr_attndt_contact_no'] : ''
		});

		if (formData && formData['stoppages_list']) {
			this.setStoppageList(formData['stoppages_list']);
		}

	}

	prepareDataSource() {
		this.routeDataSource = new MatTableDataSource<Element>(this.TRANSPORT_ROUTE_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.transportRoutesData.length; i++) {
			const tempObj = {};
			let stoppages_arr;
			if (this.transportRoutesData[i]['route_stoppages']) {
				stoppages_arr = this.transportRoutesData[i]['route_stoppages'].split(',');
			}
			tempObj['counter'] = counter;
			tempObj['tr_id'] = this.transportRoutesData[i]['tr_id'];
			tempObj['route_name'] = this.transportRoutesData[i]['tr_route_name'];
			tempObj['route_no'] = this.transportRoutesData[i]['tr_route_no'];
			tempObj['vec_reg_no'] = this.transportRoutesData[i]['tr_vec_reg_no'];
			tempObj['drvr_name'] = this.transportRoutesData[i]['tr_drvr_name'];
			tempObj['drvr_contact_no'] = this.transportRoutesData[i]['tr_drvr_contact_no'];
			tempObj['attndt_name'] = this.transportRoutesData[i]['tr_attndt_name'];
			tempObj['attndt_contact_no'] = this.transportRoutesData[i]['tr_attndt_contact_no'];
			tempObj['stoppages_name'] = stoppages_arr[0] + ' - ' + stoppages_arr[stoppages_arr.length - 1];
			tempObj['status'] = this.transportRoutesData[i]['tr_status'];
			this.TRANSPORT_ROUTE_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.routeDataSource = new MatTableDataSource(this.TRANSPORT_ROUTE_ELEMENT_DATA);
		this.routeDataSource.sort = this.sort;
		this.routeDataSource.paginator = this.paginator;
		this.sort.sortChange.subscribe((() => this.paginator.pageIndex = 0));
	}

	saveForm() {
		const stoppageArr = [];
		if (this.selectedStoppageData.length > 0) {
			for (let i = 0; i < this.selectedStoppageData.length; i++) {
				stoppageArr.push(this.selectedStoppageData[i]['tsp_id']);
			}
		}
		if (this.transportRoutes.valid) {
			if (stoppageArr.length > 0) {
				let inputJson = {};
				inputJson = {
					tr_route_no: this.transportRoutes.value.route_no,
					tr_route_name: this.transportRoutes.value.route_name,
					tr_vec_reg_no: this.transportRoutes.value.route_vehicle_reg_no,
					tr_drvr_name: this.transportRoutes.value.route_driver_name,
					tr_drvr_contact_no: this.transportRoutes.value.route_driver_contact_no,
					tr_attndt_name: this.transportRoutes.value.route_attendant_name,
					tr_attndt_contact_no: this.transportRoutes.value.route_attendant_contact_no,
					tr_tsp: stoppageArr,
					tr_status: this.routeStatus
				};

				if (this.current_tr_id) {
					inputJson['tr_id'] = this.current_tr_id;
				}
				this.callSaveAPI(inputJson);
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please Select Stoppage comes across this Route', 'error');
			}

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}
	}

	callSaveAPI(inputJson) {
		this.feeService.saveRoute(inputJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.resetForm();
				this.getRoutes();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	editRoute(element) {
		this.routeStatus = element.status;
		this.current_tr_id = element.tr_id;
		this.currentIndex = parseInt(element.counter, 10) - 1;
		this.selectedStoppageData = [];
		this.patchFormValues();
	}

	deleteRoute(element) {
		this.routeStatus = '5';
		this.current_tr_id = element.tr_id;
		this.selectedStoppageData = [];
		this.deleteModal.openModal(element);
	}

	deleteConfirm(event) {
		const inputJson = {};
		inputJson['tr_id'] = this.current_tr_id;
		inputJson['tr_status'] = this.routeStatus;
		this.callSaveAPI(inputJson);
	}

	resetForm() {
		this.routeStatus = '0';
		this.selectedStoppageData = [];
		this.prepareForm();
	}

	changeStatus(element, event) {
		const inputJson = {};
		if (event.checked) {
			this.routeStatus = '1';
		} else {
			this.routeStatus = '0';
		}
		this.current_tr_id = element.tr_id;
		inputJson['tr_id'] = this.current_tr_id;
		inputJson['tr_status'] = this.routeStatus;
		inputJson['statusUpdate'] = true;
		this.callSaveAPI(inputJson);
	}

	setStoppageList(event) {
		this.transportStoppagesData.filter((val) => {
			if (event.split(',').indexOf(val['tsp_id']) > -1) {
				this.selectedStoppageData.push(val);
			}
		});
	}

	deleteStoppage(item, i) {
		this.selectedStoppageData.splice(i, 1);
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.selectedStoppageData, event.previousIndex, event.currentIndex);
	}



	applyFilter(filterValue: string) {
		this.routeDataSource.filter = filterValue.trim().toLowerCase();
	}
}
