import { Component, OnInit, Inject } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-call-remarks',
  templateUrl: './call-remarks.component.html',
  styleUrls: ['./call-remarks.component.css']
})
export class CallRemarksComponent implements OnInit {
  remarksForm: FormGroup;
  searchStudent = false;
  studentArrayByName: any[] = [];
  constructor(private commonAPIService: CommonAPIService,
    private fbuild: FormBuilder,
    public dialogRef: MatDialogRef<CallRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.remarksForm = this.fbuild.group({
      req_reason_text: ''
    });
  }
  submit() {
    if (this.remarksForm.valid) {
      this.dialogRef.close(this.remarksForm.value);
    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill required field', 'error');
    }
    //this.dialogRef.close();
    //this.dialogRef.close({ adm_no: id, contact_no: contact_no });
  }
}
