import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-marks-register',
  templateUrl: './marks-register.component.html',
  styleUrls: ['./marks-register.component.css']
})
export class MarksRegisterComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  subSubjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  finalSubexamArray: any[] = [];
  studentArray: any[] = [];
  tableDivFlag = false;
  marksInputArray: any[] = [];
  marksEditable = true;
  responseMarksArray: any[] = [];
  exam_grade_type = '0';
  exam_grade_type_arr: any[] = [];
  subExamArray: any[] = [];
  student_sub_exam_data_arr: any[] = [];
  thead_data: any[] = [];
  classterm: any;
  absentData = { "egs_grade_name": "AB", "egs_grade_value": "AB", "egs_range_start": "0", "egs_range_end": "0" };
  tableWidth = '100%';
  ect_grade_avg_highest: any = {grade: false}
  reportTypeArray: any[] = [
    {id: 'marksinput', name: 'Marks Input'},
    {id: 'weightagescore', name: 'Weighted Score'},
    {id: 'consolidatedregister', name: 'Consolidated Register'}
  ];
  subTypeArray: any[] = [
    {id: '1', name: 'Scholastic'},
    {id: '2', name: 'Co-Scholastic'}
  ];
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
    public dialog: MatDialog
  ) { }
  buildForm() {
    this.paramform = this.fbuild.group({
      eme_report_type:'',
      eme_sub_type: '',
      eme_class_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_term_id: '',
      eme_exam_id: ''
    })
  }
  changeReportType(){
    
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        if(this.classterm.ect_grade_avg_highest) {
          const temp_grade_config = JSON.parse(this.classterm.ect_grade_avg_highest);
          if(temp_grade_config.grade) {
            this.ect_grade_avg_highest.grade = temp_grade_config.grade;
          }
        }
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
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
  getExamDetails() {
    this.examArray = [];
    this.subexamArray = [];
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, exam_category: this.paramform.value.eme_sub_type }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        this.subexamArray.push(result.data[0].exam_sub_exam_max_marks);
        for (const item of this.examArray) {
          for (const dety of item.exam_sub_exam_max_marks) {   
            const ind = this.finalSubexamArray.findIndex(e => Number(e.se_id) === Number(dety.se_id));
            if (ind === -1) {
              this.finalSubexamArray.push(dety);
            }
          }
        }
      } 
    });  
  }
  getGradeSet(param) {
    this.examService.getGradeSet(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.exam_grade_type_arr = result.data[0].egs_grade_data;
        this.exam_grade_type_arr.push(this.absentData);
      }
    })
  }
  getExamName(e_id) {
    const ind = this.examArray.findIndex(e => Number(e.exam_id) === Number(e_id));
    if (ind !== -1) {
      return this.examArray[ind].exam_name;
    } else {
      return '-';
    }
  }
  getSubexamName(se_id) {
    const ind = this.finalSubexamArray.findIndex(e => Number(e.se_id) ===  Number(se_id));
    if (ind !== -1) {
      return this.finalSubexamArray[ind].sexam_name;
    } else {
      return '-';
    }
  }
  getSubexamMarks(se_id) {
    const ind = this.finalSubexamArray.findIndex(e => Number(e.se_id) === Number(se_id));
    if (ind !== -1) {
      return this.finalSubexamArray[ind].exam_max_marks;
    } else {
      return '-';
    }
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_term_id: '',
      eme_sub_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    });
    this.tableDivFlag = false;
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
    this.paramform.patchValue({
      eme_sub_id: ''
    });
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.eme_class_id, sub_isexam : '1', sub_type: this.paramform.value.eme_sub_type}).subscribe((result: any) => {
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
  getRollNoUser() {
    this.paramform.patchValue({
      eme_term_id: '',
      eme_exam_id: '',
    });
    this.tableDivFlag = false;
    if (this.paramform.value.eme_class_id && this.paramform.value.eme_sec_id) {
      this.studentArray = [];
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.eme_class_id, au_sec_id: this.paramform.value.eme_sec_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
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
  displayData() {
    if (this.paramform.value.eme_exam_id.length > 0) {
      this.responseMarksArray = [];
      this.marksInputArray = [];
      this.tableDivFlag = true;
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.eme_review_status = ['0', '1', '2', '3', '4'];
      this.examService.getMarksRegister(this.paramform.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.responseMarksArray = result.data;
          console.log(this.responseMarksArray);
          if(this.responseMarksArray.length > 0) {
            this.thead_data = this.responseMarksArray[0]['so_printData']['sub_mark'];
            console.log(this.thead_data);
          }
          

          /*console.log(result.data);
          const subExam = result.data[0].subExam;
          if (result.data[0].length > 3) {
            this.tableWidth = '100%';
          } else {
            this.tableWidth = '70%';
          }
          Object.keys(subExam).forEach(key => {
            const examArray = [];
            let length = 0;
            if (key !== '-') {
              Object.keys(subExam[key]).forEach(key1 => {
                const subExamArray = [];
                Object.keys(subExam[key][key1]).forEach(key2 => {
                  length++;
                  subExamArray.push({
                    sexam_id: key2,
                    sub_exam_id: subExam[key][key1][key2]
                  });
                });
                examArray.push({
                  exam_id: key1,
                  subExamData: subExamArray
                });
              });
              this.responseMarksArray.push({
                sub_id: key,
                examArray: examArray,
                length: length,
                dataArr: []
              });
            }
          });
          console.log(this.responseMarksArray);*/
        }
      })
    } else {
      this.marksInputArray = [];
      this.tableDivFlag = false;
    }
  }
  // getInputMarks(sub_id, exam_id, es_id, login_id) {
  //   const ind = this.subExamArray.findIndex(e => Number(e.eme_subexam_id) === Number(es_id)
  //     && Number(e.emem_login_id) === Number(login_id) && Number(e.eme_sub_id) === Number(sub_id)
  //     && Number(e.eme_exam_id) === Number(exam_id));
  //   if (ind !== -1) {
  //     return this.subExamArray[ind].emem_marks;
  //   } else {
  //     return '-';
  //   }

  // }
  getInputMarksSubsubject(login_id,sub_id,exam_id,se_id,ssub_id){
    let tempvalue = '-';
    for (let index = 0; index < this.responseMarksArray.length; index++) {
      const element = this.responseMarksArray[index];
      if(element.au_login_id === login_id) {
        for (let index1 = 0; index1 < element.so_printData.sub_mark.length; index1++) {
          const element1 = element.so_printData.sub_mark[index1];
          if(element1.sub_id === sub_id) {
            for (let index2 = 0; index2 < element1.sub_exam_mark.length; index2++) {
              const element2 = element1.sub_exam_mark[index2];
              if(element2.exam_id === exam_id) {
                for (let index3 = 0; index3 < element2.student_mark_subexam.length; index3++) {
                  const element3 = element2.student_mark_subexam[index3];
                  if(element3.se_id === se_id) {
                    for (let index4 = 0; index4 < element3.subsubject_marks.length; index4++) {
                      const element4 = element3.subsubject_marks[index4];
                      if(element4.sub_id === ssub_id) {
                        tempvalue = element4.student_mark;
                      }                      
                    }
                  }                  
                }
              }              
            }
          }          
        }
      }      
    }
    return tempvalue;
  }
  getInputMarksSubexam(login_id,sub_id,exam_id,se_id,key){
    let tempvalue = '-';
    for (let index = 0; index < this.responseMarksArray.length; index++) {
      const element = this.responseMarksArray[index];
      if(element.au_login_id === login_id) {
        for (let index1 = 0; index1 < element.so_printData.sub_mark.length; index1++) {
          const element1 = element.so_printData.sub_mark[index1];
          if(element1.sub_id === sub_id) {
            for (let index2 = 0; index2 < element1.sub_exam_mark.length; index2++) {
              const element2 = element1.sub_exam_mark[index2];
              if(element2.exam_id === exam_id) {
                for (let index3 = 0; index3 < element2.student_mark_subexam.length; index3++) {
                  const element3 = element2.student_mark_subexam[index3];
                  if(element3.se_id === se_id) {
                    tempvalue = element3[key];
                  }                  
                }
              }              
            }
          }          
        }
      }      
    }
    return tempvalue;
  }
  getInputMarksExam(login_id,sub_id,exam_id,key){
    let tempvalue = '-';
    for (let index = 0; index < this.responseMarksArray.length; index++) {
      const element = this.responseMarksArray[index];
      if(element.au_login_id === login_id) {
        for (let index1 = 0; index1 < element.so_printData.sub_mark.length; index1++) {
          const element1 = element.so_printData.sub_mark[index1];
          if(element1.sub_id === sub_id) {
            for (let index2 = 0; index2 < element1.sub_exam_mark.length; index2++) {
              const element2 = element1.sub_exam_mark[index2];
              if(element2.exam_id === exam_id) {
                tempvalue = element2[key];
              }              
            }
          }          
        }
      }      
    }
    return tempvalue;
  }
  getInputMarkssubject(login_id,sub_id,key){
    let tempvalue = '-';
    for (let index = 0; index < this.responseMarksArray.length; index++) {
      const element = this.responseMarksArray[index];
      if(element.au_login_id === login_id) {
        for (let index1 = 0; index1 < element.so_printData.sub_mark.length; index1++) {
          const element1 = element.so_printData.sub_mark[index1];
          if(element1.sub_id === sub_id) {
            tempvalue = element1[key];
          }          
        }
      }      
    }
    return tempvalue;
  }
  // getInputMarks2(login_id) {
  //   const ind = this.subExamArray.findIndex(e => Number(e.emem_login_id) === Number(login_id));
  //   if (ind !== -1) {
  //     return 1;
  //   } else {
  //     return -1;
  //   }
  // }
  resetTableDiv() {
    this.responseMarksArray = [];
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_exam_id: ''
    });
  }
}
