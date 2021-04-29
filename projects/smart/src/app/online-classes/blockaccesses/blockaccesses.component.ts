
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, ErrorStateMatcher } from '@angular/material';
import { CommonAPIService, SisService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { SelectionModel } from '@angular/cdk/collections';
import { saveAs } from 'file-saver';
import { AssignmentModel } from "./blockaccess-review.model";

@Component({
  selector: 'app-blockaccesses',
  templateUrl: './blockaccesses.component.html',
  styleUrls: ['./blockaccesses.component.css']
})
export class BlockaccessesComponent implements OnInit {

  paramForm: FormGroup;
  enrollMentTypeArray: any[] = [
    { au_process_type: '2', au_process_name: 'Registration' },
    { au_process_type: '3', au_process_name: 'Provisional Admission' },
    { au_process_type: '4', au_process_name: 'Admission' },
    { au_process_type: '5', au_process_name: 'Alumini' }
  ];
  certificate_type_arr: any[] = [];
  classArray: any[] = [];
  sectionArray: any[] = [];
  studentsArray: any[] = [];
  isBoard = false;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  displayedColumns: any[] = ['select', 'no', 'name', 'class', 'action'];
  ELEMENT_DATA: AssignmentModel[] = [];
  dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<AssignmentModel>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('del') del;
  delMsg: any = 'Do you want to enable download for this student ?';
  tabledivflag = false;
  constructor(
    private commonApiService: CommonAPIService,
    private sisService: SisService,
    private SmartService: SmartService,
    private fbuild: FormBuilder
  ) { }
  getProcesstypeHeading(processType) {
    if (processType) {
      return this.enrollMentTypeArray.find(e => e.au_process_type === processType).au_process_name;
    }
  }
  ngOnInit() {
    this.buildForm();
    this.getClass();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  buildForm() {
    this.paramForm = this.fbuild.group({
      class_id: '',
      sec_id: '',
      enrollment_type: '4',
      certificate_type: 10
    });
  }
  getClass() {
    this.SmartService.getClassData({}).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.classArray = result.data;
      }
    });
  }
  getSectionsByClass() {
    this.sectionArray = [];
    this.sisService.getSectionsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
      if (result.status === 'ok') {
        const index = this.classArray.findIndex(f => Number(f.class_id) === Number(this.paramForm.value.class_id));
        this.sectionArray = result.data;
        if (index !== -1) {
          this.isBoard = this.classArray[index] && this.classArray[index].is_board === '0' ? false : true;

        }
      }
    });
  }
 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AssignmentModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllStudent() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
    if (this.paramForm.valid) {
      this.sisService.getMasterStudentDetail(this.paramForm.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentsArray = result.data;
          let counter = 1;
          let enrollment_fieldname = '';
          // if (this.paramForm.value.enrollment_type === '2') {
          //   enrollment_fieldname = 'em_regd_no';
          // } else if (this.paramForm.value.enrollment_type === '3') {
          //   enrollment_fieldname = 'em_provisional_admission_no';
          // } else if (this.paramForm.value.enrollment_type === '4') {
            enrollment_fieldname = 'em_admission_no';
          // } else if (this.paramForm.value.enrollment_type === '5') {
          //   enrollment_fieldname = 'em_alumini_no';
          // }
          for (const item of this.studentsArray) {
            
            this.ELEMENT_DATA.push({
              select: counter,
              no: item.au_login_id,
              name: item.au_full_name,
              class: item.sec_name ? item.class_name + '-' + item.sec_name : item.class_name,
              em_admission_no: item[enrollment_fieldname],
              action: item
            });
            counter += 1;
          }
          this.dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.tabledivflag = true;
        }
      })
    }
  }
  enableDis($event, value) {
    const param: any = {};
    param.certificate_type =10;
    param.class_id = this.paramForm.value.class_id,
      param.sec_id = this.paramForm.value.sec_id,
      param.login_id = value.au_login_id;
    param.status = $event.checked ? '1' : '0'
    // if ($event.checked) {
    //   this.delMsg = 'Do you want to enable download for this student ?'
    // } else {
    //   this.delMsg = 'Do you want to disable download for this student ?';
    // }
    if (param) {
      this.sisService.enableAcessCertificate(param).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.commonApiService.showSuccessErrorMessage(res.data, 'success');
          this.getAllStudent();
        }
      });
    }
  }
  confirmChange(data) {
    if (data) {
      this.sisService.enableAcessCertificate(data).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.commonApiService.showSuccessErrorMessage(res.data, 'success');
          this.getAllStudent();
        }
      });
    }
  }

}
