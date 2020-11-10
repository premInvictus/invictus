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
  emp_shift_arr: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
  displayedEmployeeColumns: string[] = ['emp_code_no', 'emp_name', 'emp_shift','parameters'];
  parameters_arr = ['in','exit','duration','remarks','status'];
  spans = [];
  allemployeeleavearr:any[]=[];
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
  getdaystatus(shortdate,element){
    const fdata = element.find(e => e.shortdate == shortdate)
    if(fdata){
      return fdata.data;
    }
    return '';
  }
  getRowSpan(col, index) {
    //console.log('col '+col, 'index'+index);
    return this.spans[index] && this.spans[index][col];
  }
  cacheSpan(key, accessor) {
    //console.log(key, accessor);
    for (let i = 0; i < this.EMPLOYEE_ELEMENT.length;) {
      let currentValue = accessor(this.EMPLOYEE_ELEMENT[i]);
      let count = 1;
      //console.log('currentValue',currentValue);
      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.EMPLOYEE_ELEMENT.length; j++) {
        if (currentValue != accessor(this.EMPLOYEE_ELEMENT[j])) {
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
  async getShiftAttendanceReport(){

    let inputJson = {
			'month_id': this.acumulativeReport.value.month_id,
			'emp_status': 'all',
			from_attendance: true,
    };
    this.dateArray=[];
    var no_of_days = this.getDaysInMonth(this.acumulativeReport.value.month_id, new Date().getFullYear());
    const inputJson1: any = {};
    inputJson1.datefrom = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-1';
    inputJson1.dateto = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + no_of_days;

    await this.smartService.getHolidayOnly(inputJson1).toPromise().then((res: any) => {
      if (res) {
        this.holidayArray = res.data ? res.data : [];
        var date;
        var dateFormate;
        for (let i = 1; i <= no_of_days; i++) {
          this.displayedEmployeeColumns.push(i.toString());
          date = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + ("0" + i).slice(-2);;
          dateFormate = this.commonAPIService.dateConvertion(date, 'y-MM-dd');
          if (i !== 0) {
            const findex = this.holidayArray.indexOf(dateFormate);
            if (findex !== -1) {
              this.dateArray.push({
                date: date,
                attendance: 'H',
                shortdate:i.toString(),
                data:'H'
              });
            } else {
              this.dateArray.push({
                date: date,
                attendance: '',
                shortdate:i.toString(),
                data:''
              });
            }

          }
        }
      }
    });
    await this.commonAPIService.getAllEmployeeLeaveData().toPromise().then((result: any) => {
      if(result) {
        this.allemployeeleavearr = result;
      }
    });
    console.log('dateArray',this.dateArray);
    this.EMPLOYEE_ELEMENT = [];
    this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result1: any) => {
      if(result1 && result1.length > 0) {
        let inputJson = {
          month_id: this.acumulativeReport.value.month_id,
          ses_id:this.session.ses_id,
        };
        this.commonAPIService.getShiftAttendanceAll(inputJson).subscribe((result: any) => {
          if (result) {
            this.emp_shift_arr = result;
            let pos = 0;
            result1.forEach(employeeData => {
              pos++;
              let shift_arr:any[] = [];
              if(employeeData && employeeData.emp_shift_details && employeeData.emp_shift_details.length > 0) {
                employeeData.emp_shift_details.forEach(element => {
                  shift_arr.push(new TitleCasePipe().transform(element.shift_name));
                });				
              }
              this.parameters_arr.forEach(para => {
                let element:any = {
                  srno: pos,
                  emp_code_no: employeeData.emp_code_no ? employeeData.emp_code_no : '-',
                  emp_name: employeeData.emp_name,
                  emp_shift: shift_arr,
                  parameters: para,
                  dateArray:JSON.parse(JSON.stringify(this.dateArray))
                };
                element.dateArray.forEach(dt => {
                  if(dt.attendance == 'H') {
                    if(para == 'in' || para == 'exit' || para == 'duration' || para == 'remarks') {
                      dt.data='';
                    }
                  } else {
                    const shiftdayAtt = this.emp_shift_arr.find(e => e.entrydate == dt.date);
                    if(para == 'in') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        let temp = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          dt.data = temp.datetime.split(' ')[1];
                          // dt.data = temp.datetime;
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'exit') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        let temp = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          dt.data = temp.datetime.split(' ')[1];
                          // dt.data = temp.datetime;
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'duration') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        const intm = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        const exittm = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        if(intm && exittm) {
                          var exitdate = new Date(exittm.datetime);
                          var indate = new Date(intm.datetime);
                          const diff = exitdate.getTime()-indate.getTime();
                          let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          let seconds = Math.floor((diff % (1000 * 60)) / 1000);
                          dt.data = hours + 'h ' + minutes + 'm ' + seconds + 's ';
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'remarks') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        const intm = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        const exittm = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        let remarks = '';
                        if(intm) {
                          remarks += intm.remarks+' ';
                        }
                        if(exittm) {
                          remarks += exittm.remarks+' ';
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'status') {
                      let temp;
                      let status='';
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        temp = shiftdayAtt.employeeList.find(e => e.shortleave == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          status='Shortleave';
                        }
                        temp = shiftdayAtt.employeeList.find(e => e.emp_code_no == employeeData.emp_code_no);
                        if(!temp){
                          let day_emp_leave:any;
                          let emp_leave_arr:any[]=[];
                          if(this.allemployeeleavearr && this.allemployeeleavearr.length > 0) {
                            for(let e of this.allemployeeleavearr) {
                              if(e.leave_emp_detail.emp_id == employeeData.emp_id){
                                emp_leave_arr.push(e)
                              }
                            }
                            console.log('emp_leave_arr',emp_leave_arr);
                            if(emp_leave_arr && emp_leave_arr.length > 0) {
                              for(let item of emp_leave_arr) {
                                if(item.leave_request_schedule_data && item.leave_request_schedule_data.length > 0){
                                  for(let item1 of item.leave_request_schedule_data) {
                                    console.log('item1.date',item1.date);
                                    if(item1.date == dt.date) {

                                      day_emp_leave = item;
                                      console.log('inner, day_emp_leave',day_emp_leave);
                                    }
                                  }
                                }
                              }
                            }

                          }
                          console.log('outer, day_emp_leave',dt.date,day_emp_leave);
                          if(day_emp_leave) {
                            status = day_emp_leave.leave_type.aliasname;
                          } else {
                            status='A';
                          }
                          dt.data=status;
                        }
                      }  else {
                        dt.data = 'A';
                      }
                    }
                  }
                });
                this.EMPLOYEE_ELEMENT.push(element);
              });
            });
            this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
            this.employeedataSource.paginator = this.paginator;
            // if (this.sort) {
            // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            // this.employeedataSource.sort = this.sort;
            // }
            this.cacheSpan('srno', d => d.srno);
            this.cacheSpan('emp_code_no', d => d.emp_code_no);
            this.cacheSpan('emp_name', d => d.emp_name);
            this.cacheSpan('emp_shift', d => d.emp_shift);
            console.log('this.EMPLOYEE_ELEMENT',this.EMPLOYEE_ELEMENT)
          }
        });
      }
    });
  }

}
export interface EmployeeElement {
	srno: number;
  	emp_code_no:string,
	emp_name: string;
	parameters: string;
	emp_shift: any;
}
