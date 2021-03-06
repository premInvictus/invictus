import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-admin-return',
	templateUrl: './admin-return.component.html',
	styleUrls: ['./admin-return.component.scss']
})
export class AdminReturnComponent implements OnInit {

	@ViewChild('searchModal') searchModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeData: any;
	salaryHeadsArr: any[] = [];
	shacolumns: any[] = [];
	empShacolumns: any[] = [];
	shdcolumns: any[] = [];
	empShdcolumns: any[] = [];
	formGroupArray: any[] = [];
	formGroupArray2: any[] = [];
	session_id;
	paymentModeArray: any[] = [];
	SALARY_COMPUTE_ELEMENT: AdminReturnElement[] = [];
	salaryComputeDataSource = new MatTableDataSource<AdminReturnElement>(this.SALARY_COMPUTE_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedSalaryComputeColumns: string[] = [];
	salaryComputeEmployeeData: any[] = [];
	salaryComputeEmployeeIds: any[] = [];
	sessionArray: any[] = [];
	sessionName: any;
	netSalary: any = 0;
	totalEarning: any = 0;
	deduction: any = 0;
	earning: any = 0;
	disabledApiButton = false;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
	schoolInfo: any;
	length: any;
	settingData: any;
	currentUser: any;
	showPdf = false;
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
		this.getPaymentModes();
		this.getSalaryHeads();

	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
		});
	}

	getPaymentModes() {
		this.commonAPIService.getMaster({ type_id: "6" }).subscribe((res: any) => {
			if (res) {
				//this.paymentModeArray = res;
				for (let i = 0; i < res.length; i++) {
					var calculation_type = 'text';
					var calculation_value = 0;
					if (res && res[i] && res[i]['type'] && res[i]['type']['calculation_type'] && res[i]['type']['calculation_type']['cy_name'] === '%') {
						calculation_value = res[i]['type']['calculation_type']['cy_value'];
						calculation_type = res[i]['type']['calculation_type']['cy_name'];
					}

					var inputJson = {
						'pm_id': res[i]['name'] ? res[i]['name'].trim().toLowerCase().replace(' ', '_') : '',
						'pm_name': res[i]['name'],
						'pm_value': 0,
						'calculation_type': calculation_type,
						'calculation_value': calculation_value
					}
					this.paymentModeArray.push(inputJson);
				}
			}
		});
	}

	getSession() {
		this.erpCommonService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						if (this.session_id) {
							this.sessionName = this.sessionArray[this.session_id.ses_id];
						}

					}
				});
	}

	getSchool() {
		this.erpCommonService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
	}
	getSalaryHeads() {
		this.commonAPIService.getSalaryHeads({}).subscribe((res: any) => {
			if (res) {
				this.salaryHeadsArr = [];
				this.salaryHeadsArr = res;
				this.shacolumns = [];
				this.shdcolumns = [];
				this.shacolumns[0] = { columnDef: 'Basic Pay', header: 'Basic Pay', data: { sc_type: { 'type_id': 1 } } };
				for (var i = 0; i < this.salaryHeadsArr.length; i++) {
					//console.log("this.salaryHeadsArr[i]['sc_type']", this.salaryHeadsArr[i]['sc_type']);
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 1) {
						this.shacolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i] });
					}
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 2) {
						this.shdcolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i], value: 0 });
					}
				}
			}
		});
	}

	getAllEmployee() {
		let element: any = {};
		let recordArray = [];
		this.SALARY_COMPUTE_ELEMENT = [];
		this.displayedSalaryComputeColumns = ['emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];
		this.salaryComputeDataSource = new MatTableDataSource<AdminReturnElement>(this.SALARY_COMPUTE_ELEMENT);
		let inputJson = {
			'month_id': this.searchForm.value.month_id,
			'emp_status': 'live'
		};
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
			this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_salary_payable');
			if (result && result.length > 0) {
				for (let i = 0; i < this.shacolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
				}
				this.displayedSalaryComputeColumns.push('emp_total_earnings');
				for (let i = 0; i < this.shdcolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
				}
				this.displayedSalaryComputeColumns.push('emp_total');
				this.displayedSalaryComputeColumns.push('balance');
				let pos = 1;
				recordArray = result;
				console.log(result);
				if (this.salaryComputeEmployeeData.length > 0) {
					for (var i = 0; i < this.salaryComputeEmployeeData.length; i++) {
						recordArray[i]['emp_salary_detail']['emp_salary_structure'] = this.salaryComputeEmployeeData[i].emp_salary_compute_data.emp_salary_structure;

					}
				}
				let mos = 0;
				for (const item of recordArray) {
					var editableStatus = true;
					let emp_present_days = 0;
					this.empShacolumns = [];
					this.empShdcolumns = [];
					var total_deductions = 0;
					var total_earnings = 0;
					var formJson = {
						emp_id: item.emp_id,
						advance: ''
					};
					var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));
					var empBasicPay = item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale) : 0;

					for (var i = 0; i < this.shacolumns.length; i++) {
						if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
							var value = 0;

							if (this.shacolumns[i]['header'] === 'Basic Pay') {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
							} else {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
							}

							if (item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
										) {
											if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												if (this.salaryComputeEmployeeData.length > 0) {
													const findex = this.salaryComputeEmployeeData[mos].emp_salary_compute_data.empShacolumns.findIndex(f => f.header === item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_name']);
													if (findex !== -1) {
														value = this.salaryComputeEmployeeData[mos].emp_salary_compute_data.empShacolumns[findex].value;
													} else {
														value = 0;
													}

												} else {
													value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
												}

											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;
											}

											this.empShacolumns[i]['value'] = value;
											this.shacolumns[i]['value'] = value;
											total_earnings = total_earnings + Number(value);

										} else {
											this.shacolumns[i]['value'] = 0;
											this.empShacolumns[i]['value'] = 0;
										}
									}
								}
							}
						}
					}
					for (var i = 0; i < this.shdcolumns.length; i++) {
						if (Number(this.shdcolumns[i]['data']['sc_type']['type_id']) === 2) {
							var value = 0;
							this.empShdcolumns[i] = { columnDef: this.shdcolumns[i]['data']['sc_name'], header: this.shdcolumns[i]['data']['sc_name'], value: 0 };

							if (item.emp_salary_detail
								&& item.emp_salary_detail.emp_salary_structure
								&& item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
									if (this.shdcolumns[i]['data'] && item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
										) {
											if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												if (this.salaryComputeEmployeeData.length > 0) {
													const findex = this.salaryComputeEmployeeData[mos].emp_salary_compute_data.empShdcolumns.findIndex(f => f.header === item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_name']);
													if (findex !== -1) {
														value = this.salaryComputeEmployeeData[mos].emp_salary_compute_data.empShdcolumns[findex].value;
													} else {
														value = 0;
													}
												} else {
													value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
												}
											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;
											}
											this.empShdcolumns[i]['value'] = value;
											this.shdcolumns[i]['value'] = value;
											total_deductions = total_deductions - Number(value);

										} else {
											this.shdcolumns[i]['value'] = 0;
											this.empShdcolumns[i]['value'] = 0;
										}
									}
								}
							}

						}
					}
					if (item.emp_month_attendance_data && item.emp_month_attendance_data.month_data) {
						for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
							var emp_month = item.emp_month_attendance_data.month_data[i].month_id;
							var emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
							if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
								emp_present_days = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_total_attendance : 0;
							}
						}
					}
					if (editableStatus) {
						var salary_payable = 0;
						total_earnings = item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_total_earning : 0;

						total_earnings = Number(total_earnings);
						var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
						emp_present_days = emp_present_days ? emp_present_days : 0;
						salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) + Number(total_deductions));
						const jsonInput1: any = {};
						for (var i = 0; i < this.shacolumns.length; i++) {
							if (i === 0) {
								jsonInput1[this.shacolumns[i]['header']] = empBasicPay;
							} else {
								jsonInput1[this.shacolumns[i]['header']] = this.shacolumns[i]['value'];
							}
						}
						this.formGroupArray2[pos - 1] = this.fbuild.group(jsonInput1);

						const jsonInput: any = {};
						for (var i = 0; i < this.shdcolumns.length; i++) {
							jsonInput[this.shdcolumns[i]['header']] = this.shdcolumns[i]['value'];
						}
						this.formGroupArray[pos - 1] = this.fbuild.group(jsonInput);

						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_name: item.emp_name,
							emp_salary_compute_month_id: this.searchForm.value.month_id,
							emp_designation: item.emp_designation_detail && item.emp_designation_detail.name ? item.emp_designation_detail.name : '',
							emp_pay_scale: item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
							emp_salary_structure: item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure : 0,
							emp_salary_heads: item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
							emp_allowances: '',
							empShacolumns: this.empShacolumns,
							empShdcolumns: this.empShdcolumns,
							emp_total_earnings: total_earnings,
							emp_total_deductions: total_deductions,
							emp_deductions: item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
							emp_present_days: emp_present_days,
							emp_salary_payable: emp_present_days ? salary_payable : 0,
							emp_pay_mode: item.emp_salary_detail && item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],

							emp_total: '',
							emp_status: item.emp_status ? item.emp_status : 'live',
							balance: '',
							isEditable: editableStatus
						};
					}
					this.SALARY_COMPUTE_ELEMENT.push(element);
					pos++;
					mos++;
				}
				this.getNetSalary();
				this.salaryComputeDataSource = new MatTableDataSource<AdminReturnElement>(this.SALARY_COMPUTE_ELEMENT);
				this.salaryComputeDataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.salaryComputeDataSource.sort = this.sort;
				}
			}
		});

	}
	getDynamicValue(weigtage, value) {
		if (Number(value) > 0) {
			return (Number((Number(value) * Number(weigtage)) / 100)).toFixed(2);
		} else {
			return 0;
		}
	}

	getSalaryComputeEmployee() {
		let inputJson = {
			'month_id': this.searchForm.value.month_id
		};

		this.commonAPIService.getAdminReturn(inputJson).subscribe((result: any) => {
			if (result) {
				this.salaryComputeEmployeeData = result;
				for (var i = 0; i < result.length; i++) {
					this.salaryComputeEmployeeIds.push(Number(result[i]['emp_salary_compute_data']['emp_id']));
				}
				this.getAllEmployee();
			} else {
				this.salaryComputeEmployeeData = [];
				this.getAllEmployee();
			}

		});
	}

	getDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};

	setNetTotal(element, event) {
		var value = 0;
		if (event.target.value) {
			value = event.target.value;
		}
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['emp_id'] === element.emp_id) {
				this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
				for (var j = 0; j < this.paymentModeArray.length; j++) {
					if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']) + Number(this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']]);
						this.SALARY_COMPUTE_ELEMENT[i]['balance'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) - Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']);
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						} else {
							element.colorCode = '';
						}
					} else {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']) + 0;

						this.SALARY_COMPUTE_ELEMENT[i]['balance'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) - Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']);
					}
				}
			}
		}


	}

	setNetSalary(element, event) {
		var value = 0;
		if (event.target.value) {
			value = event.target.value;
		}
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
				//this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
				var salary_payable = 0;
				var total_earnings = Number(element.emp_total_earnings);
				var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
				this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Math.round(((Number(total_earnings)) * (Number(element.emp_present_days) / Number(no_of_days))) + Number(value) + Number(element.emp_total_deductions));
				this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
			}
		}
	}


	openFilter() {
		this.searchModal.openModal();
	}

	resetAll() {
		this.buildForm();
		this.getSalaryHeads();
	}

	save() {
		this.disabledApiButton = true;
		var inputArr = [];
		var edit = false;
		let inputJson = {};
		var finJson = {};
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			inputJson = this.SALARY_COMPUTE_ELEMENT[i];
			for (var j = 0; j < this.shacolumns.length; j++) {
				inputJson['empShacolumns'][j]['value'] = this.formGroupArray2[i].value[this.shacolumns[j]['header']];
			}
			for (var j = 0; j < this.shdcolumns.length; j++) {
				inputJson['empShdcolumns'][j]['value'] = this.formGroupArray[i].value[this.shdcolumns[j]['header']];
			}
			inputJson['emp_salary_structure']['emp_basic_pay_scale'] = this.formGroupArray2[i].value['Basic Pay'];
			inputJson['emp_salary_structure']['emp_net_salary'] = this.SALARY_COMPUTE_ELEMENT[i].emp_total;
			inputArr.push(inputJson);
		}

		finJson['emp_salary_compute_month_id'] = this.searchForm.value.month_id;
		finJson['emp_salary_compute_data'] = inputArr;
		if (this.salaryComputeEmployeeData.length > 0) {
			this.commonAPIService.updateAdminReturn(finJson).subscribe((result: any) => {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Admin Return Updated Successfully', 'success');
			});
		} else {
			this.commonAPIService.insertAdminReturn(finJson).subscribe((result: any) => {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Admin Return Inserted Successfully', 'success');
				this.getSalaryComputeEmployee();
			});
		}



	}


	applyFilter(filterValue: string) {
		this.salaryComputeDataSource.filter = filterValue.trim().toLowerCase();
		console.log('this.salaryComputeDataSource--', this.salaryComputeDataSource)
	}

	// searchOk(event) {
	// 	this.commonAPIService.getFilterData(event).subscribe((result: any) => {
	// 		let element: any = {};
	// 		let recordArray = [];
	// 		this.employeeData = result;
	// 		this.SALARY_COMPUTE_ELEMENT = [];
	// 		this.displayedSalaryComputeColumns = ['emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];
	// 		this.salaryComputeDataSource = new MatTableDataSource<AdminReturnElement>(this.SALARY_COMPUTE_ELEMENT);
	// 		if (result && result.length > 0) {
	// 			for (let i = 0; i < this.shacolumns.length; i++) {
	// 				this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
	// 			}
	// 			this.displayedSalaryComputeColumns.push('emp_total_earnings');
	// 			for (let i = 0; i < this.shdcolumns.length; i++) {
	// 				this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
	// 			}
	// 			this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
	// 			for (let i = 0; i < this.paymentModeArray.length; i++) {
	// 				this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
	// 			}
	// 			this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status');
	// 			let pos = 1;
	// 			let recordArray = result;


	// 			for (const item of recordArray) {
	// 				var editableStatus = false;
	// 				let emp_present_days = 0;
	// 				this.empShacolumns = [];
	// 				this.empShdcolumns = [];
	// 				var total_deductions = 0;
	// 				var total_earnings = 0;

	// 				var formJson = {
	// 					emp_id: item.emp_id,
	// 					advance: ''
	// 				};

	// 				var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));




	// 				var empBasicPay = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale) : 0;

	// 				for (var i = 0; i < this.shacolumns.length; i++) {
	// 					if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
	// 						var value = 0;

	// 						if (this.shacolumns[i]['header'] === 'Basic Pay') {
	// 							this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
	// 						} else {
	// 							this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
	// 						}

	// 						if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
	// 							for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
	// 								if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

	// 									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
	// 										item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
	// 										Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
	// 									) {
	// 										if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
	// 											value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
	// 										}

	// 										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
	// 											value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;
	// 										}

	// 										this.empShacolumns[i]['value'] = value;
	// 										this.shacolumns[i]['value'] = value;
	// 										total_earnings = total_earnings + Number(value);

	// 									} else {
	// 										this.shacolumns[i]['value'] = 0;
	// 										this.empShacolumns[i]['value'] = 0;
	// 									}
	// 								}
	// 							}
	// 						}



	// 					}
	// 				}
	// 				for (var i = 0; i < this.shdcolumns.length; i++) {
	// 					if (Number(this.shdcolumns[i]['data']['sc_type']['type_id']) === 2) {
	// 						var value = 0;
	// 						this.empShdcolumns[i] = { columnDef: this.shdcolumns[i]['data']['sc_name'], header: this.shdcolumns[i]['data']['sc_name'], value: 0 };

	// 						if (item.emp_salary_detail
	// 							&& item.emp_salary_detail.emp_salary_structure
	// 							&& item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
	// 							for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
	// 								if (this.shdcolumns[i]['data'] && item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

	// 									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
	// 										item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
	// 										Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
	// 									) {
	// 										if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
	// 											value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
	// 										}

	// 										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
	// 											value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

	// 										}
	// 										this.empShdcolumns[i]['value'] = value;
	// 										this.shdcolumns[i]['value'] = value;
	// 										total_deductions = total_deductions - Number(value);

	// 									} else {
	// 										this.shdcolumns[i]['value'] = 0;
	// 										this.empShdcolumns[i]['value'] = 0;
	// 									}
	// 								}
	// 							}
	// 						}

	// 					}

	// 				}

	// 				if (item.emp_month_attendance_data && item.emp_month_attendance_data.month_data) {
	// 					for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
	// 						var emp_month = item.emp_month_attendance_data.month_data[i].month_id;
	// 						var emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
	// 						if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {

	// 							emp_present_days = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_total_attendance : 0;

	// 						}
	// 					}
	// 				}



	// 				var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));
	// 				if (eIndex > -1) {
	// 					if (this.salaryComputeEmployeeData[eIndex] && Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_id']) === Number(item.emp_id)
	// 						&& Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_month_id']) === Number(this.searchForm.value.month_id)
	// 						&& Number(this.salaryComputeEmployeeData[eIndex]['session_id']) === Number(this.session_id.ses_id)) {
	// 						editableStatus = true;
	// 					} else {
	// 						editableStatus = false;
	// 					}
	// 				} else {
	// 					editableStatus = false;
	// 				}


	// 				if (editableStatus) {
	// 					var salary_payable = 0;
	// 					total_earnings = this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] : 0;
	// 					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
	// 					emp_present_days = emp_present_days ? emp_present_days : 0;
	// 					salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) + Number(total_deductions));

	// 					for (var i = 0; i < this.paymentModeArray.length; i++) {
	// 						formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] : '';
	// 					}

	// 					//this.formGroupArray[pos - 1] = this.fbuild.group(formJson);


	// 					element = {
	// 						srno: pos,
	// 						emp_id: item.emp_id,
	// 						emp_name: item.emp_name,
	// 						emp_salary_compute_month_id: this.searchForm.value.month_id,
	// 						emp_designation: item.emp_designation_detail.name,
	// 						emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
	// 						emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
	// 						emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
	// 						emp_allowances: '',
	// 						empShacolumns: this.empShacolumns,
	// 						empShdcolumns: this.empShdcolumns,
	// 						emp_total_earnings: total_earnings,
	// 						emp_total_deductions: total_deductions,
	// 						emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
	// 						emp_present_days: emp_present_days,
	// 						emp_salary_payable: emp_present_days ? salary_payable : 0,
	// 						emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
	// 						emp_modes_data: {
	// 							emp_id: item.emp_id,
	// 							advance: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['advance'],
	// 							mode_data: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['mode_data']
	// 						},
	// 						emp_total: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total'],
	// 						emp_status: item.emp_status ? item.emp_status : 'live',
	// 						balance: Number(emp_present_days ? salary_payable : 0) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']),
	// 						isEditable: editableStatus
	// 					};

	// 					// if (element.emp_salary_payable) {
	// 					// 	var deduction = 0;
	// 					// 	var tdeduction = 0;
	// 					// 	for (let pi = 0; pi < this.paymentModeArray.length; pi++) {

	// 					// 		if (this.paymentModeArray[pi]['calculation_type'] === '%') {
	// 					// 			if (element.emp_modes_data.mode_data[pi]) {
	// 					// 				element.emp_modes_data.mode_data[pi]['pm_value'] = (((salary_payable) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100);


	// 					// 				deduction = deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']);
	// 					// 			} else {

	// 					// 				var inputJson = {
	// 					// 						'pm_id': this.paymentModeArray[pi]['pm_id'],
	// 					// 						'pm_name': this.paymentModeArray[pi]['pm_name'],
	// 					// 						'pm_value': (((salary_payable) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100),
	// 					// 						'calculation_type': this.paymentModeArray[pi]['calculation_type'],
	// 					// 						'calculation_value': this.paymentModeArray[pi]['calculation_value']
	// 					// 					};

	// 					// 				element.emp_modes_data.mode_data.push(inputJson);

	// 					// 				tdeduction =  Number(element.emp_modes_data.mode_data[pi]['pm_value']);
	// 					// 			}

	// 					// 		}

	// 					// 	}
	// 					// 	element.balance = (Number(emp_present_days ? salary_payable : 0) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']) - deduction - tdeduction).toFixed(2);

	// 					// 	element.emp_total = deduction + tdeduction;

	// 					// 	for (var i = 0; i < this.paymentModeArray.length; i++) {
	// 					// 		formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] : '';
	// 					// 	}

	// 					// 	this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
	// 					// }
	// 				} else {
	// 					for (var i = 0; i < this.paymentModeArray.length; i++) {
	// 						formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] : '';
	// 					}

	// 					//this.formGroupArray[pos - 1] = this.fbuild.group(formJson);


	// 					var salary_payable = 0;
	// 					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
	// 					emp_present_days = emp_present_days ? emp_present_days : 0;


	// 					salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) + Number(total_deductions));


	// 					element = {
	// 						srno: pos,
	// 						emp_id: item.emp_id,
	// 						emp_name: item.emp_name,
	// 						emp_salary_compute_month_id: this.searchForm.value.month_id,
	// 						emp_designation: item.emp_designation_detail.name,
	// 						emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
	// 						emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
	// 						emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
	// 						emp_allowances: '',
	// 						empShacolumns: this.empShacolumns,
	// 						empShdcolumns: this.empShdcolumns,
	// 						emp_total_earnings: Number(empBasicPay) + total_earnings,
	// 						emp_total_deductions: total_deductions,
	// 						emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
	// 						emp_present_days: emp_present_days,
	// 						emp_salary_payable: emp_present_days ? Number(empBasicPay) + salary_payable : 0,
	// 						emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
	// 						emp_modes_data: {
	// 							emp_id: item.emp_id,
	// 							advance: '',
	// 							mode_data: this.paymentModeArray
	// 						},
	// 						emp_total: 0,
	// 						emp_status: item.emp_status ? item.emp_status : 'live',
	// 						isEditable: editableStatus,
	// 						colorCode: '',
	// 						balance: Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0,
	// 					};


	// 					if (element.emp_salary_payable) {
	// 						var deduction = 0;
	// 						for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
	// 							if (this.paymentModeArray[pi]['calculation_type'] === '%') {
	// 								// console.log(element.emp_modes_data.mode_data[pi]);
	// 								// element.emp_modes_data.mode_data[pi]['pm_value'] = (((Number(empBasicPay) + salary_payable) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100);
	// 								// var event = {target : {value : this.paymentModeArray[pi]['pm_value'].toFixed(2)}};
	// 								// console.log('event', event);
	// 								//this.setNetTotal(element, event);

	// 								if (element.emp_modes_data.mode_data[pi]) {
	// 									element.emp_modes_data.mode_data[pi]['pm_value'] = (((salary_payable) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100);
	// 									deduction = deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']);
	// 									// console.log('event', element.balance);
	// 									//this.setNetTotal(element, event);
	// 								}

	// 								element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;

	// 							} else {
	// 								var tdeduction = 0;
	// 								var inputJson = {
	// 									'pm_id': this.paymentModeArray[pi]['name'] ? this.paymentModeArray[pi]['name'].trim().toLowerCase().replace(' ', '_') : '',
	// 									'pm_name': this.paymentModeArray[pi]['name'],
	// 									'pm_value': (((salary_payable) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100),
	// 									'calculation_type': this.paymentModeArray[pi]['calculation_type'],
	// 									'calculation_value': this.paymentModeArray[pi]['calculation_value']
	// 								};

	// 								element.emp_modes_data.mode_data.push(inputJson);

	// 								tdeduction = Number(element.emp_modes_data.mode_data[pi]['pm_value']);

	// 								element.balance = element.balance - tdeduction;
	// 							}
	// 						}


	// 					}
	// 				}

	// 				this.SALARY_COMPUTE_ELEMENT.push(element);
	// 				pos++;
	// 			}

	// 			this.salaryComputeDataSource = new MatTableDataSource<AdminReturnElement>(this.SALARY_COMPUTE_ELEMENT);
	// 			this.salaryComputeDataSource.paginator = this.paginator;
	// 			if (this.sort) {
	// 				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	// 				this.salaryComputeDataSource.sort = this.sort;
	// 			}
	// 		}
	// 	});
	// }

	getNetSalary() {
		var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			this.earning = 0;
			this.deduction = 0;
			this.totalEarning = 0;
			this.netSalary = 0;
			if (this.formGroupArray2.length > 0) {
				for (var j = 0; j < this.shacolumns.length; j++) {
					this.earning = Number(this.earning) + Number(this.formGroupArray2[i].value[this.shacolumns[j]['header']]);
				}
			}
			if (this.formGroupArray.length > 0) {
				for (var j = 0; j < this.shdcolumns.length; j++) {
					this.deduction = Number(this.deduction) + Number(this.formGroupArray[i].value[this.shdcolumns[j]['header']]);
				}
			}
			if (Number(this.SALARY_COMPUTE_ELEMENT[i].emp_present_days) > 0) {
				this.totalEarning = Math.round((Number(this.earning) * Number(this.SALARY_COMPUTE_ELEMENT[i].emp_present_days) / Number(no_of_days)) - Number(this.deduction));
			}
			this.SALARY_COMPUTE_ELEMENT[i].emp_total_earnings = this.earning;
			this.SALARY_COMPUTE_ELEMENT[i].emp_total = this.totalEarning;
		}

	}

	checkWidth(id, header) {

		const res = this.SALARY_COMPUTE_ELEMENT.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}

	downloadExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'emp_id',
			width: this.checkWidth('emp_id', 'Emp. ID')
		});
		columns.push({
			key: 'emp_name',
			width: this.checkWidth('emp_name', 'Emp Name')
		});
		columns.push({
			key: 'emp_designation',
			width: this.checkWidth('emp_designation', 'Designation')
		});
		columns.push({
			key: 'emp_pay_scale',
			width: this.checkWidth('emp_pay_scale', 'Pay Scale')
		});
		// columns.push({
		// 	key: 'emp_total_earnings',
		// 	width: this.checkWidth('emp_total_earnings', 'Total Earnings')
		// });
		columns.push({
			key: 'emp_present_days',
			width: this.checkWidth('emp_present_days', 'Present Days')
		});
		columns.push({
			key: 'emp_salary_payable',
			width: this.checkWidth('emp_salary_payable', 'Salary Payable')
		});
		columns.push({
			key: 'emp_pay_scale',
			width: this.checkWidth('emp_pay_scale', 'Total')
		});
		columns.push({
			key: 'emp_status',
			width: this.checkWidth('emp_status', 'Status')
		});
		columns.push({
			key: 'balance',
			width: this.checkWidth('balance', 'Balance')
		});

		reportType2 = new TitleCasePipe().transform('employeesalarycomputereport_') + this.sessionName;
		reportType = new TitleCasePipe().transform('Employee Salary Compute report: ') + this.sessionName;
		const fileName = 'EmployeeSalaryCompute_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
		worksheet.getCell('A2').value = new TitleCasePipe().transform('EmployeeSalaryCompute  ') + this.sessionName;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:B3');
		worksheet.getCell('A3').value = '';
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('C3:D3');
		worksheet.getCell('C3').value = '';
		worksheet.getCell(`C3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('E3:F3');
		worksheet.getCell('E3').value = '';
		worksheet.getCell(`E3`).alignment = { horizontal: 'left' };

		worksheet.getCell('A5').value = 'Emp. ID';
		worksheet.getCell('B5').value = 'Emp Name';
		worksheet.getCell('C5').value = 'Designation';
		worksheet.getCell('D5').value = 'Pay Scale';
		worksheet.getCell('E5').value = 'Present Days';
		worksheet.getCell('F5').value = 'Salary Payable';
		worksheet.getCell('G5').value = 'Net Salary';
		worksheet.getCell('H5').value = 'Difference';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let totRow = this.length + this.salaryComputeDataSource.filteredData.length + 5;

		worksheet.mergeCells('A' + totRow + ':' + 'E' + totRow);
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.salaryComputeDataSource.filteredData.length;
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' };
		for (const item of this.salaryComputeDataSource.filteredData) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = item.emp_id;
			worksheet.getCell('B' + this.length).value = item.emp_name;
			worksheet.getCell('C' + this.length).value = item.emp_designation;
			worksheet.getCell('D' + this.length).value = item.emp_pay_scale;
			worksheet.getCell('E' + this.length).value = item.emp_present_days;
			worksheet.getCell('F' + this.length).value = item.emp_salary_payable;
			worksheet.getCell('G' + this.length).value = item.emp_total;
			worksheet.getCell('H' + this.length).value = Number(item.emp_salary_payable) - Number(item.emp_total);
			worksheet.addRow(obj);
		}


		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 3) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
			}

			if (rowNum === totRow || rowNum === (totRow + 1)) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 4 || rowNum === 5) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum >= 6 && rowNum <= this.SALARY_COMPUTE_ELEMENT.length + 6) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length

					if (rowNum % 2 === 0) {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					} else {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					}

					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			} else if (rowNum === totRow || rowNum === (totRow + 1)) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
				row.eachCell(cell => {
					cell.alignment = { horizontal: 'text', vertical: 'top', wrapText: true };
				});
			}
		});
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});
	}

	downloadPdf() {
		this.showPdf = true;
		const doc = new jsPDF('landscape');

		doc.autoTable({
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 15,
			},
			useCss: true,
			theme: 'striped'
		});

		doc.autoTable({
			head: [[new TitleCasePipe().transform(' Employee Admin Return report: ') + this.sessionName]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 13,
			},
			useCss: true,
			theme: 'striped'
		});

		doc.autoTable({
			html: '#salary_compute_log',
			headerStyles: {
				fontStyle: 'normal',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 14,
			},
			useCss: true,
			styles: {
				fontSize: 14,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89A8C9',
			},
			theme: 'grid'
		});

		doc.autoTable({
			head: [['Report Generated By : ' + this.currentUser.full_name], [['Total Records : ' + this.salaryComputeDataSource.filteredData.length]]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 13,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.save('EmployeeSalaryCompute_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
		this.showPdf = false;
	}
	searchOk(event) {

	}

	reset() {
		this.getSalaryComputeEmployee();
	}

	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id)
	}


}
export interface AdminReturnElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_pay_scale: string;
	emp_total_earnings: any;
	emp_present_days: any;
	emp_salary_payable: any;
	emp_advance: any;
	emp_total: any;
	emp_status: any;
	empShacolumns: any;
	empShdcolumns: any;
	emp_modes_data: any;
	balance: any;
}