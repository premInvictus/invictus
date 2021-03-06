import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {
  submitFlag = false;
  defaultFlag = false;
  finalDivFlag = true;
  entry_date = new Date();
  disableApiCall = false;
  eventArray: any[] = [];
  firstForm: FormGroup;
  attendanceForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  studentArray: any[] = [];
  currentUser: any;
  session: any;
  formgroupArray: any[] = [];
  finalArray: any[] = [];
  studentAttendanceArray: any[] = [];
  presentFlag: any[] = [];
  absentFlag: any[] = [];
  class_id: any;
  section_id: any;
  totalStudent = 0;
  presentStudent = 0;
  absentStudent = 0;
  defaultsrc: any;
  attendanceArray: any[] = [
    { aid: 0, a_name: 'Absent' },
    { aid: 1, a_name: 'Present' },
  ];
  requiredAll = false;
  backdate_attendance_to_teacher=0;
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public examService: ExamService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getGlobalSetting();
    this.buildForm();
    this.getClass();
    this.ctForClass();
    this.getAttendanceEvent();
  }

  buildForm() {
    this.firstForm = this.fbuild.group({
      syl_class_id: '',
      syl_section_id: '',
      syl_event: '',
      cw_entry_date: this.entry_date
    });
    this.attendanceForm = this.fbuild.group({
      attendance: ''
    });
  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_alias = ['backdate_attendance_to_teacher'];
    this.examService.getGlobalSettingReplace(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const settings = result.data;
        settings.forEach(element => {
          this.backdate_attendance_to_teacher = element.gs_value
        });
      }
    })
  }
  resetdata() {
    this.formgroupArray = [];
    this.studentAttendanceArray = [];
    this.studentArray = [];
    this.finalArray = [];
    this.defaultFlag = false;
    this.submitFlag = false;
    this.finalDivFlag = true;
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
      'syl_class_id': '',
      'syl_section_id': '',
      'syl_event': ''
    });
  }
  ctForClass() {
    this.examService.ctForClass({ uc_login_id: this.currentUser.login_id })
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.class_id = result.data[0].uc_class_id;
            this.section_id = result.data[0].uc_sec_id;
            this.getSectionsByClass();
          }
        }
      );
  }
  //  Get Class List function
  getClass() {
    this.sectionArray = [];
    const classParam: any = {};
    classParam.role_id = this.currentUser.role_id;
    classParam.login_id = this.currentUser.login_id;
    this.smartService.getClassData(classParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.classArray = result.data;
          }
        }
      );
  }
  // get section list according to selected class
  getSectionsByClass() {
    this.resetdata();
    this.firstForm.patchValue({
      'syl_section_id': ''
    });
    const sectionParam: any = {};
    sectionParam.class_id = this.class_id;
    this.smartService.getSectionsByClass(sectionParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.sectionArray = result.data;
            this.fetchDetails();
          } else {
            this.sectionArray = [];
          }
        }
      );
  }
  fetchDetails() {
    this.presentStudent = 0;
    this.absentStudent = 0;
    this.firstForm.patchValue({
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.finalArray = [];
    this.formgroupArray = [];
    this.studentArray = [];
    this.studentAttendanceArray = [];
    const studentParam: any = {};
    studentParam.au_class_id = this.class_id;
    studentParam.au_sec_id = this.section_id;
    studentParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
    studentParam.au_event_id = this.firstForm.value.syl_event;
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';
    this.examService.getUserAttendance(studentParam)
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
                au_full_name: new CapitalizePipe().transform(item.au_full_name),
                au_roll_no: item.r_rollno,
              });
              this.finalArray.push({
                class_id: this.firstForm.value.syl_class_id ? this.firstForm.value.syl_class_id : '',
                sec_id: this.firstForm.value.syl_section_id ? this.firstForm.value.syl_section_id : '',
                ma_event: this.firstForm.value.syl_event ? this.firstForm.value.syl_event : '',
                ma_created_date: this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) ? this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) : '',
                login_id: item.au_login_id ? item.au_login_id : '',
                roll_no: item.r_rollno ? item.r_rollno : '',
                attendance: item.ma_attendance ? Number(item.ma_attendance) : '',
                session_id: this.session.ses_id ? this.session.ses_id : '',
                created_by: this.currentUser.login_id ? this.currentUser.login_id : ''
              });
              counter++;
              this.totalStudent = counter;
              if (Number(item.ma_attendance) === 0) {
                this.absentStudent++;
              } else {
                this.presentStudent++;
              }
            }
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
    if (this.finalArray[i].attendance === 1) {
      this.finalArray[i].attendance = 0;
      this.presentStudent--;
      this.absentStudent++;
    } else {
      this.presentStudent++;
      this.absentStudent--;
      this.finalArray[i].attendance = 1;
    }
  }
  // submit() {
  //   const checkParam: any = {};
  //   checkParam.au_class_id = this.firstForm.value.syl_class_id;
  //   checkParam.au_sec_id = this.firstForm.value.syl_section_id;
  //   checkParam.ma_created_date = this.commonService.dateConvertion(this.entry_date);
  //   checkParam.au_ses_id = this.session.ses_id;
  //   this.examService.checkAttendanceForClass(checkParam).subscribe((result: any) => {
  //     if (result && result.status === 'ok') {
  //       this.examService.updateAttendance(this.finalArray).subscribe((result_u: any) => {
  //         if (result_u && result_u.status === 'ok') {
  //           this.resetForm();
  //           this.commonService.showSuccessErrorMessage('Attendance  Updated Successfully', 'success');
  //           this.ctForClass();
  //         } else {
  //           this.commonService.showSuccessErrorMessage('Update failed', 'error');
  //         }
  //       });
  //     } else {
  //       this.examService.insertAttendance(this.finalArray).subscribe((result_i: any) => {
  //         if (result_i && result_i.status === 'ok') {
  //           this.resetForm();
  //           this.commonService.showSuccessErrorMessage('Attendance Marked Successfully', 'success');
  //           this.ctForClass();
  //         } else {
  //           this.commonService.showSuccessErrorMessage('Insert failed', 'error');
  //         }
  //       });
  //     }
  //   });
  // }
  submit() {
    this.requiredAll = true;
    for (const item of this.finalArray) {
      if (item.attendance === '') {
        this.requiredAll = false;
      }
    }
    if (this.requiredAll) {
      this.disableApiCall = true;
      const checkParam: any = {};
      checkParam.au_class_id = this.firstForm.value.syl_class_id;
      checkParam.au_sec_id = this.firstForm.value.syl_section_id;
      checkParam.au_event_id = this.firstForm.value.syl_event;
      checkParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
      checkParam.au_ses_id = this.session.ses_id;
      this.examService.checkAttendanceForClass(checkParam).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.examService.updateAttendance(this.finalArray).subscribe((result_u: any) => {
            if (result_u && result_u.status === 'ok') {
              this.commonService.showSuccessErrorMessage('Attendance  Updated Successfully', 'success');
              this.disableApiCall = false;
              this.fetchDetails();
            } else {
              this.disableApiCall = false;
              this.commonService.showSuccessErrorMessage('Update failed', 'error');
            }
          });
        } else {
          this.disableApiCall = true;
          this.examService.insertAttendance(this.finalArray).subscribe((result_i: any) => {
            if (result_i && result_i.status === 'ok') {
              this.commonService.showSuccessErrorMessage('Attendance Marked Successfully', 'success');
              this.disableApiCall = false;
              this.fetchDetails();
            } else {
              this.commonService.showSuccessErrorMessage('Insert failed', 'error');
              this.disableApiCall = false;
            }
          });
        }
      });
    } else {
      this.commonService.showSuccessErrorMessage('Mark all student attendance', 'error');
    }

  }
  getAttendanceEvent() {
    this.eventArray = [];
    this.resetdata();
    this.firstForm.patchValue({
      'syl_event': ''
    });
    this.examService.getAttendanceEvent({})
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.eventArray = result.data;
            this.firstForm.patchValue({
              syl_event: this.eventArray[0].ae_id
            });
          }
        }
      );
  }

}
