import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../_pipes/index';


@Component({
  selector: 'app-result-entry',
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.css']
})
export class ResultEntryComponent implements OnInit {
  attendanceThemeTwoForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  disableApiCall = false;
  termsArray: any[] = [];
  classterm: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  currentUser: any;
  session: any;
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
  resultEntryOptionsArray: any[] = [];
  resultEntryData: any[] = [];
  displayedColumns = ['roll_no', 'au_full_name', 'au_admission_no', 'result_entry_option', 'result_entry'];
  @ViewChild(MatSort) sort: MatSort;
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
    this.getResultEntryOptions();
  }

  buildForm() {
    this.attendanceThemeTwoForm = this.fbuild.group({
      syl_board_id: 1,
      syl_class_id: '',
      syl_section_id: '',
      syl_term_id: '',
      syl_exam_id: '0',
      syl_subexam_id: '0',
    });
  }

  // Get Result Entry Options

  getResultEntryOptions() {
    let param: any = {};
    param.gs_name = ['result_entry_options'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const settings = result.data;
        this.resultEntryOptionsArray = JSON.parse(settings[0]['gs_value'])
        console.log('settings=--', settings, this.resultEntryOptionsArray);
      }
    });
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
    this.sectionArray = [];
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_section_id': '',
      'syl_term_id': '',
      'syl_exam_id': '',
      'syl_subexam_id': '',
    });
    const sectionParam: any = {};
    sectionParam.class_id = this.attendanceThemeTwoForm.value.syl_class_id;
    sectionParam.teacher_id = this.currentUser.login_id;
    this.smartService.getSectionByTeacherIdClassId(sectionParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.sectionArray = result.data;
          } else {
            this.sectionArray = [];
          }
        }
      );
  }

  getClassTerm() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_term_id': '',
      'syl_exam_id': '',
      'syl_subexam_id': '',
    });
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.attendanceThemeTwoForm.value.syl_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        console.log(result.data);
        if (result.data && result.data.ect_no_of_term) {
          console.log('in');
          result.data.ect_no_of_term.split(',').forEach(element => {
            console.log('element--', element);
            this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
          });

          console.log(this.termsArray);
        }


      } else {
        // this.commonService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getExamDetails() {
    this.examArray = [];
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_exam_id': '',
      'syl_subexam_id': '',
    });
    this.examService.getExamDetails({
      exam_class: this.attendanceThemeTwoForm.value.syl_class_id,
      term_id: this.attendanceThemeTwoForm.value.syl_term_id
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        this.commonService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubExam() {
    this.subexamArray = [];
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.attendanceThemeTwoForm.patchValue({
      'syl_subexam_id': '',
    });
    this.examService.getExamDetails({
      exam_class: this.attendanceThemeTwoForm.value.syl_class_id,
      term_id: this.attendanceThemeTwoForm.value.syl_term_id,
      exam_id: this.attendanceThemeTwoForm.value.syl_exam_id,
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data.length > 0 && result.data[0].exam_sub_exam_max_marks.length > 0) {
          this.subexamArray = result.data[0].exam_sub_exam_max_marks;
        }
      } else {
        this.commonService.showSuccessErrorMessage(result.message, 'error');
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
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const studentParam: any = {};
    studentParam.au_class_id = this.attendanceThemeTwoForm.value.syl_class_id;
    if (Number(this.attendanceThemeTwoForm.value.syl_board_id) === 1) {
      studentParam.au_sec_id = this.attendanceThemeTwoForm.value.syl_section_id;
    }
    studentParam.term_id = this.attendanceThemeTwoForm.value.syl_term_id;
    studentParam.exam_id = this.attendanceThemeTwoForm.value.syl_exam_id ? this.attendanceThemeTwoForm.value.syl_exam_id : '0';
    studentParam.subexam_id = this.attendanceThemeTwoForm.value.syl_subexam_id ? this.attendanceThemeTwoForm.value.syl_subexam_id : '0';
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';

    this.examService.getTermAttendance(studentParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            console.log('result--', result);
            this.studentArray = result.data;

            // for (var i = 0; i < result.data.length; i++) {
            //   if (result.data[i]['result_entry']) {
            //     this.termDataFlag = true;
            //     break;
            //   }
            // }
            this.setGridData();
          } else {
            //this.termDataFlag = false;
            this.fetchDetails();
          }
        });



  }

  setResultEntry(element) {
    console.log('element', element);
    this.formgroupArray[element.sr_no - 1].formGroup.patchValue({
      'result_entry': this.formgroupArray[element.sr_no - 1].formGroup.value.result_entry_option
    })
    console.log(this.formgroupArray[element.sr_no - 1]);
  }

  setGridData() {
    this.defaultFlag = true;
    this.finalDivFlag = false;
    this.ELEMENT_DATA = [];
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    // this.studentArray = result.data;
    let counter = 1;
    for (const item of this.studentArray) {
      this.ELEMENT_DATA.push({
        sr_no: counter,
        au_admission_no: item.au_admission_no,
        au_full_name: new CapitalizePipe().transform(item.au_full_name),
        roll_no: item.r_rollno,
        result_entry_option: '',
        result_entry: this.getResultEntryRemark(item.au_login_id)
      });
      counter++;
      this.formgroupArray.push({
        formGroup: this.fbuild.group({
          class_id: this.attendanceThemeTwoForm.value.syl_class_id,
          sec_id: this.attendanceThemeTwoForm.value.syl_section_id,
          login_id: item.au_login_id,
          result_entry_option: '',
          result_entry: this.getResultEntryRemark(item.au_login_id),
          session_id: this.session.ses_id,
          created_by: this.currentUser.login_id,
          term_id: this.attendanceThemeTwoForm.value.syl_term_id,
          exam_id: this.attendanceThemeTwoForm.value.syl_exam_id ? this.attendanceThemeTwoForm.value.syl_exam_id : '0',
          subexam_id: this.attendanceThemeTwoForm.value.syl_subexam_id ? this.attendanceThemeTwoForm.value.syl_subexam_id : '0',
        })
      });
    }
    console.log('this.ELEMENT_DATA--', this.ELEMENT_DATA);
    this.termAttendanceDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.termAttendanceDataSource.sort = this.sort;
  }

  getResultEntryRemark(login_id) {
    var flag = false;
    var remarkData = '';
    for (let i = 0; i < this.resultEntryData.length; i++) {
      // console.log(login_id, this.resultEntryData[i]['erem_login_id']);
      if (this.resultEntryData[i]['erem_login_id'] === login_id) {
        remarkData = this.resultEntryData[i]['erem_remark'];
        // console.log('remarkData', remarkData);
        flag = true;
        break;
      }
    }
    return remarkData;
  }

  getResultEntry() {
    let inputJson = {};
    this.resultEntryData = [];
    this.termDataFlag = false;
    if (this.attendanceThemeTwoForm.value.syl_class_id) {
      inputJson['ere_class_id'] = this.attendanceThemeTwoForm.value.syl_class_id;
    }
    if (this.attendanceThemeTwoForm.value.syl_section_id) {
      inputJson['ere_sec_id'] = this.attendanceThemeTwoForm.value.syl_section_id;
    }
    if (this.attendanceThemeTwoForm.value.syl_term_id) {
      inputJson['ere_term_id'] = this.attendanceThemeTwoForm.value.syl_term_id;
    }
    if (this.attendanceThemeTwoForm.value.syl_exam_id) {
      inputJson['ere_exam_id'] = this.attendanceThemeTwoForm.value.syl_exam_id;
    }
    if (this.attendanceThemeTwoForm.value.syl_subexam_id) {
      inputJson['ere_sub_exam_id'] = this.attendanceThemeTwoForm.value.syl_subexam_id;
    }
    inputJson['ere_remarks_type'] = '3';
    this.examService.getRemarksEntryStudent(inputJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log('result--', result);
        this.resultEntryData = result.data;
        this.termDataFlag = true;
      }
    });
  }

  finalSubmit() {
    console.log(this.ELEMENT_DATA);
    console.log(this.formgroupArray);
    let inputJson = {};
    let remarkArray = [];
    for (var i = 0; i < this.formgroupArray.length; i++) {

      remarkArray.push(
        {
          erem_login_id: this.formgroupArray[i]['formGroup']['value']['login_id'],
          erem_remark: this.formgroupArray[i]['formGroup']['value']['result_entry']
        }
      );

    }

    inputJson['examEntry'] = {
      ere_class_id: this.attendanceThemeTwoForm.value.syl_class_id,
      ere_sec_id: this.attendanceThemeTwoForm.value.syl_section_id,
      ere_remarks_type: '3',
      ere_term_id: this.attendanceThemeTwoForm.value.syl_term_id,
      ere_exam_id: this.attendanceThemeTwoForm.value.syl_exam_id,
      ere_sub_exam_id: this.attendanceThemeTwoForm.value.syl_subexam_id
    }
    inputJson['examEntryMapping'] = remarkArray;
    inputJson['examEntryStatus'] = '1';
    inputJson['externalFlag'] = 3;
    inputJson['examEntryStatus'] = '1';
    this.disableApiCall = true;
    this.examService.addReMarksEntry(inputJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.disableApiCall = false;
        //this.displayData();
      } else {
        this.disableApiCall = false;
      }
    });
  }

  finalUpdate() {
    console.log(this.ELEMENT_DATA);
    console.log(this.formgroupArray);
    let inputJson = {};
    let remarkArray = [];
    for (var i = 0; i < this.formgroupArray.length; i++) {

      remarkArray.push(
        {
          erem_login_id: this.formgroupArray[i]['formGroup']['value']['login_id'],
          erem_remark: this.formgroupArray[i]['formGroup']['value']['result_entry']
        }
      );

    }

    inputJson['examEntry'] = {
      ere_class_id: this.attendanceThemeTwoForm.value.syl_class_id,
      ere_sec_id: this.attendanceThemeTwoForm.value.syl_section_id,
      ere_remarks_type: '3',
      ere_term_id: this.attendanceThemeTwoForm.value.syl_term_id,
      ere_exam_id: this.attendanceThemeTwoForm.value.syl_exam_id,
      ere_sub_exam_id: this.attendanceThemeTwoForm.value.syl_subexam_id
    }
    inputJson['examEntryMapping'] = remarkArray;
    inputJson['examEntryStatus'] = '1';
    inputJson['externalFlag'] = 3;
    inputJson['examEntryStatus'] = '1';
    this.examService.addReMarksEntry(inputJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        //this.displayData();
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
  roll_no: any;
  au_full_name: any;
  result_entry_option: any;
  result_entry: any;
}

