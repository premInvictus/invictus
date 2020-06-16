import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DecimalPipe } from '@angular/common';

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
	EMPLOYEE_LEDGER_ELEMENT: any[] = [];
	ledgerDisplayedColumns: any[] = ['sno', 'particulars', 'month', 'attendance', 'netearnings',
		'deductions', 'advances', 'salarypayable', 'salarypaid', 'balance'];
	ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('myInput') myInput: ElementRef;
	constructor(private commonAPIService: CommonAPIService) { }

	ngOnInit() {
		this.getEmployeeNavigationRecords();
	}
	ngAfterViewInit() {
		this.ledgerDataSource.paginator = this.paginator;
	}
	getEmployeeNavigationRecords() {
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			this.lastRecordId = result.last_record;
			this.getEmployeeLedger(this.lastRecordId);
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
					this.EMPLOYEE_LEDGER_ELEMENT.push({
						srno: srno,
						particulars : '-',
						mon: item.month,
						attendance: item && item.leaves && item.leaves.emp_total_attendance ?
							item.leaves.emp_total_attendance : '-',
						netearnings: item && item.details &&
							item.details.emp_total_earnings ? 
							new DecimalPipe('en-in').transform(item.details.emp_total_earnings) : '-',
						deductions: item && item.details &&
							item.details.emp_total_deductions ? 
							new DecimalPipe('en-in').transform(item.details.emp_total_deductions) : '-',
						advance: item && item.details &&
							item.details.emp_modes_data && item.details.emp_modes_data.advance
							? new DecimalPipe('en-in').transform(item.details.emp_modes_data.advance) : '-',
						salarypayable: item && item.details &&
							item.details.emp_salary_payable ? 
							new DecimalPipe('en-in').transform(item.details.emp_salary_payable) : '-',
						salarypaid: item && item.details &&
							item.details.emp_total ? 
							new DecimalPipe('en-in').transform(item.details.emp_total) : '-',
						balance: item && item.details &&
							item.details.balance ? 
							new DecimalPipe('en-in').transform(item.details.balance ): '-',
					});
					srno++;
				}
				console.log(this.EMPLOYEE_LEDGER_ELEMENT);
				this.ledgerDataSource = new MatTableDataSource<any>(this.EMPLOYEE_LEDGER_ELEMENT);
				this.ledgerDataSource.paginator = this.paginator;
			}
		});
	}
}
