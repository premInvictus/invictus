import { Component, OnInit, Inject } from '@angular/core';
import { SisService } from '../../_services/sis.service';
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
  shouldSizeUpdate: boolean;
  studentArrayByName: any[] = [];
  constructor(private sisService: SisService,
    private fbuild: FormBuilder,
    public dialogRef: MatDialogRef<CallRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.shouldSizeUpdate = data.shouldSizeUpdate;
  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.remarksForm = this.fbuild.group({
      req_reason_text: ''
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
