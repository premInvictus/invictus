import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-percentage-cumulative-subject-modal',
  templateUrl: './percentage-cumulative-subject-modal.component.html',
  styleUrls: ['./percentage-cumulative-subject-modal.component.css']
})
export class PercentageCumulativeSubjectModalComponent implements OnInit {

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
    public dialogRef: MatDialogRef<PercentageCumulativeSubjectModalComponent>,
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
      epcs_class_id: ''
    });

    this.submarkForm = this.fbuild.group({
      submark: this.fbuild.array([])
    })
  }

  get SubjectMark() {
    return this.submarkForm.get('submark') as FormArray;
  }
  addSubjectMark(sub_id, epcs_calculation_mark, type) {
    this.SubjectMark.push(this.fbuild.group({
      epcs_subject_id: sub_id,
      epcs_calculation_mark: epcs_calculation_mark,
      epcs_subject_type : type,
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
        epcs_class_id: this.data[0].epcs_class_id
      });
      this.getExamDetails();
    }
    console.log(this.NoncceClassArray);
  }
  getMaxMarksOfSubExam(se_id) {
    return (this.subexamArray.find(e => e.se_id === se_id)).exam_max_marks;
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({ exam_class: this.mappingForm.value.epcs_class_id, exam_category: '1',egs_point_type: '2'}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        if(this.data && this.data.length > 0) {
          this.mappingForm.patchValue({
            ssm_exam_id: this.data[0].ssm_exam_id
          });
        }
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
 
  getSubMark(sub_id, epcs_calculation_mark) {
    //console.log(sub_id,epcs_calculation_mark);
    let item: any;
    if(this.data && this.data.length > 0) {
      item = this.data.find(e => e.epcs_subject_id === sub_id);
    }
    if(item) {
      //console.log(item.epcs_calculation_mark);
      return item.epcs_calculation_mark;
    }
    return epcs_calculation_mark;

  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.submarkFormArr = [];
    //const se_max_mark = this.getMaxMarksOfSubExam(this.mappingForm.value.ssm_se_id)
    this.smartService.getSubjectsByClass({ class_id: this.mappingForm.value.epcs_class_id, sub_type: '1' }).subscribe((result: any) => {
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
              element.epcs_calculation_mark = 0;
              if(element.childSub.length === 0) {
                //this.addSubjectMark(element.sub_id, se_max_mark);
                this.submarkFormArr.push({
                  epcs_subject_id: element.sub_id,
                  epcs_calculation_mark: 0,
                  epcs_subject_type:'1'
                })
              } else {
                for(let item of element.childSub) {
                  this.submarkFormArr.push({
                    epcs_subject_id: item.sub_id,
                    epcs_calculation_mark: 0,
                    epcs_subject_type: '1'
                  })
                }
              }
              this.subjectArray.push(element);
            }
          });
        }
        this.submarkDivFlag = true;
        console.log('submarkFormArr',this.submarkFormArr);
        //console.log('subjectArray',this.subjectArray);
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getInputMarks(value) {
    for(let item of this.submarkFormArr) {
      if(item.epcs_subject_id === value.sub_id) {
        return item.epcs_calculation_mark;
      }
    }
    return '0';
  }
  enterInputMarks(sub, event) {
    const ind = this.submarkFormArr.findIndex(e => e.epcs_subject_id === sub.sub_id);
    this.submarkFormArr[ind].epcs_calculation_mark = event.value;
  }
  getType(value) {
    for(let item of this.submarkFormArr) {
      if(item.epcs_subject_id === value.sub_id) {
        return item.epcs_subject_type;
      }
    }
    return '0';
  }
  enterType(sub, event) {
    console.log(event);
    const ind = this.submarkFormArr.findIndex(e => e.epcs_subject_id === sub.sub_id);
    console.log(this.submarkFormArr[ind]);
    this.submarkFormArr[ind].epcs_subject_type = event.value;
  }
  saveForm() {
    const param: any = {};
    param.paramform = this.mappingForm.value;
    param.submark = this.submarkFormArr;
    console.log(param);
    this.examService.addExamPerCumulativeSubject(param).subscribe((result: any) => {
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
