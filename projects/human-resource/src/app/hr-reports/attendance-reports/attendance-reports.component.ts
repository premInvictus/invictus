import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-attendance-reports',
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent implements OnInit {
  submitFlag = false;
  defaultFlag = false;
  finalDivFlag = true;
  entry_date = new Date();
  firstForm: FormGroup;
  attendanceReport: FormGroup;
  employeeArray: any[] = [];
  employeeAttendanceArray: any[] = [];
  attendanceArray: any[] = [];
  studentArray: any[] = [];
  departmentArray: any[] = [];
  currentUser: any;
  session: any;
  formgroupArray: any[] = [];
  finalArray: any[] = [];
  studentAttendanceArray: any[] = [];
  presentFlag: any[] = [];
  absentFlag: any[] = [];
  totalStudent = 0;
  presentStudent = 0;
  categoryOneArray: any[] = [];
  absentStudent = 0;
  monthEntryAvailable = false;
  att_id: any;
  defaultsrc: any;

  // attendanceArray: any[] = [
  //   { aid: 0, a_name: 'Absent' },
  //   { aid: 1, a_name: 'Present' },
  // ];
  requiredAll = true;
  employeeCatDeptAvail = false;
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonAPIService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getAllEmployee();
  }

  buildForm() {
    this.attendanceReport = this.fbuild.group({
      month_id: ''
    });

  }
  getAllEmployee() {
    this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.employeeArray = result;
      }
    });
  }

  getEmployeeAttendance() {
    const checkifMonthEntry: any = {
      "$and": [
        { "ses_id": this.session.ses_id },
        { "month_id": new Date(this.attendanceReport.value.month_id).getMonth() + 1 }
      ]
    };
    var no_of_days = this.getDaysInMonth(this.attendanceReport.value.month_id, new Date().getFullYear());
    const dateArray: any[] = [];
    var date;
    for (let i = 0; i <= no_of_days; i++) {
      date = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-' + i;
      if (i !== 0) {
        dateArray.push({
          date: date,
          attendance: ''
        });
      }
    }
    for (let item of this.employeeArray) {
      this.employeeAttendanceArray.push({
        emp_id: item.emp_id,
        emp_name: item.emp_name,
        attendance_array: dateArray
      });
    }
    console.log('no');
    // console.log(this.employeeAttendanceArray);
    this.commonAPIService.checkAttendance(checkifMonthEntry).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        console.log('yes');
        this.monthEntryAvailable = true;
        this.attendanceArray = res.data;
        this.assignAttendance(JSON.stringify(this.attendanceArray));
      } else {
        this.monthEntryAvailable = false;
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


  // getAttendance(emp_id, date) {
  //   console.log('emp', emp_id);
  //   console.log('date', date);
  //   console.log(this.attendanceArray);
  //   let findex: any = '';
  //   findex = this.attendanceArray.findIndex(e => (e.entrydate) === (date));
  //   if (findex !== -1) {
  //     console.log('findex', findex);
  //     let findex2: any = '';
  //     findex2 = this.attendanceArray[findex].employeeList.findIndex(f => Number(f.emp_id) === Number(this.attendanceArray[findex].emp_id));
  //     console.log('findex2', findex2);
  //     if (findex2 !== -1) {
  //       console.log('findex33', this.attendanceArray[findex].employeeList[findex2].attendance);
  //       return this.attendanceArray[findex].employeeList[findex2].attendance;
  //     } else {
  //       return 5;
  //     }
  //   }
  //   else {
  //     return 10;
  //   }
  // }
  assignAttendance(value) {
    const array: any[] = JSON.parse(value);
    for (let item of this.employeeAttendanceArray) {
      for (let dety of item.attendance_array) {
        const findex = array.findIndex(f => f.entrydate === dety.date);
        if (findex !== -1) {
          const findex2 = array[findex].employeeList.findIndex(f => Number(f.emp_id) === Number(item.emp_id));
          if (findex2 !== -1) {
            console.log(item.emp_id + 'jkkk' + array[findex].employeeList[findex2].attendance);
            let att: any = '';
            if (array[findex].employeeList[findex2].emp_id === item.emp_id) {
              att = array[findex].employeeList[findex2].attendance;
              dety.attendance = att;
            }
          }
        }
      }
    }
    console.log(this.employeeAttendanceArray);
  }
}
