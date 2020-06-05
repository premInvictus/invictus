import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService } from '../../../_services/index';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
  reviewArray: any[] = [];
  leaveForm: FormGroup;
  leaveTypeArray: any[] = [];
  attachmentArray: any[] = [];
  showFormFlag = false;
  maxDate = new Date();
  currentUser: any;
  employeeRecord: any;
  editFlag = false;
  constructor(
    public dialogRef: MatDialogRef<LeaveApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private sisService: SisService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getLeaveType();
    if (this.data) {
      this.editFlag = true;
      this.showFormFlag = true;
      this.leaveForm.patchValue({
        'leave_id': this.data.leave_id,
        'leave_start_date': this.data.leave_start_date ? this.common.dateConvertion(this.data.leave_start_date, 'yyyy-MM-dd') : '',
        'leave_end_date': this.data.leave_end_date ? this.common.dateConvertion(this.data.leave_end_date, 'yyyy-MM-dd') : '',
        'leave_type': this.data.leave_type.leave_type_id,
        'leave_reason': this.data.leave_reason,
        'leave_attachment': this.data.leave_attachment,
        'leave_status': this.data.leave_status
      });
    } else {
      this.data = [];
      this.editFlag = false;
      this.showFormFlag = false;
    }
  }
  buildForm() {
    this.leaveForm = this.fbuild.group({
      'leave_id': '',
      'leave_type': '',
      'leave_start_date': '',
      'leave_end_date': '',
      'leave_reason': '',
      'leave_attachment': '',
      'leave_status': ''
    });
  }
  getLeaveType() {
    this.common.getLeaveManagement().subscribe((result: any) => {
      this.leaveTypeArray = result;
    });
  }

  closemodal(): void {
    this.dialogRef.close();
  }
  submitClasswork() {
    this.dialogRef.close({ data: true });
  }
  submit() {
    if (this.leaveForm.valid) {
      this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
    }
  }
  update() {
    if (this.leaveForm.valid) {
      this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
    }
  }
  uploadAttachment(event) {
    var file = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      this.uploadImage(file.name, fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  uploadImage(fileName, au_profileimage) {
    this.sisService.uploadDocuments([
      { fileName: fileName, imagebase64: au_profileimage, module: 'employee-leave' }]).subscribe((result: any) => {
        if (result.status === 'ok') {
          this.attachmentArray = result.data;
        }
      });
  }
  reset() {
    this.leaveForm.reset();
  }
}
