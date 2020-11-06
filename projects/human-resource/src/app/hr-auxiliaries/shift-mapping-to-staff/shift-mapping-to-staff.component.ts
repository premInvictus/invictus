import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-shift-mapping-to-staff',
  templateUrl: './shift-mapping-to-staff.component.html',
  styleUrls: ['./shift-mapping-to-staff.component.scss']
})

@Component({
  selector: 'app-shift-mapping-to-staff',
  templateUrl: './shift-mapping-to-staff.component.html',
  styleUrls: ['./shift-mapping-to-staff.component.scss']
})
export class ShiftMappingToStaffComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	employeeForm: FormGroup;
	searchForm: FormGroup;
	sessionArray: any[] = [];
	sessionDetails:any;
	formGroupArray: any[] = [];
	totalPresentArr: any[] = [];
	//editFlag = false;
	employeeData: any[] = [];
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id: any = {};
	categoryOneArray: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
	displayedEmployeeColumns: string[] = ['srno', 'emp_id', 'emp_name', 'emp_designation','emp_shift'];
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
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService

	) {

		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
    this.buildForm();
    this.getShift();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			status_id: '',
			cat_id: '',

		});
		// this.employeeForm = this.fbuild.group({
		// 	search_id: ''

		// });
		this.getCategoryOne();
	}

	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}

	getDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};

	getEmployeeDetail() {
    let inputJson = {
      emp_cat_id: this.searchForm.value.cat_id,
      from_attendance: true,
    };
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
      let element: any = {};
      this.employeeData = result;
      console.log('this.employeeData',this.employeeData);
      this.EMPLOYEE_ELEMENT = [];
      this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
      if (result && result.length > 0) {
        let pos = 1;
        this.formGroupArray = [];
        let j = 0;
        //console.log('result', result);
        for (const item of result) {

          this.formGroupArray[j] = {
            formGroup: this.fbuild.group({
              emp_id: item.emp_id,
              emp_shift: ''
            })
		  }
		  this.formGroupArray[j].formGroup.patchValue({
			emp_shift:item.emp_shift
		  });
          element = {
            srno: pos,
            emp_id: item.emp_id,
            emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
            emp_name: item.emp_name,
            emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',

          };
          console.log('before push element',element);
          this.EMPLOYEE_ELEMENT.push(element);
          pos++;
          j++;

        }
        this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
        this.employeedataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.employeedataSource.sort = this.sort;
        }
        console.log('this.formGroupArray',this.formGroupArray);
      }
      console.log('this.employeeData',this.employeeData);
    });
	
	}

	resetEmployeeAttendance() {
		this.getEmployeeDetail();
	}

	resetAll() {
		this.editAllStatus = true;
		this.getEmployeeDetail();
	}


	applyFilter(filterValue: String) {
		console.log('filterValue', filterValue);
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
  }
  getShift() {
		this.hrshiftArray = [];
		this.commonAPIService.getShift().subscribe((result: any) => {
			if (result) {
				this.hrshiftArray = result;
			}
		});
  }
  saveEmployeeAttendance(){
    let filterArr:any[]=[];
    for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
      filterArr.push({
				emp_id: this.formGroupArray[i].formGroup.value.emp_id,
				emp_shift: this.formGroupArray[i].formGroup.value.emp_shift
			});
    }
		console.log('filterArr',filterArr);
		this.commonAPIService.updateEmployeeDatainBulk(filterArr).subscribe((result: any) => {
			if (result) {
				this.disabledApiButton = false;
				this.getEmployeeDetail();
				this.commonAPIService.showSuccessErrorMessage('Employee Updated Successfully', 'success');
			} else {
				this.disabledApiButton = false;
				this.getEmployeeDetail();
				//this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee ', 'success');
			}
		},
		(errorResponse:any) => {
			this.commonAPIService.showSuccessErrorMessage(errorResponse.error, 'error');
		});
  }

}

export interface EmployeeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_shift: any;
}
