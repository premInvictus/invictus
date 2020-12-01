import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './rollno.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-correction',
  templateUrl: './report-correction.component.html',
  styleUrls: ['./report-correction.component.css']
})
export class ReportCorrectionComponent implements OnInit {
  defaultFlag = false;
  finalDivFlag = true;
  displayedColumns: string[] = [];
  firstForm: FormGroup;
  rollNoForm: FormGroup;
  disableApiCall = false;
  classArray: any[];
  sectionArray: any[];
  studentArray: any[];
  currentUser: any;
  session: any;
  ELEMENT_DATA: Element[] = [];
  rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
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
      this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'father_name', 'mother_name'];
    } else {
      this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'father_name'];
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
  getMasterStudentDetail
  fetchDetails() {
    this.firstForm.patchValue({
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.getClassByBoard();
    this.ELEMENT_DATA = [];
    this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const studentParam: any = {};
    studentParam.class_id = this.class_id;
    studentParam.sec_id = this.section_id;
    studentParam.enrollment_type = '4';
    studentParam.status = '1';
    this.sisService.getMasterStudentDetail(studentParam)
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
                father_name: new CapitalizePipe().transform(item.father_name),
                mother_name: new CapitalizePipe().transform(item.mother_name),
                upd_dob: new DatePipe('en-in').transform(new Date(), 'd-MMM-y'),
              });
              counter++;
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
  }
}
