import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SisService, AxiomService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { FeeService } from 'projects/fee/src/app/_services';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.css']
})
export class AdvancedSearchModalComponent implements OnInit {
  dialogRef: MatDialogRef<AdvancedSearchModalComponent>;
  @ViewChild('searchModal') searchModal;
  @Output() searchOk = new EventEmitter;
  formGroupArray: any[] = [];
  placeholder: any[] = [];
  fieldType: any[] = [];
  genderArray: any[] = [];
  wingArray: any[] = [];
  monthArray:any[] = [];
  departmentArray:any[] = [];
  designationArray:any[] = [];
  categoryOneArray:any[] = [];
  categoryTwoArray:any[] = [];
  categoryThreeArray:any[] = [];
  scaleArray:any[] = [];
  bankArray:any[] = [];
  currentUser: any = {};
  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private common: ErpCommonService,
    private axiomService: AxiomService,
    private feeService: FeeService,
    private sisService: SisService,
    private commonAPIService: CommonAPIService) { }

  statusArray: any[] = [
    {
      status_id: 'live',
      status_name: 'Live',
    },
    {
      status_id: 'left',
      status_name: 'Left',
    },
    {
      status_id: 'all',
      status_name: 'All',
    }
  ];
  categoryArray: any[] = [
    {
      cat_id: 'teaching',
      cat_name: 'Teaching',
    },
    {
      cat_id: 'non-teaching',
      cat_name: 'Non Teaching (Administrative)',
    },
    {
      cat_id: 'class-iv-staff',
      cat_name: 'Class IV Staff',
    }
  ];
  paymentModeArray:any[] = [
    {
      pm_id: '1',
      pm_name: 'Bank Transfer',
    },
    {
      pm_id: '2',
      pm_name: 'Cash Payment',
    },
    {
      pm_id: '3',
      pm_name: 'Cheque Payment',
    },
  ]
  
  filterArray: any[] = [
  ];
  generalFilterForm: FormGroup;
  ngOnInit() {
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
      this.filterArray = [
        {
          id: 'emp_id',
          name: 'Emp. Id',
          type: 'text',
          placeholder: 'Search employee by Emp. Id'
        },
        {
          id: 'emp_name',
          name: 'Employee Name',
          type: 'text',
          placeholder: 'Search employee by Employee Name'
        },
        {
          id: 'join_date',
          name: 'Join Date',
          placeholder: 'Search employee by Joined Date',
          type: 'text',
        },
        {
          id: 'left_date',
          name: 'Left Date',
          placeholder: 'Search employee by  Left Date',
          type: 'text',
        }
      ];
    
      this.monthArray = [
        {month_id : '1' , month_name : 'January'},
        {month_id : '2' , month_name : 'February'},
        {month_id : '3' , month_name : 'March'},
        {month_id : '4' , month_name : 'April'},
        {month_id : '5' , month_name : 'May'},
        {month_id : '6' , month_name : 'June'},
        {month_id : '7' , month_name : 'July'},
        {month_id : '8' , month_name : 'August'},
        {month_id : '9' , month_name : 'September'},
        {month_id : '10' , month_name : 'October'},
        {month_id : '11' , month_name : 'November'},
        {month_id : '12' , month_name : 'December'},
      ]
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.formGroupArray = [];
    this.getWings();
    this.getGender();
    this.getDesignation();
    this.getDepartment();
    this.getCategoryOne();
    this.getCategoryTwo();
    this.getCategoryThree();
    this.getPayScale();
    this.getBank();
    this.buildForm();
  }
  getWings() {
    this.commonAPIService.getAllWing({}).subscribe((res: any) => {
      if (res) {
        this.wingArray = [];
        this.wingArray = res;
      }
    });
  }
  getGender() {
    this.sisService.getGender().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.genderArray = [];
        this.genderArray = res.data;
      }
    });
  }
  getDesignation() {
    this.commonAPIService.getAllDesignation({}).subscribe((res: any) => {
      if (res) {
        this.designationArray = [];
        this.designationArray = res;
      }
    });
  }
  getDepartment() {
    this.sisService.getDepartment({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.departmentArray = [];
        this.departmentArray = res.data;
      }
    });
  }
  getCategoryOne() {
    this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
      if (res) {
        this.categoryOneArray = [];
        this.categoryOneArray = res;
      }
    });
  }
  getCategoryTwo() {
    this.commonAPIService.getCategoryTwo({}).subscribe((res: any) => {
      if (res) {
        this.categoryTwoArray = [];
        this.categoryTwoArray = res;
      }
    });
  }
  getCategoryThree() {
    this.commonAPIService.getCategoryThree({}).subscribe((res: any) => {
      if (res) {
        this.categoryThreeArray = [];
        this.categoryThreeArray = res;
      }
    });
  }

  getPayScale() {
    this.commonAPIService.getSalaryStructure({}).subscribe((res: any) => {
      if (res) {
        this.scaleArray = [];
        this.scaleArray = res;
      }
    });
  }

  getBank() {
    this.feeService.getBanksAll({}).subscribe((res: any) => {
      if (res) {
        this.bankArray = [];
        this.bankArray = res.data;
      }
    });
  }

  setPlaceHolder(val, index) {
    const findex = this.filterArray.findIndex(f => f.id === val);
    if (findex !== -1) {
      this.placeholder[index] = this.filterArray[findex].placeholder;
      this.fieldType[index] = this.filterArray[findex].type;
      this.formGroupArray[index].formGroup.patchValue({
        'type': this.filterArray[findex].type
      });
    }
  }
  addNewFilter(index) {
    this.formGroupArray.push({
      id: index + 1,
      formGroup: this.fbuild.group({
        'filter_type': '',
        'filter_value': '',
        'type': ''
      })
    });
  }
  deleteForm(i) {
    const findex = this.formGroupArray.findIndex(f => Number(f.id) === i);
    if (findex !== -1) {
      this.formGroupArray.splice(findex, 1);
    }
  }
  buildForm() {
    this.formGroupArray = [
      {
        id: '1',
        formGroup: this.fbuild.group({
          'filter_type': '',
          'filter_value': '',
          'type': ''
        })
      }
    ];
    const obj: any = {};
    obj['emp_status'] = [];
    obj['emp_wing_detail.wing_id'] = [];
    obj['gen_id'] = [];
    obj['emp_salary_detail.emp_organisation_relation_detail.doj'] = [];
    obj['emp_designation_detail.des_id'] = [];
    obj['emp_department_detail.dpt_id'] = [];
    obj['emp_salary_detail.emp_job_detail.category_1.cat_one_id'] = [];
    obj['emp_salary_detail.emp_job_detail.category_2.cat_two_id'] = [];
    obj['emp_salary_detail.emp_job_detail.category_3.cat_three_id'] = [];
    obj['emp_salary_structure.emp_pay_mode.pm_id'] = [];
    obj['emp_salary_structure.emp_pay_scale.ss_id'] = [];
    obj['emp_bank_detail.bnk_detail.bnk_id'] = [];
    obj['user'] = JSON.parse(localStorage.getItem('currentUser'));
    obj['contract_from_date'] = '';
    obj['contract_to_date'] = '';
    this.generalFilterForm = this.fbuild.group(obj);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    const dataArr: any[] = [];
    for (const item of this.formGroupArray) {
      dataArr.push(item.formGroup.value);
    }
    if (this.generalFilterForm.value.from_date || this.generalFilterForm.value.to_date) {
      this.generalFilterForm.patchValue({
        from_date: new DatePipe('en-in').transform(this.generalFilterForm.value.from_date, 'yyyy-MM-dd'),
        to_date: new DatePipe('en-in').transform(this.generalFilterForm.value.to_date, 'yyyy-MM-dd')
      });
    }
    this.searchOk.emit({
      filters: dataArr,
      generalFilters: this.generalFilterForm.value
    });
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }
  getFromDate(value) {
    this.generalFilterForm.patchValue({
      from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.generalFilterForm.patchValue({
      to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }

}
