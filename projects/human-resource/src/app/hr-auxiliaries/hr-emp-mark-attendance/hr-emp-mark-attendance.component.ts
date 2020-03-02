import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-hr-emp-mark-attendance',
  templateUrl: './hr-emp-mark-attendance.component.html',
  styleUrls: ['./hr-emp-mark-attendance.component.scss']
})
export class HrEmpMarkAttendanceComponent implements OnInit {
  submitFlag = false;
  defaultFlag = false;
  finalDivFlag = true;
  entry_date = new Date();
  firstForm: FormGroup;
  attendanceForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
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
  attendanceArray: any[] = [
    { aid: 0, a_name: 'Absent' },
    { aid: 1, a_name: 'Present' },
  ];
  requiredAll = true;
  employeeCatDeptAvail = false;
  disabledApiButton = false;
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getDepartment();
    this.getCategoryOne();
  }

  buildForm() {
    this.firstForm = this.fbuild.group({
      dept_id: '',
      cat_id: '',
      entry_date: this.entry_date
    });
    this.attendanceForm = this.fbuild.group({
      attendance: ''
    });
  }
  getCategoryOne() {
    this.commonService.getCategoryOne({}).subscribe((res: any) => {
      if (res) {
        this.categoryOneArray = [];
        this.categoryOneArray = res;
      }
    });
  }
  resetdata() {
    this.formgroupArray = [];
    this.studentAttendanceArray = [];
    this.studentArray = [];
    this.finalArray = [];
    this.defaultFlag = false;
    this.submitFlag = false;
    this.finalDivFlag = true;
    this.attendanceForm.patchValue({
      'attendance': ''
    });
  }
  resetForm() {
    this.formgroupArray = [];
    this.studentAttendanceArray = [];
    this.studentArray = [];
    this.finalArray = [];
    this.defaultFlag = false;
    this.finalDivFlag = true;
    this.submitFlag = false;
    this.firstForm.patchValue({
      'dept_id': '',
      'cat_id': ''
    });
    this.attendanceForm.patchValue({
      'attendance': ''
    });
  }
  //  Get Class List functio
  fetchDetails() {
    this.attendanceForm.patchValue({
      'attendance': ''
    });
    this.presentStudent = 0;
    this.absentStudent = 0;
    this.finalArray = [];
    this.formgroupArray = [];
    this.studentArray = [];
    this.studentAttendanceArray = [];
    this.monthEntryAvailable = false;
    this.employeeCatDeptAvail = false;
    const checkifMonthEntry: any = {
      "$and": [
        { "ses_id": this.session.ses_id },
        { "entrydate": new DatePipe('en-in').transform(this.firstForm.value.entry_date, 'yyyy-MM-dd') },
        { "month_id": new Date(this.firstForm.value.entry_date).getMonth() + 1 }
      ]
    };
    this.commonService.checkAttendance(checkifMonthEntry).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.monthEntryAvailable = true;
        this.att_id = res.data[0].att_id;
      } else {
        this.monthEntryAvailable = false;
      }
    });
    const checkStatFilter: any = {
      "$and": [
        { "ses_id": this.session.ses_id },
        { "entrydate": new DatePipe('en-in').transform(this.firstForm.value.entry_date, 'yyyy-MM-dd') },
        { "month_id": new Date(this.firstForm.value.entry_date).getMonth() + 1 },
        {
          "employeeList": {
            "$elemMatch": {
              "dpt_id": this.firstForm.value.dept_id.toString(),
              "cat_id": this.firstForm.value.cat_id.toString()
            }
          }
        }
      ]
    };
    this.commonService.checkAttendance(checkStatFilter).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.finalDivFlag = false;
        this.defaultFlag = true;
        this.studentArray = res.data[0].employeeList;
        let counter = 0;
        for (const item of this.studentArray) {
          if (Number(item.dpt_id) === Number(this.firstForm.value.dept_id) &&
            Number(item.cat_id) === Number(this.firstForm.value.cat_id)) {
            this.studentAttendanceArray.push({
              sr_no: counter,
              au_profileimage: item.au_profileimage ? item.au_profileimage : '',
              emp_name: new TitleCasePipe().transform(item.emp_name),
              emp_id: item.emp_id,
            });
            this.finalArray.push({
              dpt_id: item.dpt_id ? item.dpt_id : '',
              cat_id: item.cat_id ? item.cat_id : '',
              emp_id: item.emp_id ? item.emp_id : '',
              emp_wing_detail: item.emp_wing_detail,
              attendance: item.attendance === 0 || item.attendance === 1 ? Number(item.attendance) : '',
              att_created_date: item.att_created_date,
              att_updated_date: item.att_updated_date,
              au_profileimage: item.au_profileimage ? item.au_profileimage : this.defaultsrc,
              emp_name: new TitleCasePipe().transform(item.emp_name),
              created_by: {
                id: item.created_by.id ? item.created_by.id : '',
                name: item.created_by.name ? item.created_by.name : ''
              },
              updated_by: {
                id: item.updated_by.id ? item.updated_by.id : '',
                name: item.updated_by.name ? item.updated_by.name : ''
              },
            });
            counter++;
            this.totalStudent = counter;
            if (Number(item.attendance) === 0) {
              this.absentStudent++;
            } else {
              this.presentStudent++;
            }
          }
        }
        this.employeeCatDeptAvail = true;
      } else {
        this.employeeCatDeptAvail = false;
        const filterJSON = {
          "generalFilters": {
            "emp_department_detail.dpt_id": [
              Number(this.firstForm.value.dept_id)
            ],
            "emp_category_detail.cat_id": [
              Number(this.firstForm.value.cat_id)
            ]
          }
        };
        this.commonService.getFilterData(filterJSON)
          .subscribe(
            (result: any) => {
              if (result && result.status === 'ok') {
                this.finalDivFlag = false;
                this.defaultFlag = true;
                this.studentArray = result.data;
                let counter = 0;
                for (const item of this.studentArray) {
                  if (item.upd_gender === 'M') {
                    this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
                  } else if (item.upd_gender === 'F') {
                    this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
                  } else {
                    this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
                  }
                  this.studentAttendanceArray.push({
                    sr_no: counter,
                    au_profileimage: item.au_profileimage ? item.au_profileimage : this.defaultsrc,
                    emp_name: new TitleCasePipe().transform(item.emp_name),
                    emp_id: item.emp_id,
                  });
                  this.finalArray.push({
                    dpt_id: this.firstForm.value.dept_id ? this.firstForm.value.dept_id.toString() : '',
                    cat_id: this.firstForm.value.cat_id ? this.firstForm.value.cat_id.toString() : '',
                    emp_id: item.emp_id ? item.emp_id : '',
                    emp_name: item.emp_name ? item.emp_name : '',
                    attendance: '',
                    emp_wing_detail: item.emp_wing_detail,
                    att_created_date: '',
                    att_updated_date: '',
                    au_profileimage: item.au_profileimage ? item.au_profileimage : this.defaultsrc,
                    created_by: {
                      id: this.currentUser.login_id ? this.currentUser.login_id : '',
                      name: this.currentUser.full_name ? this.currentUser.full_name : ''
                    },
                    updated_by: {
                      id: this.currentUser.login_id ? this.currentUser.login_id : '',
                      name: this.currentUser.full_name ? this.currentUser.full_name : ''
                    },
                  });
                  counter++;
                  this.totalStudent = counter;
                }
              }
            });
      }
    });
  }
  markStudentAttendance() {
    this.submitFlag = true;
    if (this.attendanceForm.value.attendance === 0) {
      let counter1 = 0;
      for (const item of this.studentArray) {
        this.finalArray[counter1].attendance = 0;
        counter1++;
        this.absentStudent = counter1;
        this.presentStudent = 0;
      }
    } else {
      let counter1 = 0;
      for (const item of this.studentArray) {
        this.finalArray[counter1].attendance = 1;
        counter1++;
        this.presentStudent = counter1;
        this.absentStudent = 0;
      }
    }
  }
  changeStudentAttendanceStatus($event, i) {
    this.submitFlag = true;
    if (Number(this.finalArray[i].attendance) === 1) {
      this.finalArray[i].attendance = 0;
      this.presentStudent--;
      this.absentStudent++;
    } else {
      this.presentStudent++;
      this.absentStudent--;
      this.finalArray[i].attendance = 1;
    }
  }
  fetchDetailsIfCatId() {
    if (this.firstForm.value.cat_id) {
      this.fetchDetails();
    }
  }
  submit() {
    this.requiredAll = true;
    for (const item of this.finalArray) {
      if (item.attendance === '') {
        this.requiredAll = false;
      }
    }
    if (this.requiredAll) {
      this.disabledApiButton = true;
      const checkParam: any = {};
      checkParam.month_id = new Date(this.firstForm.value.entry_date).getMonth() + 1;
      checkParam.entrydate = this.firstForm.value.entry_date ? new DatePipe('en-in').transform(this.firstForm.value.entry_date, 'yyyy-MM-dd') : '';
      checkParam.ses_id = this.session.ses_id ? this.session.ses_id : '';
      checkParam.created_by = {
        id: this.currentUser.login_id ? this.currentUser.login_id : '',
        name: this.currentUser.full_name ? this.currentUser.full_name : ''
      };
      checkParam.employeeList = this.finalArray;
      if (!this.employeeCatDeptAvail && !this.monthEntryAvailable) {
        this.commonService.insertAttendance(checkParam).subscribe((result: any) => {
          this.disabledApiButton = false;
          if (result && result.status === 'ok') {
            this.commonService.showSuccessErrorMessage('Attendance Inserted Successfully', 'success');
            this.fetchDetails();
          }
        });
      }
      if (this.monthEntryAvailable && !this.employeeCatDeptAvail) {
        const updateJSON = {
          att_id: this.att_id,
          updateValue: {
            "$push": {
              "employeeList": {
                "$each": this.finalArray
              }
            }
          }
        };
        this.commonService.updateAttendance(updateJSON).subscribe((res: any) => {
          this.disabledApiButton = false;
          if (res && res.status === 'ok') {
            this.commonService.showSuccessErrorMessage('Attendance Inserted Successfully', 'success');
            this.fetchDetails();
          }
        });
      }
      if (this.monthEntryAvailable && this.employeeCatDeptAvail) {
        const updateJSON = {
          att_id: this.att_id,
          updateValue: {
            "$set": {
              "employeeList": this.finalArray
            }
          }
        };
        this.commonService.updateAttendance(updateJSON).subscribe((res: any) => {
          this.disabledApiButton = false;
          if (res && res.status === 'ok') {
            this.commonService.showSuccessErrorMessage('Attendance Updated Successfully', 'success');
            this.fetchDetails();
          }
        });
      }
    } else {
      this.commonService.showSuccessErrorMessage('Mark all employee attendance', 'error');
    }

  }
  getDepartment() {
    this.commonService.getMaster({ type_id: '7' }).subscribe((result: any) => {
      if (result) {
        this.departmentArray = result;
      } else {
        this.departmentArray = [];
      }

    });
  }

}
