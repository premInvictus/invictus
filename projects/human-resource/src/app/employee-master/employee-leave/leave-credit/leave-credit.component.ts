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
    this.getLeaveType();
    this.getFeeMonths()
    this.buildForm()
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

}

