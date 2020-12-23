import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { MatSort,MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-exam-achievement',
  templateUrl: './exam-achievement.component.html',
  styleUrls: ['./exam-achievement.component.css']
})
export class ExamAchievementComponent implements OnInit {
  paramform: FormGroup;
  defaultFlag = false;
  disableApiCall = false;
  finalDivFlag = true;
  displayedColumns: string[] = ['roll_no', 'au_admission_no', 'au_full_name', 'au_achievement'];
  classArray: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  studentArray: any[];
  currentUser: any;
  session: any;
  ELEMENT_DATA: Element[] = [];
  DataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  formgroupArray: any[] = [];
  finalArray: any[] = [];
  submitFlag = false;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getClass();
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      a_class_id: '',
      a_sec_id: '',
      a_term_id: ''
    });
    this.formgroupArray = [];
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.a_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
        //	this.examType = result.data.ect_exam_type;

      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  onTextChange($event) {
    this.submitFlag = true;
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      a_term_id: '',
    });
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.a_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  fetchDetails() {
    this.formgroupArray = [];
    this.ELEMENT_DATA = [];
    this.DataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const studentParam: any = {};
    studentParam.au_class_id = this.paramform.value.a_class_id;
    studentParam.au_sec_id = this.paramform.value.a_sec_id;
    studentParam.au_term_id = this.paramform.value.a_term_id;
    studentParam.au_role_id = '4';
    studentParam.au_status = '1';
    this.examService.getUserAchievement(studentParam)
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
                roll_no:item.r_rollno,
                au_admission_no: item.au_admission_no,
                au_full_name: new CapitalizePipe().transform(item.au_full_name),
                au_achievement: item.a_achievement,
                is_editable: item.is_editable
              });
              counter++;
              this.formgroupArray.push({
                formGroup: this.fbuild.group({
                  a_class_id: this.paramform.value.a_class_id,
                  a_sec_id: this.paramform.value.a_sec_id,
                  a_term_id: this.paramform.value.a_term_id,
                  a_login_id: item.au_login_id,
                  a_admission_no: item.au_admission_no,
                  a_achievement: item.a_achievement,
                  a_ses_id: this.session.ses_id,
                  a_created_by: this.currentUser.login_id,
                })
              });
            }
            this.DataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
            this.DataSource.sort = this.sort;
          } else {
            this.commonAPIService.showSuccessErrorMessage('No record found', 'error');
             this.finalCancel();
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
    checkParam.au_class_id = this.paramform.value.a_class_id;
    checkParam.au_sec_id = this.paramform.value.a_sec_id;
    checkParam.au_term_id = this.paramform.value.a_term_id;
    checkParam.au_ses_id = this.session.ses_id;
    this.disableApiCall = true;
    // this.examService.checkAchievement(checkParam).subscribe((result: any) => {
    //   if (result && result.status === 'ok') {
    //     this.examService.insertAchievement(this.finalArray).subscribe((result_i: any) => {
    //       if (result_i && result_i.status === 'ok') {
    //         this.fetchDetails();
    //         // this.finalCancel();
    //         this.commonAPIService.showSuccessErrorMessage('Achievement Inserted Successfully', 'success');
    //         this.disableApiCall = false;
    //       } else {
    //         this.commonAPIService.showSuccessErrorMessage('Insert failed', 'error');
    //         this.disableApiCall = false;
    //       }
    //     });
    //   }
    // });
    this.examService.insertAchievement({param: checkParam, finalArray: this.finalArray}).subscribe((result_i: any) => {
      if (result_i && result_i.status === 'ok') {
        this.fetchDetails();
        // this.finalCancel();
        this.commonAPIService.showSuccessErrorMessage('Achievement Inserted Successfully', 'success');
        this.disableApiCall = false;
      } else {
        this.commonAPIService.showSuccessErrorMessage('Insert failed', 'error');
        this.disableApiCall = false;
      }
      this.disableApiCall = false;
    });

    console.log(this.finalArray);
  }

  finalCancel() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.submitFlag = false;
		this.paramform.patchValue({
			'a_class_id': '',
      'a_sec_id': '',
      'a_term_id':''
		});
  }
  checkEditableForStudent(stu) {
    //console.log('stu---->',stu);
    if(stu.is_editable === '1') {
      return true;
    } else {
      return false;
    }
  }
  isAnyoneEditabelStu() {
    let anyoneeditable = false;
    this.studentArray.forEach(element => {
      if(element.is_editable === '1') {
        anyoneeditable = true;
      }
    });
    return anyoneeditable;
  }

}
export interface Element {
  sr_no: any;
  roll_no:any;
  au_admission_no: any;
  au_full_name: any;
  au_achievement: any;
  is_editable: any;
}