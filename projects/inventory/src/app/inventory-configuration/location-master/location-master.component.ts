import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-location-master',
	templateUrl: './location-master.component.html',
	styleUrls: ['./location-master.component.css']
})
export class LocationMasterComponent implements OnInit {

	@ViewChild('deleteModalRef') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	locationForm: FormGroup;
	configValue: any;
	currentUser: any;
	session: any;
	locationArray: any[] = [];
	locationTypeArray: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource: any = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['srno', 'location_name', 'location_parent_name', 'location_type_name', 'location_status', 'action'];
	configFlag = false;
	editFlag = false;
	currentLocationId: any;

	constructor(
		private fbuild: FormBuilder,
		public commonAPIService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getLocationType();
		this.getLocation();
	}

	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog(data) {
		console.log('data--', data);
		this.deleteModal.openModal(data);
	}

	buildForm() {
		this.locationForm = this.fbuild.group({
			location_id: '',
			location_name: '',
			location_parent_id: '',
			location_type_id: '',
			location_status: ''
		});
	}

	getLocationType() {
		var inputJson = {};
		this.commonAPIService.getMaster({ type_id: '2' }).subscribe((result: any) => {
			if (result) {
				this.locationTypeArray = result;
			} else {
				this.locationTypeArray = [];
			}
		});
	}

	getLocation() {
		var inputJson = {};
		this.commonAPIService.getLocation(inputJson).subscribe((result: any) => {
			if (result) {
				this.locationArray = result;
				let element: any = {};
				this.CONFIG_ELEMENT_DATA = [];
				this.configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
				let pos = 1;
				for (const item of this.locationArray) {
					element = {
						srno: pos,
						location_id: item.location_id,
						location_name: item.location_name,
						location_parent_id: item.location_parent_id,
						location_parent_name: item.location_parent_id ? this.getLocationParentName(item.location_parent_id) : '',
						location_status: item.location_status,
						location_type_id: item.location_type_id,
						location_type_name: '',
						action: item
					};
					this.CONFIG_ELEMENT_DATA.push(element);
					pos++;

				}
				this.configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
				this.configDataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			} else {
				this.locationArray = [];
			}
		});
	}

	save() {
		console.log(this.locationForm);
		var inputJson = {
			location_id: this.locationForm.value.location_id ? this.locationForm.value.location_id : 0,
			location_parent_id: this.locationForm.value.location_parent_id ? this.locationForm.value.location_parent_id : 0,
			location_type_id: this.locationForm.value.location_type_id ? this.locationForm.value.location_type_id : 0,
			location_name: this.locationForm.value.location_name ? this.locationForm.value.location_name : '',
			location_status: this.locationForm.value.location_status ? this.locationForm.value.location_status : 1
		}

		if (this.locationForm.value.location_id) {
			this.commonAPIService.updateLocation(inputJson).subscribe((result) => {
				if (result) {
					this.commonAPIService.showSuccessErrorMessage('Location Updated Successfully', 'success');
					this.resetForm();
					this.getLocation();
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Updating Location', 'error');
				}
			});
		} else {
			this.commonAPIService.insertLocation(inputJson).subscribe((result) => {
				if (result) {
					this.commonAPIService.showSuccessErrorMessage('Location Saved Successfully', 'success');
					this.resetForm();
					this.getLocation();
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Saving Location', 'error');
				}
			});
		}
	}

	edit(element) {
		this.editFlag = true;
		this.locationForm.patchValue({
			location_id: element.location_id ? element.location_id : 0,
			location_name: element.location_name ? element.location_name : '',
			location_parent_id: element.location_parent_id ? element.location_parent_id : 0,
			location_type_id: element.location_type_id ? element.location_type_id : 0,
			location_status: element.location_status ? element.location_status : 1
		});
	}

	toggleStatus(element) {
		this.editFlag = true;
		this.locationForm.patchValue({
			location_id: element.location_id ? element.location_id : 0,
			location_name: element.location_name ? element.location_name : '',
			location_parent_id: element.location_parent_id ? element.location_parent_id : 0,
			location_type_id: element.location_type_id ? element.location_type_id : 0,
			location_status: element.location_status === '1' ? '0' : '1'
		});

		this.save();
	}

	applyFilterLocation(filterValue: string) {
		this.configDataSource.filter = filterValue.trim().toLowerCase();
	}

	deleteLocation(data) {
		if (this.currentLocationId) {
			this.currentLocationId['location_status'] = '5';
			this.commonAPIService.updateLocation(this.currentLocationId).subscribe((res: any) => {
				if (res) {
					this.commonAPIService.showSuccessErrorMessage(res.message, res.status);
					this.getLocation();
				} else {
					this.commonAPIService.showSuccessErrorMessage(res.message, res.status);
				}
			})
		}
	}

	deleteLocationModel(location_id) {
		this.currentLocationId = location_id;
	}

	getLocationParentName(locationId) {
		for (const item of this.locationArray) {
			if (Number(item.location_id) === Number(locationId)) {
				return item.location_name;
			}
		}
	}

	resetForm() {
		this.locationForm.reset();
		this.editFlag = false;
	}


}

export class ConfigElement {
	location_id: string;
	location_name: string;
	location_parent_name: string;
	location_type_name: string;
	location_status: string;
	action: any;
}
