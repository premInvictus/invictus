import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';

@Component({
  selector: 'app-common-attendance',
  templateUrl: './common-attendance.component.html',
  styleUrls: ['./common-attendance.component.css']
})
export class CommonAttendanceComponent implements OnInit {
  defaultFlag = false;
  finalDivFlag = true;
  currentUser: any;
  session: any;
  entry_date = new Date()
  firstForm: FormGroup;
  attendanceForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  studentArray: any[] = [];
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public examService: ExamService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getClass();
  }

  buildForm() {
    this.firstForm = this.fbuild.group({
      syl_class_id: '',
      syl_section_id: '',
      cw_entry_date: this.entry_date
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
    //  this.resetdata();
    this.firstForm.patchValue({
      'syl_section_id': ''
    });
    const sectionParam: any = {};
    sectionParam.class_id = this.firstForm.value.syl_class_id;
    this.smartService.getSectionsByClass(sectionParam)
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
  toggleStatus(value) {

  }
  displayData(){
    
  }
}
