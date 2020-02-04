import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CommonAPIService, FeeService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-stopages',
	templateUrl: './stopages.component.html',
	styleUrls: ['./stopages.component.scss']
})
export class StopagesComponent implements OnInit, AfterViewInit {
	transportStopagges: FormGroup;
	displayedColumns: string[] = [
		'counter',
		'stop_name',
		'distance_from_school',
		'transport_slab',
		'status',
		'action'
	];
	currentIndex = 0;
	stoppageRoutesData: any[] = [];
	slabsData: any[] = [];
	TRANSPORT_STOPPAGE_ELEMENT_DATA: any[] = [];
	stoppageStatus = '0';
	current_stop_id = 0;
	selectedSlabData: any[] = [];
	stoppageDataSource = new MatTableDataSource<Element>(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	btnDisable = false;
	constructor(private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService, private sisService: SisService,
		private feeService: FeeService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.buildForm();
	}

	ngAfterViewInit() {
		this.stoppageDataSource.paginator = this.paginator;
		this.stoppageDataSource.sort = this.sort;
	}

	buildForm() {
		this.prepareForm();
		this.getStoppages();
		this.getSlabs();
	}

	getStoppages() {
		this.stoppageRoutesData = [];
		this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
		this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
		this.feeService.getStoppages({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.stoppageRoutesData = result.data;
				this.prepareDataSource();
			} else {
				this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
				this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
			}
		}, (error) => {
			this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
			this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
		});
	}

	getSlabs() {
		this.slabsData = [];
		this.feeService.getSlabs({ ts_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.slabsData = result.data;
			} else {
				this.slabsData = [];
			}
		}, (error) => {
			this.slabsData = [];
		});
	}

	prepareDataSource() {
		this.stoppageDataSource = new MatTableDataSource<Element>(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.stoppageRoutesData.length; i++) {
			const tempObj = {};
			if (this.stoppageRoutesData[i]['ts_id'] !== null) {
				tempObj['counter'] = counter;
				tempObj['tsp_id'] = this.stoppageRoutesData[i]['tsp_id'];
				tempObj['stop_name'] = this.stoppageRoutesData[i]['tsp_name'];
				tempObj['distance_from_school'] = this.stoppageRoutesData[i]['tsp_distance'];
				tempObj['transport_slab'] = this.stoppageRoutesData[i]['ts_name'];
				tempObj['status'] = this.stoppageRoutesData[i]['tsp_status'];
				this.TRANSPORT_STOPPAGE_ELEMENT_DATA.push(tempObj);
				counter++;
			}
		}
		this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
		this.stoppageDataSource.sort = this.sort;
		this.stoppageDataSource.paginator = this.paginator;
		this.sort.sortChange.subscribe((() => this.paginator.pageIndex = 0));
	}

	prepareForm() {
		this.transportStopagges = this.fbuild.group({
			transport_stop_name: '',
			transport_distance_from_school: '',
			transport_slab: ''
		});
	}

	patchFormValues() {
		const formData = this.stoppageRoutesData[this.currentIndex];
		this.transportStopagges.patchValue({
			transport_stop_name: formData && formData['tsp_name'] ? formData['tsp_name'] : '',
			transport_distance_from_school: formData && formData['tsp_distance'] ? formData['tsp_distance'] : '',
			transport_slab: formData && formData['tsp_slab_id'] ? formData['tsp_slab_id'] : '',
		});
	}



	callSaveAPI(inputJson) {
		this.feeService.saveStoppage(inputJson).subscribe((result: any) => {
			this.btnDisable = false;
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.resetForm();
				this.stoppageStatus = '';
				this.current_stop_id = 0;
				this.getStoppages();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	saveForm() {
		const slabArr = [];
		if (this.transportStopagges.valid) {
			this.btnDisable = true;
			let inputJson = {};
			inputJson = {
				tsp_name: this.transportStopagges.value.transport_stop_name,
				tsp_distance: this.transportStopagges.value.transport_distance_from_school,
				tsp_slab_id: this.transportStopagges.value.transport_slab,
				tsp_status: '1'
			};
			if (this.current_stop_id) {
				inputJson['tsp_id'] = this.current_stop_id;
				inputJson['tsp_status'] = this.stoppageStatus;
			}
			this.callSaveAPI(inputJson);
		} else {
			this.btnDisable = false;
			this.commonAPIService.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}
	}

	editStoppage(element) {
		this.stoppageStatus = element.status;
		this.current_stop_id = element.tsp_id;
		this.currentIndex = parseInt(element.counter, 10) - 1;
		this.patchFormValues();
	}

	deleteStoppage(element) {
		this.stoppageStatus = '5';
		this.current_stop_id = element.tsp_id;
		this.deleteModal.openModal(element);
	}

	changeStatus(element, event) {
		const inputJson = {};
		if (event.checked) {
			this.stoppageStatus = '1';
		} else {
			this.stoppageStatus = '0';
		}
		this.current_stop_id = element.tsp_id;
		inputJson['tsp_id'] = this.current_stop_id;
		inputJson['tsp_status'] = this.stoppageStatus;
		inputJson['statusUpdate'] = true;
		this.callSaveAPI(inputJson);
	}

	deleteConfirm(event) {
		const inputJson = {};
		inputJson['tsp_id'] = this.current_stop_id;
		inputJson['tsp_status'] = this.stoppageStatus;
		this.callSaveAPI(inputJson);
	}

	resetForm() {
		this.btnDisable = false;
		this.stoppageStatus = '0';
		this.prepareForm();
	}

	applyFilter(filterValue: string) {
		this.stoppageDataSource.filter = filterValue.trim().toLowerCase();
	}


}
