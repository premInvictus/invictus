import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './gradecard-printing.model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { ViewGradecardDialogComponent } from '../view-gradecard-dialog/view-gradecard-dialog.component';
import { TitleCasePipe } from '@angular/common';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-gradecard-printing',
  templateUrl: './gradecard-printing.component.html',
  styleUrls: ['./gradecard-printing.component.css']
})
export class GradecardPrintingComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal;
  @ViewChild('deleteModalUnlock') deleteModalUnlock;
  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = []; 
  examArray: any[] = [];
  gradeCardMarkArray: any[] = [];
  studentArray: any[] = [];
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select', 'au_admission_no', 'au_full_name', 'r_rollno', 'class_name', 'status', 'action'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  classterm: any;
  subexamArray: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { 
    this.buildForm();
    this.getClass();
  }
  openDialog(item): void {
    item.param = this.paramform.value;
    item.ect_exam_type = this.classterm.ect_exam_type;
    item.ect_grade_avg_highest = this.classterm.ect_grade_avg_highest;
    item.last_term_id = this.getTermid();
    const dialogRef = this.dialog.open(ViewGradecardDialogComponent, {
      width: '80%',
      height: '80%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }  
  openLockModal(data = null,multiple) {
    data.text = 'Lock'
    data.multiple = multiple;
		this.deleteModal.openModal(data);
  }
  openUnlockModal(data = null, multiple) {
    data.text = 'Unlock';
    data.multiple = multiple;
		this.deleteModalUnlock.openModal(data);
  }
  printGradecard(item=null) {
    const printData: any[] = [];
    if(item) {
      printData.push(item.au_login_id);
    } else {
      this.selection.selected.forEach(e => {
        printData.push(e.au_login_id);
      });
    }
    const param: any = {};
    param.login_id = printData;
    param.class_id = this.paramform.value.eme_class_id;
    param.sec_id = this.paramform.value.eme_sec_id;
    param.term_id = this.paramform.value.eme_term_id;
    param.exam_id = this.paramform.value.eme_exam_id;
    param.se_id = this.paramform.value.eme_subexam_id;
    this.examService.printGradecard(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        console.log(result.data);
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
      }
    })

  }
	lockGradeCard(item) {
    console.log(item);
		if (item.multiple === '1') {
      this.lockGradeCardMulti();
		} else {
			this.lockGradeCardOne(item);
		}
  }
  lockGradeCardOne(item) {
    console.log(item);
    const lockdata: any = [];
    const temp: any = {};
    temp.egl_au_login_id = item.au_login_id;
    temp.egl_classterm_id = this.paramform.value.eme_term_id;
    temp.egl_lock_status = '1';
    lockdata.push(temp);
    this.lockUnlockGradeCard(lockdata);
  }
  lockGradeCardMulti() {
    console.log(this.selection.selected);
    const lockdata: any = [];
    this.selection.selected.forEach(element => {
      const temp: any = {};
      temp.egl_au_login_id = element.au_login_id;
      temp.egl_classterm_id = this.paramform.value.eme_term_id;
      temp.egl_lock_status = '1';
      lockdata.push(temp);
    });
    this.lockUnlockGradeCard(lockdata);

  }
  unlockGradeCard(item) {
    console.log(item);
    if (item.multiple === '1') {
      this.unlockGradeCardMulti();
		} else {
			this.unlockGradeCardOne(item);
		}
  }
  unlockGradeCardOne(item) {
    console.log(item);
    const lockdata: any = [];
    const temp: any = {};
    temp.egl_au_login_id = item.au_login_id;
    temp.egl_classterm_id = this.paramform.value.eme_term_id;
    temp.egl_lock_status = '0';
    lockdata.push(temp);
    this.lockUnlockGradeCard(lockdata);
  }
  unlockGradeCardMulti() {
    console.log(this.selection.selected);
    const lockdata: any = [];
    this.selection.selected.forEach(element => {
      const temp: any = {};
      temp.egl_au_login_id = element.au_login_id;
      temp.egl_classterm_id = this.paramform.value.eme_term_id;
      temp.egl_lock_status = '0';
      lockdata.push(temp);
    });
    this.lockUnlockGradeCard(lockdata);
  }
  lockUnlockGradeCard(param) {
    this.examService.lockUnlockGradeCard(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        this.displayData();
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    })
  }
  /** Whether the number of selected elements matches the total number of rows. */ 
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.au_login_id}`;
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_term_id: '',
      eme_exam_id:'',
      eme_subexam_id:''
    })
  }

  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getExamDetails() {
    this.paramform.patchValue({
      eme_exam_id: '',
      eme_subexam_id: '',
    });
    this.examArray = [];
    this.examService.getExamDetails({exam_class: this.paramform.value.eme_class_id,term_id: this.getTermid()}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_term_id: '',
    });
    this.tableDivFlag = false;
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.paramform.patchValue({
      eme_sub_id: ''
    });
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const temp = result.data;
        if(temp.length > 0) {
          temp.forEach(element => {
            if(element.sub_parent_id && element.sub_parent_id === '0') {
              const childSub: any[] = [];
              for(const item of temp) {
                if(element.sub_id === item.sub_parent_id) {
                  childSub.push(item);
                }
              }
              element.childSub = childSub;
              this.subjectArray.push(element);
            }
          });
        }
        //console.log(this.subjectArray);
        //this.subjectArray = result.data; 
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({class_id: this.paramform.value.eme_class_id}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        this.getSubjectsByClass();
        //console.log(result.data);
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({id: element, name: result.data.ect_term_alias + ' ' +element});
        });
        this.termsArray.push({id:'comulative', name: 'Cumulative'});
        this.examService.getExamPerCumulativeExam({class_id: this.paramform.value.eme_class_id}).subscribe((result : any) => {
          if(result && result.status === 'ok') {
            this.termsArray.push({id:'percumulative', name: 'Percentage Cumulative'});
          } else {

          }
        })
        console.log('termsArray',this.termsArray);
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  sectionChange() {
    this.paramform.patchValue({
      eme_term_id: '',
    });
    this.tableDivFlag = false;
  }
  getClearedGradeCard(au_login_id) {
    let gstatus  = '1';
    for(let i=0; i<this.examArray.length;i++){
      for(let j=0;j<this.examArray[i].exam_sub_exam_max_marks.length; j++) {
        for(let k=0;k<this.subjectArray.length;k++) {
          if(this.gradeCardMarkArray) {
            if(this.examArray[i].exam_category === this.subjectArray[k].sub_type) {
              if(this.subjectArray[k].childSub.length === 0) {
                const gindex = this.gradeCardMarkArray.findIndex(e =>  e.emem_login_id === au_login_id &&
                  e.eme_sub_id === this.subjectArray[k].sub_id &&
                  e.eme_subexam_id === this.examArray[i].exam_sub_exam_max_marks[j].se_id &&
                  e.eme_exam_id === this.examArray[i].exam_id);
                if(gindex === -1) {
                  gstatus = '0';
                  break;
                }
              } else {
                for(let l=0; l< this.subjectArray[k].childSub.length; l++) {
                  const gindex = this.gradeCardMarkArray.findIndex(e =>  e.emem_login_id === au_login_id &&
                    e.eme_sub_id === this.subjectArray[k].childSub[l].sub_id &&
                    e.eme_subexam_id === this.examArray[i].exam_sub_exam_max_marks[j].se_id &&
                    e.eme_exam_id === this.examArray[i].exam_id);
                  if(gindex === -1) {
                    gstatus = '0';
                    break;
                  }
                }
                if(gstatus === '0') {
                  break;
                }
              }
            }
          } else {
            gstatus = '0';
            break;
          }
        }
        if(gstatus === '0') {
          break;
        }
      }
      if(gstatus === '0') {
        break;
      }
    }
    
    /*const sindex = this.studentArray.findIndex(e => e.au_login_id === au_login_id);
    if(sindex !== -1) {
      this.studentArray[sindex].status = gstatus;
    }*/
    return gstatus;
  }
  displayData() {
    this.tableDivFlag = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.gradeCardMarkArray = [];
    this.studentArray = [];
    this.selection.clear();    
    if (this.paramform.value.eme_class_id && this.paramform.value.eme_sec_id && this.paramform.value.eme_term_id) {
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.eme_class_id, au_sec_id: this.paramform.value.eme_sec_id}).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
          const param: any = {};
          param.class_id = this.paramform.value.eme_class_id;
          param.sec_id = this.paramform.value.eme_sec_id;
          param.eme_term_id = this.getTermid();
          param.eme_review_status = '4';
          this.examService.getGradeCardMark(param).subscribe((result: any) => {
            if(result && result.status === 'ok') {
              this.gradeCardMarkArray = result.data;
            }
            if(this.studentArray.length > 0) {
              this.studentArray.forEach(element => {
                const temp: any = {};
                temp.au_admission_no = element.au_admission_no;
                temp.au_full_name = element.au_full_name;
                temp.au_login_id = element.au_login_id;
                temp.r_rollno = element.r_rollno;
                temp.class_name = element.sec_name ? element.class_name + '-' + element.sec_name : element.class_name;
                temp.status = this.getClearedGradeCard(temp.au_login_id);
                temp.action = element;
                this.ELEMENT_DATA.push(temp);
              });
              this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
              this.tableDivFlag = true;
            }
          }) ;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  resetTableDiv() {
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_subexam_id: ''
    });
  }
  getTermid() {
    if(this.paramform.value.eme_term_id == 'comulative') {
      const termIndex = this.termsArray.findIndex(e => e.id === this.paramform.value.eme_term_id);
      return this.termsArray[termIndex-1].id;
    } else {
      const termIndex = this.termsArray.findIndex(e => e.id === this.paramform.value.eme_term_id);
      return this.termsArray[termIndex].id;
    }
  }
  getSubExam() {
    this.subexamArray = [];
    if (this.paramform.value.eme_exam_id) {
      this.examService.getExamDetails({exam_class: this.paramform.value.eme_class_id,term_id: this.getTermid(), exam_id: this.paramform.value.eme_exam_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          if (result.data.length > 0 && result.data[0].exam_sub_exam_max_marks.length > 0) {
            this.subexamArray = result.data[0].exam_sub_exam_max_marks;
            console.log(this.subexamArray);
            const subexam_id_arr: any[] = [];
            for (let item of this.subexamArray) {
              subexam_id_arr.push(item.se_id);
            }
            const param: any = {};
            param.ssm_class_id = this.paramform.value.eme_class_id;
            param.ssm_exam_id = this.paramform.value.eme_exam_id;
            param.ssm_se_id = subexam_id_arr;
            param.ssm_sub_id = this.paramform.value.eme_sub_id;
            this.examService.getSubjectSubexamMapping(param).subscribe((result: any) => {
              if (result && result.status === 'ok') {
                for (let item of result.data) {
                  for (let item1 of this.subexamArray) {
                    if (item.ssm_se_id === item1.se_id) {
                      item1.exam_max_marks = item.ssm_sub_mark;
                    }
                  }
                }
              }
            })
          }
        }
      });
    }
  }

}
