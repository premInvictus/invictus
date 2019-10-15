import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-subject-subexam-modal',
  templateUrl: './subject-subexam-modal.component.html',
  styleUrls: ['./subject-subexam-modal.component.css']
})
export class SubjectSubexamModalComponent implements OnInit {

  mappingForm: FormGroup;
  submarkForm: FormGroup;
  submarkFormArr: any[] = [];
  classterm: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  classArray: any[] = [];
  NoncceClassArray: any[] = [];
  subjectArray: any[] = [];
  submarkDivFlag = false;
  constructor(
    public dialogRef: MatDialogRef<SubjectSubexamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    private fbuild: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    this.getNonCceClass();

  }
  buildForm() {
    this.mappingForm = this.fbuild.group({
      ssm_class_id: '',
      ssm_exam_id: '',
      ssm_se_id: ''
    });

    this.submarkForm = this.fbuild.group({
      submark: this.fbuild.array([])
    })
  }

  get SubjectMark() {
    return this.submarkForm.get('submark') as FormArray;
  }
  addSubjectMark(sub_id, sub_mark) {
    this.SubjectMark.push(this.fbuild.group({
      ssm_sub_id: sub_id,
      ssm_sub_mark: sub_mark
    }))
  }
  isexistId(arr:any[], id) {
    
    for(const item of arr) {
      const temparr = item.ect_class_id.split(',');
      for(const element of temparr) {
        if(element === id) {
          return 1;
        }
      };
    }    
    return 0;
  }
  async getNonCceClass() {
    await this.examService.getClassTerm({ ect_exam_type: '2' }).toPromise().then((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
      }
    });
    await this.smartService.getClass({ class_status: '1' }).toPromise().then((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      }
    });
    this.classArray.forEach(element => {
      if(this.isexistId(this.classterm,element.class_id) === 1) {
        this.NoncceClassArray.push(element);
      }
    });
    if(this.data && this.data.length > 0) {
      this.mappingForm.patchValue({
        ssm_class_id: this.data[0].ssm_class_id
      });
      this.getExamDetails();
    }
    console.log(this.NoncceClassArray);
  }
  getSubexam() {
    this.mappingForm.patchValue({
      ssm_se_id : ''
    });
    this.subexamArray = [];
    for(let item of this.examArray) {
      const temparr = item.class_id.split(',');
      for(let e of temparr) {
        if(e === this.mappingForm.value.ssm_class_id && item.exam_id === this.mappingForm.value.ssm_exam_id) {
          this.subexamArray = item.exam_sub_exam_max_marks;
        }
      }
    }
    if(this.data && this.data.length > 0) {
      this.mappingForm.patchValue({
        ssm_se_id: this.data[0].ssm_se_id
      });
      this.getSubjectsByClass();
    }
  }
  getMaxMarksOfSubExam(se_id) {
    return (this.subexamArray.find(e => e.se_id === se_id)).exam_max_marks;
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({ exam_class: this.mappingForm.value.ssm_class_id, exam_category: '1',egs_point_type: '2'}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        if(this.data && this.data.length > 0) {
          this.mappingForm.patchValue({
            ssm_exam_id: this.data[0].ssm_exam_id
          });
          this.getSubexam();
        }
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
 
  getSubMark(sub_id, sub_mark) {
    //console.log(sub_id,sub_mark);
    let item: any;
    if(this.data && this.data.length > 0) {
      item = this.data.find(e => e.ssm_sub_id === sub_id);
    }
    if(item) {
      //console.log(item.ssm_sub_mark);
      return item.ssm_sub_mark;
    }
    return sub_mark;

  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.submarkFormArr = [];
    const se_max_mark = this.getMaxMarksOfSubExam(this.mappingForm.value.ssm_se_id)
    this.smartService.getSubjectsByClass({ class_id: this.mappingForm.value.ssm_class_id, sub_type: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
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
              element.sub_mark = se_max_mark;
              if(element.childSub.length === 0) {
                //this.addSubjectMark(element.sub_id, se_max_mark);
                this.submarkFormArr.push({
                  sub_id: element.sub_id,
                  sub_mark: this.getSubMark(element.sub_id,se_max_mark)
                })
              } else {
                for(let item of element.childSub) {
                  this.submarkFormArr.push({
                    sub_id: item.sub_id,
                    sub_mark: this.getSubMark(item.sub_id,se_max_mark)
                  })
                }
              }
              this.subjectArray.push(element);
            }
          });
        }
        this.submarkDivFlag = true;
        //console.log('submarkFormArr',this.submarkFormArr);
        //console.log('subjectArray',this.subjectArray);
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getInputMarks(value) {
    for(let item of this.submarkFormArr) {
      if(item.sub_id === value.sub_id) {
        return item.sub_mark;
      }
    }
    return '0';
  }
  enterInputMarks(sub, event) {
    const ind = this.submarkFormArr.findIndex(e => e.sub_id === sub.sub_id);
    this.submarkFormArr[ind].sub_mark = event.value;
  }
  saveForm() {
    const param: any = {};
    param.paramform = this.mappingForm.value;
    param.submark = this.submarkFormArr;
    console.log(param);
    this.examService.addSubjectSubexamMapping(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        this.dialogRef.close({list: true});
      }
    })
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
