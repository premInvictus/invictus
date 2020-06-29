import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { SalarySlipModalComponent } from '../../hr-shared/salary-slip-modal/salary-slip-modal.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-employee-ledger',
	templateUrl: './employee-ledger.component.html',
	styleUrls: ['./employee-ledger.component.scss']
})
export class EmployeeLedgerComponent implements OnInit, AfterViewInit {

	employeedetails: any = {};
	spans: any[] = [];
	lastrecordFlag: boolean;
	lastEmployeeDetails: any;
	lastRecordId: any;
	login_id: any;
	employeeDetailsForm: any;
	defaultsrc: any;
	navigation_record: any;
	session_id: any = {};
	viewOnly: boolean;
	totalObj: any = {};
	EMPLOYEE_LEDGER_ELEMENT: any[] = [];
	ledgerDisplayedColumns: any[] = ['sno', 'particulars', 'month', 'attendance', 'netearnings',
		'deductions', 'advances', 'salarypayable', 'salarypaid', 'balance', 'mop', 'remarks'];
	ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
	@ViewChild('paginator') paginator: MatPaginator;
	sessionArray: any[] = [];
	@ViewChild(MatSort) sort: MatSort;
	schoolInfo: any = {};
	year: any = '';
	currentUser: any = {};
	session: any = {};
	@ViewChild('myInput') myInput: ElementRef;
	paymentModeArray: any[] = [];
	sessionName: string;
	tempData: any[] = [];
	length = 0;
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
	constructor(private commonAPIService: CommonAPIService, private sis: SisService,
		private dialog: MatDialog) {

	}

