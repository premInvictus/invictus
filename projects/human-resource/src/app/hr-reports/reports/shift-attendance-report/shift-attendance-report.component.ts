import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AxiomService, SmartService, SisService, CommonAPIService, FeeService } from '../../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { CapitalizePipe, IndianCurrency } from '../../../_pipes';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { ErpCommonService } from 'src/app/_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
  selector: 'app-shift-attendance-report',
  templateUrl: './shift-attendance-report.component.html',
  styleUrls: ['./shift-attendance-report.component.scss']
})
export class ShiftAttendanceReportComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  monthArray: any[] = [];
  currentUser:any;
  session:any;
  acumulativeReport: FormGroup;
  schoolInfo: any;
  nodataFlag=true;
  employeeData: any
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id: any = {};
  categoryOneArray: any[] = [];
  holidayArray: any[] = [];
  dateArray: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
	displayedEmployeeColumns: string[] = ['srno', 'emp_code_no', 'emp_name', 'emp_shift'];
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonAPIService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    private erpCommonService: ErpCommonService,
    public feeService: FeeService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getFeeMonths();
    this.getSchool();
  }
  buildForm() {
    this.acumulativeReport = this.fbuild.group({
      month_id: ''
    });

  }
  getFeeMonths() {
    this.monthArray = [];
    this.feeService.getFeeMonths({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.monthArray = result.data;
      } else {
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
  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  };
  getShiftAttendanceReport(){
    let inputJson = {
			'month_id': this.acumulativeReport.value.month_id,
			'emp_status': 'all',
			from_attendance: true,
    };
    this.dateArray=[];
    var no_of_days = this.getDaysInMonth(this.acumulativeReport.value.month_id, new Date().getFullYear());
    // const inputJson1: any = {};
    // inputJson1.datefrom = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-1';
    // inputJson1.dateto = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + no_of_days;
    // this.smartService.getHolidayOnly(inputJson1).subscribe((res: any) => {
    //   if (res) {
    //     this.holidayArray = res.data ? res.data : [];
    //     const dateArray: any[] = [];
    //     var date;
    //     var dateFormate;
    //     for (let i = 1; i <= no_of_days; i++) {
    //       date = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + i;
    //       dateFormate = this.commonAPIService.dateConvertion(date, 'y-MM-dd');
    //       if (i !== 0) {
    //         const findex = this.holidayArray.indexOf(dateFormate);
    //         if (findex !== -1) {
    //           dateArray.push({
    //             date: date,
    //             attendance: 'h'
    //           });
    //         } else {
    //           dateArray.push({
    //             date: date,
    //             attendance: ''
    //           });
    //         }

    //       }
    //     }
    //   }
    // })
    for (let i = 1; i <= no_of_days; i++) {
      const date = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + i;
      this.displayedEmployeeColumns.push(i.toString());
      this.dateArray.push({
        date:date,
        shortdate:i
      })
    }
    this.EMPLOYEE_ELEMENT = [];
    this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result1: any) => {
      if(result1 && result1.length > 0) {
        result1.forEach(employeeData => {
          let element: any = {};
          console.log('employeeData',employeeData);
          let shift_arr:any[] = [];
          if(employeeData && employeeData.emp_shift_details && employeeData.emp_shift_details.length > 0) {
            employeeData.emp_shift_details.forEach(element => {
              shift_arr.push(element.shift_name);
            });				
          }
          let inputJson = {
            month_id: this.acumulativeReport.value.month_id,
            ses_id:this.session.ses_id,
          };
          this.commonAPIService.getShiftAttendance(inputJson).subscribe((result: any) => {
          // if (result) {
          //   let pos = 1;
          //   //console.log('result', result);
          //   for (const item of result.employeeList) {
          //   element = {
          //     srno: pos,
          //     emp_code_no: employeeData.emp_code_no ? employeeData.emp_code_no : '-',
          //     emp_name: employeeData.emp_name,
          //     emp_shift: shift_arr,
          //     shift_time: item.datetime ? item.datetime : '',

          //   };
          //   if(item.in) {
          //     element.shift_time = element.shift_time + ' (In)'
          //   }
          //   if(item.exit) {
          //     element.shift_time = element.shift_time + ' (Exit)'
          //   }
          //   console.log('before push element',element);
          //   this.EMPLOYEE_ELEMENT.push(element);
          //   pos++;
          //   }
          //   this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
          //   this.employeedataSource.paginator = this.paginator;
          //   if (this.sort) {
          //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          //   this.employeedataSource.sort = this.sort;
          //   }
          // }
          });
        });
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
