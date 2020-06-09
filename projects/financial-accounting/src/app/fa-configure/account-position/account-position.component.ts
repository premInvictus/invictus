import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService,FaService } from '../../_services/index';

@Component({
  selector: 'app-account-position',
  templateUrl: './account-position.component.html',
  styleUrls: ['./account-position.component.css']
})
export class AccountPositionComponent implements OnInit {

  accountTypeArr:any[] = [];
  tableDivFlag = true;
  ELEMENT_DATA: any[] = [];
  displayedColumns: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private fb: FormBuilder,
		private commonAPIService: CommonAPIService,
		private faService:FaService
  ) { }

  ngOnInit() {
    this.getAccountMaster();
  }
  getAccountMaster() {
    this.accountTypeArr = [];
    this.ELEMENT_DATA = [];
    this.faService.getAccountMaster({}).subscribe((data:any)=>{
      if(data) {
        for(let i=0; i<data.length;i++) {
          if(data[i]['acc_state']==='acc_type') {
            this.accountTypeArr.push(data[i]);
          }
        }
        console.log(this.accountTypeArr);
        if(this.accountTypeArr.length > 0){
          this.accountTypeArr.forEach(element => {
            const tempjson: any = {};
            tempjson.acc_id = element.acc_id;
            tempjson.acc_name = element.acc_name;
            tempjson.display_section = element.display_section;
            this.ELEMENT_DATA.push(tempjson);
          });
          
        }
        this.tableDivFlag = true;
        console.log(this.ELEMENT_DATA);
      }
    });
  }
  toggleStatus(event,index,key) {
    console.log(this.ELEMENT_DATA[index]);
    console.log(event.checked);
    if(key == 'trialBalance' || key == 'income' || key == 'expenditure') {
      this.ELEMENT_DATA[index].display_section[key] = event.checked;
    } else if(key == 'liabilities' || key == 'assets') {
      this.ELEMENT_DATA[index].display_section.balanceSheet[key] = event.checked;
    }
    console.log(this.ELEMENT_DATA[index]);
  }
  submit(){
    this.faService.updateAccountPosition(this.ELEMENT_DATA).subscribe((result: any) => {
      if(result) {
        this.getAccountMaster();
        console.log(result);
        this.commonAPIService.showSuccessErrorMessage('Account Updated Successfully', 'success');
      }
    })
  }

}
