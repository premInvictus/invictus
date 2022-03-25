import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService } from '../../../_services'

@Component({
  selector: 'app-user-mapping',
  templateUrl: './user-mapping.component.html',
  styleUrls: ['./user-mapping.component.css']
})
export class UserMappingComponent implements OnInit {
  disabled = true;
  userMappingForm: FormGroup
  employeeDataArray: any
  filteredEmployeeDataArray: any
  adminDataArray: any;
  teacherDataArray: any;
  finalUserDataArray: any;
  filteredUserDataArray: any;
  userData: any = [];
  displayTableData: any = [];
  displayedColumns: string[] = ['old_login_id', 'new_login_id', 'name', 'role', 'action'];
  oldLoginId: any;
  newLoginId: any;

  dataSource = new MatTableDataSource(this.displayTableData)

  constructor(
    private fbuild: FormBuilder,
    private common: CommonAPIService
  ) { }

  ngOnInit() {
    this.buildForm()
    // Employee Data
    this.common.getFilterData({}).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        this.employeeDataArray = result.data
        this.filteredEmployeeDataArray = result.data
      }
    })
    // User Data by role id
    this.common.getUser({ "au_role_id": "2" }).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        this.adminDataArray = result.data
        this.common.getUser({ "au_role_id": "3" }).subscribe((res: any) => {
          if (res && res.status == 'ok') {
            this.teacherDataArray = res.data
            this.finalUserDataArray = this.adminDataArray.concat(this.teacherDataArray)
            this.filteredUserDataArray = this.finalUserDataArray
          }
        })
      }
    })
  }

  // Enable / Disable the Add Button
  changeButtonStatus() {
    this.userMappingForm.get('new_emp_id').valueChanges.subscribe(val => {
      if (val !== '') {
        this.disabled = false
      } else this.disabled = true
    });
  }

  // Adding the data to the table
  addToTable() {
    const oldLoginId = this.userMappingForm.get('old_emp_id').value
    const newLoginId = this.userMappingForm.get('new_emp_id').value

    let oldUser = this.finalUserDataArray.find((e) => e.au_login_id == oldLoginId);
    let newUser = this.employeeDataArray.find((e) => e.emp_login_id == newLoginId);

    let duplicateCheck = this.displayTableData.find((e) => e.old_login_id == oldLoginId || e.new_login_id == newLoginId)

    if (!duplicateCheck) {
      this.userData.push(
        {
          "old": oldUser,
          "new": newUser
        }
      )

      this.displayTableData.push({
        'old_login_id': oldUser.au_login_id,
        'new_login_id': newUser.emp_login_id,
        'name': oldUser.au_full_name,
        'role': oldUser.au_role_id
      })
    } else {
      this.disabled = true
    }

    this.dataSource = new MatTableDataSource(this.displayTableData)

    // Resetting the input value
    this.userMappingForm.patchValue({
      old_emp_id: '',
      new_emp_id: ''
    })
  }

  buildForm() {
    this.userMappingForm = this.fbuild.group({
      old_emp_id: '',
      new_emp_id: ''
    })
  }

  // Search Query : Login Id & Name
  oldFilterItem(event) {
    const val = event.target.value

    this.filteredUserDataArray = this.finalUserDataArray.filter((e) => {
      const login_id = e['au_login_id']
      const full_name = e['au_full_name'].toLowerCase()

      if (login_id !== undefined && full_name !== undefined) {
        if (login_id.includes(val) || full_name.includes(val)) return e
      }
    })
  }

  // Search Query : Emp Id & Login Id & Emp name
  newFilterItem(event) {
    const val = event.target.value

    this.filteredEmployeeDataArray = this.employeeDataArray.filter((e) => {
      let emp_id = e['emp_id']
      emp_id = emp_id.toString()
      const emp_name = e['emp_name'].toLowerCase()
      const emp_login_id = e['emp_login_id']

      if (emp_id !== undefined && emp_name !== undefined && emp_login_id !== undefined) {
        if (emp_id.includes(val) || emp_name.includes(val) || emp_id.includes(val)) return e
      }
    })
  }

  removeItem(idx) {
    const poppedUserData = this.userData.pop(idx)
    const popTableData = this.displayTableData.find(e => e.old_login_id == poppedUserData['old']['au_login_id'])

    this.displayTableData.pop(popTableData)

    this.dataSource = new MatTableDataSource(this.displayTableData)
  }

  submitMappedData() {
    this.displayTableData = []

    let payload = []
    this.userData.map(ele => {
      payload.push({
        'tgem_global_config_id': ele['old']['au_login_id'],
        'tgem_employee_config_id': ele['new']['emp_id'],
        'tgem_role_type': ele['old']['au_role_id']
      })
    })

    this.common.addEmployeeMapping(this.userData)
  }
}
