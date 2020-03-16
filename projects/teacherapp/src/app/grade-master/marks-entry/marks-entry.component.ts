import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-marks-entry',
  templateUrl: './marks-entry.component.html',
  styleUrls: ['./marks-entry.component.css']
})
export class MarksEntryComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subSubjectArray: any[] = [];
  finalMarksExtendedData: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  studentArray: any[] = [];
  tableDivFlag = false;
  disableApiCall = false;
  marksInputArray: any[] = [];
  marksEditable = true;
  responseMarksArray: any[] = [];
  exam_grade_type = '0';
  exam_grade_type_arr: any[] = [];
  classterm: any;
  absentData = [
    { "egs_grade_name": "AB", "egs_grade_value": "AB", "egs_range_start": "0", "egs_range_end": "0" },
    { "egs_grade_name": "AD", "egs_grade_value": "AD", "egs_range_start": "0", "egs_range_end": "0" },
    { "egs_grade_name": "NAD", "egs_grade_value": "NAD", "egs_range_start": "0", "egs_range_end": "0" },
    { "egs_grade_name": "ML", "egs_grade_value": "ML", "egs_range_start": "0", "egs_range_end": "0" }
  ];
  currentUser: any;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getMarksEntryTimeExpiration();
    this.buildForm();
    this.getClass();
  }

  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        //this.getSubjectsByClass();
        console.log(result.data);

        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSubType() {
    const ind = this.subSubjectArray.findIndex(e => e.sub_id === this.paramform.value.eme_sub_id);
    if (ind !== -1) {
      return this.subSubjectArray[ind].sub_type;
    } else {
      return '1';
    }
  }
  getExamDetails() {
    this.examArray = [];
    this.paramform.patchValue({
      eme_exam_id: ''
    });
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, exam_category: this.getSubType(), term_id: this.paramform.value.eme_term_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getGradeSet(param) {
    this.examService.getGradeSet(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.exam_grade_type_arr = result.data[0].egs_grade_data;
        this.absentData.forEach(element => {
          this.exam_grade_type_arr.push(element);
        });
      }
    })
  }
  getSubExam() {
    if (this.paramform.value.eme_exam_id) {
      const ind = this.examArray.findIndex(e => e.exam_id === this.paramform.value.eme_exam_id);
      this.exam_grade_type = this.examArray[ind].egs_point_type;
      this.getGradeSet({ egs_number: this.examArray[ind].egs_number, sort: 'asc' });
    }
    this.subexamArray = [];
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, term_id: this.paramform.value.eme_term_id, exam_id: this.paramform.value.eme_exam_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data.length > 0 && result.data[0].exam_sub_exam_max_marks.length > 0) {
          this.subexamArray = result.data[0].exam_sub_exam_max_marks;
          console.log(this.subexamArray);
          const subexam_id_arr: any[] = [];
          for (let item of this.subexamArray) {
            subexam_id_arr.push(item.se_id);
          }
          const param: any = {};
          param.ssm_class_id = this.paramform.value.eme_class_id;
          param.ssm_exam_id = this.paramform.value.eme_exam_id;
          param.ssm_se_id = subexam_id_arr;
          param.ssm_sub_id = this.paramform.value.eme_sub_id;
          this.examService.getSubjectSubexamMapping(param).subscribe((result: any) => {
            if (result && result.status === 'ok') {
              for (let item of result.data) {
                for (let item1 of this.subexamArray) {
                  if (item.ssm_se_id === item1.se_id) {
                    item1.exam_max_marks = item.ssm_sub_mark;
                  }
                }
              }
            }
          })
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    })
  }


  getRollNoUser() {
    this.paramform.patchValue({
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    });
    this.tableDivFlag = false;
    if (this.paramform.value.eme_class_id && this.paramform.value.eme_sec_id) {
      this.studentArray = [];
      const param: any = {};
      param.au_class_id = this.paramform.value.eme_class_id;
      param.au_sec_id = this.paramform.value.eme_sec_id;
      param.sub_id = this.paramform.value.eme_sub_id;
      this.examService.getRollNoUser(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }
  getSubexamName(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
  }
  getSubexamMarks(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).exam_max_marks;
  }
  displayData() {
    if (this.paramform.value.eme_subexam_id.length > 0) {
      this.responseMarksArray = [];
      this.marksInputArray = [];
      this.tableDivFlag = true;
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.eme_review_status = ['0', '1', '2', '3', '4'];
      this.examService.getMarksEntry(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          console.log(result.data);
          this.responseMarksArray = result.data;
          if (result.data.length > 0) {
            this.paramform.value.eme_subexam_id.forEach(selement => {
              result.data.forEach(melement => {
                if (selement === melement.examEntry.eme_subexam_id) {
                  melement.examEntryMapping.forEach(element => {
                    this.marksInputArray.push({
                      es_id: melement.examEntry.eme_subexam_id,
                      login_id: element.emem_login_id,
                      mark: element.emem_marks
                    });
                  });
                }
              });
            });
          }
        }
      })
    } else {
      this.marksInputArray = [];
      this.tableDivFlag = false;
    }
  }

  getSubjectName() {
    for (const item of this.subSubjectArray) {
      if (item.sub_id === this.paramform.value.eme_sub_id) {
        return item.sub_name;
      }
    }
  }
  enterInputMarks(es_id, login_id, marktarget) {
    const subexammarks = Number(this.getSubexamMarks(es_id));
    const mark = marktarget.value;
    console.log(mark);
    if (!isNaN(mark)) {
      if (mark <= subexammarks) {
        const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
        if (ind !== -1) {
          this.marksInputArray[ind].mark = mark;
        } else {
          this.marksInputArray.push({
            es_id: es_id,
            login_id: login_id,
            mark: mark
          });
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage('Invalid input', 'error');
        marktarget.value = '';
      }
    } else if (mark === 'AB' || mark === 'AD' || mark === 'NAD' || mark === 'ML') {
      const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
      if (ind !== -1) {
        this.marksInputArray[ind].mark = mark;
      } else {
        this.marksInputArray.push({
          es_id: es_id,
          login_id: login_id,
          mark: mark
        });
      }
    } else {
      this.commonAPIService.showSuccessErrorMessage('Invalid input', 'error');
      marktarget.value = '';
    }
    console.log('marksInputArray', this.marksInputArray);
  }

  getInputMarks(es_id, login_id) {
    const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
    if (ind !== -1) {
      return this.marksInputArray[ind].mark;
    } else {
      return '';
    }
  }
  getInputMarksForPoint(es_id, login_id) {
    const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
    if (ind !== -1) {
      const temp = this.exam_grade_type_arr.find(e => e.egs_grade_value === this.marksInputArray[ind].mark);
      return temp.egs_grade_name;
    } else {
      return '';
    }
  }

  saveForm(status = '0', savelog = '0') {
    console.log('this.marksInputArray.length', this.marksInputArray.length);
    console.log('this.paramform.value.eme_subexam_id.length * this.studentArray.length', this.paramform.value.eme_subexam_id.length * this.studentArray.length);
    /* if(this.marksInputArray.length < this.paramform.value.eme_subexam_id.length * this.studentArray.length) {
      const dialogRef = this.dialog.open(MarkEntrySubmitDialogComponent, {
        width: '600px',
        height: '300px',
        data: {text: 'Save',message: 'Still few student has empty mark! Do you wish to continue'}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.confirm === 'ok') {
          if (this.paramform.valid && this.marksInputArray.length > 0) {
            const param: any = {};
            param.examEntry = this.paramform.value;
            param.examEntryMapping = this.marksInputArray;
            param.examEntryStatus = status;
            param.savelog = savelog;
            this.examService.addMarksEntry(param).subscribe((result: any) => {
              if (result && result.status === 'ok') {
                this.displayData();
              }
            })
          }
        }
      });
    } else */
    if (status !== '0') {
      if (this.paramform.valid && this.marksInputArray.length > 0) {
        this.disableApiCall = true;
        const param: any = {};
        param.examEntry = this.paramform.value;
        param.examEntryMapping = this.marksInputArray;
        param.examEntryStatus = status;
        param.marksInputArrayLength = this.marksInputArray.length;
        param.studentArrayLength = this.paramform.value.eme_subexam_id.length * this.studentArray.length;
        param.savelog = savelog;
        this.examService.addMarksEntry(param).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.displayData();
            this.disableApiCall = false;
          } else {
            this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
            this.disableApiCall = false;
          }
        })
      }
    } else {
      if (this.paramform.valid && this.marksInputArray.length > 0) {
        this.disableApiCall = true;
        const param: any = {};
        param.examEntry = this.paramform.value;
        param.examEntryMapping = this.marksInputArray;
        param.examEntryStatus = status;
        param.marksInputArrayLength = this.marksInputArray.length;
        param.studentArrayLength = this.paramform.value.eme_subexam_id.length * this.studentArray.length;
        this.examService.addMarksEntry(param).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.displayData();
            this.disableApiCall = false;
          } else {
            this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
            this.disableApiCall = false;
          }
        })
      }
    }
  }
  resetTableDiv() {
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_subexam_id: ''
    });
  }
  checkEditable(es_id, eme_review_status) {
    //console.log('this.responseMarksArray', this.responseMarksArray.length);
    if (this.responseMarksArray.length > 0) {
      const rindex = this.responseMarksArray.findIndex(item => item.examEntry.eme_subexam_id === es_id);
      if (rindex === -1) {
        return true;
      } else {
        if (this.responseMarksArray[rindex].examEntry.eme_review_status === eme_review_status) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  isAnyoneEditable(eme_review_status) {
    let status = false;
    if (this.responseMarksArray.length > 0) {
      for (const item of this.responseMarksArray) {
        if (item.examEntry.eme_review_status === eme_review_status) {
          status = true;
          break;
        }
      }
      return status;
    } else {
      return true;
    }
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassByTeacherId({ teacher_id: this.currentUser.login_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    });
    this.tableDivFlag = false;
    this.sectionArray = [];
    this.smartService.getSectionByTeacherIdClassId({
      teacher_id: this.currentUser.login_id,
      class_id: this.paramform.value.eme_class_id
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      }
    });
  }
  // getSubjectsByClass() {
  //   this.paramform.patchValue({
  //     eme_sub_id: ''
  //   });
  //   this.subjectArray = [];
  //   this.smartService.getSubjectByTeacherIdClassIdSectionId({
  //     teacher_id: this.currentUser.login_id,
  //     class_id: this.paramform.value.eme_class_id,
  //     sec_id: this.paramform.value.eme_sec_id
  //   }).subscribe((result: any) => {
  //     if (result && result.status === 'ok') {
  //       this.subjectArray = result.data;
  //       console.log(this.subjectArray);
  //     }
  //   });
  // }

  getSubjectsByClass() {
    this.subjectArray = [];
    this.paramform.patchValue({
      eme_sub_id: ''
    });
    this.smartService.getSubjectByTeacherIdClassIdSectionId({
      teacher_id: this.currentUser.login_id,
      class_id: this.paramform.value.eme_class_id,
      sec_id: this.paramform.value.eme_sec_id
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subSubjectArray = result.data;
        const temp = result.data;
        let scholastic_subject: any[] = [];
        let coscholastic_subject: any[] = [];
        if (temp.length > 0) {

          temp.forEach(element => {
            // if (element.sub_parent_id && element.sub_parent_id === '0') {
            //   const childSub: any[] = [];
            //   for (const item of temp) {
            //     if (element.sub_id === item.sub_parent_id) {
            //       childSub.push(item);
            //     }
            //   }
            //   element.childSub = childSub;
            //   this.subjectArray.push(element);
            // }
            if (element.sub_type === '1' || element.sub_type === '3') {
              if (element.sub_parent_id && element.sub_parent_id === '0') {
                var childSub: any[] = [];
                for (const item of temp) {
                  if (element.sub_id === item.sub_parent_id) {
                    childSub.push(item);
                  }
                }
                element.childSub = childSub;
                scholastic_subject.push(element);
              }
            } else if (element.sub_type === '2' || element.sub_type === '4') {
              if (element.sub_parent_id && element.sub_parent_id === '0') {
                var childSub: any[] = [];
                for (const item of temp) {
                  if (element.sub_id === item.sub_parent_id) {
                    childSub.push(item);
                  }
                }
                element.childSub = childSub;
                coscholastic_subject.push(element);
              }
            }
          });
        }

        for (var i = 0; i < scholastic_subject.length; i++) {
          this.subjectArray.push(scholastic_subject[i]);
        }
        for (var i = 0; i < coscholastic_subject.length; i++) {
          this.subjectArray.push(coscholastic_subject[i]);
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  isAnyoneEditableFinal(eme_review_status) {
    let status = false;
    if (this.responseMarksArray.length > 0) {
      for (const item of this.responseMarksArray) {
        if (item.examEntry.eme_review_status === eme_review_status) {
          status = true;
          break;
        }
      }
      return status;
    } else {
      return false;
    }
  }
  isExistUserAccessMenu(mod_id) {
    return this.commonAPIService.isExistUserAccessMenu(mod_id);
  }
  getMarksEntryTimeExpiration() {
    let param: any = {};
    param.gs_alias = ['marks_extend_time'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const settings = result.data;
        this.finalMarksExtendedData = JSON.parse(settings[0]['gs_value'])
        console.log('settings=--', settings, this.finalMarksExtendedData);
      }
    });
  }
  checkIfNotExpired() {
    let flag = false;
    if (this.finalMarksExtendedData.length > 0) {
      for (const item of this.finalMarksExtendedData) {
        if (Number(item.class_id) === Number(this.paramform.value.eme_class_id)
          && Number(item.term_id) === Number(this.paramform.value.eme_term_id)
          && Number(item.exam_id) === Number(this.paramform.value.eme_exam_id)) {
          if (item.expirationDate) {
            if (Number(item.status) === 5) {
              flag = false;
              break;
            }
            if (Number(item.status) === 1) {
              flag = true;
              break;
            }
          }
        } else {
          flag = true;
        }
      }
    } else {
      flag = true;
    }
    return flag;
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
