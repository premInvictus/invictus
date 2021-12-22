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
  }

  closemodal(): void {
    this.dialogRef.close();
  }
  submit() {
  }
}
