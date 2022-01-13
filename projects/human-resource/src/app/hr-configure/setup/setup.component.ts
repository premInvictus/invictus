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
	configValue: any = '';
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
	departmentArray: any[] = [];
	leaveManagementArray: any[] = [];
	dptFormGroupArray: any[] = [];
	configFlag = false;
	calculationFlag = false;
	multipleDropdownName: any;
	disabledApiButton = false;
	slabvalueFormGroupArray: any[] = [];
	leaveTypeArray: any[] = [];
	hrshiftArray: any[] = [];
	congigArray: any = []
	// { id: "1", name: 'Master' },
	// { id: "2", name: 'Salary Component' },
	// { id: "3", name: 'Salary Structure' },
	// { id: "4", name: 'Leave Management' },
	// { id: "5", name: 'Department Wise Leave' },
	// { id: "6", name: 'Attendance Shift' }
	// ];
	calculationTypeArray = [
		{ id: "1", name: 'Text' },
		{ id: "2", name: '%' },
		{ id: "3", name: 'Slab' },
	];
	proportionatedArray = [
		{ id: "1", name: 'Yes' },
		{ id: "2", name: 'No' },
	];
	formatTypeArray = [
		{ id: "1", name: 'Addition' },
		{ id: "2", name: 'Deduction' },
	];
	deductiontypeTypeArray = [
		{ id: "PF", name: 'PF' },
		{ id: "ESI", name: 'ESI' },
		{ id: "Security", name: 'Security' },
		{ id: "PTAX", name: 'PTAX' }
	];
	typeArray = [];
	// { id: "1", name: 'Wing Master' },
	// { id: "2", name: 'Designation Master' },
	// { id: "4", name: 'Category One' },
	// { id: "5", name: 'Category Two' },
	// { id: "6", name: 'Payment Mode' },
	// { id: "7", name: 'Department' },
	// { id: "12", name: 'Board' },
	// { id: "13", name: 'Pay Scale' },
	// { id: "14", name: 'Subject' },
	// ];
	constructor(
		private fbuild: FormBuilder,
		private erpCommonService: ErpCommonService,
		public commonService: CommonAPIService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.isExistUserAccessMenu()
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
				calculation_type: '',

				value: '',
				status: '',
				type: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				calculation_type: '',
				calculation_option: '',
				order: '',
				status: '',
				type: '',
				value: '',
				optional: false,
				upper_value: '',
				deductiontype: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				ss_component_type: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				name: '',
				aliasname: '',
				count: '',
				leave_percentage: '',
				proportionated_leave: '',
				status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				id: '',
				department_id: '',
				departmentwise_leave: '',
				status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				shift_id: '',
				shift_name: '',
				shift_intime: '',
				shift_outtime: '',
				shift_graceperiod: '',
				shift_shortleave_count: '',
				shift_leave_id: '',
				shift_status: ''
			})
		},
		];
	}
	setMandatory($event) {
		if ($event.checked) {
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				optional: true
			});
		} else {
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				optional: false
			});
		}
	}
	getGenre(that) {

	}
	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;
			} else {
				this.departmentArray = [];
			}

		});
	}
	// get genre list
	getConfiguration(event) {
		console.log('EVENT :', event);
		this.isExistUserAccessSubMenu()

		if (this.formGroupArray[this.configValue - 1].formGroup.value.type === '6') {
			this.displayedColumns = ['position', 'name', 'calculation_type', 'value', 'status', 'action'];
		} else {
			this.displayedColumns = ['position', 'name', 'status', 'action'];
		}
		this.calculationFlag = false;
		this.configArray = [];
		this.formGroupArray[this.configValue - 1].formGroup.patchValue({
			calculation_type: '',
		});
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getMaster({ type_id: event.value }).subscribe((result: any) => {
			if (result) {
				this.configArray = result;
				if (this.configValue === '1') {
					let pos = 1;
					for (const item of result) {
						console.log('ITEM of Result++++++++++++++++++', item);

						// console.log('jhjhjhh',item.type.calculation_type ? item.type.calculation_type.cy_name : '');
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.name,
							calculation_type: item.type.calculation_type ? item.type.calculation_type.cy_name : '',
							value: item.type.calculation_type ? item.type.calculation_type.cy_value : '',
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
							optional: item.sc_type.optional ? item.sc_type.optional : '',
							upper_value: item.sc_type.upper_value ? item.sc_type.upper_value : '',
							slabvalue: item.sc_calculation_type == 'Slab' ? item.slabvalue : '',
							calculation_option: item.calculation_option ? item.calculation_option : '',
							deductiontype: item.deductiontype ? item.deductiontype : '',
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

	getSalaryStructure() {
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getSalaryStr().subscribe((result: any) => {
			if (result) {
				if (this.configValue === '3') {
					let pos = 1;
					const tableName = {};
					for (const item of result) {
						let tableName = '';
						for (const det of item.ss_component_data) {
							tableName = tableName + det.sc_name + ',';
						}
						tableName = tableName.substring(0, tableName.length - 1)
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.ss_name,
							component_type: tableName,
							status: item.ss_status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			}
		});
	}
	getLeaveType() {
		this.commonService.getLeaveManagement().toPromise().then((result: any) => {
			this.leaveTypeArray = result;
		});
	}
	getShift() {
		this.hrshiftArray = [];
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getShift().subscribe((result: any) => {
			if (result) {
				this.hrshiftArray = result;
				if (this.configValue === '6') {
					let pos = 1;
					for (const item of result) {
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.shift_name,
							shift_intime: item.shift_intime,
							shift_outtime: item.shift_outtime,
							shift_graceperiod: item.shift_graceperiod,
							shift_shortleave_count: item.shift_shortleave_count,
							shift_leave_id: this.getLeaveName(item.shift_leave_id),
							status: item.shift_status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			}
		});
	}
	getLeaveName(id) {
		const findex = this.leaveTypeArray.findIndex(e => e.leave_id == id);
		if (findex != -1) {
			return this.leaveTypeArray[findex].leave_name;
		}
	}
	getLeaveManagement() {
		this.leaveManagementArray = [];
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getLeaveManagement().subscribe((result: any) => {
			if (result) {
				this.leaveManagementArray = result;
				if (this.configValue === '4') {
					let pos = 1;
					for (const item of result) {
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.leave_name,
							aliasname: item.aliasname,
							count: item.leave_count,
							leave_percentage: item.leave_percentage,
							leave_proportionated: item.leave_proportionated,
							status: item.leave_status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			}
		});
	}
	getleaveDepartment() {
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
		this.commonService.getDepartmentLeave().subscribe((result: any) => {
			if (result) {
				if (this.configValue === '5') {
					let pos = 1;
					const tableName = {};
					for (const item of result) {
						let tableName = '';
						for (const det of item.departmentwise_leave) {
							tableName = tableName + det.leave_name + ' : ' + + det.leave_credit_count + ',';
						}
						tableName = tableName.substring(0, tableName.length - 1)
						this.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.department_id.name,
							leave_credit_count: tableName,
							status: item.departmentwise_leave_status,
							action: item
						});
						pos++;
					}
					this.configDataSource = new MatTableDataSource<any>(this.CONFIG_ELEMENT_DATA);
					this.configDataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
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
		} else if (Number(this.configValue) === 3) {
			if (value.ss_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 4) {
			if (value.leave_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 5) {
			if (value.departmentwise_leave_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 6) {
			if (value.shift_status === '1') {
				return true;
			}
		}
	}

	formEdit(value: any) {
		this.dptFormGroupArray = [];
		if (Number(this.configValue) === 1) {
			this.setupUpdateFlag = true;
			if (value.type.calculation_type) {
				if (value.type.calculation_type.cy_name === '%') {
					value.type.calculation_type.cy_name = '2';
					this.calculationFlag = true;
				} else {
					this.calculationFlag = false;
					value.type.calculation_type.cy_name = '1';
				}
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.config_id,
				name: value.name,
				status: value.status,
				calculation_type: value.type.calculation_type ? value.type.calculation_type.cy_name : '',
				value: value.type.calculation_type ? value.type.calculation_type.cy_value : '',
			});
		} else if (Number(this.configValue) === 2) {
			this.setupUpdateFlag = true;
			if (value.sc_calculation_type === 'Slab') {
				value.sc_calculation_type = '3';
				if (value.slabvalue.length > 0) {
					this.slabvalueFormGroupArray = [];
					value.slabvalue.forEach(element => {
						this.addSlab(element);
					});
				}
			} else if (value.sc_calculation_type === '%') {
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
				status: value.sc_status,
				calculation_option: value.calculation_option,
				deductiontype: value.deductiontype,
				upper_value: value.sc_type && value.sc_type.upper_value ? value.sc_type.upper_value : '',
				optional: value.sc_type.type_id === '2' && value.sc_type.optional ? value.sc_type.optional : false
			});
		} else if (Number(this.configValue) === 3) {
			this.setupUpdateFlag = true;
			let tableName = [];
			for (const det of value.ss_component_data) {
				tableName.push(det.sc_id);
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.ss_id,
				name: value.ss_name,
				ss_component_type: tableName
			});
		} else if (Number(this.configValue) === 4) {
			this.setupUpdateFlag = true;
			if (value.leave_proportionated === 'Yes') {
				value.leave_proportionated = '1';
			} else {
				value.leave_proportionated = '2';
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.leave_id,
				name: value.leave_name,
				aliasname: value.aliasname,
				count: value.leave_count,
				leave_percentage: value.leave_percentage,
				proportionated_leave: value.leave_proportionated,
			});
		} else if (Number(this.configValue) === 5) {
			this.setupUpdateFlag = true;
			for (let j = 0; j < value.departmentwise_leave.length; j++) {
				this.dptFormGroupArray.push({
					formGroup: this.fbuild.group({
						leave_id: value.departmentwise_leave[j]['leave_id'],
						leave_name: value.departmentwise_leave[j]['leave_name'],
						leave_credit_count: value.departmentwise_leave[j]['leave_credit_count'],
						leave_proportionated: value.departmentwise_leave[j]['leave_proportionated']
					})
				});
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				id: value.dept_id,
				department_id: value.department_id.id,
			});
		} else if (Number(this.configValue) === 6) {
			console.log('value', value);
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				shift_id: value.shift_id,
				shift_name: value.shift_name,
				shift_intime: value.shift_intime,
				shift_outtime: value.shift_outtime,
				shift_graceperiod: value.shift_graceperiod,
				shift_shortleave_count: value.shift_shortleave_count,
				shift_leave_id: value.shift_leave_id,
				shift_status: value.shift_status,
			});
			console.log('form 6', this.formGroupArray[this.configValue - 1]);
		}
	}
	async loadConfiguration(event) {
		this.searchtoggle = false;
		this.configFlag = false;
		this.setupUpdateFlag = false;
		this.configValue = event.value;
		if (Number(this.configValue) === 1) {
			this.getConfiguration({ 'value': '1' });
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				type: '1',
			});
			if (this.formGroupArray[this.configValue - 1].formGroup.value.type === 6) {
				this.displayedColumns = ['position', 'name', 'calculation_type', 'value', 'status', 'action'];
			} else {
				this.displayedColumns = ['position', 'name', 'status', 'action'];
			}
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) {
			this.getSalaryComponent();
			this.addSlab();
			this.displayedColumns =
				['position', 'name', 'calculation_type', 'type', 'value', 'slabvalue', 'order', 'optional', 'upper_value', 'calculation_option', 'status', 'action'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 3) {
			this.getSalaryComponent();
			this.getSalaryStructure();
			this.displayedColumns = ['position', 'name', 'component_type', 'status', 'action'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 4) {
			this.getLeaveManagement();
			this.displayedColumns = ['position', 'name', 'aliasname', 'count', 'leave_percentage', 'leave_proportionated', 'status', 'action'];
			this.configFlag = true;
		}
		else if (Number(this.configValue) === 5) {
			this.getDepartment();
			this.getLeaveManagement();
			this.getleaveDepartment();
			this.displayedColumns = ['position', 'name', 'leave_credit_count', 'status', 'action'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 6) {
			await this.getLeaveType();
			await this.getShift();
			this.displayedColumns = ['position', 'name', 'shift_intime', 'shift_outtime', 'shift_graceperiod', 'shift_shortleave_count', 'shift_leave_id', 'status', 'action'];
			this.configFlag = true;
		}
	}








	addSlab(value = '') {
		if (this.slabvalueFormGroupArray.length == 0) {
			this.slabvalueFormGroupArray.push(
				{
					formGroup: this.fbuild.group({
						value: value
					})
				}
			);
		} else {
			if (this.slabvalueFormGroupArray[this.slabvalueFormGroupArray.length - 1].formGroup.get('value').value) {
				this.slabvalueFormGroupArray.push(
					{
						formGroup: this.fbuild.group({
							value: value
						})
					}
				);
			}
		}

		//console.log('this.slabvalueFormGroupArray',this.slabvalueFormGroupArray);
	}
	deleteSlab(i) {
		this.slabvalueFormGroupArray.splice(i, 1);
	}
	getDepartmentLeave() {
		this.dptFormGroupArray = [];
		for (let j = 0; j < this.leaveManagementArray.length; j++) {
			this.dptFormGroupArray.push({
				formGroup: this.fbuild.group({
					leave_id: this.leaveManagementArray[j]['leave_id'],
					leave_name: this.leaveManagementArray[j]['leave_name'],
					leave_proportionated: this.leaveManagementArray[j]['leave_proportionated'],
					leave_credit_count: ''
				})
			});
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
				this.deleteEntry(data, 'updateSalaryComponent', 'data');
				break;
			case '3':
				data.ss_status = '5';
				this.deleteEntry(data, 'updateSalaryStructure', 'data');
				break;
			case '4':
				data.leave_status = '5';
				this.deleteEntry(data, 'updateLeaveManagement', 'data');
				break;
			case '5':
				data.departmentwise_leave_status = '5';
				this.deleteEntry(data, 'updateDepartmentLeave', 'data');
				break;
			case '6':
				data.shift_status = '5';
				this.deleteEntry(data, 'updateShift', 'data');
				break;
		}
	}

	addConfiguration(value) {
		this.setupDetails = [];
		if (value == 2) {
			// console.log("i am hee", this.formGroupArray[value - 1].formGroup);
			if (this.formGroupArray[value - 1].formGroup.controls.calculation_type.value == '1') {
				this.formGroupArray[value - 1].formGroup.patchValue({
					upper_value: ''
				})
				this.formGroupArray[value - 1].formGroup.controls.upper_value.setErrors(null);
				// this.formGroupArray[value - 1].formGroup.controls.upper_value.clearValidators();
				// this.formGroupArray[value - 1].formGroup.controls.upper_value.markAsUntouched();
			}
		}
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			this.disabledApiButton = true;
			switch (value) {
				case '1':
					this.setupDetails = {
						type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.gettypeName(this.formGroupArray[value - 1].formGroup.value.type),
							calculation_type: {
								cy_name: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
								cy_value: this.formGroupArray[value - 1].formGroup.value.value
							}
						},
						name: this.formGroupArray[value - 1].formGroup.value.name,
						status: '1',
					};
					this.addEntry(this.setupDetails, 'insertMaster', this.formGroupArray[value - 1].formGroup.value.type);
					break;
				case '2':
					let slabvalueArr: any[] = [];
					if (this.slabvalueFormGroupArray.length > 0) {
						this.slabvalueFormGroupArray.forEach(element => {
							if (element.formGroup.get('value').value) {
								slabvalueArr.push(element.formGroup.get('value').value);
							}
						});
					}

					this.setupDetails = {
						sc_name: this.formGroupArray[value - 1].formGroup.value.name,
						sc_type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.getName(this.formGroupArray[value - 1].formGroup.value.type, this.formatTypeArray),
							optional: this.formGroupArray[value - 1].formGroup.value.type === '2' ?
								this.formGroupArray[value - 1].formGroup.value.optional : '',
							upper_value: this.formGroupArray[value - 1].formGroup.value.upper_value
								? this.formGroupArray[value - 1].formGroup.value.upper_value : '',
						},
						sc_order: this.formGroupArray[value - 1].formGroup.value.order,
						sc_value: this.formGroupArray[value - 1].formGroup.value.value,
						sc_calculation_type: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
						sc_status: '1',
						calculation_option: this.formGroupArray[value - 1].formGroup.value.calculation_option,
						deductiontype: this.formGroupArray[value - 1].formGroup.value.deductiontype,
						slabvalue: slabvalueArr
					};
					this.addEntry(this.setupDetails, 'insertSalaryComponent', this.formGroupArray[value - 1].formGroup.value.type);
					break;
				case '3':
					this.setupDetails = {
						ss_component_data: this.getJsonFromArray(this.formGroupArray[value - 1].formGroup.value.ss_component_type),
						ss_name: this.formGroupArray[value - 1].formGroup.value.name,
						ss_status: '1'
					};
					this.addEntry(this.setupDetails, 'insertSalaryStructure', this.formGroupArray[value - 1].formGroup.value.type);
					break;
				case '4':
					this.setupDetails = {
						leave_name: this.formGroupArray[value - 1].formGroup.value.name,
						aliasname: this.formGroupArray[value - 1].formGroup.value.aliasname,
						leave_count: this.formGroupArray[value - 1].formGroup.value.count,
						leave_percentage: this.formGroupArray[value - 1].formGroup.value.leave_percentage,
						leave_proportionated: this.getName(this.formGroupArray[value - 1].formGroup.value.proportionated_leave, this.proportionatedArray),
						leave_status: '1'
					};
					this.addEntry(this.setupDetails, 'insertLeaveManagement', 'data');
					break;
				case '5':
					let temp_arr = [];
					for (var i = 0; i < this.leaveManagementArray.length; i++) {
						temp_arr.push(this.dptFormGroupArray[i].formGroup.value);
					}
					this.setupDetails = {
						department_id: {
							id: this.formGroupArray[value - 1].formGroup.value.department_id,
							name: this.getDepartmentName(this.formGroupArray[value - 1].formGroup.value.department_id)
						},
						departmentwise_leave: temp_arr,
						departmentwise_leave_status: '1'
					};
					this.commonService.checkDepartmentEntry({ 'dept_id': this.formGroupArray[value - 1].formGroup.value.department_id }).subscribe((result: any) => {
						if (result) {
							this.disabledApiButton = false;
							this.getleaveDepartment();
							this.dptFormGroupArray = [];
							this.resetForm(this.configValue);
							this.commonService.showSuccessErrorMessage('Department Leave already Exist .', 'error');
						} else {
							this.addEntry(this.setupDetails, 'insertDepartmentLeave', 'data');
						}
					});
					break;
				case '6':
					this.setupDetails = {
						shift_name: this.formGroupArray[value - 1].formGroup.value.shift_name,
						shift_intime: this.formGroupArray[value - 1].formGroup.value.shift_intime,
						shift_outtime: this.formGroupArray[value - 1].formGroup.value.shift_outtime,
						shift_graceperiod: this.formGroupArray[value - 1].formGroup.value.shift_graceperiod,
						shift_shortleave_count: this.formGroupArray[value - 1].formGroup.value.shift_shortleave_count,
						shift_leave_id: this.formGroupArray[value - 1].formGroup.value.shift_leave_id,
						shift_status: '1'
					};
					this.addEntry(this.setupDetails, 'insertShift', 'data');
					break;
			}
		}
	}

	updateConfiguration(value) {
		this.setupDetails = [];
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			this.disabledApiButton = true;
			switch (value) {
				case '1':
					this.setupDetails = {
						type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.gettypeName(this.formGroupArray[value - 1].formGroup.value.type),
							calculation_type: {
								cy_name: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
								cy_value: this.formGroupArray[value - 1].formGroup.value.value
							}
						},
						name: this.formGroupArray[value - 1].formGroup.value.name,
						status: '1',
						config_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateMaster', this.formGroupArray[value - 1].formGroup.value.type);
					this.setupUpdateFlag = false;
					break;
				case '2':
					let slabvalueArr: any[] = [];
					if (this.slabvalueFormGroupArray.length > 0) {
						this.slabvalueFormGroupArray.forEach(element => {
							if (element.formGroup.get('value').value) {
								slabvalueArr.push(element.formGroup.get('value').value);
							}
						});
					}

					this.setupDetails = {
						sc_name: this.formGroupArray[value - 1].formGroup.value.name,
						sc_type: {
							type_id: this.formGroupArray[value - 1].formGroup.value.type,
							type_name: this.getName(this.formGroupArray[value - 1].formGroup.value.type, this.formatTypeArray),
							optional: this.formGroupArray[value - 1].formGroup.value.type === '2'
								&& this.formGroupArray[value - 1].formGroup.value.optional ?
								this.formGroupArray[value - 1].formGroup.value.optional : '',
							upper_value: this.formGroupArray[value - 1].formGroup.value.upper_value
								? this.formGroupArray[value - 1].formGroup.value.upper_value : '',
						},
						sc_order: this.formGroupArray[value - 1].formGroup.value.order,
						sc_value: this.formGroupArray[value - 1].formGroup.value.value,
						sc_calculation_type: this.getName(this.formGroupArray[value - 1].formGroup.value.calculation_type, this.calculationTypeArray),
						sc_status: '1',
						calculation_option: this.formGroupArray[value - 1].formGroup.value.calculation_option,
						deductiontype: this.formGroupArray[value - 1].formGroup.value.deductiontype,
						sc_id: this.formGroupArray[value - 1].formGroup.value.id,
						slabvalue: slabvalueArr
					};
					this.updateEntry(this.setupDetails, 'updateSalaryComponent', this.formGroupArray[value - 1].formGroup.value.type);
					this.setupUpdateFlag = false;
					break;
				case '3':
					this.setupDetails = {
						ss_component_data: this.getJsonFromArray(this.formGroupArray[value - 1].formGroup.value.ss_component_type),
						ss_name: this.formGroupArray[value - 1].formGroup.value.name,
						ss_status: '1',
						ss_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateSalaryStructure', this.formGroupArray[value - 1].formGroup.value.type);
					this.setupUpdateFlag = false;
					break;
				case '4':
					this.setupDetails = {
						leave_name: this.formGroupArray[value - 1].formGroup.value.name,
						aliasname: this.formGroupArray[value - 1].formGroup.value.aliasname,
						leave_count: this.formGroupArray[value - 1].formGroup.value.count,
						leave_percentage: this.formGroupArray[value - 1].formGroup.value.leave_percentage,
						leave_proportionated: this.getName(this.formGroupArray[value - 1].formGroup.value.proportionated_leave, this.proportionatedArray),
						leave_status: '1',
						leave_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateLeaveManagement', this.formGroupArray[value - 1].formGroup.value.type);
					this.setupUpdateFlag = false;
					break;
				case '5':
					let temp_arr = [];
					for (var i = 0; i < this.leaveManagementArray.length; i++) {
						temp_arr.push(this.dptFormGroupArray[i].formGroup.value);
					}
					this.setupDetails = {
						department_id: {
							id: this.formGroupArray[value - 1].formGroup.value.department_id,
							name: this.getDepartmentName(this.formGroupArray[value - 1].formGroup.value.department_id)
						},
						departmentwise_leave: temp_arr,
						departmentwise_leave_status: '1',
						dept_id: this.formGroupArray[value - 1].formGroup.value.id
					};
					this.updateEntry(this.setupDetails, 'updateDepartmentLeave', 'data');
					break;
				case '6':
					this.setupDetails = {
						shift_id: this.formGroupArray[value - 1].formGroup.value.shift_id,
						shift_name: this.formGroupArray[value - 1].formGroup.value.shift_name,
						shift_intime: this.formGroupArray[value - 1].formGroup.value.shift_intime,
						shift_outtime: this.formGroupArray[value - 1].formGroup.value.shift_outtime,
						shift_graceperiod: this.formGroupArray[value - 1].formGroup.value.shift_graceperiod,
						shift_shortleave_count: this.formGroupArray[value - 1].formGroup.value.shift_shortleave_count,
						shift_status: this.formGroupArray[value - 1].formGroup.value.shift_status,
						shift_leave_id: this.formGroupArray[value - 1].formGroup.value.shift_leave_id
					};
					this.updateEntry(this.setupDetails, 'updateShift', this.formGroupArray[value - 1].formGroup.value.type);
					this.setupUpdateFlag = false;
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
			this.commonService.updateMaster(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getConfiguration({ 'value': value.type.type_id });
				}
			});
		} else if (Number(this.configValue) === 2) {
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
		} else if (Number(this.configValue) === 3) {
			if (value.ss_status === '1') {
				value.ss_status = '0';
			} else {
				value.ss_status = '1';
			}
			this.commonService.updateSalaryStructure(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSalaryStructure();
				}
			});
		} else if (Number(this.configValue) === 4) {
			if (value.leave_status === '1') {
				value.leave_status = '0';
			} else {
				value.leave_status = '1';
			}
			this.commonService.updateLeaveManagement(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getLeaveManagement();
				}
			});
		} else if (Number(this.configValue) === 5) {
			if (value.departmentwise_leave_status === '1') {
				value.departmentwise_leave_status = '0';
			} else {
				value.departmentwise_leave_status = '1';
			}
			this.commonService.updateDepartmentLeave(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getleaveDepartment();
				}
			});
		} else if (Number(this.configValue) === 6) {
			if (value.shift_status === '1') {
				value.shift_status = '0';
			} else {
				value.shift_status = '1';
			}
			this.commonService.updateShift(value).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getShift();
				}
			});
		}
	}
	deleteEntry(deletedData, serviceName, next) {
		this.commonService[serviceName](deletedData).subscribe((result: any) => {
			if (result) {
				if (this.configValue === '1') {
					this.getConfiguration({ 'value': next });
				} else if (this.configValue === '2') {
					this.getSalaryComponent();
				} else if (this.configValue === '3') {
					this.getSalaryStructure();
				} else if (this.configValue === '4') {
					this.getLeaveManagement();
				} else if (this.configValue === '5') {
					this.dptFormGroupArray = [];
					this.getleaveDepartment();
				} else if (this.configValue === '6') {
					this.hrshiftArray = [];
					this.getShift();
				}
				this.commonService.showSuccessErrorMessage('Delete Successfully', 'success');
			}
		});
	}
	addEntry(data, serviceName, next) {
		this.commonService[serviceName](data).subscribe((result: any) => {
			this.disabledApiButton = false;
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
				} else if (this.configValue === '3') {
					this.getSalaryStructure();
					this.resetForm(this.configValue);
				} else if (this.configValue === '4') {
					this.getLeaveManagement();
					this.resetForm(this.configValue);
				} else if (this.configValue === '5') {
					this.getleaveDepartment();
					this.dptFormGroupArray = [];
					this.resetForm(this.configValue);
				} else if (this.configValue === '6') {
					this.getShift();
					this.hrshiftArray = [];
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
			this.disabledApiButton = false;
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
				} else if (this.configValue === '3') {
					this.getSalaryStructure();
					this.resetForm(this.configValue);
				} else if (this.configValue === '4') {
					this.getLeaveManagement();
					this.resetForm(this.configValue);
				} else if (this.configValue === '5') {
					this.getleaveDepartment();
					this.dptFormGroupArray = [];
					this.resetForm(this.configValue);
				} else if (this.configValue === '6') {
					this.getShift();
					this.hrshiftArray = [];
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
	getDepartmentName(dept_id) {
		const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dept_id));
		if (findIndex !== -1) {
			return this.departmentArray[findIndex].dept_name;
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
	getJsonFromArray(event) {
		const salaryCompute: any[] = [];
		for (let item of event) {
			const findIndex = this.configArray.findIndex(f => Number(f.sc_id) === Number(item));
			if (findIndex !== -1) {
				salaryCompute.push(this.configArray[findIndex]);
			}
		}
		return salaryCompute;
	}

	deleteCancel() {

	}

	/**
	 * First if statement is a hack in 
	 * isExistUserAccessMenu
	 * If removed: first option will not show up
	 * 
	 * Reason : Unclear
	 */
	isExistUserAccessMenu() {
		// this.congigArray = []
		let abc = 1
		if (this.commonService.isExistUserAccessMenu({ id: '940', call: 'firstCall' })) {
			// if (true == true) return;
		}
		if (this.commonService.isExistUserAccessMenu('940')) {
			this.congigArray.push({ id: "1", name: 'Master' })
		}
		if (this.commonService.isExistUserAccessMenu('941')) {
			this.congigArray.push({ id: "2", name: 'Salary Component' })
		}
		if (this.commonService.isExistUserAccessMenu('942')) {
			this.congigArray.push({ id: "3", name: 'Salary Structure' })
		}
		if (this.commonService.isExistUserAccessMenu('943')) {
			this.congigArray.push({ id: "4", name: 'Leave Management' })
		}
		if (this.commonService.isExistUserAccessMenu('944')) {
			this.congigArray.push({ id: "5", name: 'Department Wise Leave' })
		}
		if (this.commonService.isExistUserAccessMenu('945')) {
			this.congigArray.push({ id: "6", name: 'Attendance Shift' })
		}
		console.log('AFTER ENDING: ++++++++++', this.congigArray)
	}

	isExistUserAccessSubMenu() {
		// this.typeArray = []
		if (this.commonService.isExistUserAccessMenu('946')) {
			this.typeArray.push({ id: "1", name: 'Wing Master' })
		}
		if (this.commonService.isExistUserAccessMenu('947')) {
			this.typeArray.push({ id: "2", name: 'Designation Master' })
		}
		if (this.commonService.isExistUserAccessMenu('948')) {
			this.typeArray.push({ id: "4", name: 'Category One' })
		}
		if (this.commonService.isExistUserAccessMenu('949')) {
			this.typeArray.push({ id: "5", name: 'Category Two' })
		}
		if (this.commonService.isExistUserAccessMenu('950')) {
			this.typeArray.push({ id: "6", name: 'Payment Mode' })
		}
		if (this.commonService.isExistUserAccessMenu('951')) {
			this.typeArray.push({ id: "7", name: 'Department' })
		}
		if (this.commonService.isExistUserAccessMenu('952')) {
			this.typeArray.push({ id: "12", name: 'Board' })
		}
		if (this.commonService.isExistUserAccessMenu('953')) {
			this.typeArray.push({ id: "13", name: 'Pay Scale' })
		}
		if (this.commonService.isExistUserAccessMenu('954')) {
			this.typeArray.push({ id: "14", name: 'Subject' })
		}
		console.log('++++++++++++++++ After updating ++++++++++++++', this.typeArray);

	}
}
