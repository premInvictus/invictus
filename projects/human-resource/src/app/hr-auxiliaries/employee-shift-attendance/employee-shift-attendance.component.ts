import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {of} from 'rxjs'
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UserTimeModalComponent } from './user-time-modal/user-time-modal.component'

@Component({
  selector: 'app-employee-shift-attendance',
  templateUrl: './employee-shift-attendance.component.html',
  styleUrls: ['./employee-shift-attendance.component.scss']
})
export class EmployeeShiftAttendanceComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	employeeForm: FormGroup;
	searchForm: FormGroup;
	totalPresentArr: any[] = [];
	//editFlag = false;
	employeeData: any
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id: any = {};
	categoryOneArray: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
	displayedEmployeeColumns: string[] = ['srno', 'emp_code_no', 'emp_name', 'emp_shift','shift_time'];
	currentMonthName = '';
	currentStatusName = '';
	currentCategoryName = '';
	editAllStatus = true;
	disabledApiButton = false;
	holidayArray: any[] = [];
	sessionName: any;
	currSess: any;
	hrshiftArray = [];
	  leaveTypeArray:any[] = [];
	  timeflag:any;
  
  options: any[] = [];
	filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  allEmployeeData: any[] = [];
	tmpAllEmployeeData: any;
	tempEmpData: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService,
		private dialog: MatDialog


	) {

		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
    this.session_id = JSON.parse(localStorage.getItem('session'));
		this.buildForm();
		this.getAllEmployee();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			emp_code_no: '',
      emp_name: '',
      entry_date:''
		});
	}
	getShift(){

	}

	getAllEmployee() {
		this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {

			this.allEmployeeData = result.slice(0);
			this.tempEmpData = result.slice(0);
			this.tmpAllEmployeeData = result.slice(0);
			this.employeeData = {};
			this.options = JSON.parse(JSON.stringify(result));
			console.log('this.options',this.options);
			this.getFilterEmployee1('');
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
  setEmployeeId1(event) {
		let tempvalue = event.option.value;
		console.log('tempid',tempvalue);
		let empDetails = this.options.find(e => e.emp_code_no == tempvalue)
		console.log('empDetails', empDetails);
		this.searchForm.patchValue({
			emp_code_no: empDetails.emp_code_no,
			emp_name: empDetails.emp_name,
    });
    this.getEmployeeDetail();
		//this.getShiftAttendance();
	}

	getEmployeeDetail() {
		let inputJson = {
		emp_code_no: this.searchForm.value.emp_code_no,
		};
		this.commonAPIService.getEmployeeDetail(inputJson).subscribe((result1: any) => {
			let element: any = {};
			this.employeeData = result1;
			console.log('this.employeeData',this.employeeData);
			let shift_arr:any[] = [];
			if(this.employeeData && this.employeeData.emp_shift_details && this.employeeData.emp_shift_details.length > 0) {
				this.employeeData.emp_shift_details.forEach(element => {
					shift_arr.push(element.shift_name);
				});				
			}
			let inputJson = {
				emp_code_no: this.searchForm.value.emp_code_no, 
				entrydate:new DatePipe('en-in').transform(this.searchForm.value.entry_date, 'yyyy-MM-dd'),
				ses_id:this.session_id.ses_id
			};
			this.commonAPIService.getShiftAttendance(inputJson).subscribe((result: any) => {
			this.EMPLOYEE_ELEMENT = [];
			this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			if (result) {
				let pos = 1;
				//console.log('result', result);
				for (const item of result.employeeList) {
				element = {
					srno: pos,
					emp_code_no: this.employeeData.emp_code_no ? this.employeeData.emp_code_no : '-',
					emp_name: this.employeeData.emp_name,
					emp_shift: shift_arr,
					shift_time: item.datetime ? item.datetime.split(' ')[1] : '',

				};
				if(item.in) {
					element.shift_time = element.shift_time + ' (In)'
				}
				if(item.exit) {
					element.shift_time = element.shift_time + ' (Exit)'
				}
				console.log('before push element',element);
				this.EMPLOYEE_ELEMENT.push(element);
				pos++;
				}
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
				this.employeedataSource.paginator = this.paginator;
				if (this.sort) {
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.employeedataSource.sort = this.sort;
				}
			}
		});
    });
	
	}

	applyFilter(filterValue: String) {
		console.log('filterValue', filterValue);
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
	}
	openLeaveCredit(flag){
		this.timeflag = flag;
		const dialogRef: any = this.dialog.open(UserTimeModalComponent, {
			data: {
				timeflag : flag,
				emp_code_no : this.employeeData.emp_code_no,
				entrydate:new DatePipe('en-in').transform(this.searchForm.value.entry_date, 'yyyy-MM-dd')
			},
			height: '50%',
			width: '40%'
		})
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result && result.status) {
			  this.getEmployeeDetail();
			}
		});
	}

}

export interface EmployeeElement {
	srno: number;
  	emp_code_no:string,
	emp_name: string;
	shift_time: string;
	emp_shift: any;
}