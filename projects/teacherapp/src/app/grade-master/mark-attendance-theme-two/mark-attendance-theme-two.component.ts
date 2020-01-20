import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { ExamService } from '../../_services/exam.service';

@Component({
  selector: 'app-mark-attendance-theme-two',
  templateUrl: './mark-attendance-theme-two.component.html',
  styleUrls: ['./mark-attendance-theme-two.component.css']
})
export class MarkAttendanceThemeTwoComponent implements OnInit {
  attendanceThemeTwoForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  classterm: any[] = [];
  currentUser: any;
  session: any;
  class_id: any;
  section_id: any;
  ELEMENT_DATA: Element[] = [];
  termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  formgroupArray: any[] = [];
  finalArray: any[] = [];
  boardArray: any[] = [
    { id: 0, name: 'Board' },
    { id: 1, name: 'Non-Board' },
  ];
  boardClassArray: any[] = [
    { class_id: 18, class_name: 'X' },
    { class_id: 20, class_name: 'XII' },
  ];
  studentArray: any[];
  termStudentArray: any[];
  defaultFlag = false;
  finalDivFlag = true;
  termDataFlag = false;
  displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'overall_attendance', 'present_days'];
  constructor(
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public examService: ExamService, ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getClass();
    this.ctForClass();
  }

  buildForm() {
    this.attendanceThemeTwoForm = this.fbuild.group({
      syl_board_id: 1,
      syl_class_id: '',
      syl_section_id: '',
      syl_term_id: ''
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
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_section_id': ''
    });
    const sectionParam: any = {};
    sectionParam.class_id = this.class_id;
    this.smartService.getSectionsByClass(sectionParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.sectionArray = result.data;
            this.getClassTerm();
          } else {
            this.sectionArray = [];
          }
        }
      );
  }

  getClassTerm() {
    this.attendanceThemeTwoForm.patchValue({
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        if (result.data && result.data.ect_no_of_term) {
          result.data.ect_no_of_term.split(',').forEach(element => {
            this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
          });
        }
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }

  fetchDetails() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const studentParam: any = {};
    studentParam.au_class_id = this.attendanceThemeTwoForm.value.syl_class_id;
    if (Number(this.attendanceThemeTwoForm.value.syl_board_id) === 1) {
      studentParam.au_sec_id = this.attendanceThemeTwoForm.value.syl_section_id;
    }
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';
    this.examService.getRollNoUser(studentParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.studentArray = result.data;
            this.setGridData();
          } else {
            this.commonService.showSuccessErrorMessage('No record found', 'error');
            //this.finalCancel();
          }
        }
      );
  }

  displayData() {
    if (!(this.attendanceThemeTwoForm.valid)) {
      this.commonService.showSuccessErrorMessage('Please Choose Required Fields', 'error');
    } else {
      this.formgroupArray = [];
      this.ELEMENT_DATA = [];
      this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
      const studentParam: any = {};
      studentParam.au_class_id = this.attendanceThemeTwoForm.value.syl_class_id;
      if (Number(this.attendanceThemeTwoForm.value.syl_board_id) === 1) {
        studentParam.au_sec_id = this.attendanceThemeTwoForm.value.syl_section_id;
      }
      studentParam.term_id = this.attendanceThemeTwoForm.value.syl_term_id;
      studentParam.au_role_id = '4';
      studentParam.au_status = '1';

      this.examService.getTermAttendance(studentParam)
        .subscribe(
          (result: any) => {
            if (result && result.status === 'ok') {
              console.log('result--', result);
              this.studentArray = result.data;

              for (var i = 0; i < result.data.length; i++) {
                if (result.data[i]['overall_attendance'] || result.data[i]['present_days']) {
                  this.termDataFlag = true;
                  break;
                }
              }

              this.setGridData();
            } else {
              this.termDataFlag = false;
              this.fetchDetails();
            }
          });
    }
  }
  setGridData() {
    this.defaultFlag = true;
    this.finalDivFlag = false;
    // this.studentArray = result.data;
    let counter = 1;
    for (const item of this.studentArray) {
      this.ELEMENT_DATA.push({
        sr_no: counter,
        au_admission_no: item.au_admission_no,
        au_full_name: new CapitalizePipe().transform(item.au_full_name),
        present_days: item.present_days ? item.present_days : '',
        overall_attendance: item.overall_attendance ? item.overall_attendance : ''
      });
      counter++;
      this.formgroupArray.push({
        formGroup: this.fbuild.group({
          class_id: this.attendanceThemeTwoForm.value.syl_class_id,
          sec_id: this.attendanceThemeTwoForm.value.syl_section_id,
          login_id: item.au_login_id,
          present_days: item.present_days,
          overall_attendance: item.overall_attendance,
          session_id: this.session.ses_id,
          created_by: this.currentUser.login_id,
          term_id: this.attendanceThemeTwoForm.value.syl_term_id

        })
      });
    }
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  }

  finalSubmit() {
    console.log(this.ELEMENT_DATA);
    console.log(this.formgroupArray);
    let inputJson = [];
    for (var i = 0; i < this.formgroupArray.length; i++) {
      inputJson.push(this.formgroupArray[i]['formGroup']['value']);
    }

    this.examService.insertTermAttendance(inputJson)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.commonService.showSuccessErrorMessage('Term Attendance Submitted Successfully', 'success');
          } else {
            this.commonService.showSuccessErrorMessage('Error While Submitting Term Attendance', 'error');
          }
        });

    console.log('inputJson--', inputJson);
  }

  finalUpdate() {
    let inputJson = [];
    for (var i = 0; i < this.formgroupArray.length; i++) {
      inputJson.push(this.formgroupArray[i]['formGroup']['value']);
    }

    this.examService.updateTermAttendance(inputJson)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.commonService.showSuccessErrorMessage('Term Attendance Updated Successfully', 'success');
          } else {
            this.commonService.showSuccessErrorMessage('Error While Updating Term Attendance', 'error');
          }
        });
  }

  finalCancel() {
    this.attendanceThemeTwoForm.reset();
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.defaultFlag = false;
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_board_id': 1
    });
  }

}

export interface Element {
  sr_no: any;
  au_admission_no: any;
  au_full_name: any;
  present_days: any;
  overall_attendance: any;
}
