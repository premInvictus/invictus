import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-salary-slip-modal',
  templateUrl: './salary-slip-modal.component.html',
  styleUrls: ['./salary-slip-modal.component.scss']
})
export class SalarySlipModalComponent implements OnInit {
  employeeDetails: any = {};
  header: string = '';
  schoolInfo: any = '';
  constructor(private dialogRef: MatDialogRef<SalarySlipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private common: CommonAPIService,
    private sis: SisService,
    private erp: ErpCommonService) { }

  ngOnInit() {
    console.log(this.data);
    this.getEmployeeDetails(this.data.emp_id);
    this.getSchoolInfo();
  }
  getEmployeeDetails(emp_id) {
    this.common.getEmployeeDetail({ emp_id: emp_id }).subscribe((res: any) => {
      if (res) {
        this.employeeDetails = res;
        console.log(this.employeeDetails);
      }
    });
  }
  getGlobalSettings() {
    this.erp.getGlobalSetting({ gs_alias: 'employee_salary_slip' }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        if (res.data[0] && res.data[0].gs_value) {
          const head: string = ((JSON.parse(res.data[0].gs_value))['headerFormat']);
          const schoolLogo: any = '<img src="' + this.schoolInfo.school_logo + '" width = 100 height = 100>';
          this.header = head.replace(/{{si_school_logo}}/g, schoolLogo);
          
          this.header = this.header.replace(/{{si_school_name}}/g, this.schoolInfo.school_name);
          this.header = this.header.replace(/{{si_school_address}}/g, this.schoolInfo.school_address);
          this.header = this.header.replace(/{{si_school_pin}},/g, '');
          this.header = this.header.replace(/{{si_school_phone}}/g, this.schoolInfo.school_phone);
          console.log(this.header);
        }

      }
    });
  }
  getSchoolInfo() {
    this.sis.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        this.getGlobalSettings();
      }
    });
  }

}
