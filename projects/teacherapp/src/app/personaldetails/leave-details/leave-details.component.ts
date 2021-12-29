
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatCard, MatPaginatorIntl,MatDialog } from '@angular/material';
import {LeaveCreditComponent} from './leave-credit/leave-credit.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {of} from 'rxjs'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {
	@ViewChild(MatAutocompleteTrigger) trigger;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeForm: FormGroup;
	employeeData: any;
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
  session_id;
  userDetail:any;
  userDetails:any;
	empdetailFlag=0;
	allEmployeeData: any[] = [];
	tmpAllEmployeeData: any;
	tempEmpData: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	leave_opening_balance = 0;
	leaveTypeArray:any[] = [];
	//'leave_opening_balance',
	displayedEmployeeColumns: string[] = ['srno', 'month_name', 'leave_credited', 'leave_availed', 'leave_granted', 'lwp', 'leave_closing_balance'];
	options: any[] = [];
	  filteredOptions: Observable<any[]>;
	  myControl = new FormControl();
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
    this.session_id = JSON.parse(localStorage.getItem('session'));
    this.userDetails = JSON.parse(localStorage.getItem('currentUser'));
    // console.log("i am user id", this.userDetail);
   
    
		this.getLeaveType();
		this.buildForm();
		this.getAllEmployee();
	}
	onFocus(event){
		this.trigger._onChange("");
		this.trigger.openPanel();
	}
	getLeaveType() {
		this.commonAPIService.getLeaveManagement().subscribe((result: any) => {
		  this.leaveTypeArray = result;
		  console.log(this.leaveTypeArray);
		});
	  }
	buildForm() {
		this.searchForm = this.fbuild.group({
			emp_id: '',
			emp_name: ''
		});
	}

	getAllEmployee() {
		this.commonAPIService.getAllEmployee({emp_login_id: this.userDetails.login_id}).subscribe((result: any) => {
      console.log("i am result", result);
      this.userDetail = result[0];
      console.log("i am userdetail", this.userDetail);
      
      this.getEmployeeDetail(result[0].emp_id);

      
		});
	}
	private _filter(value: string): string[] {
		console.log('_filter value',value);
		const filterValue = value.toLowerCase();
	
		return this.options.filter(option => option.emp_name.toLowerCase().includes(filterValue));
	}
	getFilterEmployee1(event){
		// this.filteredOptions = this.searchForm.controls.emp_name.valueChanges
		// 	.pipe(
		// 		startWith(''),
		// 		map(value => this._filter(value))
		// 	);
		if(event){
			this.filteredOptions = of(this._filter(event));
			console.log('calling getfilteremployee1 if',this._filter(event));
		} else {
			console.log('calling getfilteremployee1 else');
			this.filteredOptions = of(this.options);
		}
			
	}
	getFilterEmployee(event) {
		var tempArr = [];
		console.log('event.target.value',event.target.value);
		if (event.target.value.length > 0) {
			const filterVal = event.target.value;
			this.allEmployeeData = this.tempEmpData.filter(f => {
				//console.log(f);
				return (f.emp_name.toLowerCase()).includes(filterVal)
			})
		} else {
			this.allEmployeeData = this.tempEmpData.slice(0);
		}
		console.log('this.tempEmpData',this.tempEmpData)
	}

	getEmployeeDetail(id) {
		let inputJson = {};
		//this.allEmployeeData = [];
		//this.tempEmpData = [];
		// if (this.searchForm.value && this.searchForm.value.emp_id && this.searchForm.value.emp_name) {
		// 	inputJson = {
		// 		emp_code_no: this.searchForm.value.emp_id
		// 	}
    // }
    inputJson = {
      emp_id: id
    }
    // console.log("i am here ---------------------------------",inputJson);
    
    

		this.commonAPIService.getEmployeeDetail(inputJson).subscribe((result: any) => {
      console.log("i am result -----------------------------------",result);
      
			this.empdetailFlag = 1;
			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			this.displayedEmployeeColumns = [];
			this.displayedEmployeeColumns.push('srno');
			this.displayedEmployeeColumns.push('month_name');
			if(this.leaveTypeArray && this.leaveTypeArray.length >0){
				this.leaveTypeArray.forEach(ele => {
					this.displayedEmployeeColumns.push('leave_credited'+ele.leave_id);
				});
				this.leaveTypeArray.forEach(ele => {
					this.displayedEmployeeColumns.push('leave_availed'+ele.leave_id);
				});
				this.displayedEmployeeColumns.push('lwp');
				this.leaveTypeArray.forEach(ele => {
					this.displayedEmployeeColumns.push('leave_closing'+ele.leave_id);
				});								
				this.displayedEmployeeColumns.push('total_credited');
				this.displayedEmployeeColumns.push('total_availed');
				this.displayedEmployeeColumns.push('total_balance');
			}
			console.log('this.displayedEmployeeColumns',this.displayedEmployeeColumns);
			element = {};
			this.EMPLOYEE_ELEMENT = [];
			this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			if (result) {
				let pos = 1;
				let recordArray = result;
				let emp_month_attendance_data:any
				if(result.emp_month_attendance_data && result.emp_month_attendance_data.length > 0){
          // console.log("i am here",result.emp_month_attendance_data,  );
          
					result.emp_month_attendance_data.forEach(element => {
            // console.log("-------------------------", element.ses_id == this.session_id.ses_id);
            
						if(element.ses_id == this.session_id.ses_id){
							emp_month_attendance_data=element
						}
					});
				}
				var total_leave_credited = 0;
				var total_leave_availed = 0;
				var total_leave_granted = 0;
				var total_leave_closing_balance = 0;
				var total_lwp = 0;
				if (emp_month_attendance_data && emp_month_attendance_data.month_data) {
					console.log('emp_month_attendance_data',emp_month_attendance_data);
					for (var i = 0; i < emp_month_attendance_data.month_data.length; i++) {
						var emp_month = emp_month_attendance_data.month_data[i].month_id;
						var emp_attendance_detail = emp_month_attendance_data.month_data[i].attendance_detail;
						let leave_credited:any;
						if (emp_attendance_detail.emp_leave_credited && emp_attendance_detail.emp_leave_credited.length > 0) {
							leave_credited = emp_attendance_detail.emp_leave_credited
						}
						let leave_availed:any;
						if (emp_attendance_detail.emp_leave_granted && emp_attendance_detail.emp_leave_granted.length > 0) {
							leave_availed = emp_attendance_detail.emp_leave_granted
						}
						let leave_closing:any;
						if (emp_attendance_detail.emp_balance_leaves && emp_attendance_detail.emp_balance_leaves.length > 0) {
							leave_closing = emp_attendance_detail.emp_balance_leaves
						}
						let total_credited=0;
						let total_availed=0;
						let total_balance=0;
						if(emp_attendance_detail.emp_leave_credited && emp_attendance_detail.emp_leave_credited.length > 0){
							emp_attendance_detail.emp_leave_credited.forEach(e => {
								total_credited += Number(e.leave_value)
							});
						}
						if(emp_attendance_detail.emp_leave_granted && emp_attendance_detail.emp_leave_granted.length > 0){
							emp_attendance_detail.emp_leave_granted.forEach(e => {
								total_availed += Number(e.leave_value)
							});
						}
						if(emp_attendance_detail.emp_balance_leaves && emp_attendance_detail.emp_balance_leaves.length > 0){
							emp_attendance_detail.emp_balance_leaves.forEach(e => {
								total_balance += Number(e.leave_value)
							});
						}
						element = {
							srno: pos,
							month_name: emp_month_attendance_data.month_data[i].month_name,
							leave_credited: leave_credited,
							leave_availed: leave_availed,
							// leave_granted: '',
							lwp: '',
							leave_closing: leave_closing,
							total_credited:total_credited,
							total_availed:total_availed,
							total_balance:total_balance
						};
						// total_leave_credited = total_leave_credited + Number(leave_credited.toFixed());
						// total_leave_availed = total_leave_availed + parseFloat(emp_attendance_detail.emp_leave_availed ? emp_attendance_detail.emp_leave_availed : 0);
						// total_leave_granted = total_leave_granted + parseFloat(emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0);
						// total_lwp = total_lwp + parseFloat(emp_attendance_detail && emp_attendance_detail.emp_lwp ? emp_attendance_detail.emp_lwp : 0);
						// total_leave_closing_balance = total_leave_closing_balance + Number(leave_credited.toFixed()) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0)
						this.EMPLOYEE_ELEMENT.push(element);
						pos++;
					}
				}


				var total_closing_balance = Number(this.leave_opening_balance) + Number(total_leave_closing_balance);

				// var lastRow = {
				// 	srno: 'Grand Total',
				// 	month_name: '',
				// 	leave_opening_balance: '',
				// 	leave_credited: '<b>' + total_leave_credited + '</b>',
				// 	leave_availed: '<b>' + total_leave_availed + '</b>',
				// 	leave_granted: '<b>' + total_leave_granted + '</b>',
				// 	lwp: '<b>' + total_lwp + '</b>',
				// 	leave_closing: '<b>' + total_closing_balance + '</b>'
				// }
				// this.EMPLOYEE_ELEMENT.push(lastRow);
				console.log('EMPLOYEE_ELEMENT',this.EMPLOYEE_ELEMENT);
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

	// setEmployeeId(empDetails) {
	// 	console.log('empDetails', empDetails);
	// 	this.searchForm.setValue({
	// 		emp_id: empDetails.emp_code_no,
	// 		emp_name: empDetails.emp_name,
	// 	});
	// 	this.allEmployeeData = this.tmpAllEmployeeData;
	// 	this.getEmployeeDetail();
	// }
	// setEmployeeId1(event) {
	// 	let tempvalue = event.option.value;
	// 	console.log('tempid',tempvalue);
	// 	let empDetails = this.options.find(e => e.emp_code_no == tempvalue)
	// 	console.log('empDetails', empDetails);
	// 	this.searchForm.setValue({
	// 		emp_id: empDetails.emp_code_no,
	// 		emp_name: empDetails.emp_name,
	// 	});
	// 	this.getEmployeeDetail();
	// }


	// applyFilter(filterValue: string) {
	// 	this.employeedataSource.filter = filterValue.trim().toLowerCase();
	// }
	openLeaveCredit(){
		const dialogRef: any = this.dialog.open(LeaveCreditComponent, {
			data: {
				emp_id:this.employeeData.emp_id,
				emp_month_attendance_data:this.employeeData.emp_month_attendance_data
			},
			height: '50%',
			width: '40%'
		})
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result && result.status) {
			  this.getEmployeeDetail(this.userDetail.emp_id);
			}
		  });
	}

}

export interface EmployeeElement {
	srno: any;
	month_name: string;
	// leave_opening_balance: string;
	leave_credited: any;
	leave_availed: any;
	leave_granted: any;
	lwp: any;
	leave_closing: any;
	total_credited:any;
	total_availed:any;
	total_balance:any;
}


