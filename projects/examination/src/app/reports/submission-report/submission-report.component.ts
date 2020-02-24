import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-submission-report',
  templateUrl: './submission-report.component.html',
  styleUrls: ['./submission-report.component.css']
})
export class SubmissionReportComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  subSubjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  subExamArray: any[] = [];
  currentTabIndex = 0;
  teacherArray: any[] = [];
  teacherId = '';
  ngOnInit() {
    this.buildForm();
    this.getClass();
  }

  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog,
    public axiomService: AxiomService
  ) { }
  buildForm() {
    this.paramform = this.fbuild.group({
      teacher_name:'',
      teacher_id: '',
      eme_class_id: '',
      eme_term_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_exam_id: '',
      eme_submit: ''
    })
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSubType() {
    const ind = this.subjectArray.findIndex(e => e.sub_id === this.paramform.value.eme_sub_id);
    if (ind !== -1) {
      return this.subjectArray[ind].sub_type;
    } else {
      return '1';
    }
  }
  getExamName(e_id) {
    const ind = this.examArray.findIndex(e => Number(e.exam_id) === Number(e_id));
    if (ind !== -1) {
      return this.examArray[ind].exam_name;
    } else {
      return '-';
    }
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getSectionsByClass() {
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.eme_class_id, sub_isexam : '1'}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subSubjectArray = result.data;
        const temp = result.data;
        if (temp.length > 0) {
          temp.forEach(element => {
            if (element.sub_parent_id && element.sub_parent_id === '0') {
              const childSub: any[] = [];
              for (const item of temp) {
                if (element.sub_id === item.sub_parent_id) {
                  childSub.push(item);
                }
              }
              element.childSub = childSub;
              this.subjectArray.push(element);
            }
          });
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubjectName(sub_id) {
    for (const item of this.subSubjectArray) {
      if (item.sub_id === sub_id) {
        if (item.sub_parent_id > 0) {
          const ind = this.subjectArray.findIndex(e => Number(e.sub_id) === Number(item.sub_parent_id));
          if (ind !== -1) {
            return item.sub_name + ' (' + this.subjectArray[ind].sub_name + ')';
          }
        } else {
          return item.sub_name;
        }
      }
    }
  }
  generateExcel() {
    if (this.paramform.value.eme_exam_id.length > 0) {
      let param: any = Object.assign({}, this.paramform.value) ;
      param.downloadexcel = true;
      this.examService.getComparativeList(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          console.log(result.data);
          this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
        }
      });
    }
  }
  resetTableDiv(changesFrom) {
    if(changesFrom == 'class') {
      this.paramform.patchValue({
        eme_term_id: '',
        eme_sec_id: '',
        eme_submit: ''
      });
    } else if(changesFrom == 'term') {
      this.paramform.patchValue({
        eme_sec_id: '',
        eme_submit:''
      });
    } else if(changesFrom == 'section') {
      this.paramform.patchValue({
        eme_submit:''
      });
    }
  }
  setIndex(event) {
		console.log(event);
		this.currentTabIndex = event;
		this.paramform.patchValue({
			teacher_name:'',
      teacher_id: '',
      eme_class_id: '',
      eme_term_id: '',
      eme_sec_id: '',
		});
  }
  getTeacherInfo(event) {
		console.log(event.target.value);
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					console.log(result.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.paramform.patchValue({
			teacher_name: teacherDetails.au_full_name,
			teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		// this.getClasswork();
  }
  displayData(){
    if(this.paramform.valid) {
      this.paramform.patchValue({
        eme_submit:true
      });
    }
  }

}
