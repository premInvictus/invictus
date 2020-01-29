import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SmartService, CommonAPIService, ExamService } from '../../_services';
import { CapitalizePipe } from '../../_pipes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bmi-calculator',
  templateUrl: './bmi-calculator.component.html',
  styleUrls: ['./bmi-calculator.component.css']
})
export class BmiCalculatorComponent implements OnInit {
  paramform: FormGroup;
  classArray: any[] = [];
  sectionArray: any[] = [];
  tableDivFlag = false;
  studentArray: any[] = [];
  formGroupArray: any[] = [];
  currentUser: any = {};
  bmiArray: any[] = [];
  ctclass_id;
  ctsection_id;
  constructor(private fbuild: FormBuilder, private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    private examService: ExamService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.buildForm();
    this.getClass();
    this.ctForClass();
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      'bmi_class_id': '',
      'bmi_sec_id': '',
    });
  }
  // getClass() {
  //   this.classArray = [];
  //   this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
  //     if (result && result.status === 'ok') {
  //       this.classArray = result.data;
  //     } else {
  //       this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
  //     }
  //   });
  // }
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
  ctForClass() {
    this.examService.ctForClass({ uc_login_id: this.currentUser.login_id })
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.ctclass_id = result.data[0].uc_class_id;
            this.ctsection_id = result.data[0].uc_sec_id;
            this.getSectionsByClass();
          }
        }
      );
  }
  // get section list according to selected class
  getSectionsByClass() {    
    const sectionParam: any = {};
    sectionParam.class_id = this.ctclass_id;
    this.smartService.getSectionsByClass(sectionParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.sectionArray = result.data;
            this.paramform.patchValue({
              'bmi_class_id' : this.ctclass_id,
              'bmi_sec_id':this.ctsection_id
            });
            this.getRollNoUser();
          } else {
            this.paramform.patchValue({
              'bmi_class_id' : this.ctclass_id
            });
            this.getRollNoUser();
            this.sectionArray = [];
          }
        }
      );
  }
  getRollNoUser() {
    this.tableDivFlag = false;
    this.formGroupArray = [];
    if (this.paramform.value.bmi_class_id && this.paramform.value.bmi_sec_id) {
      this.studentArray = [];
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.bmi_class_id, au_sec_id: this.paramform.value.bmi_sec_id })
        .subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.studentArray = [];
            this.studentArray = result.data;
            let ind = 0;
            for (const item of this.studentArray) {
              const obj = {};
              obj['height' + ind] = '';
              obj['weight' + ind] = '';
              obj['login_id' + ind] = item.au_login_id;
              ind++;
              this.formGroupArray.push({
                formGroup: this.fbuild.group(obj)
              })
            }
            this.examService.getBMI({
              bmi_class_id: this.paramform.value.bmi_class_id,
              bmi_sec_id: this.paramform.value.bmi_sec_id,
            }).subscribe((res: any) => {
              if (res && res.status === 'ok') {
                this.bmiArray = res.data;
                let index = 0;
                for (const item of this.formGroupArray) {
                  for (const titem of this.bmiArray) {
                    if (Number(titem.bmi_login_id) === Number(this.formGroupArray[index].formGroup.value['login_id' + index])) {
                      const obj: any = {};
                      obj['height' + index] = titem.bmi_height;
                      obj['weight' + index] = titem.bmi_weight;
                      this.formGroupArray[index].formGroup.patchValue(obj);
                    }
                  }
                  index++;
                }
              }
            });
          } else {
            this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
          }
        });
    }
  }
  // getSectionsByClass() {
  //   this.sectionArray = [];
  //   this.smartService.getSectionsByClass({ class_id: this.paramform.value.bmi_class_id }).subscribe((result: any) => {
  //     if (result && result.status === 'ok') {
  //       this.sectionArray = result.data;
  //     } else {
  //       this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
  //     }
  //   });
  // }
  saveBMI() {
    let ind = 0;
    const dataArr: any[] = [];
    for (const item of this.studentArray) {
      if (this.formGroupArray[ind].formGroup.value['height' + ind]
        && this.formGroupArray[ind].formGroup.value['weight' + ind]) {
        dataArr.push({
          bmi_class_id: this.paramform.value.bmi_class_id,
          bmi_sec_id: this.paramform.value.bmi_sec_id,
          bmi_login_id: item.au_login_id,
          bmi_height: this.formGroupArray[ind].formGroup.value['height' + ind],
          bmi_weight: this.formGroupArray[ind].formGroup.value['weight' + ind],
          bmi_created_date: new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd'),
          bmi_updated_date: new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd'),
          bmi_created_by: this.currentUser.login_id
        });
        ind++;
      }
    }
    if (dataArr.length > 0) {
      this.examService.insertBMI({
        bmiData: dataArr
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.commonAPIService.showSuccessErrorMessage(res.message, 'success');
          this.getRollNoUser();
        }
      });
    } else {
      this.commonAPIService.showSuccessErrorMessage('Please enter a valid data', 'error');
    }
  }
}
