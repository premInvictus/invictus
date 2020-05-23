import { Component, OnInit } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-salary-advance',
  templateUrl: './salary-advance.component.html',
  styleUrls: ['./salary-advance.component.scss']
})
export class SalaryAdvanceComponent implements OnInit {
  employeeArray: any[] = [];
  schoolInfo: any[] = [];
  sessionArray: any[] = [];
  session_id: any;
  year: any;
  currentYear: any;
  sessionName: any;
  constructor(
    public commonAPIService: CommonAPIService,
    private erpCommonService: ErpCommonService
  ) {
    this.session_id = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getSchool();
    this.getSession();
    this.getAllEpmployeeList();
  }
  getAllEpmployeeList() {
    this.commonAPIService.getAllEmployee({ 'emp_status': 'live' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.employeeArray = result;
        console.log(this.employeeArray);


      }
    });
  }
  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
            console.log(this.schoolInfo);
          }
        });
  }

  getSession() {
    this.erpCommonService.getSession()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            for (const citem of result.data) {
              this.sessionArray[citem.ses_id] = citem.ses_name;
            }
            if (this.session_id) {
              this.sessionName = this.sessionArray[this.session_id.ses_id];
              this.year = this.sessionName.split('-');
              this.currentYear = this.year[0];
            }

          }
        });
  }
  getSalaryAdvance(emp_id, month, year) {
    const findex = this.employeeArray.findIndex(f => Number(f.emp_id) === Number(emp_id));
    if (findex !== -1) {
      if (this.employeeArray[findex].emp_salary_detail.emp_salary_structure.advance_month_wise) {
        const rindex = this.employeeArray[findex].emp_salary_detail.emp_salary_structure.advance_month_wise.findIndex(r => Number(r.month_id) === Number(month) && Number(r.currentYear) === Number(year));
        if (rindex !== -1) {
          return this.employeeArray[findex].emp_salary_detail.emp_salary_structure.advance_month_wise[rindex].deposite_amount;
        } else {
          return 0;
        }
      } else {
        return 0;
      }

    }

  }
}
