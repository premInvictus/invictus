import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	selector: 'app-class-wise-timetable',
	templateUrl: './class-wise-timetable.component.html',
	styleUrls: ['./class-wise-timetable.component.css']
})
export class ClassWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	subjectwiseFlag = false;
	finaldivflag = true;
	excelTableFlag = false;
	public classArray: any[];
	public sectionArray: any[];
	public subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	subCountArray: any[] = [];
	finalCountArray: any[] = [];
	dataArr: any[] = [];
	sessionArray: any[] = [];
	classwiseForm: FormGroup;
	currentUser: any;
	session: any;
	noOfDay: any;
	anaimation: any;
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
		this.getClass();
		this.getSession();
		this.getSchool();
	}
	buildForm() {
		this.classwiseForm = this.fbuild.group({
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
	}

	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		classParam.class_status = '1';
		this.smartService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
						this.subjectwiseFlag = false;
					} else {
						this.classArray = [];
					}
				}
			);
		this.classwisetableArray = [];
		this.subCountArray = [];
		this.finalCountArray = [];
	}

	// get section list according to selected class
	getSectionsByClass() {
		this.classwiseForm.patchValue({
			'tt_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.classwiseForm.value.tt_class_id;
		this.smartService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.subCountArray = [];
						this.finalCountArray = [];
						this.classwisetableArray = [];
						this.finaldivflag = true;
						this.subjectwiseFlag = false;
						this.getSubjectsByClass();
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	// get subject list according to selected class
	getSubjectsByClass() {
		const subjectParam: any = {};
		subjectParam.class_id = this.classwiseForm.value.tt_class_id;
		this.smartService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
						console.log(this.subjectArray);
					} else {
						this.subjectArray = [];
					}
				}
			);
	}
	// get Class name from existing array
	getClassName(value) {
		const classIndex = this.classArray.findIndex(f => Number(f.class_id) === Number(value));
		if (classIndex !== -1) {
			return this.classArray[classIndex].class_name;
		}
	}
	// get section from existing array
	getSectionName(value) {
		const sectionIndex = this.sectionArray.findIndex(f => Number(f.sec_id) === Number(value));
		if (sectionIndex !== -1) {
			return this.sectionArray[sectionIndex].sec_name;
		}
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

	// export excel code
	exportAsExcel() {
		this.period = 0;
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'subject_name',
			width: this.checkWidth('subject_name', 'Subject')
		});
		reportType2 = new TitleCasePipe().transform('class wise timetable _') +
			this.getClassName(this.classwiseForm.value.tt_class_id) + '_' +
			this.getSectionName(this.classwiseForm.value.tt_section_id) + '_' + this.sessionName;
		reportType = new TitleCasePipe().transform('class wise timetable report: ') + this.sessionName;
		const fileName = reportType2 + '.xlsx';
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
		for (const item of this.classwisetableArray) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			const periodcount = this.period++;
			worksheet.getCell('A' + this.length).value = (1 + periodcount) + this.periodSup[periodcount];
			for (const dety of item.classwise) {
				if (dety.day_id === 1) {
					worksheet.getCell('B' + this.length).value = dety.subject_name;
				} else if (dety.day_id === 2) {
					worksheet.getCell('C' + this.length).value = dety.subject_name;
				} else if (dety.day_id === 3) {
					worksheet.getCell('D' + this.length).value = dety.subject_name;
				} else if (dety.day_id === 4) {
					worksheet.getCell('E' + this.length).value = dety.subject_name;
				} else if (dety.day_id === 5) {
					worksheet.getCell('F' + this.length).value = dety.subject_name;
				} else if (dety.day_id === 6) {
					worksheet.getCell('G' + this.length).value = dety.subject_name;
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
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'ffffff' },
						bgColor: { argb: 'ffffff' },
					};
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
		const res = this.dataArr.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}




	// pdf download
	pdfDownload() {
		const doc = new jsPDF('l', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [['Class Wise Time table Of ' + this.getClassName(this.classwiseForm.value.tt_class_id) + '-' +
				this.getSectionName(this.classwiseForm.value.tt_section_id)]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: false,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#report_table',
			startY: 65,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 45,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: false,
			styles: {
				fontSize: 35,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
				halign: 'center'
			},
			theme: 'grid'
		});
		doc.save('classwise_timetable_' + this.getClassName(this.classwiseForm.value.tt_class_id) + '-' +
			this.getSectionName(this.classwiseForm.value.tt_section_id) + '.pdf');
	}
	// Timetable details based on class and section 
	getclasswisedetails() {
		this.subCountArray = [];
		this.finalCountArray = [];
		this.classwisetableArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.classwiseForm.value.tt_class_id;
		timetableparam.tt_section_id = this.classwiseForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finaldivflag = false;
						this.subjectwiseFlag = true;
						this.noOfDay = result.data[0].no_of_day;
						const param: any = {};
						param.td_tt_id = result.data[0].tt_id;
						if (param.td_tt_id !== '') {
							this.smartService.getClasswiseDetails(param)
								.subscribe(
									(final_result: any) => {
										if (final_result && final_result.status === 'ok') {
											this.classwisetableArray = [];
											this.classwiseArray = [];
											this.classwiseArray = final_result.data;
											for (let i = 0; i < this.classwiseArray.length; i++) {
												this.classwisetableArray.push({
													'classwise': JSON.parse(this.classwiseArray[i].td_no_of_day)
												});
											}
											console.log(this.classwisetableArray);
											for (const item of this.classwisetableArray) {
												for (const titem of item.classwise) {
													const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
													if (findex === -1) {
														this.subCountArray.push({
															'subject_name': titem.subject_name,
															'count': 1,
														});
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

													}
												}
											}
											for (const citem of this.subCountArray) {
												this.finalCountArray[citem.subject_name] = citem.count;
											}
										}
									});
						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
						this.finaldivflag = true;
						this.subjectwiseFlag = false;
					}
				});

	}

}
