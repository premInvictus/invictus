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
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

	@ViewChild('searchModal') searchModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeData: any;
	salaryHeadsArr: any[] = [];
	shacolumns = [];
	empShacolumns = [];
	shdcolumns = [];
	empShdcolumns = [];
	formGroupArray = [];
	session_id;
	editFlag = false;
	paymentModeArray: any[] = [
		// {
		// 	pm_id: 'bank_transfer',
		// 	pm_name: 'Bank Transfer',
		// 	pm_value: 0
		// },
		// {
		// 	pm_id: 'cash_payment',
		// 	pm_name: 'Cash Payment',
		// 	pm_value: 0

		// },
		// {
		// 	pm_id: 'cheque_payment',
		// 	pm_name: 'Cheque Payment',
		// 	pm_value: 0
		// },
	];

	SALARY_COMPUTE_ELEMENT: ReportComputeElement[] = [];
	salaryComputeDataSource = new MatTableDataSource<ReportComputeElement>(this.SALARY_COMPUTE_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedSalaryComputeColumns: string[] = [];
	salaryComputeEmployeeData: any[] = [];
	salaryComputeEmployeeIds: any[] = [];
	sessionArray: any[] = [];
	sessionName: any;
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
		this.getAllEmployee();

	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			//pay_date: ''

		});
	}

	getPaymentModes() {
		this.commonAPIService.getMaster({ type_id: "6" }).subscribe((res: any) => {
			if (res) {
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
				//this.getAllEmployee();
			}
		});
	}

	getAllEmployee() {
		let element: any = {};
		let recordArray = [];
		// this.employeeData = result;
		this.SALARY_COMPUTE_ELEMENT = [];
		this.displayedSalaryComputeColumns = ['emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];
		this.salaryComputeDataSource = new MatTableDataSource<ReportComputeElement>(this.SALARY_COMPUTE_ELEMENT);
		//this.getSalaryComputeEmployee();
		let inputJson = {
			'month_id': '',

		};
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
			if (result && result.length > 0) {
				var temp_arr = [];
				for (let i = 0; i < this.shacolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
				}
				this.displayedSalaryComputeColumns.push('emp_total_earnings');
				for (let i = 0; i < this.shdcolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
				}
				this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
				for (let i = 0; i < this.paymentModeArray.length; i++) {
					this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
				}
				this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status');
				let pos = 1;
				let recordArray = result;


				for (const item of recordArray) {
					element = {};
					var editableStatus = false;
					let emp_present_days = 0;
					this.empShacolumns = [];
					this.empShdcolumns = [];
					var total_deductions = 0;
					var total_earnings = 0;

					var formJson = {
						emp_id: item.emp_id,
						advance: ''
					};

					//var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));

					var empBasicPay = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale) : 0;

					for (var i = 0; i < this.shacolumns.length; i++) {
						if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
							var value = 0;

							if (this.shacolumns[i]['header'] === 'Basic Pay') {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
							} else {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
							}

							if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
										) {
											if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;
											}

											this.empShacolumns[i]['value'] = value.toFixed(2);
											this.shacolumns[i]['value'] = value.toFixed(2);
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
												value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

											}
											this.empShdcolumns[i]['value'] = value.toFixed(2);
											this.shdcolumns[i]['value'] = value.toFixed(2);
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



					var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));
					if (eIndex > -1) {
						if (this.salaryComputeEmployeeData[eIndex] && Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_id']) === Number(item.emp_id)
							&& Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_month_id']) === Number(this.searchForm.value.month_id)
							&& Number(this.salaryComputeEmployeeData[eIndex]['session_id']) === Number(this.session_id.ses_id)) {
							editableStatus = true;
						} else {
							editableStatus = false;
						}
					} else {
						editableStatus = false;
					}



					if (editableStatus) {
						var salary_payable = 0;
						total_earnings = this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] : 0;
						var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
						emp_present_days = emp_present_days ? emp_present_days : 0;
						salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) + Number(total_deductions));

						for (var i = 0; i < this.paymentModeArray.length; i++) {
							formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] : '';
						}

						this.formGroupArray[pos - 1] = this.fbuild.group(formJson);

						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_name: item.emp_name,
							emp_salary_compute_month_id: this.searchForm.value.month_id,
							emp_designation: item.emp_designation_detail.des_name,
							emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_name : '',
							emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
							emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
							emp_allowances: '',
							empShacolumns: this.empShacolumns,
							empShdcolumns: this.empShdcolumns,
							emp_total_earnings: total_earnings,
							emp_total_deductions: total_deductions,
							emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
							emp_present_days: emp_present_days,
							emp_salary_payable: emp_present_days ? salary_payable : 0,
							emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
							emp_modes_data: {
								emp_id: item.emp_id,
								advance: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['advance'],
								mode_data: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['mode_data']
							},
							emp_total: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total'],
							emp_status: item.emp_status ? item.emp_status : 'live',
							balance: Number(emp_present_days ? salary_payable : 0) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']),
							isEditable: editableStatus
						};
					} else {


						var salary_payable = 0;
						var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
						emp_present_days = emp_present_days ? emp_present_days : 0;


						salary_payable = Math.round(((Number(empBasicPay) + total_earnings) * Number(emp_present_days)) / Number(no_of_days) + Number(total_deductions));
						//console.log('salary_payable',total_earnings, salary_payable);
						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_name: item.emp_name,
							emp_salary_compute_month_id: this.searchForm.value.month_id,
							emp_designation: item.emp_designation_detail.des_name,
							emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_name : '',
							emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
							emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
							emp_allowances: '',
							empShacolumns: this.empShacolumns,
							empShdcolumns: this.empShdcolumns,
							emp_total_earnings: Number(empBasicPay) + total_earnings,
							emp_total_deductions: total_deductions,
							emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
							emp_present_days: emp_present_days,
							emp_salary_payable: emp_present_days ? salary_payable : 0,
							emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
							emp_modes_data: {
								emp_id: item.emp_id,
								advance: '',
								mode_data: []
							},
							emp_total: 0,
							emp_status: item.emp_status ? item.emp_status : 'live',
							isEditable: editableStatus,
							colorCode: '',
							balance: Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0,
						};


						if (element) {
							var deduction = 0;
							for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
								if (this.paymentModeArray[pi]['calculation_type'] === '%') {
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': (((Math.round(((Number(empBasicPay) + total_earnings) * Number(emp_present_days)) / Number(no_of_days) + Number(total_deductions))) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100),
										'calculation_type': this.paymentModeArray[pi]['calculation_type'],
										'calculation_value': this.paymentModeArray[pi]['calculation_value']
									};
									element.emp_modes_data.mode_data.push(inputJson);
									if (element.emp_modes_data.mode_data[pi]) {
										deduction = deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']);
									}

									//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
									element.balance = element.emp_salary_payable - deduction;
									element.emp_total = deduction;

									formJson[this.paymentModeArray[pi]['pm_id']] = (((Math.round(((Number(empBasicPay) + total_earnings) * Number(emp_present_days)) / Number(no_of_days) + Number(total_deductions))) * Number(this.paymentModeArray[pi]['calculation_value'])) / 100);


								} else {
									//console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': 0,
										'calculation_type': this.paymentModeArray[pi]['calculation_type'],
										'calculation_value': this.paymentModeArray[pi]['calculation_value']
									};

									formJson[this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Number(element.emp_modes_data.mode_data[pi]['pm_value']);

									element.balance = element.balance - tdeduction;
								}
							}



							this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
						}
					}
					this.SALARY_COMPUTE_ELEMENT.push(element);

					pos++;
				}



				this.salaryComputeDataSource = new MatTableDataSource<ReportComputeElement>(this.SALARY_COMPUTE_ELEMENT);
				this.salaryComputeDataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.salaryComputeDataSource.sort = this.sort;
				}
			}
		});

	}

	getSalaryComputeEmployee() {
		let inputJson = {
			'month_id': this.searchForm.value.month_id
		};

		this.commonAPIService.getSalaryCompute(inputJson).subscribe((result: any) => {
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
		// Here January is 1 based
		//Day 0 is the last day in the previous month
		return new Date(year, month, 0).getDate();
		// Here January is 0 based
		// return new Date(year, month+1, 0).getDate();
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
				//this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
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


	openFilter() {
		this.searchModal.openModal();
	}

	resetAll() {
		this.buildForm();
		this.getSalaryHeads();
	}

	save() {
		var inputArr = [];
		var edit = false;
		let inputJson = {};
		var finJson = {};
		var validationStatus = false;
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['colorCode']) {
				this.commonAPIService.showSuccessErrorMessage('Please Correct Higlighted Employee Salary Total Amount, Should not be gretaer than Salary Payble', 'error');
				validationStatus = true;
			}
		}
		if (!validationStatus) {
			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				inputJson = this.SALARY_COMPUTE_ELEMENT[i];
				inputJson['emp_modes_data']['emp_id'] = this.formGroupArray[i]['value']['emp_id'];
				inputJson['emp_modes_data']['advance'] = this.formGroupArray[i]['value']['advance'];
				inputJson['emp_modes_data']['advance'] = this.formGroupArray[i]['value']['advance'];
				inputJson['emp_modes_data']['mode_data'] = [];
				if (this.SALARY_COMPUTE_ELEMENT[i]['isEditable']) {
					edit = true;
				} else {
					edit = false;
				}
				for (var j = 0; j < this.paymentModeArray.length; j++) {
					if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {
						inputJson['emp_modes_data']['mode_data'].push(
							{ pm_id: this.paymentModeArray[j]['pm_id'], pm_name: this.paymentModeArray[j]['pm_name'], pm_value: this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']] }
						)
					}
				}
				inputArr.push(inputJson);
			}

			finJson['emp_salary_compute_month_id'] = this.searchForm.value.month_id;
			finJson['emp_salary_compute_data'] = inputArr;

			//console.log('finJson', finJson);
			if (!edit) {
				this.commonAPIService.insertSalaryCompute(finJson).subscribe((result: any) => {
					this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
					this.getAllEmployee();
				});
			} else {
				this.commonAPIService.updateSalaryCompute(finJson).subscribe((result: any) => {
					this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
				});
			}
		}


	}

	print() {

	}

	applyFilter(filterValue: string) {
		this.salaryComputeDataSource.filter = filterValue.trim().toLowerCase();
	}
	searchOk(event) {

	}
}

export interface ReportComputeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_pay_scale: string;
	// emp_salary_heads: any;
	// emp_allowances: any;
	emp_total_earnings: any;
	// emp_deductions: any;
	emp_present_days: any;
	emp_salary_payable: any;
	emp_advance: any;
	// emp_pay_mode: any;
	emp_total: any;
	emp_status: any;
	empShacolumns: any;
	empShdcolumns: any;
	emp_modes_data: any;
	balance: any;
}
