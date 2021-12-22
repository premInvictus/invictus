import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../../_services/index';

@Component({
  selector: 'app-change-supervisor',
  templateUrl: './change-supervisor.component.html',
  styleUrls: ['./change-supervisor.component.scss']
})
export class ChangeSupervisorComponent implements OnInit {
  supervisionForm: FormGroup;
  employeeArray: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ChangeSupervisorComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private sisService: SisService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getAllEpmployeeList();
    if (this.data) {
      this.supervisionForm.patchValue({
        change_supervisor: '',
        emp_login_id: this.data.leave_from,
        leave_id: this.data.leave_id
      });
    }
  }
  buildForm() {
    this.supervisionForm = this.fbuild.group({
      change_supervisor: '',
      emp_login_id: '',
      leave_id: ''
    });
  }
  getAllEpmployeeList() {
    this.common.getAllEmployee({ 'emp_status': 'live' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.employeeArray = result;
      }
    });
  }
  closemodal(): void {
    this.dialogRef.close();
  }
  submit() {
    if (this.supervisionForm.valid) {
      this.dialogRef.close({ data: this.supervisionForm.value });
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
    }
  }
}
