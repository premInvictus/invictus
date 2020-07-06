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
  subJSON: any = {};
  leaveForm: FormGroup;
  halfDay = false;
  leaveTypeArray: any[] = [];
  empArray: any[] = [];
  attachmentArray: any[] = [];
  catArr: any[] = [];
  showFormFlag = false;
  maxDate = new Date();
  currentUser: any;
  employeeRecord: any;
  selectedIndex: any = 0;
  editFlag = false;
  constructor(
    public dialogRef: MatDialogRef<LeaveApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private sisService: SisService,
  ) { }

  ngOnInit() {
    this.getClassIVStaff();
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
        'leave_half_day': this.data.leave_half_day,
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
  checkIfHalf($event) {
    if ($event.checked) {
      this.halfDay = true;
      this.leaveForm.patchValue({
        'leave_half_day': this.halfDay
      });
    } else {
      this.halfDay = false;
      this.leaveForm.patchValue({
        'leave_half_day': this.halfDay
      });
    }
  }
  buildForm() {
    this.leaveForm = this.fbuild.group({
      'leave_id': '',
      'leave_type': '',
      'leave_start_date': '',
      'leave_end_date': '',
      'leave_half_day': '',
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

    if (this.leaveForm.value.leave_type && this.leaveForm.value.leave_start_date &&
      (!this.halfDay ? this.leaveForm.value.leave_end_date : true) && this.leaveForm.value.leave_reason) {
      if (this.halfDay) {
        this.leaveForm.value.leave_end_date = this.leaveForm.value.leave_start_date;
      }
      this.leaveForm.value['tabIndex'] = this.selectedIndex;
      this.leaveForm.value['leave_employee_id'] = this.subJSON['leave_employee_id'];
      this.leaveForm.value['leave_to'] = this.subJSON['leave_to'];
      this.leaveForm.value['leave_emp_detail'] = this.subJSON['leave_emp_detail'];
      this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
    }
  }
  update() {
    if (this.leaveForm.value.leave_type && this.leaveForm.value.leave_start_date &&
      (!this.halfDay ? this.leaveForm.value.leave_end_date : true) && this.leaveForm.value.leave_reason) {
      if (this.halfDay) {
        this.leaveForm.value.leave_end_date = this.leaveForm.value.leave_start_date;
      }
      this.leaveForm.value['tabIndex'] = this.selectedIndex;
      this.leaveForm.value['leave_employee_id'] = this.subJSON['leave_employee_id'];
      this.leaveForm.value['leave_to'] = this.subJSON['leave_to'];
      this.leaveForm.value['leave_emp_detail'] = this.subJSON['leave_emp_detail'];
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
  getClassIVStaff() {
    this.common.getFilterData(
      { "generalFilters": { "emp_department_detail.dpt_id": "", "emp_category_detail.cat_id": [3], "emp_status": ["live"] } }
    ).subscribe((res: any) => {
      if (res && res.status === 'ok') {

        for (const item of res.data) {
          this.empArray.push({
            emp_id: item.emp_id,
            emp_name: item.emp_name,
            emp_supervisor: item.emp_supervisor && item.emp_supervisor.id ? item.emp_supervisor.id : ''
          })
        }
      }
    });
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
  tabChanged($event) {
    this.selectedIndex = $event.index;
  }
  getStaff($event) {
    this.subJSON['tabIndex'] = this.selectedIndex;
    this.subJSON['leave_employee_id'] = $event.value;
    this.subJSON['leave_to'] = this.getSupervisiorId($event.value);
    this.subJSON['leave_emp_detail'] = {
      emp_id: $event.value,
      emp_name: this.getEmpName($event.value)
    }
  }
  getSupervisiorId(id) {
    const index = this.empArray.findIndex(f => Number(f.emp_id) === Number(id));
    if (index !== -1) {
      return this.empArray[index]['emp_supervisor'];
    }
  }
  getEmpName(id) {
    const index = this.empArray.findIndex(f => Number(f.emp_id) === Number(id));
    if (index !== -1) {
      return this.empArray[index]['emp_name'];
    }
  }
}
