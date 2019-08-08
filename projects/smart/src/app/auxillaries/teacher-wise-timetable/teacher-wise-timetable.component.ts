import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { CommonAPIService, AxiomService, SisService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	selector: 'app-teacher-wise-timetable',
	templateUrl: './teacher-wise-timetable.component.html',
	styleUrls: ['./teacher-wise-timetable.component.css']
})
export class TeacherWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	teacherwiseFlag = false;
	finalDivFlag = true;
	teacherArray: any[] = [];
	subjectArray: any[] = [];
	teacherwiseArray: any[] = [];
	teacherwiseWeekArray: any[] = [];
	finalArr: any[] = [];
	sessionArray: any[] = [];
	teacherwiseForm: FormGroup;
	teacherId: any;
	teacherName: any;
	noOfDay: any;
	sum = 0;
	monday = 0;
	tuesday = 0;
	wednesday = 0;
	thursday = 0;
	friday = 0;
	saturday = 0;
	sunday = 0;
	currentUser: any;
	session: any;
	schoolInfo: any = {};
	sessionName: any;
	length: any;
	period = 0;
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
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,

	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
	}
	buildForm() {
		this.teacherwiseForm = this.fbuild.group({
			teacher_name: '',
			subject_id: ''
		});
	}
	// get session year of the selected session
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session.ses_id];
					}
				});
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
		});
	}

	// get teacher information
	getTeacherInfo(event) {
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
				} else {
					this.commonService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
	}
	// set teacher name
	setTeacherId(teacherDetails) {
		this.teacherwiseForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			cw_teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.teacherName = teacherDetails.au_full_name;
		this.getSubjectByTeacherId();
		this.getTeacherwiseTableDetails();
	}

	// get subject by teacher
	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'subject_name',
			width: this.checkWidth('subject_name', 'Subject')
		});
		reportType2 = new TitleCasePipe().transform('class wise timetable _') + this.sessionName;
		reportType = new TitleCasePipe().transform('class wise timetable report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getCell('A4').value = 'Periods';
		worksheet.getCell('B4').value = 'Monday';
		worksheet.getCell('C4').value = 'Tuesday';
		worksheet.getCell('D4').value = 'Wednesday';
		worksheet.getCell('E4').value = 'Thursday';
		worksheet.getCell('F4').value = 'Friday';
		worksheet.getCell('G4').value = 'Saturday';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const item of this.teacherwiseArray) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			const periodcount = this.period++;
			worksheet.getCell('A' + this.length).value = (1 + periodcount) + this.periodSup[periodcount];
			for (const dety of item) {
				if (dety.day_id === 1) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('B' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('B' + this.length).value = '-';
					}

				} else if (dety.day_id === 2) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('C' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('C' + this.length).value = '-';
					}
				} else if (dety.day_id === 3) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('D' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('D' + this.length).value = '-';
					}
				} else if (dety.day_id === 4) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('E' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('E' + this.length).value = '-';
					}
				} else if (dety.day_id === 5) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('F' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('F' + this.length).value = '-';
					}
				} else if (dety.day_id === 6) {
					if (dety.subject_name !== '-') {
						worksheet.getCell('G' + this.length).value = dety.subject_name + dety.class_name + '-' + dety.sec_name;
					} else {
						worksheet.getCell('G' + this.length).value = '-';
					}
				}

			}
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
			if (rowNum >= 5 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					if (rowNum % 2 === 0) {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					} else {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: '888888' },
							bgColor: { argb: '888888' },
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
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	// check the max  width of the cell
	checkWidth(id, header) {
		const res = this.finalArr.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Teacher Wise Time table Of ' + this.teacherName + ' (' + this.teacherId + ')']],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 15,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#report_table',
			headerStyles: {
				fontStyle: 'normal',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 14,
			},
			useCss: true,
			styles: {
				fontSize: 14,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: 'red',
			},
			theme: 'grid'
		});
		doc.autoTable({
			head: [['Day wise Summary of ' + this.teacherName + ' (' + this.teacherId + ')']],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 15,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#daywise_table',
			headerStyles: {
				fontStyle: 'normal',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 14,
			},
			useCss: true,
			styles: {
				fontSize: 14,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: 'red',
			},
			theme: 'grid'
		});
		doc.save('table.pdf');
	}
	getSum(dety) {
		this.sum = 0;
		for (const titem of dety) {
			if (titem.day !== '-') {
				this.sum = this.sum + (Number(titem.count));
			}
		}
		return this.sum;
	}
	// get teacherwise timetable details
	getTeacherwiseTableDetails() {
		this.teacherwiseWeekArray = [];
		this.teacherwiseArray = [];
		this.finalDivFlag = false;
		this.teacherwiseFlag = true;
		this.smartService.getTeacherwiseTableDetails({ uc_login_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.teacherwiseArray = result.data.tabledata;
				this.finalArr = [];
				for (const item of this.teacherwiseArray) {
					for (const dety of item) {
						this.finalArr.push(dety);
					}
				}
				Object.keys(result.data.dataperiod).forEach(key => {
					if (key !== '-') {
						this.teacherwiseWeekArray.push({
							sub_id: key,
							dataArr: result.data.dataperiod[key]
						});
					}
				});
				for (const item of this.teacherwiseWeekArray) {
					for (const titem of item.dataArr) {
						if (titem.day === 'Monday') {
							this.monday = this.monday + (Number(titem.count));
						}
						if (titem.day === 'Tuesday') {
							this.tuesday = this.tuesday + (Number(titem.count));
						}
						if (titem.day === 'Wednesday') {
							this.wednesday = this.wednesday + (Number(titem.count));
						}
						if (titem.day === 'Thursday') {
							this.thursday = this.thursday + (Number(titem.count));
						}
						if (titem.day === 'Friday') {
							this.friday = this.friday + (Number(titem.count));
						}
						if (titem.day === 'Saturday') {
							this.saturday = this.saturday + (Number(titem.count));
						}
						if (titem.day === 'Sunday') {
							this.sunday = this.sunday + (Number(titem.count));
						}
					}
				}
			} else {
				this.teacherwiseArray = [];
				this.finalDivFlag = true;
				this.commonService.showSuccessErrorMessage('No record found', 'error');
			}
		});
	}
}
