import { Component, OnInit,Inject} from '@angular/core';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService,FeeService } from '../../../_services';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-user-time-modal',
  templateUrl: './user-time-modal.component.html',
  styleUrls: ['./user-time-modal.component.scss']
})
export class UserTimeModalComponent implements OnInit {

  leaveTypeArray:any[] = [];
  feeMonthArray:any[] = []
  paramform:FormGroup
  leavetypeform: any[] = [];
  approvedArray: any[] = [];
  session_id:any;
  constructor(
    private dialogRef: MatDialogRef<UserTimeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private common: CommonAPIService,
    private sis: SisService,
    private erp: ErpCommonService,
    private feeService: FeeService,
    private fb:FormBuilder

  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.session_id = JSON.parse(localStorage.getItem('session'));
    this.buildForm()
  }
  addleavetypeform(item) {
		this.leavetypeform.push(this.fb.group(item));
	}
  buildForm(){
    this.paramform = this.fb.group({
      user_time:'',
      user_time_remarks:''
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit(){
    if(this.paramform.valid){ 
      const inputJson:any = {};
        inputJson.user_time = this.paramform.value.user_time;
        inputJson.user_time_remarks = this.paramform.value.user_time_remarks;
				inputJson.timeflag = this.data.timeflag;
				inputJson.emp_code_no = this.data.emp_code_no;
				inputJson.entrydate=this.data.entrydate;
				this.common.updateShiftAttendance(inputJson).subscribe((result: any) => {
					if (result) {
            this.common.showSuccessErrorMessage('Employee Shift Attendance Updated Successfully', 'success');
            this.dialogRef.close({status:true});
					} else {
            this.common.showSuccessErrorMessage('Error While Updating Employee Shift Attendance', 'error');
            this.dialogRef.close({status:false});
					}
				});
    } else {
      this.common.showSuccessErrorMessage('Please fill all required field', 'error');
    }
  }

}