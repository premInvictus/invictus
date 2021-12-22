import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-percentage-cumulative-exam-modal',
  templateUrl: './percentage-cumulative-exam-modal.component.html',
  styleUrls: ['./percentage-cumulative-exam-modal.component.css']
})
export class PercentageCumulativeExamModalComponent implements OnInit {

  mappingForm: FormGroup;
  submarkFormArr: any[] = [];
  classterm: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  classArray: any[] = [];
  NoncceClassArray: any[] = [];
  subjectArray: any[] = [];
  submarkDivFlag = false;
  typeArr = [{id: '1', name: 'Theory'}, {id:'2', name: 'Practical'}];
  constructor(
    public dialogRef: MatDialogRef<PercentageCumulativeExamModalComponent>,
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
    if(this.data) {
      this.mappingForm.patchValue({
        epce_id: this.data.epce_id,
        epce_class_id: this.data.epce_class_id,
        epce_exam_id: this.data.epce_exam_id,
        epce_exam_type: this.data.epce_exam_type,
        epce_exam_weightage: this.data.epce_exam_weightage,
        epce_status: this.data.epce_status
      });
    }

  }
  buildForm() {
    this.mappingForm = this.fbuild.group({
      epce_id: '',
      epce_class_id: '',
      epce_exam_id: '',
      epce_exam_type: '',
      epce_exam_weightage: '',
      epce_status: ''
    });
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
    if(this.data) {
      this.mappingForm.patchValue({
        epce_class_id: this.data.epce_class_id
      });
      this.getExamDetails();
    }
    console.log(this.NoncceClassArray);
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({ exam_class: this.mappingForm.value.epce_class_id, exam_category: '1',egs_point_type: '2'}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  saveForm() {
    if(this.mappingForm.valid) {
      this.examService.addExamPerCumulativeExam(this.mappingForm.value).subscribe((result: any) => {
        if(result && result.status === 'ok') {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
          this.dialogRef.close({list: true});
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      })
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