	ngOnInit() {
		this.getSchool();
		this.getEmployeeNavigationRecords();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngAfterViewInit() {
		this.ledgerDataSource.paginator = this.paginator;
	}
	getSession(login_id) {
		this.sis.getSession().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.sessionArray = [];
				this.sessionArray = res.data;
				const index = this.sessionArray.findIndex((f) => f.ses_id === this.session.ses_id);

				this.sessionName = this.sessionArray[index].ses_name;
				this.getEmployeeLedger(login_id);
			}
		});
	}
	getPaymentModes(loginid) {
		this.commonAPIService.getBanks({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.getSession(loginid);
				this.paymentModeArray.push(
					{
						'pm_id': 'Cash' ? 'Cash'.trim().toLowerCase().replace(' ', '_') : '',
						'pm_name': 'Cash',
						'pm_value': 0,
						'calculation_type': '',
						'calculation_value': '',
						'config_id': '0'

					}
				);
				for (const item of res.data) {
					this.paymentModeArray.push(
						{
							'pm_id': item.bank_name ? item.bank_name.trim().toLowerCase().replace(' ', '_') : '',
							'pm_name': item.bank_name,
							'pm_value': 0,
							'calculation_type': '',
							'calculation_value': '',
							'config_id': item.bnk_id

						}
					);
				}
			}
		});
	}

	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
		if (findex !== -1) {
			const year = this.sessionArray[findex].ses_name;
			let str: string = '';
			str = year.split('-')[0];
			console.log(str.substring(str.length - 2, str.length));
			return str.substring(str.length - 2, str.length);

		}
	}

	getEmployeeNavigationRecords() {
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			this.lastRecordId = result.last_record;
			this.getPaymentModes(this.lastRecordId);

		});
	}

	getEmployeeLedger(emp_id) {
		this.commonAPIService.getEmployeeLedger({ emp_id: emp_id }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.EMPLOYEE_LEDGER_ELEMENT = [];
				this.tempData = [];
				this.spans = [];
				this.ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
				const DATA: any[] = [];
				console.log(res.data);
				let srno = 1;
				for (const item of res.data) {
					let pay_name = '';
					const obj: any = {};
					const obj2: any = item.advance_details;
					const objArr: any[] = item.advance_details;
					if (obj2.constructor === Object) {
						if (item.advance_details && item.advance_details.advance &&
							Number(item.id) === Number(item.advance_details.starting_month)) {
							const obj3: any = {};
							obj3['srno'] = srno;
							obj3['particulars'] = 'Advance Pay (' + this.getSessionName(item.session_id) + ')';
							obj3['mon'] = item.month;
							obj3['attendance'] = '';
							obj3['leaves'] = 0;
							obj3['netearnings'] = '';
							obj3['deductions'] = '';
							obj3['advance'] = '';
							obj3['salarypayable'] = '';
							obj3['salarypaid'] = '';
							obj3['balance'] = item.advance_details.advance;
							obj3['mop'] = '-';
							obj3['remarks'] = '-';
							obj3['sum'] = 0;
							obj['action'] = item;
							this.EMPLOYEE_LEDGER_ELEMENT.push(obj3);
							this.tempData.push(obj3);
							srno++;
						}
					}
					if (Array.isArray(objArr)) {
						for (const st of objArr) {
							if (st && st.advance &&
								Number(item.id) === Number(st.starting_month)) {
								const obj3: any = {};
								obj3['srno'] = srno;
								obj3['particulars'] = 'Advance Pay (' + this.getSessionName(item.session_id) + ')';
								obj3['mon'] = item.month;
								obj3['leaves'] = 0;
								obj3['attendance'] = '';
								obj3['netearnings'] = '';
								obj3['deductions'] = '';
								obj3['advance'] = '';
								obj3['salarypayable'] = '';
								obj3['salarypaid'] = '';
								obj3['balance'] = st.advance;
								obj3['mop'] = '-';
								obj3['remarks'] = '-';
								obj3['sum'] = 0;
								obj['action'] = item;
								this.EMPLOYEE_LEDGER_ELEMENT.push(obj3);
								this.tempData.push(obj3);
								srno++;
							}
						}
					}

					obj['srno'] = srno;
					obj['particulars'] = 'Salary Pay (' + this.getSessionName(item.session_id) + ')';
					obj['mon'] = item.month + "' " + this.getSessionName(item.session_id);
					obj['attendance'] = item && item.leaves && item.leaves.emp_total_attendance ?
						item.leaves.emp_total_attendance : 0;
					obj['leaves'] = item && item.leaves && item.leaves.emp_leave_availed ?
						Number(item.leaves.emp_leave_availed) : 0;
					obj['netearnings'] = item && item.details &&
						item.details.emp_total_earnings ?
						item.details.emp_total_earnings : 0;
					obj['deductions'] = item && item.details &&
						item.details.emp_total_deductions ?
						item.details.emp_total_deductions : 0;
					obj['advance'] = item && item.details &&
						item.details.emp_modes_data && item.details.emp_modes_data.advance
						? item.details.emp_modes_data.advance : 0;
					obj['salarypayable'] = item && item.details &&
						item.details.emp_salary_payable ?
						item.details.emp_salary_payable : 0;
					obj['salarypaid'] = item && item.details &&
						item.details.emp_total ?
						item.details.emp_total : 0;
					obj['balance'] = item && item.details &&
						item.details.balance ?
						item.details.balance : 0;
					const mop: any[] = [];
					let sumValues = 0;
					for (const pay of this.paymentModeArray) {
						if (this.getPaymentDataFromName(item, pay.pm_id) && this.getPaymentDataFromMode(item, pay.pm_id)) {
							mop.push(this.getPaymentDataFromName(item, pay.pm_id) + '-' +
								this.getPaymentDataFromMode(item, pay.pm_id));
						}
						if (this.getPaymentDataFromMode(item, pay.pm_id)) {
							sumValues += Number(this.getPaymentDataFromMode(item, pay.pm_id));
						}
					}
					if (mop.length === 0) {
						mop.push('-')
					}
					obj['sum'] = sumValues;
					obj['mop'] = mop;
					obj['pay_mode'] = pay_name;
					obj['remarks'] = '-';
					obj['action'] = item;
					this.EMPLOYEE_LEDGER_ELEMENT.push(obj);
					this.tempData.push(obj);
					srno++;
				}
				console.log(this.EMPLOYEE_LEDGER_ELEMENT);

				for (const next of this.EMPLOYEE_LEDGER_ELEMENT) {
					for (const b of next.mop) {
						DATA.push({
							srno: next.srno,
							particulars: next.particulars,
							mon: next.mon,
							attendance: next.attendance,
							netearnings: next.netearnings,
							deductions: next.deductions,
							advance: next.advance,
							salarypayable: next.salarypayable,
							salarypaid: next.salarypaid,
							balance: next.balance,
							mop: b,
							remarks: next.remarks,
							action: next.action

						})
					}
				}
				this.EMPLOYEE_LEDGER_ELEMENT = [];
				this.EMPLOYEE_LEDGER_ELEMENT = DATA;

				this.cacheSpan('srno', d => d.srno);
				this.cacheSpan('particulars', d => d.particulars);
				this.cacheSpan('mon', d => d.mon);
				this.cacheSpan('attendance', d => d.attendance);
				this.cacheSpan('netearnings', d => d.netearnings);
				this.cacheSpan('deductions', d => d.deductions);
				this.cacheSpan('advance', d => d.advance);
				this.cacheSpan('salarypayable', d => d.salarypayable);
				this.cacheSpan('salarypaid', d => d.salarypaid);
				this.cacheSpan('balance', d => d.balance);
				this.cacheSpan('mop', d => d.mop);
				this.cacheSpan('remarks', d => d.remarks);
				this.totalObj['particulars'] = 'Grand Total';
				this.totalObj['attendance'] = (this.tempData.map(f => Math.round(Number(f.attendance))).reduce((acc, val) => acc + val, 0));
				this.totalObj['leaves'] = (this.tempData.map(f => Math.round(Number(f.leaves))).reduce((acc, val) => acc + val, 0));
				this.totalObj['netearnings'] = this.tempData.map(f => Math.round(Number(f.netearnings))).reduce((acc, val) => acc + val, 0);
				this.totalObj['deductions'] = this.tempData.map(f => Math.round(Number(f.deductions))).reduce((acc, val) => acc + val, 0);
				this.totalObj['advance'] = this.tempData.map(f => Math.round(Number(f.advance))).reduce((acc, val) => acc + val, 0);
				this.totalObj['salarypayable'] = this.tempData.map(f => Math.round(Number(f.salarypayable))).reduce((acc, val) => acc + val, 0);
				this.totalObj['salarypaid'] = this.tempData.map(f => Math.round(Number(f.salarypaid))).reduce((acc, val) => acc + val, 0);
				this.totalObj['mop'] = this.tempData.map(f => Math.round(Number(f.sum))).reduce((acc, val) => acc + val, 0);;
				this.totalObj['balance'] = this.tempData.map(f => Math.round(Number(f.balance))).reduce((acc, val) => acc + val, 0);
				this.ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
				this.ledgerDataSource.paginator = this.paginator;
			}
		});
	}
	getRowSpan(col, index) {
		//console.log('col '+col, 'index'+index, this.spans);
		return this.spans[index] && this.spans[index][col];
	}
	getPaymentDataFromMode(item, pm_id) {
		if (item && item.details && item.details.emp_modes_data
			&& item.details.emp_modes_data.mode_data
			&& item.details.emp_modes_data.mode_data.length > 0) {
			const index = item.details.emp_modes_data.mode_data.findIndex(f => f.pm_id === pm_id);
			if (index !== -1) {
				return item.details.emp_modes_data.mode_data[index].pm_value ?
					item.details.emp_modes_data.mode_data[index].pm_value : '';
			}
		} else {
			return '';
		}
	}
	getSchool() {
		this.sis.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
	}
	getPaymentDataFromName(item, pm_id) {
		if (item && item.details && item.details.emp_modes_data
			&& item.details.emp_modes_data.mode_data
			&& item.details.emp_modes_data.mode_data.length > 0) {
			const index = item.details.emp_modes_data.mode_data.findIndex(f => f.pm_id === pm_id);
			if (index !== -1) {
				if (item.details.emp_modes_data.mode_data[index].pm_value) {
					return item.details.emp_modes_data.mode_data[index].pm_name ?
						item.details.emp_modes_data.mode_data[index].pm_name : '';
				} else {
					return '';
				}
			}
		} else {
			return '';
		}
	}
	openSalarySlip(item, emp_id) {
		if (item.netearnings !== '-') {
			const dialogRef: any = this.dialog.open(SalarySlipModalComponent, {
				data: {
					values: item,
					emp_id: emp_id
				},
				height: '70%',
				width: '55%'
			})
		}
	}
	checkWidth(id, header) {
		const res = this.EMPLOYEE_LEDGER_ELEMENT.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	exportAsExcel() {
		const reportType = new TitleCasePipe().transform('Employee ledger report: ' + this.sessionName);
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		const columns: any[] = [];
		columns.push({
			key: 'srno',
			width: this.checkWidth('srno', 'Sno.')
		});
		columns.push({
			key: 'particulars',
			width: this.checkWidth('particulars', 'Paerticulars')
		});
		columns.push({
			key: 'mon',
			width: this.checkWidth('mon', 'Month')
		});
		columns.push({
			key: 'attendance',
			width: this.checkWidth('attendance', 'Attendance')
		});
		columns.push({
			key: 'netearnings',
			width: this.checkWidth('netearnings', 'Net Earning')
		});
		columns.push({
			key: 'deductions',
			width: this.checkWidth('deductions', 'Deductions')
		});
		columns.push({
			key: 'advance',
			width: this.checkWidth('advance', 'Advance')
		});
		columns.push({
			key: 'salarypayable',
			width: this.checkWidth('salarypayable', 'Salary Payable')
		});
		columns.push({
			key: 'salarypaid',
			width: this.checkWidth('salarypaid', 'Salary Paid')
		});
		columns.push({
			key: 'balance',
			width: this.checkWidth('balance', 'Balance')
		});

		for (const pay of this.paymentModeArray) {
			columns.push({
				key: pay.pm_id,
				width: this.checkWidth(pay.pm_id, pay.pm_name)
			});
		}
		columns.push({
			key: 'remarks',
			width: this.checkWidth('remarks', 'Remarks')
		});
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getCell('A4').value = "Sno";
		worksheet.getCell('B4').value = "Particulars";
		worksheet.getCell('C4').value = "Month";
		worksheet.getCell('D4').value = "Attendance";
		worksheet.getCell('E4').value = "Net Earnings";
		worksheet.getCell('F4').value = "Deductions";
		worksheet.getCell('G4').value = "Advances";
		worksheet.getCell('H4').value = "Salary Payable";
		worksheet.getCell('I4').value = "Salary Paid";
		worksheet.getCell('J4').value = "Balance";
		worksheet.getCell('K4').value = "MOP";
		worksheet.getCell('L4').value = "Remarks";
		// worksheet.getCell(this.alphabetJSON[count + 1] + '4').value = "Balance";
		//worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const item of this.tempData) {
			const lengthPay = item.mop.length;
			const intialLength = this.length + 1;
			this.length = this.length + lengthPay;
			worksheet.mergeCells('A' + intialLength + ': A' + this.length);
			worksheet.getCell('A' + intialLength).value = item.srno;
			worksheet.mergeCells('B' + intialLength + ': B' + this.length);
			worksheet.getCell('B' + intialLength).value = item.particulars;
			worksheet.mergeCells('C' + intialLength + ': C' + this.length);
			worksheet.getCell('C' + intialLength).value = item.mon;
			worksheet.mergeCells('D' + intialLength + ': D' + this.length);
			worksheet.getCell('D' + intialLength).value = item.attendance;
			worksheet.mergeCells('E' + intialLength + ': E' + this.length);
			worksheet.getCell('E' + intialLength).value = item.netearnings;
			worksheet.mergeCells('F' + intialLength + ': F' + this.length);
			worksheet.getCell('F' + intialLength).value = item.deductions;
			worksheet.mergeCells('G' + intialLength + ': G' + this.length);
			worksheet.getCell('G' + intialLength).value = item.advance;
			worksheet.mergeCells('H' + intialLength + ': H' + this.length);
			worksheet.getCell('H' + intialLength).value = item.salarypayable;
			worksheet.mergeCells('I' + intialLength + ': I' + this.length);
			worksheet.getCell('I' + intialLength).value = item.salarypaid;
			worksheet.mergeCells('J' + intialLength + ': J' + this.length);
			worksheet.getCell('J' + intialLength).value = item.balance;
			let ind = 0;
			for (const mp of item.mop) {
				worksheet.getCell('K' + (intialLength + ind)).value = mp;
				ind++;
			}
			worksheet.mergeCells('L' + intialLength + ': L' + this.length);
			worksheet.getCell('L' + intialLength).value = item.remarks;
		}
		// this.length = worksheet._rows.length;
		let gtRow = worksheet._rows.length + 1;
		worksheet.getCell('A' + gtRow).value = "";
		worksheet.getCell('B' + gtRow).value = "Grand Total";
		worksheet.getCell('C' + gtRow).value = "";
		worksheet.getCell('D' + gtRow).value = this.totalObj.attendance;
		worksheet.getCell('E' + gtRow).value = this.totalObj.netearnings;
		worksheet.getCell('F' + gtRow).value = this.totalObj.deductions;
		worksheet.getCell('G' + gtRow).value = this.totalObj.advance;
		worksheet.getCell('H' + gtRow).value = this.totalObj.salarypayable;
		worksheet.getCell('I' + gtRow).value = this.totalObj.salarypaid;
		worksheet.getCell('J' + gtRow).value = this.totalObj.balance;
		worksheet.getCell('K' + gtRow).value = this.totalObj.mop;
		worksheet.getCell('L' + gtRow).value = "";
		let totRow = gtRow + 6;

		worksheet.mergeCells('A' + totRow + ':' + 'E' + totRow);
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.tempData.length;
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' }
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
			if (rowNum === 3 || rowNum === 5 || rowNum === 6) {
				row.font = {
					name: 'Arial',
					size: 10,
					bold: false
				};
				row.eachCell((cell) => {
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}


			if (rowNum === 4) {
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
			if (rowNum === gtRow) {
				row.eachCell(cell => {
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.alignment = { wrapText: true, horizontal: 'center' };
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '439f47' },
						bgColor: { argb: '439f47' }
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
				});
			}
			if (rowNum >= 7 && rowNum !== gtRow && rowNum <= this.tempData.length + 7) {
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
	cacheSpan(key, accessor) {
		//console.log(key, accessor);
		for (let i = 0; i < this.EMPLOYEE_LEDGER_ELEMENT.length;) {
			let currentValue = accessor(this.EMPLOYEE_LEDGER_ELEMENT[i]);
			let count = 1;
			//console.log('currentValue',currentValue);
			// Iterate through the remaining rows to see how many match
			// the current value as retrieved through the accessor.
			for (let j = i + 1; j < this.EMPLOYEE_LEDGER_ELEMENT.length; j++) {
				if (currentValue != accessor(this.EMPLOYEE_LEDGER_ELEMENT[j])) {
					break;
				}
				count++;
			}

			if (!this.spans[i]) {
				this.spans[i] = {};
			}

			// Store the number of similar values that were found (the span)
			// and skip i to the next unique row.
			this.spans[i][key] = count;
			i += count;
		}
	}

}
