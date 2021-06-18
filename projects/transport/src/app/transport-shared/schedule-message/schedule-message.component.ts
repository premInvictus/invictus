import { Component, OnInit, Inject } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-schedule-message',
  templateUrl: './schedule-message.component.html',
  styleUrls: ['./schedule-message.component.css']
})
export class ScheduleMessageComponent implements OnInit {
  scheduleform: FormGroup;
  searchStudent = false;
  studentArrayByName: any[] = [];
  constructor(
    private commonAPIService: CommonAPIService,
    private fbuild: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    ) {  }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
  }
  buildForm() {
    this.scheduleform = this.fbuild.group({
      schedule_date: '',
      schedule_time:''
    });
  }
  submit() {
    if (this.scheduleform.valid) {
      this.dialogRef.close(this.scheduleform.value);
    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill required field', 'error');
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
