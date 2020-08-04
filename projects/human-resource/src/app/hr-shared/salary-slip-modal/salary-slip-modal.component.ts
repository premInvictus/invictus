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
  constructor(private dialogRef: MatDialogRef<SalarySlipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private common: CommonAPIService,
    private sis: SisService,
    private erp: ErpCommonService) { }

  ngOnInit() {
    this.values = this.data.values;
    console.log(this.values);
    this.getSchoolInfo();
  }
  getEmployeeDetails(emp_id) {
    this.common.getEmployeeSalaryDetail({ emp_ids: [emp_id],month_id: this.values.action.id.toString() }).subscribe((res: any) => {
      if (res) {
        this.employeeDetails = res[0];
        console.log(this.employeeDetails);
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
    if (values)
      return (values.map(f => Math.round(Number(f.value))).reduce((acc, val) => acc + val)) + td;
  }
  getTotalDeductions(values: any[], value2: any, value3) {
    let tds = 0;
    if (value3.configs && value3.configs.tds) {
      tds = value2.emp_salary_structure && value2.emp_salary_structure.tds ?
        Math.round(Number(value2.emp_salary_structure.tds)) : 0;
    }
    if(values)
      return (values.map(f => Math.round(Number(f.value))).reduce((acc, val) => acc + val)) + tds;
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
