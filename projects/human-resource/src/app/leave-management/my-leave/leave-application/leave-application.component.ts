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
  monthData: any = {};
  empRecord: any = {};
  editFlag = false;
  employeeData:any;
  session_id:any;   
  leave_credit = 0;
  constructor(
    public dialogRef: MatDialogRef<LeaveApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private sisService: SisService,
  ) { }

  ngOnInit() {
    this.session_id = JSON.parse(localStorage.getItem('session'));
    console.log('data',this.data);
    this.getClassIVStaff();
    this.buildForm();
    this.getLeaveType();
    this.empRecord = JSON.parse(localStorage.getItem('eRecord'));
    console.log('this.empRecord',this.empRecord);
    if (this.data.leave_type.leave_id) {
      this.editFlag = true;
      this.showFormFlag = true;
      this.leaveForm.patchValue({
        'leave_id': this.data.leave_id,
        'leave_start_date': this.data.leave_start_date ? this.common.dateConvertion(this.data.leave_start_date, 'yyyy-MM-dd') : '',
        'leave_end_date': this.data.leave_end_date ? this.common.dateConvertion(this.data.leave_end_date, 'yyyy-MM-dd') : '',
        'leave_type': this.data.leave_type.leave_id,
        'leave_half_day': this.data.leave_half_day,
        'leave_reason': this.data.leave_reason,
        'leave_attachment': this.data.leave_attachment,
        'leave_status': this.data.leave_status
      });
      if(this.data.leave_type.leave_id){
        this.getEmployeeDetails();
      }
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
      'leave_half_day': false,
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

    if (this.selectedIndex === 0) {
      console.log('this.empRecord',this.empRecord);
      const month_data: any[] = this.empRecord.emp_month_attendance_data &&
        this.empRecord.emp_month_attendance_data.month_data &&
        this.empRecord.emp_month_attendance_data.month_data.length > 0 ?
        this.empRecord.emp_month_attendance_data.month_data : [];
      ;
      console.log('month_data',month_data);
    } else {
      const month_data: any[] = this.monthData &&
        this.monthData.month_data &&
        this.monthData.month_data.length > 0 ?
        this.monthData.month_data : [];
      ;
      
    }
    console.log('this.leaveForm',this.leaveForm.value);
    if (this.leaveForm.value.leave_type && this.leaveForm.value.leave_start_date &&
      (!this.halfDay ? this.leaveForm.value.leave_end_date : true) && this.leaveForm.value.leave_reason
      && this.leave_credit > 0
      ) {
      if (this.halfDay) {
        this.leaveForm.value.leave_end_date = this.leaveForm.value.leave_start_date;
      }
      this.leaveForm.value['tabIndex'] = this.selectedIndex;
      this.leaveForm.value['leave_employee_id'] = this.subJSON['leave_employee_id'];
      if (this.selectedIndex == 0) {
        this.leaveForm.value['leave_to'] = this.empRecord.emp_supervisor && this.empRecord.emp_supervisor.id ? this.empRecord.emp_supervisor.id : '';
      } else {
        this.leaveForm.value['leave_to'] = this.subJSON['leave_to'];
      }
      
      this.leaveForm.value['leave_emp_detail'] = this.subJSON['leave_emp_detail'];
      console.log('this.leaveForm.value',this.leaveForm.value);
      let tempdays = this.leaveForm.value.leave_end_date.diff(this.leaveForm.value.leave_start_date, 'days');
      tempdays++;
      console.log('tempdays',tempdays);
      
      if(this.leave_credit >= tempdays){
        this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
      }  else {
        this.common.showSuccessErrorMessage('Insufficiant leave balance', 'error');
      }
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields or make sure leave credit exist', 'error');
    }
  }
  update() {
    let eRecord;
    if (this.selectedIndex === 0) {
      const month_data: any[] = this.empRecord.emp_month_attendance_data &&
        this.empRecord.emp_month_attendance_data.month_data &&
        this.empRecord.emp_month_attendance_data.month_data.length > 0 ?
        this.empRecord.emp_month_attendance_data.month_data : [];
      ;
      // if (month_data && month_data[month_data.length - 1] && month_data[month_data.length - 1]['attendance_detail'] &&
      //   month_data[month_data.length - 1]['attendance_detail']['emp_balance_leaves'] >= 0) {
      //   eRecord = month_data[month_data.length - 1]['attendance_detail']['emp_balance_leaves'];

      // } else {
      //   eRecord = this.empRecord && this.empRecord.emp_month_attendance_data &&
      //     this.empRecord.emp_month_attendance_data.leave_opening_balance ?
      //     this.empRecord.emp_month_attendance_data.leave_opening_balance : 0;
      // }
    } else {
      const month_data: any[] = this.monthData &&
        this.monthData.month_data &&
        this.monthData.month_data.length > 0 ?
        this.monthData.month_data : [];
      ;
      // if (month_data && month_data[month_data.length - 1] && month_data[month_data.length - 1]['attendance_detail'] &&
      //   month_data[month_data.length - 1]['attendance_detail']['emp_balance_leaves'] >= 0) {
      //   eRecord = month_data[month_data.length - 1]['attendance_detail']['emp_balance_leaves'];

      // } else {
      //   eRecord = this.empRecord && this.monthData &&
      //     this.monthData.leave_opening_balance ?
      //     this.monthData.leave_opening_balance : 0;
      // }
    }
    if (this.leaveForm.value.leave_type && this.leaveForm.value.leave_start_date &&
      (!this.halfDay ? this.leaveForm.value.leave_end_date : true) && this.leaveForm.value.leave_reason
      && this.leave_credit > 0) {
      if (this.halfDay) {
        this.leaveForm.value.leave_end_date = this.leaveForm.value.leave_start_date;
      }
      this.leaveForm.value['tabIndex'] = this.selectedIndex;
      this.leaveForm.value['leave_employee_id'] = this.subJSON['leave_employee_id'];
      this.leaveForm.value['leave_to'] = this.subJSON['leave_to'];
      this.leaveForm.value['leave_emp_detail'] = this.subJSON['leave_emp_detail'];
      let tempdays = this.leaveForm.value.leave_end_date.diff(this.leaveForm.value.leave_start_date, 'days');
      tempdays++;
      console.log('tempdays',tempdays);
      if(this.leave_credit >= tempdays){
        this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
      }  else {
        this.common.showSuccessErrorMessage('Insufficiant leave balance', 'error');
      }
      //this.dialogRef.close({ data: this.leaveForm.value, attachment: this.attachmentArray });
    } else {
      this.common.showSuccessErrorMessage('Please Fill Required Fields or make sure leave balance exist', 'error');
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
            emp_supervisor: item.emp_supervisor && item.emp_supervisor.id ? item.emp_supervisor.id : '',
            emp_month_attendance_data : item.emp_month_attendance_data ? item.emp_month_attendance_data : ''
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
    this.leaveForm.patchValue({
      'leave_half_day' : false
    });
  }
  getStaff($event) {
    this.subJSON['tabIndex'] = this.selectedIndex;
    this.subJSON['leave_employee_id'] = $event.value;
    this.subJSON['leave_to'] = this.getSupervisiorId($event.value);
    this.subJSON['leave_emp_detail'] = {
      emp_id: $event.value,
      emp_name: this.getEmpName($event.value)
    }
    this.monthData = this.getMonthData($event.value);
  }
  getSupervisiorId(id) {
    console.log('this.empArray',this.empArray);
    console.log('id',id);
    const index = this.empArray.findIndex(f => Number(f.emp_id) === Number(id));
    if (index !== -1) {
      return this.empArray[index]['emp_supervisor'];
    }
  }
  getMonthData(id) {
    const index = this.empArray.findIndex(f => Number(f.emp_id) === Number(id));
    if (index !== -1) {
      return this.empArray[index]['emp_month_attendance_data'];
    }
  }
  getEmpName(id) {
    const index = this.empArray.findIndex(f => Number(f.emp_id) === Number(id));
    if (index !== -1) {
      return this.empArray[index]['emp_name'];
    }
  }
  getEmployeeDetails(){
    let inputJson:any = {};
    this.leave_credit = 0;
    console.log('this.selectedIndex',this.selectedIndex);
    if(this.selectedIndex ==0){
      inputJson.emp_id = this.data.emp_id;
    } else {
      if (this.subJSON['leave_employee_id']) {
        inputJson.emp_id   =    this.subJSON['leave_employee_id']
      }
    }
    if(inputJson.emp_id) {
      this.common.getEmployeeDetail(inputJson).subscribe((result: any) => {
        this.employeeData = result;
        if(this.employeeData && this.employeeData.emp_month_attendance_data)
        this.employeeData.emp_month_attendance_data.forEach(element => {
					if(element.ses_id == this.session_id.ses_id){
						if(element.month_data  && element.month_data.length > 0){
              const tempmonthdata = element.month_data[element.month_data.length-1];
              console.log('tempmonthdata',tempmonthdata);

              const templeaveCredit = tempmonthdata.attendance_detail.emp_leave_credited.find(e => e.leave_id == this.leaveForm.value.leave_type);
              if(templeaveCredit){
                this.leave_credit = templeaveCredit.leave_value;
              }
              // const templeaveAvailed = tempmonthdata.attendance_detail.emp_leave_availed.find(e => e.leave_id == this.leaveForm.value.leave_type);
              // if(templeaveAvailed){
              //   this.leave_credit -= templeaveAvailed.leave_value;
              // }
              const templeaveGranted = tempmonthdata.attendance_detail.emp_leave_granted.find(e => e.leave_id == this.leaveForm.value.leave_type);
              if(templeaveGranted){
                this.leave_credit -= templeaveGranted.leave_value;
              }
            }
					}
				});
      });
    }
  }
}
