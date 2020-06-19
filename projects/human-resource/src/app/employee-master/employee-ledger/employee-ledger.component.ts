import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DecimalPipe } from '@angular/common';
import { SalarySlipModalComponent } from '../../hr-shared/salary-slip-modal/salary-slip-modal.component';

@Component({
	selector: 'app-employee-ledger',
	templateUrl: './employee-ledger.component.html',
	styleUrls: ['./employee-ledger.component.scss']
})
export class EmployeeLedgerComponent implements OnInit, AfterViewInit {

	employeedetails: any = {};
	lastrecordFlag: boolean;
	lastEmployeeDetails: any;
	lastRecordId: any;
	login_id: any;
	employeeDetailsForm: any;
	defaultsrc: any;
	navigation_record: any;
	viewOnly: boolean;
	totalObj: any = {};
	EMPLOYEE_LEDGER_ELEMENT: any[] = [];
	ledgerDisplayedColumns: any[] = ['sno', 'particulars', 'month', 'attendance', 'netearnings',
		'deductions', 'advances', 'salarypayable', 'salarypaid', 'balance'];
	ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
	@ViewChild('paginator') paginator: MatPaginator;
	sessionArray: any[] = [];
	@ViewChild(MatSort) sort: MatSort;
	schoolInfo: any = {};
	year: any = '';
	session: any = {};
	@ViewChild('myInput') myInput: ElementRef;
	paymentModeArray: any[] = [];

	constructor(private commonAPIService: CommonAPIService, private sis: SisService, 
		private dialog : MatDialog) {
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.getEmployeeNavigationRecords();
	}
	ngAfterViewInit() {
		this.ledgerDataSource.paginator = this.paginator;
	}
	getSession(login_id) {
		this.sis.getSession().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.sessionArray = [];
				this.sessionArray = res.data;
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
				for (const pay of this.paymentModeArray) {
					this.ledgerDisplayedColumns.push(pay.pm_id);
				}
				this.ledgerDisplayedColumns.push('remarks');
			}
		});
	}
	
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
		if (findex !== -1) {
			const year = this.sessionArray[findex].ses_name;
			let str : string = '';
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
				this.ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
				console.log(res.data);
				let srno = 1;
				for (const item of res.data) {
					let pay_name = '';
					const obj: any = {};
					obj['srno'] = srno;
					obj['particulars'] = item.month + ' Pay';
					obj['mon'] = item.month + "' " + this.getSessionName(item.session_id);
					obj['attendance'] = item && item.leaves && item.leaves.emp_total_attendance ?
						item.leaves.emp_total_attendance : 0;
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
					for (const pay of this.paymentModeArray) {
						obj[pay.pm_id] = this.getPaymentDataFromMode(item, pay.pm_id);
						pay_name = pay_name + this.getPaymentDataFromName(item, pay.pm_id) ;
					}
					obj['pay_mode'] = pay_name;
					obj['remarks'] = '-';
					obj['action'] = item;
					this.EMPLOYEE_LEDGER_ELEMENT.push(obj);
					srno++;
				}
				console.log(this.EMPLOYEE_LEDGER_ELEMENT);
				this.totalObj['particulars'] = 'Grand Total';
				this.totalObj['attendance'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.attendance))).reduce((acc, val) => acc + val, 0);
				this.totalObj['netearnings'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.netearnings))).reduce((acc, val) => acc + val, 0);
				this.totalObj['deductions'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.deductions))).reduce((acc, val) => acc + val, 0);
				this.totalObj['advance'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.advance))).reduce((acc, val) => acc + val, 0);
				this.totalObj['salarypayable'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.salarypayable))).reduce((acc, val) => acc + val, 0);
				this.totalObj['salarypaid'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.salarypaid))).reduce((acc, val) => acc + val, 0);
				for (const pay of this.paymentModeArray) {
					this.totalObj[pay.pm_id] =
						this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f[pay.pm_id]))).reduce((acc, val) => acc + val, 0);
				}
				this.totalObj['balance'] = this.EMPLOYEE_LEDGER_ELEMENT.map(f => Math.round(Number(f.balance))).reduce((acc, val) => acc + val, 0);
				this.ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
				this.ledgerDataSource.paginator = this.paginator;
			}
		});
	}
	getPaymentDataFromMode(item, pm_id) {
		if (item && item.details && item.details.emp_modes_data
			&& item.details.emp_modes_data.mode_data
			&& item.details.emp_modes_data.mode_data.length > 0) {
			const index = item.details.emp_modes_data.mode_data.findIndex(f => f.pm_id === pm_id);
			if (index !== -1) {
				return item.details.emp_modes_data.mode_data[index].pm_value ?
					item.details.emp_modes_data.mode_data[index].pm_value : 0;
			}
		} else {
			return 0;
		}
	}
	getPaymentDataFromName(item, pm_id) {
		if (item && item.details && item.details.emp_modes_data
			&& item.details.emp_modes_data.mode_data
			&& item.details.emp_modes_data.mode_data.length > 0) {
			const index = item.details.emp_modes_data.mode_data.findIndex(f => f.pm_id === pm_id);
			if (index !== -1) {
				if (item.details.emp_modes_data.mode_data[index].pm_value) {
				return item.details.emp_modes_data.mode_data[index].pm_name ?
					item.details.emp_modes_data.mode_data[index].pm_name  + ',': '';
				} else {
					return '';
				}
			}
		} else {
			return '';
		}
	}
	openSalarySlip(item, emp_id) {
		const dialogRef : any = this.dialog.open(SalarySlipModalComponent, {
			data : {
				values : item,
				emp_id : emp_id
			},
			height: '60vh',
			width : '70vh'
		})
	}
}
