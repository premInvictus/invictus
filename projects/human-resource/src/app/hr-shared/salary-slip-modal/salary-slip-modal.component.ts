import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-salary-slip-modal',
  templateUrl: './salary-slip-modal.component.html',
  styleUrls: ['./salary-slip-modal.component.scss']
})
export class SalarySlipModalComponent implements OnInit {
  employeeDetails: any = {};
  header: string = '';
  schoolInfo: any = '';
  values: any = {};
  ch:any = {};
  employeeDetailsFlag=false;
  constructor(private dialogRef: MatDialogRef<SalarySlipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private common: CommonAPIService,
    private sis: SisService,
    private erp: ErpCommonService) { }

  ngOnInit() {
    // console.log('this.data',this.data, this.data.values);
    this.values = this.data.values;
    // if(this.values.action.leaves && this.values.action.leaves.emp_leave_availed){
    //   let emp_leave_availed = 0;
    //   this.values.action.leaves.emp_leave_availed.forEach(element => {
    //     emp_leave_availed += element.leave_value;
    //   });
    //   this.values.action.leaves.emp_leave_availed = emp_leave_availed;
    // }
    this.ch = this.data.ch ? this.data.ch : {};
    this.getSchoolInfo();
  }
  getEmployeeDetails(emp_id) {
    this.common.getEmployeeSalaryDetail({ emp_ids: [emp_id], month_id: this.values.action.id.toString() }).subscribe((res: any) => {
      if (res) {
        this.employeeDetails = res[0];
        this.employeeDetailsFlag = true;
        console.log('this.employeeDetails',this.employeeDetails);
        this.employeeDetails.datax = this.ch.security_details ? this.ch.security_details[0].security_month_amount: '-';
        console.log('__________________________', this.employeeDetails);
        
      }
    });
  }
  getNumFormat(val) {
    return Number(val);
  }
  getGlobalSettings() {
    this.erp.getGlobalSetting({ gs_alias: 'employee_salary_slip' }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        if (res.data[0] && res.data[0].gs_value) {
          const head: string = ((JSON.parse(res.data[0].gs_value))['headerFormat']);
          const schoolLogo: any = '<img src="' + this.schoolInfo.school_logo + '" width = 90 height = 90>';
          this.header = head.replace(/{{si_school_logo}}/g, schoolLogo);

          this.header = this.header.replace(/{{si_school_name}}/g, this.schoolInfo.school_name);
          this.header = this.header.replace(/{{si_school_address}}/g, this.schoolInfo.school_address);
          this.header = this.header.replace(/{{si_school_pin}},/g, '');
          this.header = this.header.replace(/{{si_school_phone}}/g, this.schoolInfo.school_phone);

        }

      }
    });
  }
  getSchoolInfo() {
    this.sis.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        this.getEmployeeDetails(this.data.emp_id);
        this.getGlobalSettings();
      }
    });
  }
  getGrossSalary(values: any[], value2: any, td) {
    // const td = value2.emp_salary_structure && value2.emp_salary_structure.td ?
    //   Math.round(Number(value2.emp_salary_structure.td)) : 0;
    if (values) {

      var result = Number(values.map(f => Math.round(Number(f.value))).reduce((acc, val) => Number(acc) + Number(val))) + Number(td);

      if (!isNaN(result))
        return result;
    }
  }

  getTotalDeductions(values: any[], value2: any, value3) {
    let tds = 0;
      console.log("i am value", value2, 'ssss', values);
      
      tds = value2 && value2.emp_salary_structure && value2.emp_salary_structure.tds ?
        Math.round(Number(value2.emp_salary_structure.tds)) : 0;
    
    if (values) {

      var result = Number(values.map(f => Math.round(Number(f.value))).reduce((acc, val) => acc + val)) + tds;

      return result;
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  downloadSlip() {
    this.common.generatePaySlip({
      values: this.values,
      school: this.schoolInfo,
      employeeDetails: this.employeeDetails
    }).subscribe((result: any) => {
      if (result) {
        const length = result.data.fileUrl.split('/').length;
        saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
      }
    });
  }

}
