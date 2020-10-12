import { Component, OnInit,Inject} from '@angular/core';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService,FeeService } from '../../../_services';
import { ErpCommonService } from 'src/app/_services';
@Component({
  selector: 'app-leave-credit',
  templateUrl: './leave-credit.component.html',
  styleUrls: ['./leave-credit.component.scss']
})
export class LeaveCreditComponent implements OnInit {

  leaveTypeArray:any[] = [];
  feeMonthArray:any[] = []
  paramform:FormGroup
  leavetypeform: any[] = [];
  approvedArray: any[] = [];
  session_id:any;
  constructor(
    private dialogRef: MatDialogRef<LeaveCreditComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private common: CommonAPIService,
    private sis: SisService,
    private erp: ErpCommonService,
    private feeService: FeeService,
    private fb:FormBuilder

  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.session_id = JSON.parse(localStorage.getItem('session'));
    this.getLeaveType();
    this.getFeeMonths()
    this.buildForm()
  }
  addleavetypeform(item) {
		this.leavetypeform.push(this.fb.group(item));
	}
  buildForm(){
    this.paramform = this.fb.group({
      month_id:''
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  getLeaveType() {
    this.common.getLeaveManagement().subscribe((result: any) => {
      this.leaveTypeArray = result;
      console.log(this.leaveTypeArray);
      this.leaveTypeArray.forEach(element => {
        let tempdata:any={};
        tempdata.leave_id = element.leave_id;
        tempdata.leave_name = element.leave_name;
        tempdata.leave_value = '';
        this.addleavetypeform(tempdata);
      });
    });
  }
  getFeeMonths() {
		this.feeMonthArray = [];
		this.feeService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
        this.feeMonthArray = result.data;
        console.log(this.feeMonthArray);
			}
		});
  }
  submit(){
    var months = [
      '', 'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ];
    let monthJson:any;
    if(this.paramform.valid){
      let templeavedata:any[]=[];
      this.leavetypeform.forEach(element => {
        templeavedata.push(element.value);
      });
      
      monthJson = {
        "month_id": Number(this.paramform.value.month_id),
        "month_name": months[Number(this.paramform.value.month_id)],
        "attendance_detail": {
          "emp_leave_credited": templeavedata
        }
      }
      let tempR:any= this.data.emp_month_attendance_data || [];
      console.log('tempR',tempR);
      console.log('this.session_id.ses_id',this.session_id.ses_id);
      let sessionindex = tempR.findIndex(e => e.ses_id == this.session_id.ses_id);
      console.log('sessionindex',sessionindex);
      let monthindex=-1;
      if(sessionindex != -1){
        monthindex =  tempR[sessionindex].month_data.findIndex(e => e.month_id == Number(this.paramform.value.month_id))
        if(monthindex == -1){
          tempR[sessionindex].month_data.push(monthJson)
        } else{
          if(tempR[sessionindex].month_data[monthindex].attendance_detail.emp_leave_credited
            && tempR[sessionindex].month_data[monthindex].attendance_detail.emp_leave_credited.length > 0) {
            this.common.showSuccessErrorMessage('Leave Credited for this month','error');
          } else{
            tempR[sessionindex].month_data[monthindex].attendance_detail.emp_leave_credited = templeavedata
          }
          
        }
      } else{
        tempR.push({
          ses_id:this.session_id.ses_id,
          month_data:[monthJson]
        })
      }      
      let approvedjson = {
        emp_id: this.data.emp_id,
        emp_month_attendance_data: tempR
      }
      console.log('approvedjson',approvedjson);
      this.common.updateEmployee(approvedjson).subscribe((approved_result: any) => {
        if (approved_result) {
          this.common.showSuccessErrorMessage('Leave Credited Successfully', 'success');
          this.dialogRef.close({status:true});
        }
      },
      (errorResponse:any) => {
        console.log('error',errorResponse);
        this.common.showSuccessErrorMessage('Error to update database, Structure is not valid', errorResponse.error.status);
      });
    }
  }

}

