import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, ErrorStateMatcher } from '@angular/material';
import { CommonAPIService, SisService,SmartService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Element } from './certificate-printing.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { SelectionModel } from '@angular/cdk/collections';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-certificate-printing',
  templateUrl: './certificate-printing.component.html',
  styleUrls: ['./certificate-printing.component.css']
})
export class CertificatePrintingComponent implements OnInit {

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

  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  displayedColumns: any[] = ['select', 'no', 'name', 'class', 'action'];
  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  tabledivflag = false;
  constructor(
    private commonApiService: CommonAPIService,
    private sisService: SisService,
    private SmartService: SmartService,
    private fbuild: FormBuilder
    ) { }
  getProcesstypeHeading(processType) {
    if(processType) {
      return this.enrollMentTypeArray.find(e => e.au_process_type === processType).au_process_name;
    }    
  }
  ngOnInit() {
    this.buildForm();
    this.getClass();
    this.getSlcTcTemplateSetting();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  buildForm() {
    this.paramForm = this.fbuild.group({
      class_id: '',
      sec_id: '',
      enrollment_type: '',
      certificate_type: ''
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
        this.sectionArray = result.data;
      }
    });
  }
  getSlcTcTemplateSetting() {
    this.sisService.getSlcTcTemplateSetting({usts_certificate_type: '1'}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.certificate_type_arr = result.data;
      }
    })
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
  checkboxLabel(row?: Element): string {
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
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if (this.paramForm.valid) {
      this.sisService.getMasterStudentDetail(this.paramForm.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentsArray = result.data;
          let counter = 1;
          let enrollment_fieldname = '';
          if(this.paramForm.value.enrollment_type === '2'){
            enrollment_fieldname = 'em_regd_no';
          } else if(this.paramForm.value.enrollment_type === '3'){
            enrollment_fieldname = 'em_provisional_admission_no';
          } else if(this.paramForm.value.enrollment_type === '4'){
            enrollment_fieldname = 'em_admission_no';
          }else if(this.paramForm.value.enrollment_type === '5'){
            enrollment_fieldname = 'em_alumini_no';
          }
          for (const item of this.studentsArray) {
            this.ELEMENT_DATA.push({
              select: counter++,
              no: item.au_login_id,
              name: item.au_full_name,
              class: item.sec_name ? item.class_name+'-'+item.sec_name : item.class_name,
              em_admission_no: item[enrollment_fieldname],
              action: item
            });
          }
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.tabledivflag = true;
        }
      })
    }
  }
  printcertificate(item=null) {
    const printData: any[] = [];
    if(item) {
      printData.push(item.au_login_id);
    } else {
      this.selection.selected.forEach(e => {
        printData.push(e.action.au_login_id);
      });
    }
    console.log(printData);
    const param: any = {};
    param.certificate_type = this.paramForm.value.certificate_type;
    param.class_id = this.paramForm.value.class_id,
    param.sec_id = this.paramForm.value.sec_id,
    param.printData = printData;
    this.sisService.printAllCertificate({param}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.commonApiService.showSuccessErrorMessage('Download Successfully', 'success');
        const length = result.data.split('/').length;
        saveAs(result.data, result.data.split('/')[length - 1]);
      }
    })
  }
}
