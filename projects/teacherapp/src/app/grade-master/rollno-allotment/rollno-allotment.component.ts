import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { ExamService } from '../../_services/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './rollno.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
  selector: 'app-rollno-allotment',
  templateUrl: './rollno-allotment.component.html',
  styleUrls: ['./rollno-allotment.component.css']
})
export class RollnoAllotmentComponent implements OnInit {
  defaultFlag = false;
  finalDivFlag = true;
  displayedColumns: string[] = [];
  firstForm: FormGroup;
  rollNoForm: FormGroup;
  classArray: any[];
  sectionArray: any[];
  studentArray: any[];
  currentUser: any;
  session: any;
  ELEMENT_DATA: Element[] = [];
  rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  formgroupArray: any[] = [];
  finalArray: any[] = [];
  class_id: any;
  section_id: any;
  board_id: any;
  boardArray: any[] = [
    { id: 0, name: 'Board' },
    { id: 1, name: 'Non-Board' },
  ];
  boardClassArray: any[] = [
    { class_id: 18, class_name: 'X' },
    { class_id: 20, class_name: 'XII' },
  ];
  @ViewChild(MatSort) sort: MatSort;
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
    this.buildForm();
    this.getClass();
    this.ctForClass();
  }

  ngAfterViewInit() {
    this.rollNoDataSource.sort = this.sort;
  }

  buildForm() {
    this.firstForm = this.fbuild.group({
      syl_board_id: '',
      syl_class_id: '',
      syl_section_id: ''
    });
  }
  getClassByBoard() {
    this.defaultFlag = false;
    this.finalDivFlag = true;
    if (Number(this.board_id) === 0) {
      this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no', 'au_board_roll_no'];
    } else {
      this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no'];
    }
  }
  ctForClass() {
    this.examService.ctForClass({ uc_login_id: this.currentUser.login_id })
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.class_id = result.data[0].uc_class_id;
            this.section_id = result.data[0].uc_sec_id;
            if (Number(this.class_id) === 18 || Number(this.class_id) === 20) {
              this.board_id = 0;
            } else {
              this.board_id = 1;
            }
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
  finalCancel() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.defaultFlag = false;
    this.finalDivFlag = true;
    this.firstForm.patchValue({
      'syl_board_id': '',
      'syl_class_id': '',
      'syl_section_id': ''
    });
  }
  fetchDetails() {
    this.firstForm.patchValue({
      'syl_board_id': this.board_id,
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.getClassByBoard();
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    const studentParam: any = {};
    studentParam.au_class_id = this.class_id;
    studentParam.au_sec_id = this.section_id;
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';
    this.examService.getRollNoUser(studentParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.defaultFlag = true;
            this.finalDivFlag = false;
            this.studentArray = result.data;
            let counter = 1;
            for (const item of this.studentArray) {
              this.ELEMENT_DATA.push({
                sr_no: counter,
                au_admission_no: item.au_admission_no,
                au_full_name: new CapitalizePipe().transform(item.au_full_name),
                au_roll_no: item.r_rollno,
                au_board_roll_no: item.r_board_roll_no
              });
              counter++;
              this.formgroupArray.push({
                formGroup: this.fbuild.group({
                  class_id: this.firstForm.value.syl_class_id,
                  sec_id: this.firstForm.value.syl_section_id,
                  login_id: item.au_login_id,
                  roll_no: item.r_rollno,
                  board_roll_no: item.r_board_roll_no,
                  session_id: this.session.ses_id,
                  created_by: this.currentUser.login_id

                })
              });
            }
            this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
            this.rollNoDataSource.sort = this.sort;
          } else {
            this.studentArray = [];
          }
        }
      );
  }
  finalSubmit() {
    this.finalArray = [];
    for (const item of this.formgroupArray) {
      this.finalArray.push(item.formGroup.value);
    }
    const checkParam: any = {};
    checkParam.au_class_id = this.firstForm.value.syl_class_id;
    checkParam.au_sec_id = this.firstForm.value.syl_section_id;
    checkParam.au_ses_id = this.session.ses_id;
    this.examService.checkRollNoForClass(checkParam).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examService.updateRollNo(this.finalArray).subscribe((result_u: any) => {
          if (result_u && result_u.status === 'ok') {
            this.finalCancel();
            this.commonService.showSuccessErrorMessage('Roll No. Updated Successfully', 'success');
            this.fetchDetails();
          } else {
            this.commonService.showSuccessErrorMessage('Update failed', 'error');
          }
        });
      } else {
        this.examService.insertRollNo(this.finalArray).subscribe((result_i: any) => {
          if (result_i && result_i.status === 'ok') {
            this.finalCancel();
            this.commonService.showSuccessErrorMessage('Roll No. Inserted Successfully', 'success');
            this.fetchDetails();
          } else {
            this.commonService.showSuccessErrorMessage('Insert failed', 'error');
          }
        });
      }
    });
  }
}
