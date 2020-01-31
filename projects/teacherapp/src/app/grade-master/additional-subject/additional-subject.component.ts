import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService,ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './additional-subject.model';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
@Component({
  selector: 'app-additional-subject',
  templateUrl: './additional-subject.component.html',
  styleUrls: ['./additional-subject.component.css']
})
export class AdditionalSubjectComponent implements OnInit {
  displayedColumns: string[] = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no', 'subjects'];
  defaultFlag = false;
  finalDivFlag = true;
  firstForm: FormGroup;
  rollNoForm: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  subjectArray: any[] = [];
  studentArray: any[] = [];
  currentUser: any;
  session: any;
  class_id: any;
  section_id: any;
  ELEMENT_DATA: Element[] = [];
  rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  formgroupArray: any[] = [];
  finalArray: any[] = [];
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

  buildForm() {
    this.firstForm = this.fbuild.group({
      syl_class_id: '',
      syl_section_id: ''
    });
  }
  ctForClass(){
    this.examService.ctForClass({uc_login_id : this.currentUser.login_id})
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
    this.datareset();
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
  getSubjectsByClass() {
    this.smartService.getSubjectsByClass({ class_id: this.class_id })
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.subjectArray = result.data;
          } else {
            this.subjectArray = [];
          }
        }
      );
  }
  // get section list according to selected class
  getSectionsByClass() {
    this.datareset();
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
  datareset() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.defaultFlag = false;
    this.finalDivFlag = true;
  }
  finalCancel() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.defaultFlag = false;
    this.finalDivFlag = true;
    this.firstForm.patchValue({
      'syl_class_id': '',
      'syl_section_id': ''
    });
  }
  fetchDetails() {
    this.firstForm.patchValue({
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.studentArray = [];
    this.getSubjectsByClass();
    const studentParam: any = {};
    studentParam.au_class_id = this.class_id;
    studentParam.au_sec_id = this.section_id;
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';
    this.examService.getAdditionalSubjectUser(studentParam)
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
                subjects: this.subjectArray,
              });
              const subject_id = item.a_subject_id ? item.a_subject_id.replace(/\s/g, '').split(',') : [];
              this.formgroupArray.push({
                formGroup: this.fbuild.group({
                  class_id: '',
                  sec_id: '',
                  login_id: '',
                  roll_no: '',
                  subjects: '',
                  session_id: '',
                  created_by: ''
                })
              });
              this.formgroupArray[counter - 1].formGroup.patchValue({
                class_id: this.firstForm.value.syl_class_id ? this.firstForm.value.syl_class_id : '',
                sec_id: this.firstForm.value.syl_section_id ? this.firstForm.value.syl_section_id : '',
                login_id: item.au_login_id ? item.au_login_id : '',
                roll_no: item.r_rollno ? item.r_rollno : '',
                subjects: subject_id,
                session_id: this.session.ses_id ? this.session.ses_id : '',
                created_by: this.currentUser.login_id ? this.currentUser.login_id : ''
              });
              counter++;
            }
            this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          } else {
            this.studentArray = [];
            this.ELEMENT_DATA = [];
            this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          }
        }
      );
  }
  finalSubmit() {
    this.finalArray = [];
    for (const item of this.formgroupArray) {
      this.finalArray.push(item.formGroup.value);
    }
    console.log(this.finalArray);
    const checkParam: any = {};
    checkParam.au_class_id = this.firstForm.value.syl_class_id;
    checkParam.au_sec_id = this.firstForm.value.syl_section_id;
    checkParam.au_ses_id = this.session.ses_id;
    this.examService.checkAdditionalSubjectForClass(checkParam).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examService.updateAdditionalSubject(this.finalArray).subscribe((result_u: any) => {
          if (result_u && result_u.status === 'ok') {
            this.finalCancel();
            this.commonService.showSuccessErrorMessage('Additional Subject Updated Successfully', 'success');
            this.fetchDetails();
          } else {
            this.commonService.showSuccessErrorMessage('Update failed', 'error');
          }
        });
      } else {
        this.examService.insertAdditionalSubject(this.finalArray).subscribe((result_i: any) => {
          if (result_i && result_i.status === 'ok') {
            this.finalCancel();
            this.commonService.showSuccessErrorMessage('Additional Subject Inserted Successfully', 'success');
            this.fetchDetails();
          } else {
            this.commonService.showSuccessErrorMessage('Insert failed', 'error');
          }
        });
      }
    });
  }

}
