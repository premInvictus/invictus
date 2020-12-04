import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SisService,ExamService } from '../../../_services/index';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-student-verification-modal',
  templateUrl: './student-verification-modal.component.html',
  styleUrls: ['./student-verification-modal.component.css']
})
export class StudentVerificationModalComponent implements OnInit {
  session_id:any;
  currentUser:any;
  leaveForm: FormGroup;
  changeMap:any = {};

  constructor(
    public dialogRef: MatDialogRef<StudentVerificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService:ErpCommonService,
    private sisService: SisService,
    private examService:ExamService
  ) { }

  ngOnInit() {
    this.session_id = JSON.parse(localStorage.getItem('session'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.buildForm();

  }
  buildForm() {
    this.leaveForm = this.fbuild.group({
      'upd_dob': '',
      'upd_dob_check': '',
      'upd_dob_change':'',
      'au_full_name': '',
      'au_full_name_check': '',
      'au_full_name_change':'',
      'father_name': '',
      'father_name_check': '',
      'father_name_change':'',
      'mother_name': '',
      'mother_name_check': '',
      'mother_name_change':''
    });
    this.changeMap['upd_dob_change']='DOB';
    this.changeMap['au_full_name_change']='Name';
    this.changeMap['father_name_change']='Father\'s Name';
    this.changeMap['mother_name_change']='Mother\'s Name';
    this.setOldValue();
    this.getStudentVerification();
  }
  getStudentVerification(){
    const param:any = {};
    param['au_login_id'] = this.data.au_login_id;
    this.examService.getStudentVerification(param).subscribe((result2: any) => {
      if (result2.status === 'ok') {
        let svdata = result2.data[0];
        if(svdata.esv_formvalue){
          let formvalue = JSON.parse(svdata.esv_formvalue);
          console.log('formvalue',formvalue);
          Object.keys(this.leaveForm.value).forEach(key => {
            if(formvalue[key]) {
              this.leaveForm.controls[key].setValue(formvalue[key]);
            }
          })
        }
      } else {
        this.common.showSuccessErrorMessage(result2.message,'error');
      }
    });
  }
  setOldValue(){
    this.leaveForm.patchValue({
      upd_dob:this.data.upd_dob,
      au_full_name:this.data.au_full_name,
      father_name:this.data.father_name,
      mother_name:this.data.mother_name,
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  submit() {
    const param:any = {};
    param['au_login_id'] = this.data.au_login_id;
    param['formvalue'] = JSON.stringify(this.leaveForm.value);
    const correction:any = {};
    Object.keys(this.leaveForm.value).forEach(key => {
      if(key.indexOf('change') != -1) {
        if(this.leaveForm.value[key]) {
          if(moment.isMoment(this.leaveForm.value[key])) {
            correction[this.changeMap[key]] = moment(this.leaveForm.value[key]).format('D-MMM-YYYY');
          } else {
            correction[this.changeMap[key]] = this.leaveForm.value[key];
          }
        }
      }
    })
    param['correction'] = JSON.stringify(correction);
    console.log('param',param);
    this.examService.insertStudentVerification(param).subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.common.showSuccessErrorMessage(result2.message,'success');
        this.closeDialog();
      } else {
        this.common.showSuccessErrorMessage(result2.message,'error');
      }
    });
  }
}
