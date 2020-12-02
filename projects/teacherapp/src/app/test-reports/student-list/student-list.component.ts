import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './rollno.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe,TitleCasePipe } from '@angular/common';

import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { ErpCommonService } from 'src/app/_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  defaultFlag = false;
  finalDivFlag = true;
  displayedColumns_heading: any = {sr_no:'Sr. No.',au_admission_no:'Adm. No.',r_rollno:'Roll No.', au_full_name:'Name', class_sec:'Class-Section', father_name:'Father\'s Name', mother_name:'Mother\'s Name',active_parent_no:'Active Parent Contact No.',upd_dob:'DOB'};
  displayedColumns: string[] = ['r_rollno', 'au_full_name', 'au_admission_no', 'class_sec', 'father_name', 'mother_name','active_parent_no','upd_dob'];
  firstForm: FormGroup;
  rollNoForm: FormGroup;
  disableApiCall = false;
  classArray: any[];
  sectionArray: any[];
  studentArray: any[];
  currentUser: any;
  session: any;
  ELEMENT_DATA: Element[] = [];
  rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  finalArray: any[] = [];
  class_id: any;
  section_id: any;
  boardArray: any[] = [
    { id: 0, name: 'Board' },
    { id: 1, name: 'Non-Board' },
  ];
  @ViewChild(MatSort) sort: MatSort;

  reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
  schoolInfo: any;
  sessionName: any;
  sessionArray: any[] = [];
  length:any;
  alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public examService: ExamService,
    public erpCommonService: ErpCommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getSchool();
    this.getSession();
    this.getClass();
    this.ctForClass();
  }

  ngAfterViewInit() {
    this.rollNoDataSource.sort = this.sort;
  }

  buildForm() {
    this.firstForm = this.fbuild.group({
      syl_class_id: '',
      syl_section_id: ''
    });
  }
  // get session year of the selected session
	getSession() {
    this.erpCommonService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        this.sessionName = this.getSessionName(this.session.ses_id);
      }
    });
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }
  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  getClassByBoard() {
    this.defaultFlag = false;
    this.finalDivFlag = true;
  }
  ctForClass() {
    this.examService.ctForClass({ uc_login_id: this.currentUser.login_id })
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.class_id = result.data[0].uc_class_id;
            this.section_id = result.data[0].uc_sec_id;
            this.getSectionsByClass();
          }
        }
      );
  }
  //  Get Class List function
  getClass() {
    this.sectionArray = [];
    const classParam: any = {};
    classParam.role_id = this.currentUser.role_id;
    classParam.login_id = this.currentUser.login_id;
    this.smartService.getClassData(classParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.classArray = result.data;
          }
        }
      );
  }
  // get section list according to selected class
  getSectionsByClass() {
    this.firstForm.patchValue({
      'syl_section_id': ''
    });
    const sectionParam: any = {};
    sectionParam.class_id = this.class_id;
    this.smartService.getSectionsByClass(sectionParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.sectionArray = result.data;
            this.fetchDetails();
          } else {
            this.sectionArray = [];
          }
        }
      );
  }
  getMasterStudentDetail
  fetchDetails() {
    this.firstForm.patchValue({
      'syl_class_id': this.class_id,
      'syl_section_id': this.section_id
    });
    this.getClassByBoard();
    this.ELEMENT_DATA = [];
    this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const studentParam: any = {};
    studentParam.class_id = this.class_id;
    studentParam.sec_id = this.section_id;
    studentParam.enrollment_type = '4';
    studentParam.status = '1';
    this.sisService.getMasterStudentDetail(studentParam)
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.defaultFlag = true;
            this.finalDivFlag = false;
            this.studentArray = result.data;
            let counter = 1;
            for (const item of this.studentArray) {
              let tempadmono;
              if(item.au_process_type=='4') {
                tempadmono = item.em_admission_no;
              } else if(item.au_process_type=='3'){
                tempadmono = item.em_provisional_admission_no;
              }
              this.ELEMENT_DATA.push({
                sr_no: counter,
                au_admission_no: tempadmono,
                r_rollno:Number(item.r_rollno),
                class_sec:item.sec_name ? item.class_name + '-' + item.sec_name : item.class_name,
                au_full_name: new CapitalizePipe().transform(item.au_full_name),
                father_name: new CapitalizePipe().transform(item.father_name),
                mother_name: new CapitalizePipe().transform(item.mother_name),
                upd_dob: new DatePipe('en-in').transform(new Date(item.upd_dob), 'd-MMM-y'),
                active_parent_no:item.active_parent == 'F' ? item.father_contact_no : item.mother_contact_no
              });
              counter++;
            }
            this.ELEMENT_DATA.sort((a, b) => a.r_rollno < b.r_rollno ? -1 : a.r_rollno > b.r_rollno ? 1 : 0)
            this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
            this.rollNoDataSource.sort = this.sort;
          } else {
            this.studentArray = [];
          }
        }
      );
  }

  exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
    const columns: any = [];
    this.displayedColumns.forEach(element => {
      columns.push({
        key: element,
        width: this.checkWidth(element, this.displayedColumns_heading[element])
      });
    });
		reportType = new TitleCasePipe().transform('student_list: ' + this.sessionName);
    let reportType1 = new TitleCasePipe().transform('Student List: ' + this.sessionName);
    const fileName =reportType + '_' + this.reportdate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType1;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    this.displayedColumns.forEach((element,index) => {
      console.log('index',index)
      worksheet.getCell(this.alphabetJSON[index+1]+'4').value = this.displayedColumns_heading[element];
    });
		worksheet.columns = columns;
    this.length = worksheet._rows.length;
    let srno=1;
		for (const dety of this.ELEMENT_DATA) {
			const obj: any = {};
      this.length++;
      this.displayedColumns.forEach((element,index) => {
        worksheet.getCell(this.alphabetJSON[index+1]+this.length).value = dety[element];
      });
			worksheet.addRow(obj);
    }
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 4) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum > 4 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});

		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
    });
    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
      + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

  }
  checkWidth(id, header) {
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}
}
