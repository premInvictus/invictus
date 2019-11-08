import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'app-employee-leave',
	templateUrl: './employee-leave.component.html',
	styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeForm: FormGroup;
	employeeData: any;
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id;
	allEmployeeData:any[] = [];
	tmpAllEmployeeData:any;
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	leave_opening_balance = 0;
	//'leave_opening_balance',
	displayedEmployeeColumns: string[] = ['srno', 'month_name',  'leave_credited', 'leave_availed', 'leave_granted', 'lwp', 'leave_closing_balance'];
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getAllEmployee();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			emp_id: '',
			emp_name: ''
		});
	}

	getAllEmployee() {
		this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
			
			this.tmpAllEmployeeData = result;
		});
	}

	getFilterEmployee(event) {
		var tempArr = [];
		if (event.target.value.length > 2) {			
			this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
				this.tmpAllEmployeeData = result;
				if (this.tmpAllEmployeeData && (event.target.value.length > 2)) {
					for(var i=0; i<this.tmpAllEmployeeData.length;i++) {
						if(this.tmpAllEmployeeData[i]['emp_name'].toLowerCase().includes(event.target.value)) {
							tempArr.push(this.tmpAllEmployeeData[i]);
						}
					}
					if (tempArr.length > 0) {
						this.allEmployeeData = tempArr;
					}
				}
			});			
		} else {
			this.allEmployeeData = []
		}		
	} 

	getEmployeeDetail() {
		let inputJson = {}
		if (this.searchForm.value && this.searchForm.value.emp_id && this.searchForm.value.emp_name) {
			inputJson = {
				emp_id: this.searchForm.value.emp_id
			}
		}

		this.commonAPIService.getEmployeeDetail(inputJson).subscribe((result: any) => {
			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			element = {};
			this.EMPLOYEE_ELEMENT = [];
			this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			if (result) {
				let pos = 1;
				let recordArray = result;
				var total_leave_credited = 0;
				var total_leave_availed = 0;
				var total_leave_granted = 0;
				var total_leave_closing_balance = 0;
				var total_lwp = 0;
				
				this.leave_opening_balance = result.emp_month_attendance_data ? result.emp_month_attendance_data.leave_opening_balance : 0;

				if (result.emp_month_attendance_data && result.emp_month_attendance_data.month_data) {
					for (var i = 0; i < result.emp_month_attendance_data.month_data.length; i++) {
						var emp_month = result.emp_month_attendance_data.month_data[i].month_id;
						var emp_attendance_detail = result.emp_month_attendance_data.month_data[i].attendance_detail;
						element = {
							srno: pos,
							month_name: result.emp_month_attendance_data.month_data[i].month_name,						
							leave_credited: emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0,
							leave_availed: emp_attendance_detail && emp_attendance_detail.emp_leave_availed ? emp_attendance_detail.emp_leave_availed : 0,
							leave_granted: emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0,
							lwp: emp_attendance_detail && emp_attendance_detail.emp_lwp ? emp_attendance_detail.emp_lwp : 0,
							leave_closing_balance: (emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0)
						};
						total_leave_credited = total_leave_credited + parseFloat(emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0);
						total_leave_availed = total_leave_availed + parseFloat(emp_attendance_detail.emp_leave_availed ? emp_attendance_detail.emp_leave_availed : 0);
						total_leave_granted = total_leave_granted + parseFloat(emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0);
						total_lwp = total_lwp + parseFloat(emp_attendance_detail && emp_attendance_detail.emp_lwp ? emp_attendance_detail.emp_lwp : 0);
						total_leave_closing_balance = total_leave_closing_balance + ( emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0)
						this.EMPLOYEE_ELEMENT.push(element);
						
						pos++;
	
						
	
					}
				}
				

				var total_closing_balance = Number(this.leave_opening_balance) + Number(total_leave_closing_balance);

				var lastRow = {
					srno: 'Grand Total',
					month_name: '',
					leave_opening_balance: '',
					leave_credited: '<b>' + total_leave_credited + '</b>',
					leave_availed: '<b>' + total_leave_availed + '</b>',
					leave_granted: '<b>' + total_leave_granted + '</b>',
					lwp: '<b>' + total_lwp + '</b>',
					leave_closing_balance: '<b>' + total_closing_balance + '</b>'
				}
				this.EMPLOYEE_ELEMENT.push(lastRow);
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
				this.employeedataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.employeedataSource.sort = this.sort;
				}
			} else {
				let element: any = {};
				let recordArray = [];
				this.employeeData = {};
				this.EMPLOYEE_ELEMENT = [];
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			}
		});


	}

	setEmployeeId(empDetails) {
		console.log('empDetails', empDetails);
		this.searchForm.patchValue({
			emp_id: empDetails.emp_id,
			emp_name: empDetails.emp_name,
		});
		this.getEmployeeDetail();
	}


	applyFilter(filterValue: string) {
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
	}

}

export interface EmployeeElement {
	srno: any;
	month_name: string;
	// leave_opening_balance: string;
	leave_credited: string;
	leave_availed: any;
	leave_granted: any;
	lwp: string;
	leave_closing_balance: string;
}
