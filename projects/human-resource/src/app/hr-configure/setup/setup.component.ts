import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, AfterViewInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	configValue: any;
	currentUser: any;
	session: any;
	param: any = {};
	systemInfoForm: FormGroup;
	setupUpdateFlag = false;
	searchtoggle = false;
	editFlag = false;
	showConfigForm = '';
	setupDetails: any = {};
	file: any;
	finalXlsTopicArray: any[] = [];
	XlslArray: any[] = [];
	arrayBuffer: any;
	subjectTypeArr: any[] = [];
	CONFIG_ELEMENT_DATA: any[] = [];
	configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'calculation_type', 'type', 'value', 'order', 'status', 'action'];
	firstHeaderArray: any[] = [];
	secondHeaderArray: any[] = [];
	configArray: any[] = [];
	configFlag = false;
	calculationFlag = false;
	congigArray = [
		{ id: "1", name: 'Master' },
		{ id: "2", name: 'Salary Compopnent' },
		{ id: "3", name: 'Salary Structure' },
	];
	calculationTypeArray = [
		{ id: "1", name: 'Text' },
		{ id: "2", name: '%' },
	];
	formatTypeArray = [
		{ id: "1", name: 'Addition' },
		{ id: "2", name: 'Deducation' },
	];
	typeArray = [
		{ id: "1", name: 'Wing Master' },
		{ id: "2", name: 'Designation Master' },
		{ id: "3", name: 'Category One' },
		{ id: "4", name: 'Category Two' },
		{ id: "5", name: 'Category Three' },
	];
	constructor(
		private fbuild: FormBuilder,
		private erpCommonService: ErpCommonService,
		public commonService: CommonAPIService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
	}



	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				status: '',
				type: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				calculation_type: '',
				order: '',
				status: '',
				type: '',
				value: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				ss_component_type: ''
			})
		},
		];
	}
	getGenre(that) {

	}

	// get genre list
	getConfiguration(event) {
		this.configArray = [];
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getMaster({ type_id: event.value }).subscribe((result: any) => {
			console.log(result);
			if (result) {
				this.configArray = result;
				if (this.configValue === '1') {
					let pos = 1;
					for (const item of result) {
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.name,
							status: item.status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			} else {
				this.configArray = [];
			}
		});
	}

	getSalaryComponent() {
		this.configArray = [];
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getSalaryComponent().subscribe((result: any) => {
			if (result) {
				this.configArray = result;
				if (this.configValue === '2') {
					let pos = 1;
					for (const item of result) {
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.sc_name,
							order: item.sc_order,
							value: item.sc_value,
							type: item.sc_type.type_name,
							calculation_type: item.sc_calculation_type,
							status: item.sc_status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			} else {
				this.configArray = [];
			}
		});
	}
	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
		this.setupUpdateFlag = false;
	}


	validateForm() {
		let validateFlag = false;
		if (this.showConfigForm === '1') {
			if (this.systemInfoForm.value.name === '') {
				this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
				validateFlag = false;
			} else {
				validateFlag = true;
			}
		}
		return validateFlag;
	}


	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 2) {
			if (value.sc_status === '1') {
				return true;
			}
		}
	}

	formEdit(value: any) {
		if (Number(this.configValue) === 1) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.config_id,
				name: value.sc_name,
				status: value.status
			});
		} else if (Number(this.configValue) === 2) {
			this.setupUpdateFlag = true;
			if (value.sc_calculation_type === '%') {
				value.sc_calculation_type = '2';
				this.calculationFlag = true;
			} else {
				this.calculationFlag = false;
				value.sc_calculation_type = '1';
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.sc_id,
				name: value.sc_name,
				type: value.sc_type.type_id,
				order: value.sc_order,
				value: value.sc_value,
				calculation_type: value.sc_calculation_type,
				status: value.sc_status
			});
		}
	}

	loadConfiguration(event) {
		this.searchtoggle = false;
		this.configFlag = false;
		this.setupUpdateFlag = false;
		this.configValue = event.value;
		if (Number(this.configValue) === 1) {
			this.getConfiguration({ 'value': '1' });
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				type: '1',
			});
			this.displayedColumns = ['position', 'name', 'status', 'action'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) {
			this.getSalaryComponent();
			this.displayedColumns = ['position', 'name', 'calculation_type', 'type', 'value', 'order', 'status', 'action'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 3) {
			this.getSalaryComponent();
			this.displayedColumns = ['position', 'name', 'component_type', 'status', 'action'];
			this.configFlag = true;
		}
	}
	getCalculationValue(event) {
		if (event.value === '2') {
			this.calculationFlag = true;
		} else {
			this.calculationFlag = false;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				value: '',
			});
		}
	}
	deleteConfirm({ data, type }) {
		switch (type) {
			case '1':
				data.status = '5';
				this.deleteEntry(data, 'updateMaster', data.type.type_id);
				break;
			case '2':
				data.sc_status = '5';
				this.deleteEntry(data, 'updateSalaryComponent', data.type);
				break;
		}
	}

	addConfiguration(value) {
		this.setupDetails = [];
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.setupDetails = {
						type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.gettypeName(this.formGroupArray[value - 1].formGroup.value.type)
						},
						name: this.formGroupArray[value - 1].formGroup.value.name,
						status: '1',
					};
					this.addEntry(this.setupDetails, 'insertMaster', this.formGroupArray[value - 1].formGroup.value.type);
					break;
				case '2':
					this.setupDetails = {
						sc_name: this.formGroupArray[value - 1].formGroup.value.name,
						sc_type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.getName(this.formGroupArray[value - 1].formGroup.value.type, this.formatTypeArray)
						},
						sc_order: this.formGroupArray[value - 1].formGroup.value.order,
						sc_value: this.formGroupArray[value - 1].formGroup.value.value,
						sc_calculation_type: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
						sc_status: '1',
					};
					this.addEntry(this.setupDetails, 'insertSalaryComponent', this.formGroupArray[value - 1].formGroup.value.type);
					break;
			}
		}
	}

	updateConfiguration(value) {
		this.setupDetails = [];
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.setupDetails = {
						type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.gettypeName(this.formGroupArray[value - 1].formGroup.value.type)
						},
						name: this.formGroupArray[value - 1].formGroup.value.name,
						status: '1',
						config_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateMaster', this.formGroupArray[value - 1].formGroup.value.type);
					break;
				case '2':
					this.setupDetails = {
						sc_name: this.formGroupArray[value - 1].formGroup.value.name,
						sc_type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.getName(this.formGroupArray[value - 1].formGroup.value.type, this.formatTypeArray)
						},
						sc_order: this.formGroupArray[value - 1].formGroup.value.order,
						sc_value: this.formGroupArray[value - 1].formGroup.value.value,
						sc_calculation_type: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
						sc_status: '1',
						sc_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateSalaryComponent', this.formGroupArray[value - 1].formGroup.value.type);
					break;
			}
		}
	}

	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.status === '1') {
				value.status = '0';
			} else {
				value.status = '1';
			}
			console.log(value);
			this.commonService.updateMaster(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getConfiguration({ 'value': value.type.type_id });
				}
			});
		}
		if (Number(this.configValue) === 2) {
			if (value.sc_status === '1') {
				value.sc_status = '0';
			} else {
				value.sc_status = '1';
			}
			this.commonService.updateSalaryComponent(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSalaryComponent();
				}
			});
		}
	}

	applyFilter(event) {
		this.configDataSource.filter = event.trim().toLowerCase();
	}

	deleteEntry(deletedData, serviceName, next) {
		this.commonService[serviceName](deletedData).subscribe((result: any) => {
			if (result) {
				if (this.configValue === '1') {
					this.getConfiguration({ 'value': next });
				} else if (this.configValue === '1') {
					this.getSalaryComponent();
				}
				this.commonService.showSuccessErrorMessage('Delete Successfully', 'success');
			}
		});
	}
	addEntry(data, serviceName, next) {
		console.log(data);
		this.commonService[serviceName](data).subscribe((result: any) => {
			if (result) {
				if (this.configValue === '1') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						name: '',
					});
					this.getConfiguration({ 'value': next });
				} else if (this.configValue === '2') {
					this.getSalaryComponent();
					this.calculationFlag = false;
					this.resetForm(this.configValue);
				}
				this.commonService.showSuccessErrorMessage('Inserted Successfully', 'success');
			} else {
				this.commonService.showSuccessErrorMessage('failed', 'error');
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.commonService[serviceName](data).subscribe((result: any) => {
			if (result) {
				if (this.configValue === '1') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						name: '',
					});
					this.getConfiguration({ 'value': next });
				} else if (this.configValue === '2') {
					this.getSalaryComponent();
					this.calculationFlag = false;
					this.resetForm(this.configValue);
				}
				this.commonService.showSuccessErrorMessage('Updated Successfully', 'success');
			} else {
				this.commonService.showSuccessErrorMessage('failed', 'error');
			}
		});
	}
	getConfigName(config_id) {
		const findIndex = this.congigArray.findIndex(f => Number(f.id) === Number(config_id));
		if (findIndex !== -1) {
			return this.congigArray[findIndex].name;
		}
	}
	gettypeName(type_id) {
		const findIndex = this.typeArray.findIndex(f => Number(f.id) === Number(type_id));
		if (findIndex !== -1) {
			return this.typeArray[findIndex].name;
		}
	}
	getName(id, array) {
		const findIndex = array.findIndex(f => Number(f.id) === Number(id));
		if (findIndex !== -1) {
			return array[findIndex].name;
		}
	}
}
