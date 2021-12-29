import { Component, OnInit } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-salary-advance',
  templateUrl: './security-month-wise.component.html',
  styleUrls: ['./security-month-wise.component.scss']
})
export class SecurityDetailComponent implements OnInit {
  employeeArray: any[] = [];
  tblEmployeeArray: any[] = [];
  schoolInfo: any[] = [];
  sessionArray: any[] = [];
  session_id: any;
  year: any;
  currentYear: any;
  nextyear: any;
  sessionName: any;
  constructor(
    public commonAPIService: CommonAPIService,
    private erpCommonService: ErpCommonService
  ) {
    this.session_id = JSON.parse(localStorage.getItem('session'));
    console.log('i am ses', this.session_id.ses_id);
    
  }

  ngOnInit() {
    this.getSchool();
    this.getSession();
    this.getAllEpmployeeList();
  }
  getAllEpmployeeList() {
    this.commonAPIService.getAllEmployee({emp_status: "live" }).subscribe((result: any) => {
      if (result && result.length > 0) {
        console.log("i am result", result);
        
        this.employeeArray = result;
        for (let item of result) {
          console.log("i am here", );
          
          let total_advance_deposite = 0;
          if (item.emp_salary_detail.emp_salary_structure.security_details && Number(item.emp_salary_detail.emp_salary_structure.security_details[0].session_id) <= Number(this.session_id.ses_id) && item.emp_salary_detail.emp_salary_structure.security_details[0].security) {
           console.log('sss',Number(item.emp_salary_detail.emp_salary_structure.security_details[0].session_id), "check the val", Number(item.emp_salary_detail.emp_salary_structure.security_details[0].session_id) >= Number(this.session_id.ses_id));
           
            if (item.emp_salary_detail.emp_salary_structure.security_month_wise) {
              for (const dety of item.emp_salary_detail.emp_salary_structure.security_month_wise) {
                total_advance_deposite = total_advance_deposite + Number(dety.deposite_amount);
              }
            }
            let obj:any = {
              emp_id:item.emp_id,
              emp_name: item.emp_name,
              advance: item.emp_salary_detail.emp_salary_structure.security_details[0].security,
              remaining_advance: Number(item.emp_salary_detail.emp_salary_structure.security_details[0].security) - Number(total_advance_deposite)
            } 
            console.log('i am obj', obj);
            
            this.tblEmployeeArray.push(obj);
          }
        }
        console.log(this.tblEmployeeArray, 'tblEmployeeArray');


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
              this.nextyear = this.year[1];
            }

          }
        });
  }

  getSalaryAdvance(emp_id, month, year) {
    const findex = this.employeeArray.findIndex(f => Number(f.emp_id) === Number(emp_id));
    if (findex !== -1) {
      if (this.employeeArray[findex].emp_salary_detail.emp_salary_structure.security_month_wise) {
        const rindex = this.employeeArray[findex].emp_salary_detail.emp_salary_structure.security_month_wise.findIndex(r => Number(r.month_id) === Number(month) && Number(r.currentYear) === Number(year));
        if (rindex !== -1) {
          return this.employeeArray[findex].emp_salary_detail.emp_salary_structure.security_month_wise[rindex].deposite_amount;
        } else {
          return 0;
        }
      } else {
        return 0;
      }

    }

  }
}
