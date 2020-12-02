import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SisService } from '../../../_services/index';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-verification-modal',
  templateUrl: './student-verification-modal.component.html',
  styleUrls: ['./student-verification-modal.component.css']
})
export class StudentVerificationModalComponent implements OnInit {
  session_id:any;
  currentUser:any;
  leaveForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StudentVerificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService:ErpCommonService,
    private sisService: SisService,
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
    this.setOldValue();
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
  }
}
